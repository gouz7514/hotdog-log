---
title: 'ECS and Docker Experience - Part 1'
summary: 'Getting Hands-on with ECS & Docker'
tags: ['AWS', 'Docker', 'ABZ Inc.']
date: '2022-01-26 00:00:01'
---

### Dockerizing

First, we'll build server images using Docker.
The images we'll build are the **Django container image** for the server and the **nginx container image** to be used in front of Django, totaling 2 images.

The reason for using nginx along with Django is that the `runserver` command used by Django is primarily intended for "development and testing." In fact, Django's official documentation doesn't recommend using runserver in production environments due to security and performance issues.

![runserver is for development and testing](https://images.velog.io/images/gouz7514/post/8cd5583d-efe4-489b-ab2b-e9ecb9f70bae/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202022-02-18%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%202.08.55.png)

(Source: https://docs.djangoproject.com/en/2.2/ref/django-admin/#runserver)

For this reason, we use uWSGI, a type of WSGI (Web Server Gateway Interface), instead of runserver to run Django.

You might wonder, "Why use wsgi?"

> - WSGI servers are designed to handle many requests.
- Frameworks are not designed to handle numerous requests optimally on their own, but this is determined by the server that runs the framework.

By using wsgi, we can leverage Django's web framework capabilities while adding nginx to the front to perform reverse proxy functions and achieve better performance.

Here's how to build each image:

#### 1. django application

**Dockerfile**
```bash
FROM python:3.6

ENV PYTHONUNBUFFERED 1

ENV PATH="/scripts:${PATH}"

ENV ENV=dev # Assign different tags according to environment

WORKDIR /app

COPY . .

COPY ./scripts /scripts

RUN pip install -r requirements.txt --no-cache-dir 

RUN chmod +x /scripts/*

RUN mkdir -p /vol/web/media
RUN mkdir -p /vol/web/static
RUN adduser user --gecos "First Last,RoomNumber,WorkPhone,HomePhone" --disabled-password
RUN chown -R user:user /vol
RUN chmod -R 755 /vol/web
USER user

CMD ["entrypoint.sh"]
```

> ❓ Why use the `--gecos` and `--disabled-password` commands?
❗️ The `--disabled-password` option prevents unnecessary password-related error outputs.
The `--gecos` option sets additional information related to the user. While `--gecos` isn't necessary for functionality, we assign dummy values to gecos to prevent unnecessary user setting-related error outputs since we'll be using GitHub Actions for management later.

**entrypoint.sh** - Manage commands like migrate, uwsgi in one file
```bash
#!/bin/sh

set -e

python manage.py collectstatic --noinput

python manage.py migrate --noinput

uwsgi --socket :8000 --master --enable-threads --module (filename).wsgi
```

Then run the build command in the directory where the Dockerfile is located.
```bash
docker build . (-t tag) (-f dockerfile-name)
```

#### 2. nginx

**Dockerfile**
```bash
FROM nginxinc/nginx-unprivileged:1-alpine

COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY ./uwsgi_params /etc/nginx/uwsgi_params

USER root

RUN mkdir -p /vol/static
RUN chmod 755 /vol/static

USER nginx
```

**default.conf**
```bash
server {
    listen 8080;

    location /static {
        alias /vol/static;
    }

    location / {
        uwsgi_pass 127.0.0.1:8000;
        include /etc/nginx/uwsgi_params;
    }
}
```

Then run the build command in the directory where the Dockerfile is located.
```bash
docker build . (-t tag) (-f dockerfile-name)
```

This allows users to access the nginx container through port 8080, and the nginx container can connect to the django container through port 8000.

***

### ECS cluster - Fargate vs EC2

Before pushing the built images to ECR, we need to create a cluster suitable for our purpose.

AWS allows you to choose between EC2 and Fargate for cluster infrastructure.
EC2 delivers higher efficiency in systems with predictable and stable CPU usage, while Fargate performs efficiently in environments with dynamic workloads.

Since Inpock Link frequently scales and usually has relatively low workloads, we ultimately chose Fargate, which allows us to use low-level CPU units (0.25).

Now it's time to push the created images to ECR!

***

### Uploading images to repository (feat. M1)

(If you're not using an M1 chip environment, you can skip this section. Congratulations!)

This was the most challenging part of the project and where we spent the most time on image uploads 🥲
Normally, you can build images using the `docker build ~` command.
However, with the M1 chip, when running tasks in a cluster using built images, you'll encounter the following error:

![exec format error](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*7N5NUWcHg4Hk5evmW9YJ9A.png)

The reason is that the architecture of ECS tasks differs from images built with the M1 chip.

ECS task architecture is set to `Linux/X86_64`, while images built with the M1 chip have `arm64` as the default architecture.

To solve this problem, you can use the `docker buildx` command.

`docker buildx` is an extension plugin for Docker commands that can build multi-architecture images. Additionally, you can build images in desired formats through custom builders that include the features you want.

[Docker Buildx](https://docs.docker.com/buildx/working-with-buildx/)
You can specify the desired architecture using the `--platform` option.
```bash
docker buildx build --platform linux/amd64 (-t tag) . (--no-cache) (-f Dockerfile name)
```

Reference links (Thank you so much to all the experts!)
- [stackoverflow - standard_init_linux.go:178: exec user process caused "exec format error"](https://stackoverflow.com/questions/42494853/standard-init-linux-go178-exec-user-process-caused-exec-format-error)
- [Building Multi-Architecture Images with Docker Buildx](https://meetup.toast.com/posts/255)
- [About EKS Deployment Errors for M1 MacBook Users](https://appleg1226.tistory.com/35)
- [[Devops] Docker buildx build(at M1 Macbook)](https://velog.io/@inyong_pang/Devops-Docker-buildx-at-M1-Macbook)

***

Through these processes, we were able to successfully build server and nginx images and push them to ECR.

In [Part 2](https://hakjae.dev/posts/use-ecs-with-docker-part-2), we'll create tasks and services using the generated images and proceed all the way to CodeDeploy!

***

For more detailed content and trial-and-error processes, you can also check [here](https://medium.com/ab-z/%EA%B8%89%EA%B2%A9%ED%95%98%EA%B2%8C-%EC%A6%9D%EA%B0%80%ED%95%98%EB%8A%94-%ED%8A%B8%EB%9E%98%ED%94%BD-%EC%96%B4%EB%96%BB%EA%B2%8C-%EB%8C%80%EB%B9%84%ED%95%A0%EA%B9%8C-d92f2fbf2130)!