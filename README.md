# hexo-web-push-notification

![downloads](https://img.shields.io/npm/dt/hexo-web-push-notification)

A hexo plugin help you automatically notify readers new post update. Subscribed readers can receive notification about your latest post. The notificaiton will contain title and excerpt. Clicking it will bring readers to your latest post.

## Requirement

This plugin relies on [webPushr](https://www.webpushr.com/), which is a **free** web push notification service. Thus make sure you have already registered and add your site into the webpushr. If you want notifications work for Safari, remember to set up the Safari Certificate. Here is the [教程](https://www.inevitable.tech/posts/98ae9e55/). Do not worry about integrating webpushr into your site. This plugin will make this happen for you.

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

Put `AEGlpbdgvBCWXqXI6PtsUzobY7TLV9gwJU8bzMktrwfrSERg_xnLVbjpCw8x2GmFmi1ZcLTz0ni6OnX5MAwoM88` in the last line is your `trackingCode`.

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

When you call `hexo deploy`, the plugin will compare the `newPost.json` from your online site and from your local machine. If the id values are different, the plugin will trigger the push notification from [webPush](https://www.webpushr.com/).

## Future work

- [ ]Maybe support more web push notification services.

- [x]Maybe try to help integrate web push notification services into different themes.

- [ ]The roadmap needs your feedbacks. Feel free to open the issue.
