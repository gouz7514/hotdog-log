---
title: 'ECS와 Docker 사용기 - 0부'
summary: '서론'
tags: ['AWS', 'Docker']
date: '2022-01-26 00:00:00'
---
작년 6월 첫 직장에 입사한지 벌써 8개월이라는 시간이 흘렀습니다.
이번 글에서는 올해부터 메인 개발자로 참여하게 된 [인포크링크](https://link.inpock.co.kr/) 팀에서 진행했던 프로젝트 **서버 컨테이너화**의 상세 과정에 대해서 다뤄보려고 합니다.

AWS의 다양한 스택 사용을 염두에 두고 계시거나, 더 나은 서버를 위해 고민하시는 분이라면 이 글을 통해 어느 정도 도움이 될 수 있길 바랍니다!

본 글은 [AB-Z의 medium](https://medium.com/ab-z)에 기고된 글에 대해 좀 더 자세하게 쓰려고 노력한 글입니다. 주요 의사 결정이나 시행착오 등에 대해서는 [링크](https://medium.com/ab-z/%EA%B8%89%EA%B2%A9%ED%95%98%EA%B2%8C-%EC%A6%9D%EA%B0%80%ED%95%98%EB%8A%94-%ED%8A%B8%EB%9E%98%ED%94%BD-%EC%96%B4%EB%96%BB%EA%B2%8C-%EB%8C%80%EB%B9%84%ED%95%A0%EA%B9%8C-d92f2fbf2130)를 참고하세요 😃
***
### 서론
이번 프로젝트는 [AB-Z](https://www.notion.so/inpock/ABZ-8ecc728639d94704b7b25ef8e770b117)에서 제공하는 서비스 중 <span style="color:#ff5b1a">인포크링크</span> 서비스 환경에서 진행되었습니다.
<span style="color:#ff5b1a">인포크링크</span>는 `인플루언서와 소비자 사이의 거리를 좁힌다`는 목표 아래 만들어졌습니다. 인플루언서들이 다양한 링크를 하나의 페이지에서 관리하며 인플루언서의 팔로워이자 소비자들에게 가치를 쉽고 빠르게 전달할 수 있는 서비스입니다. 인플루언서는 인포크링크의 관리자로 가입하여 마켓, 공동구매, 쇼핑몰 링크는 물론 CS 채널, 유튜브 등 원하는 링크를 본인의 링크페이지에 추가할 수 있고 방문자들은 인플루언서가 홍보하는 링크로 쉽게 접속할 수 있습니다.

기존의 <span style="color:#ff5b1a">인포크링크</span>는 AWS에서 제공하는 서비스를 활용해 서버는 EB (ElasticBeanstalk), 프론트는 ECS (Elastic Container Service)로 환경을 구축해 개발 및 유지, 보수를 진행중이었습니다. 우리는 여기서 고민이 생겼습니다.

> 서버를 좀 더 빠르게 scale-out할 수 있는 시스템을 만들 수 있지 않을까?

바로 이 부분에서 우리의 프로젝트는 시작되었습니다.
일명 **`서버 컨테이너화`** 프로젝트이며 주요 목표는 다음과 같습니다.

> 서버의 컨테이너화를 통해 서버 스택을 ECS로 이전해 **auto-scaling에 걸리는 시간을 유의미하게 단축**합니다.
**무중단 배포**를 통해 유저 입장에서 배포가 진행되는 사실을 알지 못하게 합니다.
기존에 사용하던 **외부 API의 사용에도 문제가 없어야** 합니다.

프로젝트는 약 4주동안 진행됐으며 주요 과정은 크게 다음과 같이 나뉩니다.
**[1부](https://hakjae.dev/blog/use-ecs-with-docker-part-1),** Docker를 활용해 장고 서버 및 nginx의 이미지를 생성하고 ECR에 push합니다.
**[2부](https://hakjae.dev/blog/use-ecs-with-docker-part-2),** 태스크, 클러스터, 서브넷, Route 53 등 빌드된 이미지를 통해 배포 과정을 거칩니다.
**[3부](https://hakjae.dev/blog/use-ecs-with-docker-part-3),** github action을 활용한 CI/CD, CDK를 통한 stack deploy 를 통해 AWS console을 통하지 않고 배포 및 수정을 가능하도록 합니다.