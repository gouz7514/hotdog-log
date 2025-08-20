---
title: 'ECS and Docker Experience - Part 2'
summary: 'From Task definition to Deploy'
tags: ['AWS', 'Docker']
date: '2022-01-26 00:00:02'
---

As explained in [Part 1](https://hakjae.dev/posts/use-ecs-with-docker-part-1), we decided to use AWS Fargate integrated with ECS.

In Part 2, we'll create clusters and tasks, and proceed to configure Security Groups, Subnets, and more.

***

### Cluster

Create a cluster in AWS ECS. Through the console, you can see that Fargate is set as the default.

![Creating AWS cluster](https://images.velog.io/images/gouz7514/post/c2758030-3924-42b0-9573-cc64a5392d98/image.png)

You can set the cluster name and specify VPC and subnets. While creating a new VPC would be much more convenient and easier to manage later, we didn't create a new VPC because we needed to connect with resources we were already using within the existing VPC.

![Creating AWS cluster](https://images.velog.io/images/gouz7514/post/f244e04c-155f-4dc8-8bab-fcf9e6006752/image.png)

***

### Task definition

Create a task.

![Creating AWS task](https://images.velog.io/images/gouz7514/post/b1c6beee-9f62-4ea4-9a52-b070d3889f82/image.png)

Since we use two containers - Django and nginx - we add 2 containers and specify ports at this stage.

In the next step, you can select architecture, CPU, and memory.
For CPU, you can choose from .25 to 4, and you can specify memory that can be combined with each CPU.

While we found links explaining that nginx doesn't need much CPU when used with Django, we couldn't find significant data, so we didn't assign separate capacities. We'll discuss this in detail later.

![Creating AWS task - 2](https://images.velog.io/images/gouz7514/post/27c79b3b-6810-4a9c-beba-d233eac495a5/image.png)

***

### Security group

Before creating the ECS service, we need to create Security Groups and Subnets first.

If you need to understand VPC and Subnets, please refer to this link!
[Understanding VPC Easily](https://aws-hyoh.tistory.com/entry/VPC-%EC%89%BD%EA%B2%8C-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0-1)

According to AWS documentation, Security Groups are virtual firewalls that control inbound/outbound traffic.

Therefore, rather than having all components belong to one security group, it's better to set up multiple security groups according to the required inbound/outbound rules.

We'll use an Application Load Balancer, and **the load balancer needs a security group with port 443 open to allow HTTPS requests from the internet**.

Conversely, **the ECS service needs a new security group that doesn't allow direct requests from the internet that bypass the load balancer**. We also need to open ports for communication with Redis, which we use as our database.

Once you've successfully created the security groups, shall we move on to creating subnets?

***

### Subnet

ECS services running Fargate Tasks require at least 2 subnets for stability.
[stackoverflow - Why I should configure a AWS ECS Service with two or more Subnets?](https://stackoverflow.com/questions/62971888/why-i-should-configure-a-aws-ecs-service-with-two-or-more-subnets)

If you're using an existing VPC instead of creating a new one, you might encounter errors where the IPv4 CIDR block settings overlap with CIDR blocks assigned to other subnets. You can fix this as follows:

#### Fix 1. Set non-overlapping CIDR addresses by checking other subnet addresses

You can check the addresses of other subnets in the AWS console's VPC - subnet menu.

If you're not familiar with subnet range and subnet masking concepts, I recommend this YouTube video. Inpock Link's pick for the best lecture of 2022!

[https://www.youtube.com/watch?v=s_Ntt6eTn94](https://www.youtube.com/watch?v=s_Ntt6eTn94)

#### Fix 2. Add new CIDR within VPC

Add a large range CIDR that hasn't been allocated within the VPC yet, then appropriately allocate subnets within the newly created CIDR.

After creating the 2 subnets needed for the service, create subnets needed for the load balancer. We created and specified one for each AZ, totaling 3.

***

### Route53

Route53 is a cloud DNS web service provided by AWS.
It consists of domains as higher elements and records as lower elements, and one domain can have multiple records.
After creating a record within the domain you want to connect, you can set the load balancer's IP address as the routing target through `Edit record`.

***

### CodeDeploy

When executing a new deploy, you must first create an application and then create a deployment group within the created application before you can proceed with deployment.

![AWS CodeDeploy](https://images.velog.io/images/gouz7514/post/a47bfa21-351a-4186-a721-9f416e9e4a1c/image.png)

In the deployment group, you can **specify the service, cluster, load balancer, and target group for deployment**.

Also, CodeDeploy allows you to specify wait times before the original task set is terminated when new deployments proceed through configuration. This makes it easy to perform operations like rolling back to the original task set through the console if unexpected errors occur after actual deployment.

***

This completes all the server image containerization work using AWS and Docker!
In Part 3, we'll cover how Inpock Link manages the various and complex steps from Parts 1 and 2 through CDK.

***

For more detailed content and trial-and-error processes, you can also check [here](https://medium.com/ab-z/%EA%B8%89%EA%B2%A9%ED%95%98%EA%B2%8C-%EC%A6%9D%EA%B0%80%ED%95%98%EB%8A%94-%ED%8A%B8%EB%9E%98%ED%94%BD-%EC%96%B4%EB%96%BB%EA%B2%8C-%EB%8C%80%EB%B9%84%ED%95%A0%EA%B9%8C-d92f2fbf2130)!