---
title: '우당탕탕 vue-query 적용기'
summary: 'vue-query 적용을 통한 서비스의 성능 개선! (feat. react-query)'
tags: ['Vue', 'Vue-Query', 'ABZ Inc.']
date: '2023-01-04 00:00:00'
---

작년 한해를 숨가쁘게 달리면서 여러 프로덕트 프로젝트를 진행해 왔다. 사용자들의 니즈에 맞는 여러 기능들을 출시한 덕분인지 주간 가입자가 최고치를 찍는 순간도 있었고, 인스타에서도 우리 서비스를 사용하는 유저들을 점점 많이 찾아볼 수 있게 되었다.

그러다보니 트래픽이 몰릴 때 서비스의 속도가 느려지는 현상이 종종 발생하게 되었고, 22년이 끝나기 전 테크팀 어벤져스가 모두 모여서 `서비스의 속도 개선` 이라는 특명 아래 여러 프로젝트를 진행하게 되었다.

이번 포스팅은 내가 담당으로 진행한 `서버 상태 캐싱` 프로젝트에 관련된 내용이다. 

---

### 목표
본 프로젝트의 목표는 서버 상태의 캐싱을 통해 불필요한 api의 요청을 방지하고 서비스의 속도를 개선하는 것을 목표로 하는 프로젝트였다. 최초 접속 시에는 서버에서 정보를 받아온다면, 이후에 해당 정보가 변경되지 않았다면 서버에 요청을 하지 않고 캐싱된 정보를 활용해 사용자에게 좀 더 나은 UX를 제공하는 것을 최우선 목표로 한다

웹서비스가 vue를 기반으로 만들어져 있어서 이번 포스팅의 모든 내용은 vue를 중심으로 설명한다. vue 사용자들에게 많은 도움이 될 수 있으면 좋겠다!

### 진행 내용
#### 1) vue-query 설치하기
리액트에서 활용할 수 있는 `react-query`를 기반으로 만들어진 `vue-query`는 기본적인 사용법은 매우 비슷하다.

