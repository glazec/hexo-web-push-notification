/* global hexo */
/* eslint no-param-reassign:0, strict:0 */
'use strict';

const util = require('hexo-util');
const fs = require('hexo-fs');
const fetch = require("node-fetch");
const url = require("url")
var request = require('request');
var moment = require('moment');

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
        'summary': util.stripHTML(newPost.excerpt),
        'url': newPost.permalink,
        'tags': newPost.tags.data.map(function (v) { return v.name }),
        'categories': newPost.categories.data.map(function (v) { return v.name })
    }
    fs.writeFile('public/newPost.json', JSON.stringify(JSONFeed), function (err, data) { hexo.log.info("Generated: newPost.json") })
})

//triggered before hexo deploy.
//it compare the newPost.json from your site and local to decide whether push the notification.
// DeployAfter event has encode issue
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
            target_url: new URL(newPostLocal.url).pathname,
            // segment: [4205],
            send_at: moment().add(10, 'minutes').format()
            // sid: '4557611'
        };
        var headers = {
            webpushrKey: hexo.config.webPushNotification.webpushrKey,
            webpushrAuthToken: hexo.config.webPushNotification.webpushrAuthToken,
            "Content-Type": "application/json"
        };
        var options = {
            url: 'https://api.webpushr.com/v1/notification/send/all',
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload)
        };
        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                hexo.log.info("Successfully send notifications");
                hexo.log.info(body);
                
            }
            else {
                hexo.log.error("Fail to send notifications");
                hexo.log.error(body);
            }
        }
        hexo.log.info(JSON.stringify(payload))
        request(options, callback);

        // const response = await fetch(
        //     "https://app.webpushr.com/api/v1/notification/send/segment",
        //     {
        //         method: "POST",
        //         headers: {
        //             webpushrKey: hexo.config.webPushNotification.webpushrKey,
        //             webpushrAuthToken: hexo.config.webPushNotification.webpushrAuthToken,
        //             "Content-Type": "application/json"
        //         },
        //         body: JSON.stringify(payload)
        //     }
        // );
        // // const data = await response.json();
        // console.log(response.status)
        // if (!response.ok) {
        //     // NOT res.status >= 200 && res.status < 300
        //     hexo.log.error("Push Notification failed " + response.status.toString()+' '+response.statusText);
        // } else {
        //     hexo.log.info("Successfully push notification");
        // }
    } else {
        hexo.log.info("No New Post detected.");
    }
})

//insert webpushr tracking code
hexo.extend.filter.register('after_render:html', data => {
    var payload = `(function(w,d, s, id) {w.webpushr=w.webpushr||function(){(w.webpushr.q=w.webpushr.q||[]).push(arguments)};var js, fjs = d.getElementsByTagName(s)[0];js = d.createElement(s); js.id = id;js.src = 'https://cdn.webpushr.com/app.min.js';fjs.parentNode.appendChild(js);}(window,document, 'script', 'webpushr-jssdk'));webpushr('init','${hexo.config.webPushNotification.trackingCode}');`

    // return data.replace(/<body>(?!<\/body>).+?<\/body>/s, str => str.replace('</body>', "<script>"+decodeURI(payload)+"</script></body>"));
    return data.replace(/<body.+?>(?!<\/body>).+?<\/body>/s, str => str.replace('</body>', "<script>" + decodeURI(payload) + "</script></body>"));

});

//insert webpushr-sw.js to web root dir
hexo.on('generateAfter', async function (post) {
    fs.writeFile('public/webpushr-sw.js', "importScripts('https://cdn.webpushr.com/sw-server.min.js');", function (err, data) { hexo.log.info("Generated: webpushr-sw.js") })
})