// ==UserScript==
// @name      ndr plugin - wnp
// @namespace http://d.hatena.ne.jp/miya2000/
// @author    miya2000
// @include   http://www.nicovideo.jp/ndr/
// ==/UserScript==
setTimeout(function() {
    if (typeof NDR == 'undefined') return;
    if (typeof WNP == 'undefined') return;
    NDR.prototype.openURL = function(url) {
        WNP.open(url);
    }
    NDR.prototype.openURLs = function(urls) {
        var items = [],
            video = {},
            title = {},
            image = {};
        for (var i = 0; i < urls.length; i++) {
            var item = this.pinnedMap.get(urls[i]);
            var m = /[a-z]{0,2}[0-9]+(?=\?|$)/.exec(item.url);
            if (!m) continue;
            var video_id = m[0];
            items.push(video_id);
            video[video_id] = item.link;
            title[video_id] = item.title;
            image[video_id] = item.image;
        }
        var playlist ={ items: items, video: video, title: title, image: {} };
        var wnp = WNP.wnp();
        if (!wnp.wnpCore.isPlaying) {
            WNP.open(playlist);
        }
        else {
            WNP.add(playlist);
        }
    }
}, 0)