vue3에서는 vue-query의 다양한 기능들을 기본적으로 제공하지만 vue2에서 사용하기 위해서는 [vuejs/composition-api](https://github.com/vuejs/composition-api)를 따로 설치해서 사용해야 한다 (물론 해당 프로젝트도 vue 2.6 이하의 경우에만 지원하는, 이제는 deprecated될 프로젝트...)

`vue-query`, `vuejs/composition-api`를 모두 설치했다면 각각을 plugin으로 선언해서 사용할 준비를 한다.

```javascript
// vueQuery.js
import Vue from "vue"
import { VueQueryPlugin, QueryClient, hydrate } from "vue-query"

export default (context) => {
  // 여기서 vue query의 global setting을 할 수 있다
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 1000 } },
  })
  const options = { queryClient }

  Vue.use(VueQueryPlugin, options)

  if (process.client) {
    if (context.nuxtState && context.nuxtState["vue-query"]) {
      hydrate(queryClient, context.nuxtState["vue-query"])
    }
  }
}
```
```javascript
// compositionApi.js
import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'

Vue.use(VueCompositionAPI)
```

#### 2) 페이지 내에서 사용해보기
**캐싱 적용하기**
vue-query의 기능은 vue3의 `setup()` 라이프사이클 내에서만 호출이 가능하다. vue2에서의 사용을 위해 `composition-api`를 활용해 기본적인 페이지의 구조를 변경해서 사용한다.

vue2에서는 `asyncData`, `mounted` 와 같은 생명주기에서 데이터를 가져왔다면, vue3에서는 여러 라이프사이클을 사용할 필요없이 setup 라이프사이클 내에서 대부분의 기능들이 사용 가능하다.

**AS_IS**
```javascript
export default {
  ...
  async asyncData(context) {
    const { $axios } = context // nuxt의 context에서 axios를 호출

	const A = await $axios.get('/A')
    
    const { status: aStatus, data: aData } = A
    
    if (aStatus === 200) {
      return {
        result: aData.results
      }
    }
  ...
}
```

**TO_BE**
```javascript
import { useQuery } from 'vue-query'
import { defineComponent, ref } from '@vue/composition-api'

// A 정보를 가져오기 위한 queryFn
const queryFn = async (axios) => {
  const { status, data } = await axios.get('/A')
  return data.results
}

export default defineComponent ({
  setup(_, context) {
    const app = getCurrentInstance().proxy
    let fetchEnable = ref(false)
    
    // query key를 QUERY_KEY에서 불러온다
    const QUERY_KEY = app.$QUERY_KEY.A를_불러오기_위한_쿼리_키
    
    // queryFn에 axios를 넘겨준다
    const { data } = useQuery(QUERY_KEY, () => queryFn(app.$axios), {
      staleTime: Infinity,
      enabled: fetchEnable // 이 값을 활용해 호출 시점 결정
    })
    
    // mount되는 시점에 정보를 요청할 수 있도록 한다
    onMounted(() => {
      fetchEnable.value = true
    })
    
    return {
      data
    }
  }
})
```
두번째 코드에서 중요한 부분은
- react-query에서는 데이터를 `쿼리 키` 값을 기반으로 관리하기 때문에 고유한 쿼리 키 값을 `useQuery`에 넘겨줬다는 것
- staleTime을 Infinity로 설정해 데이터에 변화가 있지 않은 이상 데이터는 계속 신선한 상태를 유지하게 된다

위와 같은 방식으로 우선적으로 캐싱을 적용할 수 있는 페이지에 캐싱을 진행하였다.

**캐시 invalidate하기**
캐싱을 적용했다면 이제는 캐시를 삭제하고 서버에서 데이터를 갱신해야하는 시점도 필요하게 된다. 이 경우 `invalidateQuery` 요청을 날리게 된다.

주의할 점인지 모르겠지만 `/A` 요청에 대해 캐싱을 적용하고 있다가 A 데이터에 변화가 생겨 `invalidateQuery` 를 하게 되면 그 즉시 서버측에 `/A` 에 대해 새로운 요청을 하게 된다. 이 과정에서, 원치 않는 데이터 refetching 및 브라우저 reflow가 발생할 수도 있다. 이런 경우 `setQueryData`를 활용해 같은 쿼리 키 값에 데이터를 덮어 씌우는 방법을 택할 수도 있다

### 결과
정량적인 수치를 여기에는 정리할 수 없지만 대략적으로 진행한 측정 수치를 공유하려고 한다.

#### core web vital
웹 페이지의 성능을 측정할 수 있는 지표 중 하나인 core web vital을 프로젝트 전후로 비교하였다.
주요 3대 지표로 꼽히는 FCP, LCP, TTI만을 놓고 보자면
- `FCP` : 2.8s -> 0.4s
- `LCP` : 3.1s -> 0.5s
- `TTI` : 4.1s -> 2s
와 같이 **적게는 50%부터 많게는 80%까지 성능이 개선**되는 것을 확인할 수 있었다.

#### api 호출 횟수
`불필요한 api의 요청을 방지` 하는 최초의 목표를 얼마나 달성했는지 비교하기 위해 api의 요청 횟수를 프로젝트 전후 같은 기간동안 비교하였다.

캐싱이 적용된 3개 api에 대해, 서비스의 전체적인 트래픽은 증가한 반면, **호출 횟수는 모두 약 15% 정도 감소**된 것을 확인할 수 있었다.

### 느낀 점
처음 시작할 때는 막막했던 프로젝트였으나 진행하면 할수록 '왜 진작 하지 않았을까' 하는 생각이 잔뜩 드는 프로젝트였다. 얼기설기 짜놓은 코드들도 지금 와서 보니 블로그에 정리하기가 민망할 정도이니, 캐싱에 대해 무지몽매하던 내가 단기간에 빠르게 성장했구나를 깨달을 수 있었던 프로젝트였다.

나는 해낼 수 있다 를 다시 한번 체감하게 된 프로젝트이다. 이 프로젝트를 여기에 포스팅함으로서 올해를 시작하는 마음을 다잡고 좀 더 열심히, 느리더라도 꾸준히 성장해나가고자 한다!