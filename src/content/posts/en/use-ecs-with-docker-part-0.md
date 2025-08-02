---
title: 'ECS and Docker Experience - Part 0'
summary: 'Introduction'
tags: ['AWS', 'Docker', 'ABZ Inc.']
date: '2022-01-26 00:00:00'
---

It's already been 8 months since I joined my first company last June.
In this post, I'll cover the detailed process of the **server containerization** project that I participated in as the main developer for the [Inpock Link](https://link.inpock.co.kr/) team starting this year.

If you're considering using various AWS stacks or thinking about building a better server, I hope this post can be of some help!

This post is a more detailed version of an article published on [AB-Z's medium](https://medium.com/ab-z). For key decisions and trial-and-error processes, please refer to [this link](https://medium.com/ab-z/%EA%B8%89%EA%B2%A9%ED%95%98%EA%B2%8C-%EC%A6%9D%EA%B0%80%ED%95%98%EB%8A%94-%ED%8A%B8%EB%9E%98%ED%94%BD-%EC%96%B4%EB%96%BB%EA%B2%8C-%EB%8C%80%EB%B9%84%ED%95%A0%EA%B9%8C-d92f2fbf2130) 😃

***

### Introduction

This project was conducted in the <span style="color:#ff5b1a">Inpock Link</span> service environment, one of the services provided by [AB-Z](https://www.notion.so/inpock/ABZ-8ecc728639d94704b7b25ef8e770b117).

<span style="color:#ff5b1a">Inpock Link</span> was created with the goal of "bridging the gap between influencers and consumers." It's a service that allows influencers to manage various links on a single page, enabling them to deliver value to their followers and consumers easily and quickly. Influencers can sign up as Inpock Link administrators and add desired links such as market, group purchase, shopping mall links, as well as CS channels and YouTube to their link pages. Visitors can easily access the links promoted by influencers.

The existing <span style="color:#ff5b1a">Inpock Link</span> was built using AWS services with the server running on EB (ElasticBeanstalk) and the frontend on ECS (Elastic Container Service) for development and maintenance. This is where we faced a concern:

> Can't we create a system that allows for faster server scale-out?

This is exactly where our project began.
We called it the **`Server Containerization`** project, and its main goals are as follows:

> Through server containerization, migrate the server stack to ECS to **significantly reduce the time required for auto-scaling**.
Enable **zero-downtime deployment** so users won't notice when deployments are in progress.
Ensure there are **no issues with existing external API usage**.

The project lasted about 4 weeks and was divided into the following major phases:
**[Part 1](https://hakjae.dev/posts/use-ecs-with-docker-part-1),** Use Docker to create Django server and nginx images and push them to ECR.
**[Part 2](https://hakjae.dev/posts/use-ecs-with-docker-part-2),** Deploy using the built images through tasks, clusters, subnets, Route 53, etc.
**[Part 3](https://hakjae.dev/posts/use-ecs-with-docker-part-3),** Enable deployment and modification without going through the AWS console using GitHub Actions for CI/CD and CDK for stack deployment.