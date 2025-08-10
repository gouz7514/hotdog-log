---
title: '🐳 Using Docker in Monorepo Environment'
summary: 'Using nextjs (feat. standalone) and docker in a monorepo utilizing turbo'
tags: ['Docker', 'Next.JS']
date: '2024-11-08 09:00:00'
---
> - For each of our growth, we recently decided to have internal developers write blog posts on their chosen topics. This post is one I wrote, covering docker and nextjs.

---

ABZ, which started with InpockStore and InpockLink, has launched various services as it has grown in scale. In the process of effectively managing the increasing repositories, we recently introduced a monorepo.

Existing services are undergoing migration one by one, and we are currently developing various services within the monorepo, including the recently launched InpockManager.
In this article, I'll introduce what I learned while developing a new next.js project in a monorepo environment and the process of deploying it using docker.

> **Through this article, you can learn about the following:**
> - next.js standalone option
> - How env files are applied in next.js
> - Creating lightweight next.js images using standalone option and docker


### 1. next.js standalone
We used turbo for monorepo construction.
Since using docker in a monorepo environment was my first time, I first read the [turbo official documentation](https://turbo.build/repo/docs/guides/tools/docker) to learn about using docker together, during which I came across the following statement:

```
This Dockerfile is written for a Next.js app that is using the standalone output mode.
```

I became curious about what kind of option this was that even the turbo documentation introduces it this way, so I briefly summarized it as follows.

According to the [official documentation](https://nextjs.org/docs/pages/api-reference/next-config-js/output), Next.js goes through each page and dependencies during the build process to determine the files needed for the production version.
If unnecessary files are included in the build during this process, the resulting file size will also become larger, which can cause problems in deployment time, traffic costs, etc.

The `standalone` option, as its name suggests (independent, standalone), makes the application run independently without additional dependency installation. This is because the `.next/standalone` folder contains minimal dependencies and a `server.js` file to run the server.

![description of nextjs standlone build result](https://github.com/user-attachments/assets/f66f57bd-5f80-4392-b09e-5be30ae112c1)

This minimal server includes only the files essential for production deployment, excluding the `public` and `.next/static` directories that recommend CDN usage. Of course, if files from these directories are needed, they can be copied manually.

### 2. Creating next.js images with docker
Now that we know about the standalone option, it's time to create lighter docker images.
For easy and quick understanding, let me first briefly explain the main concepts of docker.

**Container**
- The core concept in docker
- Something that bundles a program and all the settings or files needed by that program into one box

**Image**
- A blueprint-like concept needed to create containers
- Contains files and configuration values needed to run containers

**Dockerfile**
- Configuration file for creating images

Before writing the actual Dockerfile, let me briefly explain the project structure:
- Monorepo using pnpm and turbo
- Various services exist within the services directory

Now I'll show you the completed Dockerfile and then explain each stage step by step.
```dockerfile
# 1. Base image setup (node and Alpine based)
FROM node:18-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"

# Install necessary libraries (including glibc compatibility)
RUN apk update && apk add --no-cache libc6-compat git openssh

# SSH key setup
ARG SSH_PRIVATE_KEY
RUN mkdir ~/.ssh/
RUN echo "${SSH_PRIVATE_KEY}" | tee ~/.ssh/id_rsa
RUN chmod 600 ~/.ssh/id_rsa

# Github Authorization for private repository installation
RUN ssh-keyscan github.com >> ~/.ssh/known_hosts

# 2. Build stage setup
FROM base AS builder

ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV
ARG STAGE
ENV STAGE=$STAGE

# Set working directory
WORKDIR /app

# Copy entire code and perform pruned work
COPY . .

# Copy .env files differently based on STAGE value
RUN if [ "$STAGE" = "development" ]; then \
		echo "Using development environment" && \
		cp services/project-name/.env.development services/project-name/.env.local; \
	elif [ "$STAGE" = "production" ]; then \
		echo "Using production environment" && \
		cp services/project-name/.env.production services/project-name/.env.local; \
	else \
		echo "Invalid STAGE value: $STAGE" && exit 1; \
	fi

# Install pnpm and turbo
RUN npm install -g pnpm turbo

# Copy monorepo root package.json and lock file
COPY package.json pnpm-lock.yaml ./

# Install dependencies (including root dependencies)
RUN pnpm install --frozen-lockfile

# Prune to keep only dependencies needed for the project
RUN turbo prune project-name --docker

# 3. Dependency installation stage
FROM base AS installer

ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV
ARG STAGE
ENV STAGE=$STAGE

# Set working directory
WORKDIR /app

# Copy pruned dependencies and install
COPY --from=builder /app/out/json/ .
RUN npm install -g pnpm turbo
RUN pnpm install --frozen-lockfile

# Copy entire project and build
COPY --from=builder /app/out/full/ .
RUN pnpm turbo run build --filter=project-name...

# 4. Final runtime stage setup
FROM base AS runner

ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV
ARG STAGE
ENV STAGE=$STAGE

# Set working directory
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy files needed for project execution
COPY --from=installer --chown=nextjs:nodejs /app/services/project-name/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/services/project-name/.next/static ./services/project-name/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/services/project-name/public ./services/project-name/public

# Run application
EXPOSE 80
ENV PORT=80

CMD ["node", "services/project-name/server.js"]
```


**1. base stage**
> Image foundation setup and access setup through SSH keys

We proceed with image foundation setup using Alpine for lightweight deployment.
We grant access permissions using SSH keys for installing the design system used in the project.

**2. builder stage**
> Copy configuration files according to environment variables and optimize with turbo prune

In this stage, we use the STAGE variable to determine the environment to run.
Since next.js applies env variables in the order `.env.$(NODE_ENV).local` > `.env.local` > `.env.${NODE_ENV}`, we copy the desired env file as the `env.local` file (Source: [Next.js Official Documentation](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables#environment-variable-load-order))

The `turbo prune project-name` command optimizes by keeping only the dependencies essential for the project and removing unnecessary parts. (Source: [turbo official documentation](https://turbo.build/repo/docs/guides/tools/docker#the-solution))

**3. installer stage**
> Install optimized dependencies and build project

In this stage, we copy and install the optimized dependency files from the builder stage.

**4. runner stage**
> Copy minimal files to run application

Finally, we set up the final execution environment and copy optimized files.
As explained above, the standalone option doesn't include `.next/static/` and `public` directories, so we manually copy them.

Finally, we open port 80 to receive traffic.


So how much difference is there in the size of next.js images built with the standalone option compared to when the option is not applied?

![nextjs standalone config size compare](https://github.com/user-attachments/assets/68386d96-daa8-4932-850b-09471d4920a0)

Using the images created this way, we can deploy faster and lighter next.js projects.

---

Although it was unfamiliar as an option I was encountering for the first time, by directly using docker and comparing, I was able to better understand the content. As a frontend developer, I was able to grow one step further by not just stopping at UI and component development but learning across the entire service.
For other projects currently developed with next.js, I plan to gradually review and apply the standalone option when time permits.

ABZ is full of engineers who don't just do assigned work but constantly think and strive to satisfy consumers using our capabilities. If you're interested in ABZ where you can grow faster than anyone else, please click [here](https://ab-z.notion.site/8ecc728639d94704b7b25ef8e770b117).

FE engineer Kim Hakjae