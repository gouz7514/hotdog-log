---
title: 'Experience Faster Data Transfer Using Ping Requests'
summary: 'Improving event logic with Ping Requests (feat. sendBeacon)'
tags: ['Network', 'Javascript']
date: '2024-02-25 22:00:00'
---

Recently, while working on an internal company project, I encountered and utilized a method called `sendBeacon`.
Through this process, I was able to improve our business logic, and I'd like to share that journey in this post.

> #### TL;DR
> - What is a Ping Request?
> - Utilizing the `sendBeacon` method
> - Understanding what `OPTIONS` requests are and how to skip them

---
## Event Collection
The InpockLink I'm currently developing is a link-in-bio service where users can add any links they want and share them. Thanks to the ability to manage many links at once, many users are adding our links to their Instagram bio links.

Additionally, InpockLink provides click count aggregation for each link exclusively for paid plan users. This allows users to see how many times their links have been clicked, enabling more effective marketing strategies.

While I can't explain the detailed logic of click count aggregation events, here's a simple overview:
```markdown
// Event occurrence sequence
1. User visits page
2. User clicks link
3. Open link in new window (target="blank") while simultaneously sending click event to server
4. Click event aggregation and redirection
```

## Issues with In-App Browsers (Instagram)
As mentioned above, numerous users access our service through Instagram bio links.
This means they use our service in in-app browsers, and **since in-app browsers don't open links in new windows but rather in the current window**, events are triggered with the following logic:

```markdown
// Event occurrence sequence in in-app browsers (Instagram)
1. User visits page
2. User clicks link
3. Send click event to server
4. Once click event is complete, redirect to the clicked link
```

If the network environment is fine, the above logic works perfectly. However, if the network environment is slow or if there's an issue with the event aggregation API, redirection to the desired link might not occur, ultimately leading to service errors.

## Ping Request
While contemplating solutions to this issue, I became curious about how other services handle such events, so I looked into Linktree's event logic.

![ping-request](https://github.com/gouz7514/hotdog-log/assets/41367134/5f311ce9-b716-4699-b914-c2c197d142e0)

Like us, Linktree also calls event APIs when links are clicked, but looking at the Network tab in developer tools, I noticed they were making requests as Ping type rather than Fetch/XHR type.

So, I became curious about what ping requests are and why they adopted this approach. After researching, I found the following information:

[StackOverflow - Type "ping" in network tab](https://stackoverflow.com/questions/75666416/type-ping-in-network-tab)
![ping request description](https://github.com/gouz7514/hotdog-log/assets/41367134/a9701cef-cc59-4f23-9a2d-f94a009939b1)

- `ping` requests can be sent using `navigator.sendBeacon`.
- It's a method to address the problems of traditional `XMLHttpRequest` when sending data.

So what is the `sendBeacon` method?

### `sendBeacon()`
[MDN - Navigator: sendBeacon() method](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon)

When users navigate between web pages and need to send data to the server, using `XMLHttpRequest` required the following approaches to guarantee data transmission completion:
- Send data through blocking and synchronous `XMLHttpRequest` calls
- Create an `<img>` element and set a URL containing data in the `src` attribute to send data
- Or... send data through random time loops

All these methods block page transitions, providing a poor user experience.
The `sendBeacon` method can be used to solve this issue.

The `sendBeacon` method asynchronously sends POST requests containing small amounts of data.
The `sendBeacon` method **returns whether the data to be sent was successfully added to the queue**. In other words, it only cares about sending the request, not about subsequent actions.

With these advantages of the `sendBeacon` method, our event logic can be improved as follows:
```markdown
1. User visits page
2. User clicks link
3. Send click event to server through `sendBeacon` method
4. User is redirected to the clicked link
5. Click event aggregation is completed on the server since it was already sent
```

As soon as the user clicks a link, the click event is sent to the server, and the user can be redirected to the desired link regardless of whether this action succeeds or fails.

## + `OPTIONS` request
When exchanging requests with URLs or servers, you can see `OPTIONS` requests occurring.
This is a preflight request that checks whether the server can accept the request before sending the actual request.

Since the `sendBeacon` method ultimately sends `POST` requests, `OPTIONS` requests occur. However, in Linktree's case above, I noticed that `OPTIONS` requests don't occur.

Thinking that not triggering `OPTIONS` requests might reduce the load on API servers, I researched and found the following solution:
- One of `GET`, `HEAD`, `POST` requests
- `Content-Type` header is one of `application/x-www-form-urlencoded`, `multipart/form-data`, `text/plain`
- Only includes headers specified as CORS-satisfied request-headers

(Source: [MDN - CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#simple_requests))

In Linktree's case above, `OPTIONS` requests don't occur either, and as shown in the image below, you can see that Content-type is set to `text/plain`.
![linktree api content type as text/plain](https://github.com/gouz7514/hotdog-log/assets/41367134/0b5dc006-6c61-4f69-8962-0772cc290d45)

While the overall number of API requests would decrease, it also means skipping a kind of safety mechanism in terms of CORS, so the decision to apply this approach should be made carefully. I wonder what reasons led Linktree to adopt this approach...

---
The solution was simpler than expected, but what I learned in the process was incredibly new and useful. Through brief consideration, the solution not only improved our business logic but also enabled us to provide a better user experience. I feel very relieved to have grown one step closer to being **a developer who finds inconvenience inconvenient**, which is always my goal.

> **What I learned from this post**
> - Ping requests can be used to send small amounts of data.
> - You can send ping requests using the `sendBeacon` method.
> - `OPTIONS` requests are preflight requests, and you can skip them if desired.

---
**Referenced articles**
- [StackOverflow - Type "ping" in network tab](https://stackoverflow.com/questions/75666416/type-ping-in-network-tab)
- [MDN - Navigator: sendBeacon() method](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon)
- [MDN - CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#simple_requests)