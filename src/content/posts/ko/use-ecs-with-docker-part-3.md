---
title: 'ECS와 Docker 사용기 - 3부 : CDK를 통한 서버 관리'
summary: 'ECS와 Docker 사용기 - 3부 : CDK를 통한 서버 관리'
tags: ['AWS', 'Docker', 'ABZ Inc.']
date: '2022-01-26 00:00:03'
---
본 글에서는 배포된 서버 환경에서의 테스트 그리고 CDK를 통한 서버 관리에 대해서 다룹니다.
앞선 내용이 궁금하시다면 [1부](https://hakjae.dev/posts/use-ecs-with-docker-part-1), [2부](https://hakjae.dev/posts/use-ecs-with-docker-part-2)를 참고하세요!
***
### Stress test
실제 request 수와 비슷하게 재현한 로컬 환경에서의 스트레스 테스트도 문제 없이 진행되는 것을 확인할 수 있었습니다.
![attempt 1](https://miro.medium.com/max/1400/1*W17ivnvXjR87mWvI1jDx_A.png)

![attempt 2](https://miro.medium.com/max/1400/1*SpuOiDEBpvqi2HAFUk1zrg.png)

1차 시도에는 Nginx 와 django의 cpu 할당량을 각각 0.15 : 0.85 비율로 주고 진행,
2차 시도에서는 따로 할당하지 않은 기본 세팅으로 진행했습니다.

![stress test result](https://miro.medium.com/max/870/1*_-UE23dv74HUJqkJvL05rw.png)
그 결과 유의미한 차이를 찾지 못해 별도의 설정을 하지 않고 진행했습니다.
***
### AWS CDK
이렇게 배포는 성공적으로 마무리되었지만 이런 복잡한 과정을 매번 반복하기에는 물리적인 한계가 존재했습니다.
이런 과정을 코드를 통해 한번에 관리할 수 있도록 해주는 기능이 바로 [AWS CDK](https://aws.amazon.com/ko/cdk/)입니다.

AWS CDK(Cloud Development Kit)는 프로그래밍 언어를 사용하여 클라우드 애플리케이션 리소스를 정의할 수 있는 개발 프레임워크입니다.

서비스, VPC, 보안 그룹 등 다양한 AWS의 기능들을 CDK를 통해 손쉽게 관리할 수 있습니다. 또한, CDK는 `.NET` , `GO`, `Java`, `Python`, `Typescript` 언어들을 사용해 개발할 수 있어 개발자 본인에게 친숙한 언어를 선택해 개발할 수 있습니다.

CDK는 빌드된 스택을 `cdk deploy 스택명` 커맨드를 통해 AWS의 Cloudformation에 생성합니다. deploy된 스택은 각 단계별로 진행 상황 및 에러 발생 시 어느 부분에서 에러가 발생하는지를 손쉽게 파악할 수 있습니다. 또한 `cdk synth` 커맨드를 통해 작성중인 코드와 실제 AWS의 리소스와 차이점을 파악해 개발자의 실수를 방지할 수 있습니다. 

아쉽게도 현재 기준(2022.1.27) CDK는 codedeploy까지는 완벽하게 지원하지 않아 CDK만을 사용한 완벽한 배포는 불가능합니다. 이를 보완하기 위해 우리는 github action을 사용해 이미지를 푸쉬하고 동시에 codedeploy 과정까지 수행함으로서 CDK 그리고 github action을 사용한 CI/CD 과정을 완성했습니다.

CDK의 완성을 통해 이제 <span style="color:#ff5b1a">인포크링크</span>의 개발자는 누구라도 손쉽게 서버 이미지를 관리할 수 있게 되었습니다
> **초기 배포**
1. cdk deploy 스택
2. 서버 이미지 업로드
3. codedeploy 그룹 생성
4. github action을 통한 codedeploy<br/>
**새로운 배포가 있을 경우**
github action을 통한 deploy

실 서버를 배포한 뒤 약 3일의 모니터링 기간동안 서버는 정상적으로 동작했고 동시에 서비스 장애 관련 CS도 발생하지 않았습니다.
***
이로서 **서버 컨테이너화** 프로젝트는 성공적으로 마무리되었습니다. 프론트엔드 개발자로 일하다 보면 페이지, 기능 구현 등의 업무에 갇히게 되는 경우가 종종 있는데 평소에 접하기 힘든 스택들에 대한 다양한 공부를 할 수 있는 좋은 기회였습니다. 동시에 좀 더 큰 숲을 바라볼 수 있는 안목도 생기게 됐습니다.

> 풀스택 개발자로 나아가는 첫 발걸음을 잘 내딛은 것 같다..!