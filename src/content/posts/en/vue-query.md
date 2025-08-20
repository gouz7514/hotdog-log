---
title: 'A Vue-Query implementation story'
summary: 'Service performance improvement with vue-query!'
tags: ['FE', 'Vue', 'Productivity']
date: '2023-01-04 00:00:00'
---

Last year, I ran breathlessly through various product projects. Thanks to launching various features that met users' needs, we had moments where weekly signups hit their peak, and we could increasingly find users using our service on Instagram.

As a result, we often experienced slowdowns in service speed when traffic surged, and before the end of 2022, the entire tech team Avengers gathered under the special mission of `service speed improvement` to proceed with various projects.

This post is about the `server state caching` project that I was in charge of.

---

### Goal
The goal of this project was to prevent unnecessary API requests through server state caching and improve service speed. While we fetch information from the server on initial access, if that information hasn't changed afterward, we aim to provide users with better UX by utilizing cached information without making server requests - this was our top priority.

Since our web service is built on Vue, all content in this post is explained centered around Vue. I hope this can be of great help to Vue users!

### Implementation Details
#### 1) Installing vue-query
`vue-query`, which is built based on `react-query` that can be used in React, has very similar basic usage.

While Vue 3 provides various features of vue-query by default, to use it in Vue 2, you need to separately install and use [vuejs/composition-api](https://github.com/vuejs/composition-api) (of course, this project only supports Vue 2.6 and below, and is now a deprecated project...)

Once you've installed both `vue-query` and `vuejs/composition-api`, declare each as a plugin to prepare for use.

```javascript
// vueQuery.js
import Vue from "vue"
import { VueQueryPlugin, QueryClient, hydrate } from "vue-query"

export default (context) => {
  // Here you can set vue query's global settings
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

#### 2) Using it within pages
**Applying caching**
Vue-query's functionality can only be called within Vue 3's `setup()` lifecycle. For use in Vue 2, we use `composition-api` to change the basic page structure.

While in Vue 2 we fetched data in lifecycles like `asyncData` and `mounted`, in Vue 3, most functionalities are available within the setup lifecycle without needing multiple lifecycles.

**AS_IS**
```javascript
export default {
  // ...
  async asyncData(context) {
    const { $axios } = context // Call axios from nuxt's context

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

// queryFn to fetch A information
const queryFn = async (axios) => {
  const { status, data } = await axios.get('/A')
  return data.results
}

export default defineComponent ({
  setup(_, context) {
    const app = getCurrentInstance().proxy
    let fetchEnable = ref(false)
    
    // Load query key from QUERY_KEY
    const QUERY_KEY = app.$QUERY_KEY.query_key_for_fetching_A
    
    // Pass axios to queryFn
    const { data } = useQuery(QUERY_KEY, () => queryFn(app.$axios), {
      staleTime: Infinity,
      enabled: fetchEnable // Use this value to determine call timing
    })
    
    // Enable information request when mounted
    onMounted(() => {
      fetchEnable.value = true
    })
    
    return {
      data
    }
  }
})
```
The important parts in the second code are:
- Since react-query manages data based on `query key` values, we passed a unique query key value to `useQuery`
- By setting staleTime to Infinity, the data maintains a fresh state unless there are changes to the data

Using this approach, we applied caching to pages where caching could be prioritized.

**Cache invalidation**
Once caching is applied, there are times when we need to delete the cache and refresh data from the server. In such cases, we make an `invalidateQuery` request.

I'm not sure if this is something to be careful about, but when caching is applied to a `/A` request and there's a change in A data triggering `invalidateQuery`, it immediately makes a new request to `/A` on the server side. During this process, unwanted data refetching and browser reflow might occur. In such cases, you could choose to use `setQueryData` to overwrite data with the same query key value.

### Results
While I can't share specific quantitative figures here, I'd like to share the approximate measurement results.

#### Core Web Vitals
We compared core web vitals, one of the metrics for measuring web page performance, before and after the project.
Looking at the three major indicators FCP, LCP, and TTI:
- `FCP` : 2.8s -> 0.4s
- `LCP` : 3.1s -> 0.5s
- `TTI` : 4.1s -> 2s
We confirmed **performance improvements ranging from 50% to 80%**.

#### API call frequency
To compare how well we achieved our initial goal of `preventing unnecessary API requests`, we compared API request frequencies for the same period before and after the project.

For the three APIs where caching was applied, while overall service traffic increased, we confirmed that **call frequencies all decreased by about 15%**.

### Reflections
What started as an overwhelming project became one where I increasingly thought 'why didn't we do this sooner?' The hastily written code now looks embarrassing enough that I'm hesitant to organize it for this blog post, so I realized that I, who was completely ignorant about caching, had grown rapidly in a short period.

This was a project that made me feel once again that 'I can do it.' By posting this project here, I want to steel my resolve to start this year and grow more diligently and steadily, even if slowly!