# hexo-web-push-notification

![downloads](https://img.shields.io/npm/dt/hexo-web-push-notification)

A hexo plugin help you automatically notify readers new post update.

## Requirement

This plugin relies on [webPush](https://www.webpushr.com/), which is a **free** web push notification service. Thus make sure your site support webpusr. Here is the [教程](https://www.inevitable.tech/posts/98ae9e55/).

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
```

**notice**: The ask-for-notification prompt will not appear locally. This means you will not see any ask-for-notification prompt when running `hexo server`

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

Maybe support more web push notification services.

Maybe try to help integrate web push notification services into different themes.

The roadmap needs your feedbacks. Feel free to open the issue.
