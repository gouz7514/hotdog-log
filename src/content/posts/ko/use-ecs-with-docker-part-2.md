---
title: 'ECS와 Docker 사용기 - 2부'
summary: 'Task definition부터 Deploy까지'
tags: ['AWS', 'Docker', 'ABZ Inc.']
date: '2022-01-26 00:00:02'
---

[1부](https://hakjae.dev/posts/use-ecs-with-docker-part-1)에서 설명했듯 저희는 AWS의 fargate를 ECS와 연동해 사용하기로 결정했습니다.

2부에서는 클러스터, 태스크를 만들고 나아가 Security Group, Subnet 등의 설정까지 마치도록 하겠습니다. 
***
### Cluster
AWS의 ECS에서 클러스터를 생성합니다. 콘솔을 통한다면 다음과 같이 fargate가 기본으로 설정되어 있는 것을 확인할 수 있습니다.
![AWS cluster 생성하기](https://images.velog.io/images/gouz7514/post/c2758030-3924-42b0-9573-cc64a5392d98/image.png)

클러스터의 이름을 설정하고, VPC와 서브넷을 지정할 수 있습니다. 새로운 VPC를 만드는 것이 훨씬 간편하고 추후 관리에도 편리하지만, 저희는 기존 VPC 내에 사용하는 리소스들과도 연결을 해야했기 때문에 새로운 VPC를 생성하지 않고 기존 VPC를 지정해 생성했습니다.
![AWS cluster 생성](https://images.velog.io/images/gouz7514/post/f244e04c-155f-4dc8-8bab-fcf9e6006752/image.png)
***
### Task definition
태스크를 생성합니다.
![AWS task 생성하기](https://images.velog.io/images/gouz7514/post/b1c6beee-9f62-4ea4-9a52-b070d3889f82/image.png)

장고와 nginx 총 2개의 컨테이너를 사용하므로 이 단계에서 2개의 컨테이너를 추가하고 포트를 지정해줍니다.

다음 단계에서 아키텍쳐, CPU, 메모리를 선택할 수 있습니다.
CPU의 경우 .25 ~ 4 중 선택할 수 있으며 각 CPU와 조합할 수 있는 메모리를 지정할 수 있습니다.

nginx와 djnago를 같이 사용하는 경우 nginx에 많은 cpu를 부여할 필요가 없다고 설명하는 링크를 찾을 수 있었으나 유의미한 자료를 찾지 못해 저희는 따로 용량을 부여하지는 않았습니다. 이에 대한 자세한 내용은 후술하도록 하겠습니다.
![AWS task 생성하기 - 2](https://images.velog.io/images/gouz7514/post/27c79b3b-6810-4a9c-beba-d233eac495a5/image.png)
***
### Security group
ECS 서비스의 생성에 앞서, Security group과 Subnet을 먼저 생성해 주어야 합니다.

VPC와 Subnet의 이해가 필요하시다면 다음 링크를 참고해보세요!
[VPC 쉽게 이해하기](https://aws-hyoh.tistory.com/entry/VPC-%EC%89%BD%EA%B2%8C-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0-1)

AWS의 설명에 의하면, Security group은 inbound/outbound 트래픽을 컨트롤 해주는 가상 방화벽 입니다.

그러므로 모든 컴포넌트가 하나의 security group에 속하는것 보다 필요한 inbound/outbound 룰에 따라 여러개의 security group 을 설정해 주는게 좋습니다.

저희는 Application load balancer를 사용 할 것이고, **로드밸런서는 인터넷으로 부터의 https 요청을 허락 할 수 있도록 port 443이 열린 security group 이 필요**합니다.

반대로 **ECS 서비스의 경우, 인터넷으로부터 로드밸런서를 통하지 않고 들어오는 다이렉트 요청을 허락하지 않는 새로운 security group이 필요**합니다. 또한 DB로 사용하는 Redis와 소통할 수 있는 포트를 열어줘야 합니다.

성공적으로 security group을 생성했다면 이제 subnet을 생성하러 가보실까요?
***
### Subnet
Fargate Task가 동작할 ECS 서비스는 안정성을 위해 최소 2개 이상의 subnet을 필요로 합니다.
[stackoverflow - Why I should configure a AWS ECS Service with two or more Subnets? ](https://stackoverflow.com/questions/62971888/why-i-should-configure-a-aws-ecs-service-with-two-or-more-subnets)

만약 새로운 VPC를 생성하지 않고 기존의 VPC를 사용한다면, IPv4 CIDR block 설정 시 다른 서브넷에 할당된 CIDR block 주소와 겹치는 에러가 발생할 수 있습니다. 이 경우 다음과 같이 수정할 수 있습니다.

#### Fix 1. 다른 서브넷 주소를 보고 겹치지 않는 CIDR 주소 설정
AWS console의 VPC - subnet 메뉴에서 다른 서브넷들의 주소를 확인할 수 있습니다.

만약 subnet range와 subnet masking의 컨셉과 친숙하지 않다면 다음 유튜브 영상을 추천드립니다. 인포크링크 선정 2022년 최고의 강의!

[https://www.youtube.com/watch?v=s_Ntt6eTn94](https://www.youtube.com/watch?v=s_Ntt6eTn94)

#### Fix 2. VPC 내에 새로운 CIDR 추가
VPC 내에 아직 할당되지 않은 큰 범위의 CIDR을 추가해주고, 새로 생성한 CIDR 내에서 subnet에 적당히 할당해주면 됩니다.

서비스를 위해 필요한 2개의 subnet을 생성한 후에는, load balancer에 필요한 subnet을 생성해 줍니다. 각 AZ마다 하나씩, 총 3개를 생성해 지정해 진행했습니다.

***
### Route53
Route53은 AWS가 제공하는 클라우드 DNS 웹 서비스입니다.
상위 요소인 도메인, 하위 요소인 레코드로 구성되며 하나의 도메인 안에 여러 개의 레코드를 가질 수 있습니다.
연결을 하고자 하는 도메인 안에 레코드를 생성한 뒤 `레코드 편집`을 통해 로드 밸런서의 IP 주소를 라우팅 대상으로 설정할 수 있습니다.
***
### Codedeploy
새로운 deploy를 실행하는 경우 먼저 애플리케이션을 생성한 뒤 생성된 애플리케이션 안에서 배포 그룹을 생성해야 deploy를 진행할 수 있습니다.
![AWS Codedeploy](https://images.velog.io/images/gouz7514/post/a47bfa21-351a-4186-a721-9f416e9e4a1c/image.png)

배포 그룹에서는 **배포를 진행할 서비스, 클러스터, 로드 밸런서 및 타겟 그룹을 지정**할 수 있습니다.

또, Codedeploy에서는 설정을 통해 새로운 배포가 진행되면 원본 작업 세트가 종료되기 전 대기 시간을 지정할 수 있습니다. 이를 통해 실제 배포가 진행된 후 예상치 못한 에러가 발생하는 경우 다시 원본 작업 세트로 되돌리는 등의 작업이 손쉽게 콘솔을 통해 가능합니다.

***
이로서 AWS와 Docker를 활용한 서버 이미지의 컨테이너화 작업이 모두 완료되었습니다!
3부에서는 1,2부에서 진행한 다양하고 복잡한 단계를 인포크링크에서는 어떻게 CDK를 통해서 관리를 하는지 다루도록 하겠습니다.
***
보다 상세한 내용 및 시행착오에 대해서는 [여기](https://medium.com/ab-z/%EA%B8%89%EA%B2%A9%ED%95%98%EA%B2%8C-%EC%A6%9D%EA%B0%80%ED%95%98%EB%8A%94-%ED%8A%B8%EB%9E%98%ED%94%BD-%EC%96%B4%EB%96%BB%EA%B2%8C-%EB%8C%80%EB%B9%84%ED%95%A0%EA%B9%8C-d92f2fbf2130)서도 확인할 수 있습니다!