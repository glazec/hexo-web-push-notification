/* global hexo */
/* eslint no-param-reassign:0, strict:0 */
'use strict';

const util = require('hexo-util');
const fs = require('hexo-fs');
const parser = require('parser-front-matter');
const path = require('path')
const fetch = require("node-fetch");
const url = require("url")

// triggered after hexo generate.
// this output the newPost.json into public/.
hexo.on('generateAfter', async function (post) {
    var posts = hexo.locals.get('posts').data
    var dateSortedPosts = posts.sort(function (a, b) { return b.date - a.date }).map(function (v) { return v })
    var newPost = dateSortedPosts[0]
    var JSONFeed = {
        'title': newPost.title,
        'id': newPost.path,
        'date_published': newPost.date.format('L'),
        'summary': newPost.excerpt,
        'url': newPost.permalink,
        'tags': newPost.tags.data.map(function (v) { return v.name }),
        'categories': newPost.categories.data.map(function (v) { return v.name })
    }
    fs.writeFile('public/newPost.json', JSON.stringify(JSONFeed), function (err, data) { hexo.log.info("Generated: newPost.json") })
})

//triggered after hexo deploy.
//it compare the newPost.json from your site and local to decide whether push the notification.
hexo.on("deployAfter", async function (post) {
    // Get newPost.json from your site.
    var newPostOnlineSite = await fetch(url.resolve(hexo.config.url, "newPost.json"));
    var newPostOnlineSite = await newPostOnlineSite.json();
    newPostOnlineSite = JSON.parse(JSON.stringify(newPostOnlineSite));
    // Get newPost.json from your local.
    var newPostLocal = await fs.readFileSync('public/newPost.json')
    // Get newPost.json from local
    newPostLocal = JSON.parse(newPostLocal);
    // console.table({
    //     "From online site": newPostOnlineSite,
    //     "From Local": newPostLocal
    // });
    //determine whether to push web notification
    if (newPostOnlineSite.id != newPostLocal.id) {
        // push new Post notification
        var payload = {
            title: newPostLocal.title,
            message: newPostLocal.summary,
            target_url: new URL(newPostLocal.url).pathname
        };
        console.log(payload)
        const response = await fetch(
            "https://app.webpushr.com/api/v1/notification/send/all",
            {
                method: "POST",
                headers: {
                    webpushrKey: hexo.config.webPushNotification.webpushrKey,
                    webpushrAuthToken: hexo.config.webPushNotification.webpushrAuthToken,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            }
        );
        const data = await response.json();
        if (!response.ok) {
            // NOT res.status >= 200 && res.status < 300
            hexo.log.error("Push Notification failed " + JSON.stringify(data));
        } else {
            hexo.log.info("Successfully push notification");
        }
    } else {
        hexo.log.info("No New Post detected.");
    }
})