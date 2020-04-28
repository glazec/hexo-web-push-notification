# hexo-web-push-notification

![downloads](https://img.shields.io/npm/dt/hexo-web-push-notification)

A hexo plugin helps you **automatically** notify readers new post update **everytime** you deploy new post. Subscribed readers can receive browser notification about your latest post. The notification will contain title and excerpt. Clicking it will bring readers to your latest post.

![example](https://www.inevitable.tech/static/images/webpush4.png)

[开发经历](https://www.inevitable.tech/posts/a1b574bb/)

[Example site](https://www.inevitable.tech)

Reminder: If you choose not to receive the notification, the prompt will not shown until 15 days later.

## Requirement

This plugin relies on [webPushr](https://www.webpushr.com/), which is a **free** web push notification service. Thus make sure you have already registered and add your site into the webpushr. If you want notifications to work for Safari, remember to set up the Safari Certificate. Here is the [教程](https://www.inevitable.tech/posts/98ae9e55/). Do not worry about integrating webpushr into your site. This plugin will make this happen for you.

## Install

```js
npm i hexo-web-push-notification --save
```

## Usage

Add the configuration to `_config.yml` in hexo root dir.

```yml
webPushNotification:
  webpushrKey: "your webpushr rest api key"
  webpushrAuthToken: "your webpushr authorize token"
  trackingCode: "AEGlpbdgvBCWXqXI6PtsUzobY7TLV9gwJU8bzMktrwfrSERg_xnLVbjpCw8x2GmFmi1ZcLTz0ni6OnX5MAwoM88"
```

The `trackingCode` is a little bit harder to find. Go to your webpushr site dashboard, and go to Setup>TrackingCode. The tracking code look like this:

```js
<!-- start webpushr tracking code -->
<script>(function(w,d, s, id) {w.webpushr=w.webpushr||function(){(w.webpushr.q=w.webpushr.q||[]).push(arguments)};var js, fjs = d.getElementsByTagName(s)[0];js = d.createElement(s); js.id = id;js.src = "https://cdn.webpushr.com/app.min.js";
fjs.parentNode.appendChild(js);}(window,document, 'script', 'webpushr-jssdk'));
webpushr('init','AEGlpbdgvBCWXqXI6PtsUzobY7TLV9gwJU8bzMktrwfrSERg_xnLVbjpCw8x2GmFmi1ZcLTz0ni6OnX5MAwoM88');</script>
<!-- end webpushr tracking code -->
```

`AEGlpbdgvBCWXqXI6PtsUzobY7TLV9gwJU8bzMktrwfrSERg_xnLVbjpCw8x2GmFmi1ZcLTz0ni6OnX5MAwoM88` in the last line is your `trackingCode`.

The webpushrKey and webpushrAuthToken can be found in Integration>REST API Keys.

**notice**: The ask-for-notification prompt will not appear locally. This means you will not see any ask-for-notification prompt when running `hexo server`

## Customize
You can customize how your ask-for-notification prompt look like in Setup>EditCustom Prompts.

## How it works

The plugin generates `newPost.json` during `hexo generate`. The `newPost.json` contains the information of latest post. It looks like this:

```json
{
  "title": "Auto web push notification",
  "id": "posts/afd56cf2/",
  "date_published": "02/24/2020",
  "summary": "如何自动通知读者有更新了？即只要正常更新博客，读者便可以在第一时间收到关于新文章的通知。",
  "url": "https://www.inevitable.tech/posts/afd56cf2/",
  "tags": ["hexo", "push notifications", "自动化", "CI"],
  "categories": ["开发"]
}
```
The summary part is from the excerpt of your post. Plase ensure that your post have **excerpt**.
```
---
title: Hexo使用Web Push Notification 浏览器通知推送
tags:
  - hexo
  - 服务器推送技术
  - push notifications
categories:
  - 开发
comments: true
abbrlink: 98ae9e55
date: 2020-02-26 10:00:00
---

Web Push Notification 是怎么工作的？个人博客为什么要使用它？如何使用它？

<!-- more -->
```
The content between `---` and `<!-- more -->` is excerpt.

When you call `hexo deploy`, the plugin will compare the `newPost.json` from your online site and from your local machine. If the id values are different, the plugin will trigger the push notification from [webPush](https://www.webpushr.com/).

## Future work

- [ ] Maybe support more web push notification services.

The roadmap needs your feedbacks. Feel free to open the issue.
