---
title: 'ECS와 Docker 사용기 - 1부 : ECS & Docker 박치기'
summary: 'ECS와 Docker 사용기 - 1부 : ECS & Docker 박치기'
tags: ['AWS', 'Docker', 'ABZ Inc.']
date: '2022-01-26 00:00:01'
---
### Dockerizing
먼저 Docker를 활용해 서버 이미지를 빌드합니다.
우리가 빌드할 이미지는 서버인 **장고 컨테이너 이미지,** 장고 앞단에 사용할 **nginx 컨테이너 이미지** 총 2개입니다.

장고와 함께 nginx를 사용하는 이유는 바로 장고에서 사용하는 `runserver` 커맨드가 "개발 및 테스트"가 주요 목적이기 때문입니다. 실제로 장고 공식 document에서도 Production 환경에서는 보안, 성능 상의 이슈로 인해 runserver의 사용을 권하지 않고 있습니다.

![runserver는 개발 테스트용](https://images.velog.io/images/gouz7514/post/8cd5583d-efe4-489b-ab2b-e9ecb9f70bae/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202022-02-18%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%202.08.55.png)

(출처 : https://docs.djangoproject.com/en/2.2/ref/django-admin/#runserver)

이러한 이유로 runserver 대신 WSGI(Web Server Gateway Interface)의 일종인 uWSGI를 사용해서 장고를 실행합니다.

여기서 “왜 wsgi를 사용하나요?” 하는 의문이 생길 수 있습니다.

> - wsgi 서버는 많은 request를 다룰 수 있게 설계되어 있습니다.
- 프레임워크들은 수많은 request를 스스로 최적의 방법으로 처리하도록 설계되어 있지 않고 프레임워크를 실행하는 서버에 의해 결정됩니다.

wsgi의 사용을 통해 장고의 웹 프레임워크 기능을 활용함과 동시에 nginx를 앞 단에 붙여 리버스 프록시 역할 등의 수행을 통해 더 좋은 성능을 발휘할 수 있도록 합니다.

각각의 이미지를 빌드하는 방법은 다음과 같습니다.
#### 1. django application
**Dockerfile**
```bash
FROM python:3.6

ENV PYTHONUNBUFFERED 1

ENV PATH="/scripts:${PATH}"

ENV ENV=dev # 환경에 따라 각각 다른 태그를 부여합니다.

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
> ❓ `--gecos` `--disabled-password` 커맨드를 사용하는 이유가 무엇인가요?
❗️ `--disabled-password` 옵션을 통해 password 관련 불필요한 에러의 출력을 방지합니다.
`--gecos` 옵션을 통해 user에 관련된 추가 정보를 설정합니다. `--gecos` 옵션이 없어도 동작에는 아무 문제가 없지만, 우리는 추후 github action을 사용해 관리를 하기 때문에 유저 셋팅 관련된 불필요한 에러의 출력을 방지하기 위해 더미값을 gecos에 부여합니다.

**entrypoint.sh** - migrate, uwsgi 등의 커맨드를 한 파일에서 관리
```bash
#!/bin/sh

set -e

python manage.py collectstatic --noinput

python manage.py migrate --noinput

uwsgi --socket :8000 --master --enable-threads --module (파일명).wsgi
```

이후 Dockerfile이 있는 경로에서 build 커맨드를 입력합니다.
```bash
docker build . (-t 태그) (-f 도커파일명)
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
이후 Dockerfile이 있는 경로에서 build 커맨드를 입력합니다.
```bash
docker build . (-t 태그) (-f 도커파일명)
```

이를 통해 사용자는 8080번 포트를 통해 nginx container에 접속하며, nginx container는 8000번 포트를 통해 django container에 접속이 가능합니다.
***
### ECS cluster - Fargate vs EC2
빌드된 이미지를 ECR에 푸쉬하기 전 목적에 맞는 클러스터를 생성해야 합니다.

AWS에서는 EC2, Fargate 중 클러스터의 인프라를 선택할 수 있습니다.
EC2는 cpu의 사용률이 예측 가능하고 안정적인 시스템에서 더 높은 효율을 발휘하는 반면, fargate는 유동적인 workload가 나타나는 환경에서 높은 효율을 발휘합니다.

인포크링크는 scaling의 빈도가 잦고 평소에는 상대적으로 낮은 workload가 부여되기 때문에 낮은 단위의 cpu(0.25)까지 사용할 수 있는 fargate를 최종 선택했습니다.

이제 생성된 이미지를 ECR에 푸쉬할 차례입니다!
***
### 레포지토리에 이미지 업로드 (feat. m1)
(m1칩을 사용하지 않는 환경이라면 본 단계는 건너뛰셔도 됩니다. 축하합니다!)

이번 프로젝트에서 제일 난항을 겪었으며 동시에 시간이 제일 많이 소요된 구간인 이미지 업로드입니다 🥲
보통의 경우라면 `docker build ~`커맨드를 사용해 이미지를 빌드할 수 있습니다.
하지만 m1칩의 경우 빌드된 이미지를 통해 클러스터에서 태스크를 실행할 경우 다음과 같은 에러를 맞닥뜨리게 됩니다.
![exec format error](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*7N5NUWcHg4Hk5evmW9YJ9A.png)

이유는 바로 ECS 태스크와 m1칩을 통해 빌드된 이미지의 아키텍쳐가 다르기 때문입니다.

ECS 태스크의 아키텍쳐는 `Linux/X86_64`로 설정되는 반면, m1칩을 통해 빌드된 이미지의 아키텍쳐는 `arm64`가 기본값으로 설정됩니다.

이 문제를 해결하기 위해 `docker buildx` 커맨드를 사용할 수 있습니다.

`docker buildx` 는 docker 명령어의 확장 플러그인으로 멀티 아키텍쳐 이미지를 빌드할 수 있습니다. 또한, 사용자가 원하는 기능을 포함한 커스텀 빌더를 통해 원하는 형식의 이미지를 빌드할 수 있습니다.

[Docker Buildx](https://docs.docker.com/buildx/working-with-buildx/)
`--platform` 옵션을 통해 원하는 아키텍쳐를 지정할 수 있습니다.
```bash
docker buildx build --platform linux/amd64 (-t 태그) . (--no-cache) (-f Dockerfile 이름)
```

참고 링크 (수많은 고수분들 너무 감사합니다ㅠㅠ)
[stackoverflow - standard_init_linux.go:178: exec user process caused "exec format error"](https://stackoverflow.com/questions/42494853/standard-init-linux-go178-exec-user-process-caused-exec-format-error)
[Docker Buildx로 Multi-Archtecture Image 빌드하기](https://meetup.toast.com/posts/255)
[M1 맥북 사용자의 EKS 배포 오류에 대하여](https://appleg1226.tistory.com/35)
[[Devops] Docker buildx build(at M1 Macbook)](https://velog.io/@inyong_pang/Devops-Docker-buildx-at-M1-Macbook)
***
이 과정들을 통해 서버 이미지와 nginx 이미지를 빌드하고 ECR에 성공적으로 푸쉬할 수 있었습니다.

[2부](https://hakjae.dev/posts/use-ecs-with-docker-part-2)에서는 생성된 이미지를 통해 태스크 및 서비스를 생성하고 최종적으로 Codedeploy까지 진행해보도록 하겠습니다!
***
보다 상세한 내용 및 시행착오에 대해서는 [여기](https://medium.com/ab-z/%EA%B8%89%EA%B2%A9%ED%95%98%EA%B2%8C-%EC%A6%9D%EA%B0%80%ED%95%98%EB%8A%94-%ED%8A%B8%EB%9E%98%ED%94%BD-%EC%96%B4%EB%96%BB%EA%B2%8C-%EB%8C%80%EB%B9%84%ED%95%A0%EA%B9%8C-d92f2fbf2130)서도 확인할 수 있습니다!