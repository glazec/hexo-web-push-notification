# hexo-web-push-notification
An hexo plugin help you notify readers new post update.
## Requirement
This plugin relies on [webPush](https://www.webpushr.com/), which is a **free** web push notification service. Thus to use this plugin, make sure your site support webpusr. Here is the [教程](https://www.inevitable.tech/posts/98ae9e55/).
## Install
## Usage
Add the configuration to `_config.yml` in hexo root dir.

```yml
webPushNotification:
    webpushrKey: 'your webpushr rest api key'
    webpushrAuthToken: 'your webpushr authorize token'
```
## How it works
The plugin generate `newPost.json` during `hexo generate`. The `newPost.json` contains the information of latest post. It looks like this:
```json
{
"title":"静态博客优化",
"id":"7a4bc632",
"date_published":"2020-02-07T00:00:00.000Z",
"summary":"新的一年从优化博客开始。这一次从内容，性能这两方面对博客进行优化。",
"url":"https:\\www.inevitable.tech\\posts\\7a4bc632",
"tags":["博客优化","性能","Hexo"],
"categories":["开发"]
}
```

When you call `hexo deploy`, the plugin will compare the `newPost.json` from your online site and from your local. If the id value is different, the plugin will trigger the notification from [webPush](https://www.webpushr.com/).

## Future work
Maybe support more web push notification service.

Maybe open try to help integrate the web push notification service into different themes.

The roadmap need your feedbacks. Feel free to open the issue.
