// ==UserScript==
// @name      NDR
// @description niconico douga RSS reader.
// @namespace http://d.hatena.ne.jp/miya2000/
// @author    miya2000
// @version   preview2
// @include   http://www.nicovideo.jp/ndr/
// ==/UserScript==
(function() {

    // ==== preferences ==== //
    NDR.PREFERENCES = {
        MIX_COUNT : 30,
        LOAD_COUNT : 15,
        ENABLE_HATENASTAR : true,
        ENABLE_HATENABOOKMARK : false,
        ENABLE_STORAGE : true,
        FEED_LIST : []
    };

    // ==== shortcut keys ==== //
    NDR.SHOPRTCUT = [
        { command: 'NextEntry', key: 'j' },
        { command: 'NextEntry', key: 'Enter' },
        { command: 'PrevEntry', key: 'k' },
        { command: 'PrevEntry', key: 'Enter shift' },
        { command: 'OlderEntries', key: '>' },
        { command: 'OlderEntries', key: 'j shift' },
        { command: 'NewerEntries', key: '<' },
        { command: 'NewerEntries', key: 'k shift' },
        { command: 'NextFeed', key: 's' },
        { command: 'NextFeed', key: 'shift ctrl' },
        { command: 'NextFeed', key: 'Down shift' },
        { command: 'PrevFeed', key: 'a' },
        { command: 'PrevFeed', key: 'ctrl shift' },
        { command: 'PrevFeed', key: 'Up shift' },
        { command: 'ScrollDown', key: 'Space' },
        { command: 'ScrollDown', key: 'PageDown' },
        { command: 'ScrollUp',   key: 'Space shift' },
        { command: 'ScrollUp',   key: 'PageUp' },
        { command: 'View',    key: 'v' },
        { command: 'View',    key: 'Enter ctrl' },
        { command: 'Pin',     key: 'p' },
        { command: 'OpenPin', key: 'o' },
        { command: 'RefreshFeedList',   key: 'r' },
        { command: 'FocusSearch',       key: 'f' },
        { command: 'ToggleFeedPane',    key: 'z' },
        { command: 'ToggleCompactMode', key: 'c' }
    ];
    
    // ==== const ==== //
    var NDR_DEF_FAVICON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAANklEQVR42mNgoCL4TyLGAP%2F%2BEwlwGUCs%2Fn%2BUGvCfZgb8G3UByQYwDr5opNwALPgfGo03M5EFAD%2FlDgo8c6q7AAAAAElFTkSuQmCC';
    var NDR_IMG_LOADING = 'data:image/gif;base64,R0lGODlhFAAUAIIAAC8vL%2BTl5EdFR%2FT09Dk6OVNVU%2Bzr7Pz%2B%2FCH%2FC05FVFNDQVBFMi4wAwEAAAAh%2BQQADQAAACwAAAAAFAAUAAIDSHi6awLCsDlNkVZSGpsY20SIITN0igOW6XVkLONAa6wMBKHZygPwDACAULPhhB%2FgIVc0MpUK5I43pCmlSpxO6SBCCYCmbRhLAAAh%2BQQADQAAACwAAAAAFAAUAAIDVHi6awLCsDlNkVZSGpsY20SIITN0igOW6XVkLBM8aPw%2BxGofEQHosUHOJ9gphoDc7iRUGg%2BD5PPmA7KaM4KGZSB8qEHvVnglaEVWhtfKDAnTBykjAQAh%2BQQADQAAACwAAAAAFAAUAAIDVni6awLCsDlNkVZSGpsY20SIITN0igOW6XVkLBM8X7wQD7HaZ0AAh11MRyDMbMHPT6BDgn5CHmCEDJ6gTpyRqdkMikUDyEENfQZCQzMUvZWrwTX8%2B04AACH5BAANAAAALAAAAAAUABQAAgNOeLprAsKwOU2RVlIamxjbRIghM3SKA5bpdWQsEzxofJwAsdoKkO%2B8XI63IPg%2BxJsRyDMmU4QRcXBaxgYEQZQQkMYiIJCXBTwxm2fbkJIAACH5BAANAAAALAAAAAAUABQAAgNJeLprAsKwOU2RVlIamxjbRIghM3SKA5bpdWQs40BrrAwEodnKA%2FAMAIBQs52EH%2BBhMCwaCT%2Flkag8CGlKpJOFQ%2FEcuip0GxvGEgAh%2BQQADQAAACwAAAAAFAAUAAIDUHi6awLCsDlNkVZSGpsY20SIITN0igOW6XVkLBM8aHycALHaCuDzC5wOqAgQch8gTcMb5ALEG4EgiFKNu9hgOG12pdnQabXlTXc18VDhHE0SACH5BAANAAAALAAAAAAUABQAAgNXeLprAsKwOU2RVlIamxjbRIghM3SKA5bpdWQsEzxunD5EYC8RAa2x08AnmO0OA0BOQACWhhCkk0XIHRXJ6m4wJPSmJm%2B1cxqVIlzgULMBK7RX7CeOVE4SACH5BAANAAAALAAAAAAUABQAAgNNeLprAsKwOU2RVlIamxjbRIghM3SKA5bpdWQsEzxofJwAsdoK4PMMQg6oGAg%2FxENuBxQyeT4BcWB0xqoEgiAwsn2ooO7VpEsqasDqJgEAOw%3D%3D';
    var NDR_IMG_COMPLETE = 'data:image/gif;base64,R0lGODlhFAAUAIIAADAvMOPl40hHSPT19Dg5OFRWVOzs7Pz%2B%2FCH5BAANAAAALAAAAAAUABQAAgNNeLpqAmSwOU0xx2I6h9iZIHEMMZnk4oHOmGYXDL5HIBAfrT6Gqw8QHcMTFC4ASKOCGFFmCACREwlwHh5NZQDqdHCNXpuSQMCUjdkoKQEAIfkEACgAAAAsAAAAABQAFAACA0Z4umcCZLA5TTHtUjoEVo60McRUjkv3NYKIZpi1vizg0RM04wfEm4AfA%2BLiDQgRoYIAKPJ8ygMzOoAqmU7a8XQl7LQAGyoBACH5BAANAAAALAAAAAAUABQAAgNGeLpqAmSwOU0xx2I6h9iZIHEMMZnk4oHOmGYXDL4h8NGMYc%2F4w9MDCI5CAAxzRdfwcTsGCT%2Ba8LgoUhdTqgd6zey6AFsqAQAh%2BQQADQAAACwAAAAAFAAUAAIDSni6POcsSiOIMDIfU8zgmLYM10JB4kFEa%2FqUyuluggPODwFYoUsBF5RLB8MNdL0ZaYdjAHbC2bPVXAKaJgIVu0sqBUBsrCtWhTUJACH5BAANAAAALAAAAAAUABQAAgNLeLrc%2Fm0cCZ8RRJjaTDGDt3GTtlwURzQreRDjgZJGtom0AACYyV07zSAFAQJgLpmOFyMtCYHkZEcgupbSEwGQXRy7JWTXwARvBZUEACH5BAAKAAAALAAAAAAUABQAAgNKeLo85yxKI4gwMh9TzOCYtgzXQkHiQURr%2BpTK6W6CA84PAVihSwEXlEsHww10vRlph2MAdsLZs9VcApomAhW7SyoFQGysK1aFNQkAIfkEAAoAAAAsAAAAABQAFAACA0Z4umoCZLA5TTHHYjqH2JkgcQwxmeTigc6YZhcMviHw0Yxhz%2FjD0wMIjkIADHNF1%2FBxOwYJP5rwuChSF1OqB3rN7LoAWyoBACH5BAAUAAAALAAAAAAUABQAAgNGeLpnAmSwOU0x7VI6BFaOtDHEVI5L9zWCiGaYtb4s4NETNOMHxJuAHwPi4g0IEaGCACjyfMoDMzqAKplO2vF0Jey0ABsqAQAh%2BQQADQAAACwAAAAAFAAUAAIDS3i6ZwJksDlNMe1SOgRWjrQxxFSOS%2Fc1gohmmLW%2BLODREzTjBnHiig4EyABAXLgB4UhUPABIHrN58EWohICAWlVGaZEfUHVrQmyjBAAh%2BQQADQAAACwAAAAAFAAUAAIDT3i6ZwJksDlNMe1SOgRWjrQxxFSOS%2Fc1gohmmLW%2BLODREzTjBnHiig4EyADoiAehzcXz7WgDAoCJ8%2FmoqN4giiS0Dr8qhgtUKW5AW3K5SQAAIfkEAA0AAAAsAAAAABQAFAACA1J4umcCZLA5TTHtUjoEVo60McRUjkv3NYKIZpi1vizg0ROEtbhC2IYTbvADhHqHH%2BGGhAxcvR%2BS4Zw2CNgZbRkQCGmOGHMbORC%2FI9UiTCPm0IcEACH5BADIAAAALAAAAAAUABQAAgNXeLpqAmSwOU0xx2I6h9iZIHEMMZnk4oHOmGYXDL4hIASHS0NOSys8EepHsOGGtKJR9DsAeLFmMaJ7DSC2WcpBJXyI3wwByekxVq%2BxbjB%2B3ShmzpU5gSwSADs%3D';
    var NDR_HATENASTAR_TOKEN = '43176db8ca94b7e759246873fc3dad868c75fd6f';
    var NDR_STORAGE_SWF = 'http://miya2000.up.seesaa.net/storage/ndr.swf';
    
    // ==== resource ==== //
    var lang = {
        HAS_SUBSCRIBED : '\u65E2\u306B\u8CFC\u8AAD\u3057\u3066\u3044\u307E\u3059\u3002'
    };
    
    // ==== main ==== //
    var opera9_5Ab = (window.opera && parseFloat(opera.version()) >= 9.5);
    var NDR_HTML = [
        NDR.PREFERENCES.ENABLE_STORAGE ? '<embed id="NDR_STORAGE" type="application/x-shockwave-flash" src="' + NDR_STORAGE_SWF + '" width="1" height="1" allowScriptAccess="always">' : '',
        '<h1 class="ndr_title"><a href="http://www.nicovideo.jp/" target="_blank"><img src="/favicon.ico" width="16" height="16"></a><a href="' + location.href + '" onclick="javascript:void(location.reload())">niconico douga Reader</a></h1>',
        '<div class="ndr_status"><img id="NDR_STATUS_IMAGE" width="20" height="20" src="' + NDR_IMG_LOADING + '">&lt; <span id="NDR_STATUS_MESSAGE">Welcome.</span></div>',
        '<form id="NDR_NICO_SEARCH" class="ndr_search_form" action="/search" method="get" target="ndr_search_result">',
        '    <p>\u30AD\u30FC\u30EF\u30FC\u30C9\u691C\u7D22',
        '        <input id="NDR_C_NICO_SEARCH_TEXT" type="text" name="s" value="" class="search">',
        '        <input type="submit" value="\u691C\u7D22">',
        '    </p>',
        '</form>',
        '<div class="ndr_header">',
        '    <p class="ndr_feed_controls">',
        '        <button class="ndr_control" id="NDR_C_MYFEED">\u30DE\u30A4\u30D5\u30A3\u30FC\u30C9</button>',
        '        <button class="ndr_control" id="NDR_C_HISTORY">\u6700\u8FD1\u898B\u305F\u52D5\u753B</button>',
        '        <button class="ndr_control" id="NDR_C_MIX">MIX</button>',
        '    </p>',
        '    <p class="ndr_entries_controls">',
        '        <button class="ndr_control" id="NDR_C_PREV_ENTRY">\u25B2</button>',
        '        <button class="ndr_control" id="NDR_C_NEXT_ENTRY">\u25BC</button>',
        '        <label id="NDR_C_PINNED_LIST" for="NDR_PINNED_LIST"><span class="ndr_opera_icon ndr_pin"></span><span id="NDR_PINNED_COUNT">0</span></label>',
        '    </p>',
        '    <ul class="ndr_pinned_list" id="NDR_PINNED_LIST"></ul>',
        '    <p class="ndr_unread_info">\u672A\u8AAD <span id="NDR_UNREAD_FEED_COUNT">0</span>\u30D5\u30A3\u30FC\u30C9\u0020 | <span id="NDR_UNREAD_ENTRY_COUNT">0</span>\u30A8\u30F3\u30C8\u30EA</p>',
        '</div>',
        '<div class="ndr_content">',
        '    <div class="ndr_feed_pane" id="NDR_FEED_PANE">',
        '        <ul class="ndr_feed_menu" id="NDR_FEED_MENU">',
        '            <li class="ndr_feed_reload"><button class="ndr_control" id="NDR_C_FEED_RELOAD">\u66F4\u65B0</button></li>',
        NDR.PREFERENCES.ENABLE_STORAGE ? '            <li class="ndr_feed_edit"><button class="ndr_control" id="NDR_C_FEED_EDIT">\u7DE8\u96C6</button></li>' : '',
        NDR.PREFERENCES.ENABLE_STORAGE ? '            <li class="ndr_feed_add"><button class="ndr_control" id="NDR_C_FEED_ADD">\u8FFD\u52A0</button></li>' : '',
        '            <li class="ndr_feed_search"><input type="text" id="NDR_C_FEED_SEARCH" autocomplete="off"></li>',
        '        </ul>',
        '        <div class="ndr_feed_lists" id="NDR_FEED_LISTS">',
        '            <ul class="ndr_feed_list" id="NDR_FEED_LIST"></ul>',
        '            <ul class="ndr_feed_list ndr_temporary_feed_list" id="NDR_TEMPORARY_FEED_LIST"></ul>',
        '        </div>',
        '    </div>',
        '    <div class="ndr_entry_pane">',
        '        <div class="ndr_entries" id="NDR_ENTRIES"></div>',
        '    </div>',
        '</div>',
    ].join('\n');
    
    var NDR_STYLE = [
        'body { width: 99%; min-width: 580px; overflow: hidden; background-image: none; } ',
        'a, a:hover, a:active { color: inherit; text-decoration: underline; } ',
        'h1 a { text-decoration: none !important; } ',
        '.ndr_body { height: 100%; } ',
        'h1.ndr_title {',
        '    height: 32px; ',
        '    width: 250px; ',
        '    font: bold 20px cursive; ',
        '    overflow: hidden; ',
        '} ',
        'h1.ndr_title img {',
        '    vertical-align: middle; ',
        '    margin: 0 4px 0 2px;',
        '} ',
        '.ndr_status {',
        '    height: 32px; ',
        '    margin-top: -32px; ',
        '    margin-left: 255px; ',
        '    font-size: 15px; ',
        '    line-height: 32px; ',
        '    overflow: hidden; ',
        '} ',
        '.ndr_status img {',
        '    vertical-align: middle; ',
        '    margin: 0 4px 0 2px;',
        '} ',
        '.ndr_search_form {',
        '    height: 32px; ',
        '    margin-top: -32px; ',
        '    text-align: right; ',
        '    font-weight: bold; ',
        '    font-size: 12px; ',
        '    line-height: 32px; ',
        '    overflow: hidden; ',
        '} ',
        '.ndr_header {',
        '    background: #FFFFFF url(http://res.nicovideo.jp/img/index/bg_ch_kanren.gif) repeat-x scroll 0 0; ',
        '    border-color: #CCCCCC; ',
        '    border-style: solid; ',
        '    border-width: 1px 0; ',
        '    height: 25px; ',
        '    font-weight: normal; ',
        '    font-size: 12px; ',
        '    line-height: 25px; ',
        '    position: relative; ',
        '} ',
        '.ndr_feed_controls {',
        '    height: 100%; ',
        '    padding-left: 1em; ',
        '    text-align: left; ',
        '    overflow: hidden; ',
        '} ',
        'button.ndr_control {',
        '    border: 0; ',
        '    padding: 1px 3px; ',
        '    margin: 0 10px 0 0; ',
        '    text-align: center; ',
        '    background-color: transparent; ',
        '    cursor: pointer; ',
        '} ',
        '.ndr_entries_controls {',
        '    height: 100%; ',
        '    padding-right: 1em; ',
        '    margin-top: -25px; ',
        '    margin-left: 257px; ',
        '    overflow: hidden; ',
        '} ',
        '.ndr_entries_controls button {',
        '    margin: 0; ',
        '    padding: 0 7px; ',
        '} ',
        '.ndr_entries_controls label {',
        '    font-weight: bold; ',
        '} ',
        '.ndr_entries_controls label * {',
        '    vertical-align: middle; ',
        '    margin-left: 5px; ',
        '} ',
        '.ndr_pinned_list {',
        '    display: none; ',
        '    position: absolute; ',
        '    top: 25px; ',
        '    left: 255px; ',
        '    z-index: 100; ',
        '    background-color: #FDFEF9; ',
        '    width: 400px; ',
        '    border: #9FA9B2 solid; ',
        '    border-width: 1px 2px 2px 1px; ',
        '    margin: 0; ',
        '    padding: 0; ',
        '    list-style-type: none; ',
        '} ',
        '.ndr_pinned_list > li {',
        '    font-size: larger; ',
        '    line-height: 1.3; ',
        '    padding: 2px 1px; ',
        '    border-bottom: #9FA9B2 dotted 1px; ',
        '} ',
        '.ndr_pinned_list > li:hover {',
        '    background-color: #B6BDD2; ',
        '} ',
        '.ndr_pinned_list > li > a {',
        '    display: block; ',
        '    text-decoration: none; ',
        '} ',
        '.ndr_pinned_list > li.clear {',
        '    background-color: #EEEEEE; ',
        '    border-bottom: none; ',
        '} ',
        '.ndr_unread_info {',
        '    height: 100%; ',
        '    padding-right: 1em; ',
        '    margin-top: -25px; ',
        '    text-align: right; ',
        '    overflow: hidden; ',
        '} ',
        '.ndr_content {',
        '    box-sizing: border-box; ',
        '    height: 100%; ',
        '    margin-top: -60px; ',
        '    padding: 61px 0 0; ',
        '    overflow: hidden; ',
        '} ',
        '.ndr_feed_pane {',
        '    float: left; ',
        '    width: 250px; ',
        '    height: 100%; ',
        '    box-sizing: border-box; ',
        '    padding-top: 61px; ',
        '    position: relative; ',
        '    z-index: 10; ',
        '    overflow: hidden; ',
        '} ',
        'ul.ndr_feed_menu {',
        '    background: #FFFFFF url(http://res.nicovideo.jp/img/index/top/guide_bg.gif) repeat-x scroll 0 -20px; ',
        '    border-bottom: #CCCCCC solid 1px; ',
        '    list-style-type: none; ',
        '    margin: 0; ',
        '    padding: 2px 10px; ',
        '    position: absolute; ',
        '    z-index: 11; ',
        '    top: 0; ',
        '    width: 100%; ',
        '    box-sizing: border-box; ',
        '} ',
        '.ndr_feed_lists {',
        '    position: relative; ',
        '    z-index: 10; ',
        '    width: 100%; ',
        '    height: 100%; ',
        '    overflow: auto; ',
        '} ',
        '.ndr_feed_reload, .ndr_feed_edit, .ndr_feed_add {',
        '    width: 5em; ',
        '    height: 30px; ',
        '    font-weight: normal; ',
        '    font-size: 15px; ',
        '    line-height: 28px; ',
        '    float: left; ',
        '} ',
        // http://orera.g.hatena.ne.jp/higeorange/20061210/1165754993
        '.ndr_feed_reload:before {',
        '    content: ""; ',
        '    background-image: -o-skin("Reload"); ',
        '    width: 16px; ',
        '    height: 16px; ',
        '    margin: 8px 0 0 2px; ',
        '    display: inline-block;',
        '    position: absolute;',
        '} ',
        '.ndr_feed_edit:before {',
        '    content: ""; ',
        '    background-image: -o-skin("Widget"); ',
        '    width: 16px; ',
        '    height: 16px; ',
        '    margin: 8px 0 0 2px; ',
        '    display: inline-block;',
        '    position: absolute;',
        '} ',
        '.ndr_feed_add:before {',
        '    content: ""; ',
        '    background-image: -o-skin("RSS"); ',
        '    width: 16px; ',
        '    height: 16px; ',
        '    margin: 8px 0 0 2px; ',
        '    display: inline-block;',
        '    position: absolute;',
        '} ',
        '.ndr_feed_search {',
        '    width: auto; ',
        '    height: 25px; ',
        '    font-size: 15px; ',
        '    line-height: 30px; ',
        '    clear: both; ',
        '} ',
        '.ndr_feed_search:before {',
        '    content: ""; ',
        '    background-image: -o-skin("Search"); ',
        '    width: 16px; ',
        '    height: 16px; ',
        '    margin: 3px 0 0 3px; ',
        '    display: inline-block;',
        '    position: absolute;',
        '} ',
        '.ndr_feed_search > input[type="text"] {',
        '    width: 100%; ',
        '    box-sizing: border-box; ',
        '    height: 18px; ',
        '    padding-left: 25px; ',
        '    border: #888888 solid 1px; ',
        '    background-color: white; ',
        '} ',
        '.ndr_feed_menu > li > button {',
        '    width: 100%; ',
        '    height: 100%; ',
        '    padding: 3px 5px; ',
        '} ',
        '.ndr_feed_list {',
        '    list-style-type: none; ',
        '    margin: 0; ',
        '    padding: 0; ',
        '    color: #939393; ',
        '    font-size: 13px; ',
        '    line-height: 1.4; ',
        '} ',
        '.ndr_feed_list > li {',
        '    padding: 3px 5px 3px 23px; ',
        '    cursor: pointer; ',
        '} ',
        '.ndr_feed_list > li:hover, .ndr_temporary_feed_list > li:hover {',
        '    background-color: #E8E8E8; ',
        '} ',
        'li.ndr_unread_feed {',
        '    color: black; ',
        '} ',
        '.ndr_feed_item {',
        '    background: url("' + NDR_DEF_FAVICON + '") no-repeat 2px 5px; ',
        '} ',
        '.ndr_feed_origin_nico, .ndr_temporary_feed_list > li { ',
        '    background-image: url("/favicon.ico") !important; ',
        '} ',
        '.ndr_temporary_feed_list {',
        '    border-top: #CCCCCC solid 1px; ',
        '    margin-top: 5px; ',
        '    padding-top: 5px; ',
        '} ',
        '.ndr_temporary_feed_list button {',
        '    margin: 0 5px; ',
        '    padding: 0 5px; ',
        '} ',
        '.ndr_entry_pane {',
        '    float: left; ',
        '    margin-left: -250px; ',
        '    width: 100%; ',
        '    height: 100%; ',
        '    overflow: hidden; ',
        '} ',
        '.ndr_entry_pane > .ndr_entries {',
        '    margin-left: 253px; ',
        '    background-color: #FDFDFD; ',
        '    height: 100%; ',
        '    overflow: auto; ',
        '    position: relative; ',
        opera9_5Ab ? 'overflow-y: scroll; ' : '',
        '} ',
        '.ndr_entries h2.ndr_title {',
        '    font-weight: normal; ',
        '    font-size: 21px; ',
        '    line-height: 1.3; ',
        '    background-color: #F0FAFF; ',
        '    padding: 10px 10px 0; ',
        '} ',
        '.ndr_entries h2 a {',
        '    text-decoration: none; ',
        '} ',
        '.ndr_entries h3.ndr_subtitle {',
        '    font-weight: normal; ',
        '    font-size: 15px; ',
        '    line-height: 1.2; ',
        '    background-color: #F0FAFF; ',
        '    padding: 3px 10px 5px; ',
        '} ',
        '.ndr_entry_menu {',
        '    position: relative; ',
        '    height: 20px; ',
        '    font-size: 13px; ',
        '    line-height: 20px; ',
        '    background-color: #F0FAFF; ',
        '    margin: 2px 0 0; ',
        '    padding: 3px 10px; ',
        '    border-bottom: #CCCCCC solid 2px; ',
        '    list-style-type: none; ',
        '} ',
        '.ndr_entry_menu li {',
        '    float: left; ',
        '    width: 10em; ',
        '} ',
        '.ndr_page_button {',
        '    position: absolute; ',
        '    right: 25px; ',
        '    margin-top: -25px; ',
        '    width: 200px; ',
        '    height: 20px; ',
        '    text-align: right; ',
        '} ',
        'button.ndr_reload_button {',
        '    position: static; ',
        '    height: 20px; ',
        '    font-size: 12px; ',
        '    line-height: 18px; ',
        '    padding: 1px 3px 0; ',
        '    margin: 0 5px; ',
        '} ',
        'button.ndr_page_button {',
        '    position: static; ',
        '    color: #89A8EF; ',
        '    width: 30px; ',
        '    height: 20px; ',
        '    font-weight: bold; ',
        '    font-size: 15px; ',
        '    line-height: 18px; ',
        '    text-align: center; ',
        '    background-color: #C7FEFF; ',
        '    border: #A5C5FF solid 1px; ',
        '    padding: 1px 0 0 3px; ',
        '    margin: 0 0 0 5px; ',
        '} ',
        'button.ndr_page_button[disabled] {',
        '    color: #808080; ',
        '    background-color: #CCC; ',
        '    border: #808080 solid 1px; ',
        '} ',
        '.ndr_entry {',
        '    border-bottom: #CCCCCC solid 2px; ',
        '    font-size: 90%; ',
        '    line-height: 1.5; ',
        '    padding: 3px 10px 5px; ',
        '} ',
        '.ndr_entry_even {',
        '    background-color: #F5F5F5; ', opera9_5Ab ? 'background-color: transparent; ' : '',
        '} ',
        opera9_5Ab ? '.ndr_entry:nth-child(even) { background-color: #F5F5F5; } ' : '',
        '.ndr_mylist_pane {',
        '    box-sizing: border-box;',
        '    background-color: white;',
        '    border: #488BFF solid 4px; ',
        '    width: 90%; ',
        '    margin: 0 auto 20px; ',
        '    padding: 10px; ',
        '    color: #000; ',
        '    display: none; ',
        '} ',
        '.ndr_mylist_pane select {',
        '    width: 130px; ',
        '} ',
        '.ndr_mylist_pane input[type="submit"] {',
        '    margin: 0 5px; ',
        '} ',
        '.ndr_mylist_pane span {',
        '    font-size: small; ',
        '} ',
        '.ndr_entry_clip .ndr_mylist_pane {',
        '    display: block; ',
        '} ',
        '.ndr_entry_clip button.ndr_clip {',
        '    background-color: #E8E8E8 !important; ',
        '    border: inset gray 1px !important; ',
        '} ',
        '.ndr_entry_pin {',
        '    background-color: #FFF0F0 !important; ',
        '} ',
        '.ndr_entry_pin button.ndr_pin {',
        '    background-color: #E8E8E8 !important; ',
        '    border: inset gray 1px !important; ',
        '} ',
        '.ndr_entry h4 {',
        '    margin: 0.7em 0; ',
        '    padding-right: 80px; ',
        '} ',
        '.ndr_entry h4 a {',
        '    color: #000; ',
        '    text-decoration: none; ',
        '} ',
        '.ndr_entry h4 a:visited {',
        '    color: #595959; ',
        '} ',
        'p.ndr_entry_thumbnail {',
        '    width: 100%; ',
        '    overflow: auto; ',
        '} ',
        'img.ndr_entry_thumbnail {',
        '    border: #333333 solid 1px; ',
        '    float: left; ',
        '    margin: 0 10px 10px 0; ',
        '} ',
        '.ndr_entry_footer {',
        '    color: #747474; ',
        '    height: 20px; ',
        '    font-size: 12px; ',
        '    line-height: 20px; ',
        '    margin-top: 8px; ',
        '    padding: 3px 0; ',
        '    border-top: #CCCCCC dotted 1px; ',
        '} ',
        '.ndr_thumb_res {',
        '    background-color: #FFF; ',
        '    border:2px solid #CCCCCC; ',
        '    margin-top: 4px;; ',
        '    padding: 6px; ',
        '} ',
        'a.ndr_visited_checker {',
        '    position: absolute; ',
        '    top: 0; ',
        '    left: 0; ',
        '    z-index: -1000; ',
        '    visibility: hidden; ',
        '    display: block !important; ',
        '    width: 10px !important; ',
        '    height: 10px !important; ',
        '} ',
        'a.ndr_visited_checker:visited {',
        '    display: none !important; ',
        '} ',
        '.ndr_entry_controls {',
        '    position: absolute; ', opera9_5Ab ? 'position: static; float: right; ' : '', // Booooooooo!!!
        '    right: 30px; ',
        '    width: 100px; ',
        '    text-align: right; ',
        '    margin-top: 5px; ',
        '} ',
        '.ndr_entry_controls > button {',
        '    background-color: transparent;',
        '    border: transparent solid 1px;',
        '    padding: 4px 3px 5px;',
        '} ',
        '.ndr_entry_controls > button:active {',
        '    background-color: #E8E8E8;',
        '    border: inset gray 1px;',
        '} ',
        '.ndr_opera_icon {',
        '    display: inline-block;',
        '    width: -o-skin; ',
        '    height: -o-skin; ',
        '} ',
        '.ndr_clip .ndr_opera_icon {',
        '    background-image: -o-skin("Mail Attachment"); ',
        '} ',
        '.ndr_pin .ndr_opera_icon, .ndr_opera_icon.ndr_pin {',
        '    background-image: -o-skin("News Read"); ',
        '} ',
        '.ndr_mark_as_read .ndr_opera_icon {',
        '    background-image: -o-skin("Mark as read"); ',
        '} ',
        '#NDR_STORAGE {',
        '    position: absolute; ',
        '    top: 0; right: 0; ',
        '    width: 0px; height: 0px; ',
        '} ',
        '.ndr_feed_edit_controls {',
        '    margin-top: 5px; ',
        '} ',
        'ul.ndr_feed_edit_list {',
        '    list-style-type: none; ',
        '    margin: 10px 0; ',
        '    padding: 0; ',
        '} ',
        'ul.ndr_feed_edit_list li {',
        '    font-size: 12px; ',
        '    line-height: 1; ',
        '} ',
        '.ndr_feededit_pane {',
        '    border: black solid 1px; ',
        '    background-color: #FFFFFC; ',
        '    margin-top: 15px; ',
        '    padding: 5px; ',
        '} ',
        '.ndr_feededit_pane tr > td:first-child {',
        '    padding-right: 1em; ',
        '    white-space: nowrap;',
        '} ',
        '.ndr_feededit_pane .ndr_feed_del_checker {',
        '    margin-top: -12px; ',
        '    margin-left: 5px; ',
        '    width: 80px; ',
        '    background-color: white; ',
        '    text-align: center; ',
        '    border-left: black double 3px; ',
        '    border-right: black double 3px; ',
        '} ',
        '.ndr_feed_del_check, .ndr_feed_title_check {',
        '    margin-right: 3px; ',
        '} ',
        '.ndr_feed_title {',
        '    background: url("' + NDR_DEF_FAVICON + '") no-repeat 1px 0 ; ',
        '    background-color: white; ',
        '    padding-left: 22px; ',
        '    border: #555 solid 1px; ',
        '} ',
        '.ndr_subscribe {',
        '    text-decoration: underline; ',
        '    cursor: pointer; ',
        '} ',
        '.ndr_emphasis_phrase_00 { background-color: #FFFF66; } ',
        '.ndr_emphasis_phrase_01 { background-color: #A0FFFF; } ',
        '.ndr_emphasis_phrase_02 { background-color: #99FF99; } ',
        '.ndr_emphasis_phrase_03 { background-color: #FF9999; } ',
        '.ndr_emphasis_phrase_04 { background-color: #FF66FF; } ',
        '.ndr_feed_input_pane {',
        '    color: white; ',
        '    background-color: #202020; ',
        '    width: 400px; ',
        '    padding: 13px 15px;',
        '    font-size: 12px; ',
        '    box-sizing: border-box; ',
        '} ',
        '.ndr_feed_input_pane form {',
        '    margin: 0; ',
        '    padding: 0; ',
        '} ',
        '.ndr_feed_input_pane .ndr_feed_url {',
        '    width: 364px; ',
        '    margin: auto; ',
        '} ',
        '.ndr_feed_input_pane p {',
        '    line-height: 2.2; ',
        '    border-width: 0; ',
        '} ',
        '.ndr_feed_input_import {',
        '    float: left; ',
        '} ',
        '.ndr_feed_input_submit {',
        '    float: right; ',
        '} ',
        '.ndr_feed_input_submit input {',
        '    margin-left: .2em; ',
        '} ',
        '.ndr_feed_input_pane .ndr_message {',
        '    color: red; ',
        '    font-size: smaller; ',
        '    margin-top: -3px; ',
        '    line-height: 1; ',
        '    height: 1.5em; ',
        '} ',
        '.ndr_feed_input_pane.ndr_feed_editor {',
        '    width: 600px; ',
        '} ',
    ].join('\n');

    var NDR_EMPHASIS_CLASSES = [
        'ndr_emphasis_phrase_00',
        'ndr_emphasis_phrase_01',
        'ndr_emphasis_phrase_02',
        'ndr_emphasis_phrase_03',
        'ndr_emphasis_phrase_04'
    ];
    
    var NDR_STYLE_HIDE_FEED_PANE = [
        '.ndr_feed_pane {',
        '    display: none; ',
        '} ',
        '.ndr_entry_pane {',
        '    margin-left: 0; ',
        '} ',
        '.ndr_entry_pane > .ndr_entries {',
        '    margin-left: 0; ',
        '} ',
    ].join('\n');
    var NDR_STYLE_COMPACT_MODE = [
        '.ndr_entry > * {',
        '    display: none; ',
        '} ',
        '.ndr_entry > h4, .ndr_entry > .ndr_entry_controls {',
        '    display: block; ',
        '} ',
    ].join('\n');
    
    function addStyle(styleStr, doc) {
        var document = doc || window.document;
        var style = document.createElement('style');
        style.type = 'text/css';
        style.style.display = 'none';
        style.innerHTML = styleStr;
        document.body.appendChild(style);
        return style;
    }
    function hasClass(el, className) {
        return new RegExp('\\b' + className + '\\b').test(el.className);
    }
    function appendClass(el, className) {
        if (!el) return;
        if (new RegExp('\\b' + className + '$').test(el.className)) return;
        removeClass(el, className);
        el.className += ' ' + className;
        return el;
    }
    function removeClass(el, className) {
        if (!el) return;
        var orgClassName = el.className;
        var newClassName = orgClassName.replace(new RegExp('\\b' + className + '\\b', 'g'), '');
        if (orgClassName != newClassName) {
            el.className = newClassName;
        }
        return el;
    }

    var stripTag = (function() {
        var dv = document.createElement('div');
        return function (str) {
            if (!str) return '';
            dv.innerHTML = str;
            return dv.textContent;
        };
    })();
    
    function escAttr(str) {
        return str.replace(/'/g, '&#39;').replace(/"/g, '&quot;');
    }

    function parseDate(s) {
        if (!s) return new Date(0);
        if (s.indexOf('T') > 0) return new Date(s.replace(/T/, ' ').replace(/\+09:00/, ''));
        return new Date(s);
    }
    function formatDate(d) {
        return d.getFullYear() + ('/' + (d.getMonth()+1) + '/' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()).replace(/(\D)(\d)(?!\d)/g, '$10$2');
    }
    function formatNumber(d) {
        // http://nanto.asablo.jp/blog/2007/12/07/2479257
        return d.toString().replace(/(\d{1,3})(?=(?:\d\d\d)+$)/g, "$1,");
    }
    function formatLength(l) {
        return l.replace(/:(\d)(?!\d)/g, ":0$1");
    }
    
    function randomPickout(array, num) {
        var a = array.concat();
        var l = a.length;
        var n = num < l ? num : l;
        var r = new Array(n);
        for (var i = 0; i < n; i++) {
            var c = Math.random() * l | 0;
            r[i] = a[c];
            a[c] = a[--l];
        }
        return r;
    }
    
    var unique = (function() {
        function uniqueFilter(val, index, arr) {
            return arr.indexOf(val) == index;
        }
        return function(array) {
            return array.filter(uniqueFilter);
        };
    })();
    
    function toJSON(o) {
        if (o == void(0)) {
            return 'null';
        }
        var c = o.constructor;
        if (c == Boolean) {
            return o.toString();
        }
        if (c == Number) {
            return isNaN(o) ? '"NaN"' : !isFinite(o) ? '"Infinity"' : o.toString(10);
        }
        if (c == String) {
            return '"' + uescape(o) + '"';
        }
        if (c == Array) {
            var tmp = [];
            for (var i=0; i<o.length; i++) {
                tmp[i] = toJSON(o[i]);
            }
            return '[' + tmp.join(',') + ']';
        }
        if (o.toString() == '[object Object]') {
            var tmp = [];
            for (var i in o) {
                if (o.hasOwnProperty(i)) {
                    tmp.push('"' + uescape(i) + '":' + toJSON(o[i]));
                }
            }
            return '{' + tmp.join(',') + '}';
        }
        return '\"' + uescape(o.toString()) + '\"';
    }
    function uescape(s) {
        return escape(s).replace(/%([0-9A-F]{2})/g,'\\u00$1').replace(/%u/g,'\\u');
    }
    function clone(obj) {
        return eval('(' + toJSON(obj) + ')');
    }
    
    function evaluate(xpath, context) {
        var eles = document.evaluate(xpath, context || document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        var arr = [];
        for (var i = 0, len = eles.snapshotLength; i < len; i++) {
            arr.push(eles.snapshotItem(i));
        }
        return arr;
    }
    // http(s) only.
    function getAbsoluteURL(url, baseURL) {
        if (!url && !baseURL) return location.href;
        var base = baseURL || location.href;
        var href;
        if (!url) {
            href = base;
        }
        else if (/https?:\/\/.*/.test(url)) {
            href = url;
        }
        else if (url[0] == '?') {
            href = base.replace(/\?.*/, '') + url;
        }
        else if (url[0] == '#') {
            href = base.replace(/#.*/, '') + url;
        }
        else if (url[0] == '/') {
            href = /https?:\/\/.*?(?=(\/|$))/.exec(base)[0] + url;
        }
        else if (base[base.length-1] != '/'){
            href = base.replace(/[^/]*$/, '') + url;
        }
        else {
            href = base + url;
        }
        // normalize.
        var a = document.createElement('a');
        a.href = href;
        return a.href;
    }

    function createPlayInfo(el) {
        var an = el.getElementsByTagName('a');
        if (an.length == 0 && /a/i.test(el.nodeName)) {
            an = [el];
        }
        var items = [],
            video = {},
            title = {},
            image = {};
        for (var i = 0; i < an.length; i++) {
            var a = an[i];
            if (/\bnofollow\b/.test(a.getAttribute('rel'))) continue;
            var href = a.href;
            if (/^\/?watch\/(.*)/.exec(href)) href = 'http://www.nicovideo.jp/watch/' + RegExp.$1;
            if (/http:\/\/www\.nicovideo\.jp\/watch\/(\w*)$/.test(href)) {
                var videoid = RegExp.$1;
                if (!video[videoid]) {
                    items.push(videoid);
                    video[videoid] = href;
                }
                var img = a.getElementsByTagName('img')[0];
                if (img) {
                    title[videoid] = title[videoid] || img.alt;
                    image[videoid] = image[videoid] || img.src;
                }
                if (!title[videoid]) {
                    title[videoid] = a.textContent || a.innerText;
                }
            }
        }
        return {items: items, video: video, title: title, image: image }
    }

    /**
     * class KeyBind.
     */
    function KeyBind(target) {
        this.target = target || window;
        this.binds = [];
    };
    KeyBind.KEY_MAP = {
        'backspace' : 8,
        'tab'       : 9,
        'enter'     : 13,
        'shift'     : 16,
        'ctrl'      : 17,
        'alt'       : 18,
        'pause'     : 19,
        'esc'       : 27,
        'space'     : 32,
        'pageup'    : 33,
        'pagedown'  : 34,
        'end'       : 35,
        'home'      : 36,
        'left'      : 37,
        'up'        : 38,
        'right'     : 39,
        'down'      : 40,
        'ins'       : 45,
        'del'       : 46
        // not support Function keys.
    };
    KeyBind.WHITCH_MAP = {
        'pageup'    : 0,
        'pagedown'  : 0,
        'left'      : 0,
        'up'        : 0,
        'right'     : 0,
        'down'      : 0
    };
    KeyBind.prototype.start = function() {
        var self = this;
        this.target.addEventListener('keypress', this._listener = function(e) {
            if (self.target != e.target && /^(?:input|textarea|select|button)$/i.test(e.target.nodeName)) return;
            self.binds.forEach(function(shortcut) {
                if (self.checkShortcut(shortcut, e)) {
                    e.preventDefault();
                    shortcut.fn(e);
                }
            });
        }, false);
    };
    KeyBind.prototype.stop = function() {
        this.target.removeEventListener('keypress', this._listener, false);
        delete this._listener;
    };
    KeyBind.prototype.clear = function() {
        this.binds = [];
    };
    KeyBind.prototype.dispose = function() {
        this.stop();
        delete this.binds;
        delete this.target;
    };
    KeyBind.prototype.add = function(ch, fn) {
        var shortcut = this.parseShortcut(ch);
        shortcut.fn = fn;
        this.binds.push(shortcut);
    };
    KeyBind.prototype.parseShortcut = function(str) {
        var shortcut = {};
        var cmds = str.toLowerCase().split(/\s+/);
        if (cmds.indexOf('shift') >= 0) shortcut.shift = true;
        if (cmds.indexOf('alt') >= 0) shortcut.alt = true;
        if (cmds.indexOf('ctrl') >= 0) shortcut.ctrl = true;
        shortcut.ch = cmds[0];
        return shortcut;
    };
    KeyBind.prototype.checkShortcut = function(shortcut, e) {
        if (shortcut.ch == '*') return true;
        if (/^(?:[0-9A-Za-z]|enter|space)$/.test(shortcut.ch)) {
            if (!!shortcut.shift != e.shiftKey) return false;
        }
        else {
            if (shortcut.shift && !e.shiftKey) return false;
        }
        if (!!shortcut.alt   != e.altKey ) return false;
        if (!!shortcut.ctrl  != e.ctrlKey) return false;
        if (KeyBind.KEY_MAP[shortcut.ch] != null) {
            var keyCode = KeyBind.KEY_MAP[shortcut.ch];
            var which   = KeyBind.WHITCH_MAP[shortcut.ch];
            if (which == null) which = keyCode;
            return e.keyCode == keyCode && e.which == which;
        }
        else {
            return shortcut.ch == String.fromCharCode(e.which).toLowerCase();
        }
    };
    
    /**
     * class ListedKeyMap.
     * Map implementation that has listed keys.
     */
    function ListedKeyMap() {
        this.keys = [];
        this.values = {};
    }
    ListedKeyMap.prototype = {
        has : function(key) {
            return this.values.hasOwnProperty(key);
        },
        get : function(key) {
            return this.values[key];
        },
        getAt : function(index) {
            return this.values[this.keys[index]];
        },
        add : function(key, value) {
            if (this.has(key)) this.remove(key);
            this.values[key] = value;
            this.keys.push(key);
        },
        insertAt : function(index, key, value) {
            if (this.has(key)) return;
            this.values[key] = value;
            this.keys.splice(index, 0, key);
        },
        remove : function(key) {
            if (this.has(key)) {
                this.keys.splice(this.keys.indexOf(key), 1);
                delete this.values[key];
            }
        },
        removeAt : function(index) {
            var key = keys[index];
            keys.splice(index, 1);
            delete this.values[key];
        },
        indexOf : function(key) {
            return this.keys.indexOf(key);
        },
        keys : function() {
            return this.keys.concat();
        },
        size : function() {
            return this.keys.length;
        }
    }
    
    /**
     * class ListElementIterator (from wnp)
     */
    function ListElementIterator(listElement, targetClass) {
        this.listElement = listElement;
        this.classTest = (targetClass) ? new RegExp('\\b' + targetClass + '\\b')
                                       : { test: function() { return true } };
        this.item = null;
    }
    ListElementIterator.prototype = {
        count : function() {
            var n = 0, childs = this.listElement.childNodes;
            for (var i = 0, len = childs.length; i < len; i++) {
                if (childs[i].nodeType == 1) n++;
            }
            return n;
        },
        indexOf : function(item) {
            var n = 0, childs = this.listElement.childNodes;
            var classTest = this.classTest;
            for (var i = 0, len = childs.length; i < len; i++) {
                var c = childs[i];
                if (c.nodeType == 1 && classTest.test(c.className)) {
                    if (c == item) return n;
                    n++;
                }
            }
            return -1;
        },
        current : function(item) {
            if (item && item.parentNode != this.listElement) throw 'illegal argument.';
            if (arguments.length > 0) this.item = item;
            return this;
        },
        first : function() {
            var c = this.listElement.firstChild;
            var classTest = this.classTest;
            while (c && (c.nodeType != 1 || !classTest.test(c.className))) { c = c.nextSibling };
            return this.current(c);
        },
        last : function() {
            var c = this.listElement.lastChild;
            var classTest = this.classTest;
            while (c && (c.nodeType != 1 || !classTest.test(c.className))) { c = c.previousSibling };
            return this.current(c);
        },
        index : function(index) {
            var n = 0, c = this.listElement.firstChild;
            var classTest = this.classTest;
            while (c) {
                if (c.nodeType == 1 && classTest.test(c.className)) {
                    if (n == index) break;
                    n++;
                }
                c = c.nextSibling;
            }
            return this.current(c);
        },
        next : function(item) {
            var c = item || this.item;
            var classTest = this.classTest;
            if (c) do { c = c.nextSibling } while (c && (c.nodeType != 1 || !classTest.test(c.className)));
            return this.current(c);
        },
        previous : function(item) {
            var c = item || this.item;
            var classTest = this.classTest;
            if (c) do { c = c.previousSibling } while (c && (c.nodeType != 1 || !classTest.test(c.className)));
            return this.current(c);
        },
        isNullThenFirst : function() {
            if (this.item == null) this.first();
            return this;
        },
        isNullThenLast : function() {
            if (this.item == null) this.last();
            return this;
        }
    };

    /**
     * class Soar (from wnp)
     */
    var Soar = function(object, option) {
        this.object = object;
        var o = option || {};
        this.duration = o.duration || 150;
        this.delay = o.delay || 10;
        this.coe = (o.coe != null) ? o.coe : 0.10;
    }
    Soar.prototype.from = function(attr) {
        this._from = attr;
        return this;
    };
    Soar.prototype.to = function(attr) {
        this._to = attr;
        return this;
    }
    Soar.prototype.go = function (win) {
        this.cancel();
        var obj = this.object;
        this.window = win || window;
        for (var p in this._from) {
            obj[p] = this._from[p];
        }
        var target = [];
        for (var p in this._to) {
            var start = Number(obj[p].toString().replace(/([0-9]*).*/,'$1'));
            var dest  = Number(this._to[p].toString().replace(/([0-9]*)(.*)/,'$1'));
            var unit = RegExp.$2;
            target.push({ prop: p, cur: start, dest: dest, unit: unit });
        }
        var n = Math.ceil(this.duration / this.delay);
        var self = this;
        var start = new Date().getTime();
        self.tid = this.window.setTimeout( function() {
            var now = new Date().getTime();
            var nn = (self.duration - (now - start)) / self.delay;
            while (n > nn && n > 0) {
                for (var i = 0, len = target.length; i < len; i++) {
                    var t = target[i];
                    t.cur = t.cur + (t.dest - t.cur) * ( 1/n + (1-1/n) * self.coe);
                }
                n--;
            }
            var finishCount = 0;
            for (var i = 0, len  = target.length; i < len; i++) {
                var t = target[i];
                var next = Math.round(t.cur);
                obj[t.prop] = next + t.unit;
                if (next == t.dest) finishCount++;
            }
            if (finishCount != target.length && n > 0) {
                self.tid = self.window.setTimeout(arguments.callee, self.delay);
            }
            else {
                self.isActive = false;
                if (self.onFinish) self.onFinish(self);
            }
        }, 0);
        this.isActive = true;
    }
    Soar.prototype.cancel = function() {
        if (this.isActive) {
            this.window.clearTimeout(this.tid);
            this.isActive = false;
        }
    }
    
    /**
     * class TimerManager.
     */
    function TimerManager(win) {
        this.win = win || window;
        this.timeouts = {};
        this.intervals = {};
    }
    TimerManager.prototype.setTimeout = function(name, func, delay) {
        this.clearTimeout(name);
        var self = this;
        this.timeouts[name] = this.win.setTimeout(function() {
            delete self.timeouts[name];
            func();
        }, delay);
    };
    TimerManager.prototype.clearTimeout = function(name) {
        if (this.timeouts[name]) {
            this.win.clearTimeout(this.timeouts[name]);
            delete this.timeouts[name];
        }
    };
    TimerManager.prototype.setInterval = function(name, func, delay) {
        this.clearInterval(name);
        this.intervals[name] = this.win.setInterval(func, delay);
    };
    TimerManager.prototype.clearInterval = function(name) {
        if (this.intervals[name]) {
            this.win.clearInterval(this.intervals[name]);
            delete this.intervals[name];
        }
    };

    /**
     * class RequestPool.
     *   limit number of Ajax request.
     */
    function RequestPool(poolCount) {
        this.poolCount = poolCount;
        this.requestQueue = [];
        this.working = 0;
        this.timeout = 5000;
    }
    RequestPool.prototype = {
        getRequest : function(usecache) {
            var xhr = new XMLHttpRequest();
            var self = this;
            xhr.send = function(content) {
                if (!usecache) xhr.setRequestHeader('Connection', 'keep-alive');
                self.requestQueue.push( { xhr: xhr, content : content } );
                self.next();
            };
            return xhr;
        },
        next : function() {
            if (this.requestQueue.length == 0) {
                this.isActive = false;
                return;
            }
            while(this.requestQueue.length > 0 && this.working < this.poolCount) {
                this.working++;
                this.request(this.requestQueue.shift());
            }
        },
        request: function(target) {
            this.isActive = true;
            var xhr = target.xhr;
            var orgListener = xhr.onload;
            var self = this;
            var requestTid = setTimeout(function() {
                try { xhr.abort(); } catch(e) {}
                self.working--;
                self.next();
                if (orgListener) orgListener.apply(xhr, []);
            }, this.timeout);
            xhr.onload = function() {
                clearTimeout(requestTid);
                self.working--;
                self.next();
                if (orgListener) orgListener.apply(xhr, []);
            };
            XMLHttpRequest.prototype.send.call(xhr, target.content);
        },
        cancelWaitingRequest: function() {
            this.requestQueue = [];
        }
    };
    
    var sameDomainRequest = (function() {
        var requestPool = new RequestPool(2);
        return function(href, callback, usecache) {
            var xhr = requestPool.getRequest(usecache);
            if (callback) {
                xhr.onload = function() {
                    callback(xhr);
                };
            }
            xhr.open('GET', href, true);
            xhr.send(null);
            return xhr;
        }
    })();
    var crossDomainRequest = (function() {
        // for Cross Domain Access. (http://orera.g.hatena.ne.jp/misttrap/20080302/p1)
        var requests = [];
        function crossDomainListener(e) {
            var script = e.element;
            for (var i = 0; i < requests.length; i++) {
                if (script === requests[i].script) {
                    e.preventDefault();
                    var callback = requests[i].callback;
                    requests.splice(i, 1);
                    script.parentNode.removeChild(script);
                    if (callback) {
                        callback({ responseText: script.text });
                    }
                    break;
                }
            }
            // prevent other script.
            e.preventDefault();
        }
        opera.addEventListener('BeforeScript', crossDomainListener, false);
        // prevent other script.
        function beforeExternalScriptListener(e) {
            var script = e.element;
            for (var i = 0; i < requests.length; i++) {
                if (script == requests[i].script) return;
            }
            e.preventDefault();
        }
        opera.addEventListener('BeforeExternalScript', beforeExternalScriptListener, false);
        document.addEventListener('DOMContentLoaded', function() { document.body.removeAttribute('onload') }, false);
        return function(href, callback, usecache) {
            var reqUrl = href;
            if (!usecache) reqUrl = href + ((href.indexOf('?') < 0) ? '?' : '&') + new Date().getTime();
            var script = document.createElement('script');
            script.style.display = 'none';
            script.src = reqUrl;
            requests.push({ script: script, callback: callback } );
            document.body.appendChild(script);
        }
    })();
    
    var isSameDomain = (function() {
        var homeAddress = location.href.match(/.*?[/][/].*?[/]/).toString();
        return function(url) {
            return url.indexOf(':') < 0 || url.indexOf(homeAddress) == 0;
        }
    })();
    
    function httpRequest(href, callback) {
        if (isSameDomain(href)) {
            sameDomainRequest(href, callback);
        }
        else {
            if (href.indexOf('atwiki') > 0) {
                crossDomainRequest(href, callback, true);
            }
            else {
                crossDomainRequest(href, callback);
            }
        }
    }
    
    function feedRequest(href, feedCallback) {
        var callback = function(e) {
            if (e.readyState < 4) { // timeout.
                var feedObj = {
                    title : href,
                    link : href,
                    description: '\u901A\u4FE1\u3092\u4E2D\u65AD\u3057\u307E\u3057\u305F\u3002',
                    items : [],
                    url : href,
                    status : 'timeout'
                };
            }
            else if (e.responseText == "") {
                var feedObj = {
                    title : href,
                    link : href,
                    description: '\u60C5\u5831\u304C\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002',
                    items : [],
                    url : href,
                    status : 'nodata'
                };
            }
            else if (!/^\s*</.test(e.responseText)) { // deleted mylist. etc.
                var feedObj = {
                    title : href,
                    link : href,
                    description: '\u6709\u52B9\u306A\u30D5\u30A3\u30FC\u30C9\u3067\u306F\u3042\u308A\u307E\u305B\u3093\u3002\n(' + /\s*(.*)$/m.exec(e.responseText)[0].substring(0, 300) + ')',
                    items : [],
                    url : href,
                    status : 'invalid'
                };
            }
            else {
                var feedObj = parseFeedObjectFromString(e.responseText);
                feedObj.url = href;
                feedObj.status = 'ok';
                if (!feedObj.link) {
                    feedObj.link = href;
                }
            }
            feedCallback(feedObj);
        };
        httpRequest(href, callback);
    }
    
    /**
     * class ThumbnailInfo.
     */
    var ThumbnailInfo = {
        BASE : 'http://www.nicovideo.jp/api/getthumbinfo/',
        IMG_DELETED : 'http://www.nicovideo.jp/img/thumb/del_img.jpg'
    }
    ThumbnailInfo.Instance = function() {
        this.cache = {};
        this.requestPool = new RequestPool(1);
        this.requestPool.timeout = 2000;
    };
    ThumbnailInfo.Instance.prototype = {
        getThumbnailInfo : function(uri, callback) {
            if (this.cache[uri]) {
                callback(this.cache[uri]);
                return;
            }
            this.request(uri, callback);
        },
        request: function(uri, callback) {
            var video_id = /[a-z]{0,2}[0-9]+(?=\?|#|$)/.exec(uri)[0];
            var thumb_url = ThumbnailInfo.BASE + video_id;
            var xhr = this.requestPool.getRequest(true);
            xhr.open('GET', thumb_url, true);
            var self = this;
            xhr.onload = function() {
                var thumb_info;
                if (xhr.readyState < 4) { // timeouted.
                    thumb_info = {
                        timeout : true
                    };
                }
                else {
                    var thumb_doc = xhr.responseXML;
                    if (thumb_doc.documentElement.getAttribute('status') == 'ok') {
                        thumb_info = {
                            status : 'ok',
                            title : thumb_doc.getElementsByTagName('title')[0].textContent,
                            link  : uri,
                            description : thumb_doc.getElementsByTagName('description')[0].textContent,
                            date  : thumb_doc.getElementsByTagName('first_retrieve')[0].textContent,
                            image : thumb_doc.getElementsByTagName('thumbnail_url')[0].textContent,
                            length: thumb_doc.getElementsByTagName('length')[0].textContent,
                            response : thumb_doc.getElementsByTagName('last_res_body')[0].textContent,
                            type  : thumb_doc.getElementsByTagName('thumb_type')[0].textContent,
                            view  : Number(thumb_doc.getElementsByTagName('view_counter')[0].textContent),
                            comment : Number(thumb_doc.getElementsByTagName('comment_num')[0].textContent),
                            mylist  : Number(thumb_doc.getElementsByTagName('mylist_counter')[0].textContent),
                            tags  : (function(t) {
                                    var tags = [];
                                    for (var i = 0; i < t.length; i++) {
                                        tags.push(t[i].textContent);
                                    }
                                    return tags;
                                })(thumb_doc.getElementsByTagName('tag'))
                        };
                    }
                    else {
                        var code = thumb_doc.getElementsByTagName('code')[0].textContent;
                        var desc = thumb_doc.getElementsByTagName('description')[0].textContent
                        thumb_info = {
                            status : 'fail',
                            code : code,
                            title : video_id,
                            link  : uri,
                            description : desc,
                            date  : '',
                            image : (/DELETED|NOT_FOUND/.test(code)) ? ThumbnailInfo.IMG_DELETED : ''
                        };
                    }
                    self.cache[uri] = thumb_info;
                }
                try { callback(thumb_info); } catch (e) {}
            };
            xhr.send(null);
        },
        cancelRequest : function() {
            this.requestPool.cancelWaitingRequest();
        }
    };
    var thumbnailInfo = new ThumbnailInfo.Instance();
    
    /**
     * class HateneStar.
     */
    var HatenaStar = {
        BASE     : 'http://s.hatena.ne.jp/',
        ENTRY    : 'http://s.hatena.ne.jp/entry.json',
        ENTRIES  : 'http://s.hatena.ne.jp/entries.json',
        ADD      : 'http://s.hatena.ne.jp/star.add.json',
        IMG_STAR : 'http://s.hatena.ne.jp/images/star.gif',
        IMG_BUTTON : 'http://s.hatena.ne.jp/images/add.gif'
    };
    HatenaStar.Instance = function(token) {
        this.token = token; // need to use the hatena star from outside of the hatena.
        this.rks   = null;  // get from entries.json.
        this.session = encodeURIComponent(new Date().getTime());
        this.cache = {};
        this.requests = [];
        this.requestLimit = 100;
    };
    HatenaStar.Instance.prototype = {
        /**
         * @param req: request object that has property uri, title and place.
         */
        register : function(req) {
            if (this.cache[req.uri]) {
                this.attachStar(req, this.cache[req.uri]);
                return;
            }
            this.requests.push(req);
            this.next();
        },
        next : function() {
            if (this.requests.length == 0) {
                return;
            }
            // load 1sec after the last item was added. 
            if (this.loadTid) clearTimeout(this.loadTid);
            var self = this;
            this.loadTid = setTimeout(function() {
                self.loadTid = null;
                self.loadStar();
            }, 1000);
        },
        loadStar : function() {
            var allRequests = this.requests;
            var requests = [], uris = [], dup = {}, count = 0, limit = this.requestLimit;
            for (var i = 0; i < allRequests.length && count < limit; i++) {
                var req = allRequests[i];
                if (this.cache[req.uri]) { // loaded while waiting 1sec.
                    this.attachStar(req, this.cache[req.uri]);
                    continue;
                }
                requests.push(req);
                if (!dup[req.uri]) {
                    uris.push(encodeURIComponent(req.uri));
                    dup[req.uri] = true;
                    count++;
                }
            }
            this.requests = allRequests.slice(i);
            if (requests.length == 0) return;
            var url = HatenaStar.ENTRIES + '?uri=' + uris.join('&uri=') + '&' + this.session;
            var self = this;
            crossDomainRequest(url, function(xhr) {
                try {
                    var json = eval('(' + xhr.responseText + ')'); // trust s.hatena
                }
                catch (e) {
                    opera.postError('eval failed:[' + xhr.responseText + ']');
                    throw e;
                }
                self.rks = json.rks;
                var entries = json.entries;
                for (var i = 0; i < entries.length; i++) {
                    var entry = entries[i];
                    self.cache[entry.uri] = entry;
                }
                for (var i = 0; i < requests.length; i++) {
                    var req = requests[i];
                    var entry = self.cache[req.uri];
                    if (!entry) {
                        entry = self.cache[req.uri] = { uri: req.uri, stars: [] };
                    }
                    self.attachStar(req, entry);
                }
            }, true);
            self.next();
        },
        cancelRequest : function() {
            this.requests = [];
        },
        attachStar : function(req, entry) {
            this.showStarButton(req);
            var stars = entry.stars;
            var df = req.place.ownerDocument.createDocumentFragment();
            for (var i = 0; i < stars.length; i++) {
                if (isNaN(stars[i])) this.showStar(stars[i], df);
                else                 this.showStarNum(stars[i], entry.uri, df);
            }
            req.place.appendChild(df);
        },
        showStarButton : function (req) {
            var img = req.place.ownerDocument.createElement('img');
            img.src = HatenaStar.IMG_BUTTON;
            img.setAttribute('width', '16');
            img.setAttribute('height', '16');
            img.style.cssText = 'margin: 2px; vertical-align: middle; cursor: pointer;';
            img.alt = img.title = 'Add Star';
            var self = this;
            img.addEventListener('click', function(e) {
                self.showStar({quote: '', name: ''}, req.place);
                self.addStar(req.uri, req.title);
                self.cache[req.uri].stars.push({quote: '', name: ''});
            }, false);
            req.place.appendChild(img);
        },
        showStar : function (star, place) {
            var img = place.ownerDocument.createElement('img');
            img.src = HatenaStar.IMG_STAR;
            img.setAttribute('width', '11');
            img.setAttribute('height', '10');
            img.style.cssText = 'vertical-align: middle;';
            img.alt = img.title = star.name;
            place.appendChild(img);
        },
        showStarNum : function (number, uri, place) {
            var numPlace = place.ownerDocument.createElement('span');
            numPlace.textContent = number;
            numPlace.style.cssText = 'color: #F4B128; font-weight: bold; font-size: 80%; font-family: "arial", sans-serif; margin: 0 2px; cursor: pointer;';
            var self = this;
            numPlace.addEventListener('click', function(e) {
                self.expandStar(uri, numPlace);
            }, false);
            place.appendChild(numPlace);
        },
        expandStar : function(uri, numPlace) {
            var url = HatenaStar.ENTRY + '?uri=' + uri + '&' + this.session;
            var self = this;
            crossDomainRequest(url, function(xhr) {
                var json = eval('(' + xhr.responseText + ')');
                var stars = json.entries[0].stars;
                var df = numPlace.ownerDocument.createDocumentFragment();
                for (var i = 1, len = stars.length - 1; i < len; i++) { // remove first and last.
                    self.showStar(stars[i], df);
                }
                numPlace.parentNode.replaceChild(df, numPlace);
            }, true);
        },
        addStar : function (uri, title) {
            if (!this.rks) throw "rks.";
            var url = HatenaStar.ADD + '?uri=' + encodeURIComponent(uri) + (title ? ('&title=' + encodeURIComponent(title)) : '') + '&token=' + this.token + '&rks=' + this.rks + '&' + new Date().getTime();
            new Image().src = url;
        }
    };
    var hatenaStar = new HatenaStar.Instance(NDR_HATENASTAR_TOKEN);
    
    /** 
     * class SimpleDeferred
     */
    var SimpleDeferred = function() {
        this.funcs = [];
    };
    SimpleDeferred.prototype.addCallback = function(f) {
        this.funcs.push(f);
    };
    SimpleDeferred.prototype.callback = function(initArg) {
        var result = initArg;
        for (var i = 0; i < this.funcs.length; i++) {
            result = this.funcs[i](result);
        }
    };
    var Deferred = SimpleDeferred;
    
    /**
     * class NicoMylist.
     */
    var NicoMylist = {
        GROUP_EDIT : '/mylistgroup_edit',
        EDIT       : '/mylist_edit',
        STATUS     : {
            'loading':'\u8FFD\u52A0\u4E2D\u3067\u3059\u2026\u3002',
            //'success':'<a href="%HREF%">%NAME%</a> \u306B\u767B\u9332\u3057\u307E\u3057\u305F\u3002',
            'duperror':'\u3059\u3067\u306B\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u3059\u3002',
            'maxerror':'\u6700\u5927\u767B\u9332\u6570\u3092\u30AA\u30FC\u30D0\u30FC\u3057\u3066\u3044\u307E\u3059\u3002',
            'error':'\u767B\u9332\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002'
        },
        REQUEST_INTERVAL : 3
    };
    NicoMylist.Instance = function() {
        this.mylistGroup = null;
        this.requestQueue = [];
        this.isRunning = false;
        this.loadMylistGroup();
    };
    NicoMylist.Instance.prototype = {
        loadMylistGroup : function() {
            var self = this;
            sameDomainRequest(NicoMylist.GROUP_EDIT, function(x) {
                if (x.status == 200) {
                    var group_list = [];
                    var group_info = {};
                    var m = x.responseText.match(/href\s*=\s*"mylist\/\d+"[^>]*>.+?<\/a>/g);
                    if (!m) return;
                    for (var i = 0; i < m.length; i++) {
                        var info = m[i].match(/href\s*=\s*"(mylist\/(\d+))"[^>]*>(.+?)<\/a>/);
                        group_list.push(info[2]);
                        group_info[info[2]] = { group_name: info[3], group_uri: '/' + info[1] };
                    }
                    self.mylistGroup = { group_list: group_list, group_info: group_info };
                }
            });
        },
        request : function(win, method, url, data, callback) {
            var x = new win.XMLHttpRequest();
            x.open(method, url, true);
            x.onload = function() { callback(x) };
            x.onerror = function() { throw "XMLHttpRequest error." };
            x.setRequestHeader('X-Requested-With', 'XMLHttpRequest'); // for niconico API.
            x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8'); // for niconico API.
            x.send(data);
            return x;
        },
        add : function(video_id, group_id, callback) {
            var self = this;
            this.enqueueRequest(function() {
                var d = new Deferred();
                self.request(window, 'POST', '/watch/' + video_id, 'mylist=add&group_id=' + group_id + '&ajax=1', 
                    function(x) { d.callback(x) }
                );
                d.addCallback(function(x) { 
                    try {
                        callback(eval(x.responseText).result);
                    }
                    catch(e) {}
                });
                return d;
            });
        },
        enqueueRequest : function(func) {
            this.requestQueue.push(func);
            if (!this.isRunning) this.next();
        },
        next : function() {
            if (this.requestQueue.length == 0) {
                this.isRunning = false;
                return;
            }
            this.isRunning = true;
            var d = this.requestQueue.shift()();
            var self = this;
            d.addCallback(function() {
                setTimeout(function() {
                    self.next();
                }, NicoMylist.REQUEST_INTERVAL * 1000)
            });
        }
    };
    var nicoMylist = new NicoMylist.Instance();
    
    
    // class RSSProcessor (RSS2.0)
    function RSSProcessor() {
        this.initialize.apply(this, arguments);
    }
    RSSProcessor.prototype.initialize = function() {
        this.xProps = {
            title       : '//channel/title',
            link        : '//channel/link',
            description : '//channel/description',
            date        : '//channel/pubDate'
        };
        this.xItems = '//item';
        this.xItemProps = {
            title       : 'title',
            link        : 'link',
            description : 'description',
            date        : 'pubDate'
        };
    };
    RSSProcessor.prototype.createResolver = function(document) {
        return null;
    };
    RSSProcessor.prototype.toObject = function(document) {
        var data = {};
        var resolver = this.createResolver(document);
        for (var k in this.xProps) {
            if (this.xProps.hasOwnProperty(k)) {
                data[k] = document.evaluate(this.xProps[k], document, resolver, XPathResult.STRING_TYPE, null).stringValue;
            }
        }
        var keys = [];
        var exps = {};
        for (var k in this.xItemProps) {
            if (this.xItemProps.hasOwnProperty(k)) {
                keys.push(k);
                exps[k] = document.createExpression(this.xItemProps[k], resolver);
            }
        }
        var rss_items = [];
        var items = document.evaluate(this.xItems, document, resolver, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (var i = 0, len = items.snapshotLength; i < len; i++) {
            var item = items.snapshotItem(i);
            var itemData = {};
            for (var j = 0; j < keys.length; j++) {
                var k = keys[j];
                itemData[k] = exps[k].evaluate(item, XPathResult.STRING_TYPE, null).stringValue;
            }
            rss_items.push(itemData);
        }
        data.items = rss_items;
        return data;
    };
    // class RSS1Processor
    function RSS1Processor() {
        this.initialize.apply(this, arguments);
    }
    RSS1Processor.prototype = new RSSProcessor();
    RSS1Processor.prototype.initialize = function() {
        this.xProps = {
            title       : '//rss1:channel/rss1:title',
            link        : '//rss1:channel/rss1:link',
            description : '//rss1:channel/rss1:description',
            date        : '//rss1:channel/dc:date'
        };
        this.xItems = '//rss1:item';
        this.xItemProps = {
            title       : 'rss1:title',
            link        : 'rss1:link',
            description : '*[self::content:encoded or self::rss1:description]',
            date        : 'dc:date'
        };
    };
    RSS1Processor.prototype.createResolver = function(document) {
        // http://subtech.g.hatena.ne.jp/cho45/20071119/1195408940
        return function(prefix) {
            if (prefix == 'rss1') {
                return 'http://purl.org/rss/1.0/';
            }
            var c = document.createNSResolver(document.documentElement).lookupNamespaceURI(prefix);
            if (c) return c;
            return (document.documentElement.namespaceURI ? "http://www.w3.org/1999/xhtml" : "");
        }
    };
    // class AtomProcessor.
    function AtomProcessor() {
        this.initialize.apply(this, arguments);
    }
    AtomProcessor.prototype = new RSSProcessor();
    AtomProcessor.prototype.initialize = function() {
        this.xProps = {
            title       : '//atom:feed/atom:title',
            link        : '//atom:feed/atom:link[@rel="alternate" or true()]/@href',
            description : '//atom:feed/atom:subtitle',
            date        : '//atom:feed/atom:updated'
        };
        this.xItems = '//atom:entry';
        this.xItemProps = {
            title       : 'atom:title',
            link        : 'atom:link/@href',
            description : 'atom:content',
            date        : 'atom:published'
        };
    };
    AtomProcessor.prototype.createResolver = function(document) {
        return function(prefix) {
            if (prefix == 'atom') {
                return 'http://www.w3.org/2005/Atom';
            }
            var c = document.createNSResolver(document.documentElement).lookupNamespaceURI(prefix);
            if (c) return c;
            return (document.documentElement.namespaceURI ? "http://www.w3.org/1999/xhtml" : "");
        }
    };
    // class HtmlProcessor.
    function HtmlProcessor() {
    }
    HtmlProcessor.prototype.toObject = function(document) {
        var data = {
            title : document.title,
            link  : '',
            description : '',
            items : []
        };
        if (!data.title) {
            var title = document.getElementsByTagName('title')[0];
            if (title) data.title = title.textContent;
        }
        var items = data.items;
        var playinfo = createPlayInfo(document);
        var pitems = playinfo.items;
        for (var i = 0; i < pitems.length; i++) {
            var video_id = pitems[i];
            items.push({
                title : playinfo.title[video_id],
                link  : playinfo.video[video_id],
                image : playinfo.image[video_id],
                description : '',
                date : ''
            });
        }
        return data;
    };
    function parseFeedObjectFromString(str) {
        var responseDocument = null;
        if (/^\s*<\?xml/.test(str)) {
            var xmlDocument = new DOMParser().parseFromString(str, 'application/xml');
            if (xmlDocument.documentElement.nodeName != 'parsererror') {
                responseDocument = xmlDocument;
            }
        }
        if (responseDocument == null) {
            // cutting corners
            var doc = document.implementation.createHTMLDocument('');
            var range = doc.createRange();
            range.selectNodeContents(doc.documentElement);
            range.deleteContents();
            range.insertNode(range.createContextualFragment(str));
            responseDocument = doc;
        }
        return parseFeedObjectFromDocument(responseDocument);
    }
    function parseFeedObjectFromDocument(document) {
        var rssProcessor;
        switch (document.documentElement.nodeName) {
            case 'rss'    : rssProcessor = new RSSProcessor();  break;
            case 'rdf:RDF': rssProcessor = new RSS1Processor(); break;
            case 'feed'   : rssProcessor = new AtomProcessor(); break;
            default       : rssProcessor = new HtmlProcessor(); break;
        }
        var obj = rssProcessor.toObject(document);
        return obj;
    }
    function isFeedDocument(document) {
        return /^(?:rss|rdf:RDF|feed)$/.test(document.documentElement.nodeName);
    }
    
    /**
     * VisitUtil
     */
    var VisitUtil = {
        checker : null,
        isVisited : function(url) {
            if (!VisitUtil.checker) {
                VisitUtil.checker = document.createElement('a');
                VisitUtil.checker.setAttribute('rel', 'nofollow');
                appendClass(VisitUtil.checker, 'ndr_visited_checker');
                document.body.insertBefore(VisitUtil.checker, document.body.firstChild);
                setTimeout(function() {
                    document.body.removeChild(VisitUtil.checker);
                    VisitUtil.checker = null;
                }, 1000);
            }
            VisitUtil.checker.href = url;
            return (VisitUtil.checker.offsetHeight == 0);
        },
        pseudoVisit : function(link) {
            if (opera9_5Ab) {
                var w = window.open(link, '', 'width=1,height=1,menubar=no,toolbar=no,scrollbars=no,top=0,left=10000');
                setTimeout(function() { w.close(); }, 0);
                return;
            }
            var iframe = document.createElement('object');
            iframe.style.display = 'none';
            iframe.src = link;
            document.body.appendChild(iframe);
            document.body.removeChild(iframe);
        }
    }
    
    /**
     * SimpleNicovideoPlayer.
     *   http://orera.g.hatena.ne.jp/miya2000/20070925/p0
     */
    function SimpleNicovideoPlayer(name) {
        this.playlist = [];
        this.name = name || 'SimpleNicovideoPlayer';
    }
    SimpleNicovideoPlayer.prototype = {
        add : function(playlist) {
            this.playlist = this.playlist.concat(playlist);
            if (this.isPlaying) {
                this.focus();
            }
            else {
                this.play();
            }
        },
        play : function() {
            if (this.playlist.length == 0) {
                this.isPlaying = false;
                return;
            };
            this.isPlaying = true;
            var nextVideo = this.playlist.shift();
            var w = window.open(nextVideo, this.name);
            w.focus();
            this.focus = function() {
                w.focus();
            };
            var self = this;
            var tid = setInterval(function(){
                if (w.closed) {
                    clearInterval(tid);
                    self.isPlaying = false;
                    self.playlist = [];
                }
                var d, p;
                if ((d = w.document) && (p = d.getElementById('flvplayer'))) {
                    try {
                        if (p.ext_getStatus() == 'end') {
                            clearInterval(tid);
                            self.play();
                            return;
                        }
                    }
                    catch (e) {}
                }
            }, 5000);
        }
    };
    
    function Platform() {
        this.commands = new ListedKeyMap();
        this.currentMode = '';
        this.keyBinds = {};
        this.currentKeyBind = this.keyBinds[''] = new KeyBind();
        this.currentKeyBind.start();
    }
    Platform.prototype.bindCommand = function(command) {
        this.commands.add(command.name, command);
    };
    Platform.prototype.doCommand = function(commandName) {
        var cmd = this.commands.get(commandName);
        if (cmd) {
            cmd.fn.apply(this, arguments.slice(1));
        }
    };
    Platform.prototype.bindShortcut = function(commandName, key, mode) {
        var self = this;
        var keyBind = this.keyBinds[mode || ''];
        if (!keyBind) {
            keyBind = this.keyBinds[mode] = new KeyBind();
        }
        keyBind.add(key, function(e) { self.doCommand(commandName, e); });
    };
    Platform.prototype.changeMode = function(mode) {
        if (this.currentKeyBind) this.currentKeyBind.stop();
        this.currentKeyBind = this.keyBinds[mode || ''];
        if (this.currentKeyBind) this.currentKeyBind.start();
    };
    Platform.prototype.clearMode = function(mode) {
        this.changeMode(null);
    };
    
    function NDR(preferences) {
        var p = preferences || {};
        this.pref = {
            mixCount  : p.MIX_COUNT || 30,
            loadCount : p.LOAD_COUNT || 15,
            enableHatenaStar : !!p.ENABLE_HATENASTAR,
            enableHatenaBookmark : !!p.ENABLE_HATENABOOKMARK,
            enableStorage : !!p.ENABLE_STORAGE,
            feedList : [],
            feedInfo : {}
        };
        this.isFeedPaneShowing = true;
        this.faviconClass = {};
        this.feedMap = new ListedKeyMap();
        this.tempFeedMap = new ListedKeyMap();
        this.pinnedMap = new ListedKeyMap();
        this.timer = new TimerManager();
        this.player = new SimpleNicovideoPlayer('NDR');
        this.build();
        this.openFeed(this.createHistoryFeed());
        this.clearFeedItems();
        this.importFeedList(p.FEED_LIST || []);
        // loadPreference delay for Opera9.
        var self = this;
        setTimeout(function() { self.loadPreference() }, 0);
    }
    NDR.prototype.build = function() {
        addStyle(NDR_STYLE);
        var body = document.getElementsByTagName('body')[0];
        var ndrBody = document.createElement('div');
        appendClass(ndrBody, 'ndr_body');
        ndrBody.innerHTML = NDR_HTML;
        body.appendChild(ndrBody);
        
        var feed_pane = document.getElementById('NDR_FEED_PANE');
        var feed_menu = document.getElementById('NDR_FEED_MENU');
        feed_pane.style.paddingTop = feed_menu.offsetHeight + 'px';
        
        window.addEventListener('resize', function() {
            // force redraw.
            feed_pane.style.display = 'none';
            feed_pane.style.display = '';
        }, false);
        
        var self = this;
        
        // subscribe mylist.
        document.addEventListener('click', function(e) {
            self.interceptClick(e);
        }, true);
        
        var nicoSearchForm = document.getElementById('NDR_NICO_SEARCH');
        nicoSearchForm.addEventListener('submit', function(e) {
            if (e.shiftKey) {
                setTimeout(function() { nicoSearchForm.s.value = '' }, 0);
            }
            else {
                e.preventDefault();
                self.openTemporaryFeed('http://www.nicovideo.jp/search/' + nicoSearchForm.s.value);
                setTimeout(function() { nicoSearchForm.s.value = '' }, 0);
            }
        }, false);
        
        var myFeedButton = document.getElementById('NDR_C_MYFEED');
        myFeedButton.addEventListener('click', function(e) {
            e.preventDefault();
            self.toggleFeedPane();
        }, false);
        
        var historyButton = document.getElementById('NDR_C_HISTORY');
        historyButton.addEventListener('click', function(e) {
            e.preventDefault();
            self.openFeed(self.createHistoryFeed());
        }, false);
        
        var mixButton = document.getElementById('NDR_C_MIX');
        mixButton.addEventListener('click', function(e) {
            e.preventDefault();
            self.openFeed(self.createMixFeed());
        }, false);
        
        var feedReloadButton = document.getElementById('NDR_C_FEED_RELOAD');
        feedReloadButton.addEventListener('click', function(e) {
            e.preventDefault();
            self.reloadAllFeeds();
        }, false);
        
        var feedEditButton = document.getElementById('NDR_C_FEED_EDIT');
        feedEditButton && feedEditButton.addEventListener('click', function(e) {
            e.preventDefault();
            self.openFeedEdit();
        }, false);
        
        var feedAddButton = document.getElementById('NDR_C_FEED_ADD');
        feedAddButton && feedAddButton.addEventListener('click', function(e) {
            e.preventDefault();
            self.addFeedURL();
        }, false);
        
        var feedSearchBox = document.getElementById('NDR_C_FEED_SEARCH');
        feedSearchBox.addEventListener('keypress', function(e) {
            if (e.which == 0 && e.keyCode == 38) {
                self.selectPreviousFeed();
                e.preventDefault();
            }
            if (e.which == 0 && e.keyCode == 40) {
                self.selectNextFeed();
                e.preventDefault();
            }
        }, false);
        var intervalCount = 0;
        feedSearchBox.addEventListener('keydown', function(e) {
            if (!self.timer.intervals['feedSearch']) {
                var preWord = null;
                self.timer.setInterval('feedSearch', function() {
                    if (preWord != feedSearchBox.value) {
                        preWord = feedSearchBox.value;
                        intervalCount = 0;
                        self.feedSearch(feedSearchBox);
                    }
                    else {
                        if (++intervalCount > 10) {
                            self.timer.clearInterval('feedSearch');
                        }
                    }
                }, 500);
            }
            self.timer.clearTimeout('entrySearch');
            if (e.keyCode == 13) {
                self.timer.setTimeout('entrySearch', function() {
                    var feed = self.createEntrySearchResultFeed(feedSearchBox);
                    if (feed) self.openFeed(feed);
                }, 300);
            }
            e.stopPropagation();
        }, false);
        
        var prevEntryButton = document.getElementById('NDR_C_PREV_ENTRY');
        prevEntryButton.addEventListener('click', function(e) {
            self.selectPreviousEntry();
        }, false);
        prevEntryButton.addEventListener('dblclick', function(e) {
            e.preventDefault();
            self.selectPreviousEntry();
        }, false);
        var nextEntryButton = document.getElementById('NDR_C_NEXT_ENTRY');
        nextEntryButton.addEventListener('click', function(e) {
            self.selectNextEntry();
        }, false);
        nextEntryButton.addEventListener('dblclick', function(e) {
            e.preventDefault();
            self.selectNextEntry();
        }, false);
        
        var pinnedListButton = document.getElementById('NDR_C_PINNED_LIST');
        var pinnedList = document.getElementById('NDR_PINNED_LIST');
        pinnedListButton.addEventListener('click', function(e) {
            self.viewPinnedEntries();
        }, false);
        pinnedListButton.addEventListener('mouseover', function(e) {
            self.showPinnedList();
        }, false);
        pinnedList.addEventListener('mouseover', function(e) {
            self.showPinnedList();
        }, false);
        pinnedListButton.addEventListener('mouseout', function(e) {
            self.hidePinnedListLater();
        }, false);
        pinnedList.addEventListener('mouseout', function(e) {
            self.hidePinnedListLater();
        }, false);
        
        var platform = new Platform();
        // bind commands.
        platform.bindCommand({ name: 'NextEntry', fn: function() { self.selectNextEntry() }, desc: '\u6B21\u306E\u30A2\u30A4\u30C6\u30E0'});
        platform.bindCommand({ name: 'PrevEntry', fn: function() { self.selectPreviousEntry() }, desc: '\u524D\u306E\u30A2\u30A4\u30C6\u30E0'});
        platform.bindCommand({ name: 'OlderEntries', fn: function() { self.openOlderEntries() }, desc: '\u65E2\u306B\u898B\u305F\u52D5\u753B\u3092\u8868\u793A'});
        platform.bindCommand({ name: 'NewerEntries', fn: function() { self.openNewerEntries() }, desc: '\u307E\u3060\u898B\u3066\u306A\u3044\u52D5\u753B\u3092\u8868\u793A'});
        platform.bindCommand({ name: 'NextFeed', fn: function() { self.selectNextFeed() }, desc: '\u6B21\u306E\u30D5\u30A3\u30FC\u30C9\u306B\u79FB\u52D5'});
        platform.bindCommand({ name: 'PrevFeed', fn: function() { self.selectPreviousFeed() }, desc: '\u524D\u306E\u30D5\u30A3\u30FC\u30C9\u306B\u79FB\u52D5'});
        platform.bindCommand({ name: 'ScrollDown', fn: function() { self.scrollDown() }, desc: '\u4E0B\u306B\u30B9\u30AF\u30ED\u30FC\u30EB'});
        platform.bindCommand({ name: 'ScrollUp', fn: function() { self.scrollUp() }, desc: '\u4E0A\u306B\u30B9\u30AF\u30ED\u30FC\u30EB'});
        platform.bindCommand({ name: 'View', fn: function() { self.viewEntry() }, desc: '\u52D5\u753B\u3092\u518D\u751F'});
        platform.bindCommand({ name: 'Pin', fn: function() { self.pinToggle() }, desc: '\u30D4\u30F3\u3092\u4ED8\u3051\u308B\u0020/\u0020\u5916\u3059'});
        platform.bindCommand({ name: 'OpenPin', fn: function() { self.viewPinnedEntries() }, desc: '\u30D4\u30F3\u3092\u958B\u304F'});
        platform.bindCommand({ name: 'RefreshFeedList', fn: function() { self.refreshFeedList() }, desc: '\u30D5\u30A3\u30FC\u30C9\u4E00\u89A7\u306E\u66F4\u65B0'});
        platform.bindCommand({ name: 'FocusSearch', fn: function() { self.focusSearch() }, desc: '\u691C\u7D22\u30DC\u30C3\u30AF\u30B9\u3092\u30D5\u30A9\u30FC\u30AB\u30B9'});
        platform.bindCommand({ name: 'ToggleFeedPane', fn: function() { self.toggleFeedPane() }, desc: '\u30DE\u30A4\u30D5\u30A3\u30FC\u30C9\u3092\u7573\u3080\u0020/\u0020\u623B\u3059'});
        platform.bindCommand({ name: 'ToggleCompactMode', fn: function() { self.toggleCompactMode() }, desc: '\u672C\u6587\u306E\u8868\u793A\u0020/\u0020\u975E\u8868\u793A'});
        this.platform = platform;
        
        var entries = document.getElementById('NDR_ENTRIES');
        this.entrySelectionIterator = new ListElementIterator(entries, 'ndr_entry');
        this.feedSelectionIterator = new ListElementIterator(document.getElementById('NDR_FEED_LIST'));
    };
    NDR.prototype.interceptClick = function(e) {
        if (hasClass(e.target, 'ndr_subscribe')) {
            e.preventDefault();
            e.stopPropagation();
            var a = e.target.previousSibling;
            while (a && a.nodeName != 'A') a = a.previousSibling;
            if (a) {
                this.addFeedURL(a.href + '?rss=2.0');
            }
        }
        if (hasClass(e.target, 'ndr_select_feed')) {
            e.preventDefault();
            e.stopPropagation();
            var link = e.target.href;
            for (var i = 0, len = this.feedMap.size(); i < len; i++) {
                var feedItem = this.feedMap.getAt(i);
                if (feedItem.feedObj && feedItem.feedObj.link == link) {
                    var element = feedItem.element;
                    this.openFeedItemFromElement(element);
                    break;
                }
            }
        }
    };
    NDR.prototype.initKeyBind = function(shortcutList) {
        if (!shortcutList) return;
        this.platform.keyBinds[''].clear();
        for (var i = 0; i < shortcutList.length; i++) {
            var item = shortcutList[i];
            this.platform.bindShortcut(item.command, item.key);
        }
    };
    NDR.prototype.makeNicoLinks = (function() {
        var makeNicoReg = /(https?:\/\/[-_.!~*()a-zA-Z0-9;\/?:@&=+$,%#]+)|([a-z]{2}\d+)|(mylist\/\d+)|(^|\D)(\d{10})(?!\d)/mg;
        return function(str) {
            return str.replace(makeNicoReg, function(str, $1, $2, $3, $4, $5){
                if ($1 != null) return ' <a href="' + $1 + '" target="_blank" rel="nofollow">' + $1 + '</a> ';
                if ($2 != null) {
                    if ($2 == 'mp3') return $2;
                    var co = $2.substring(0, 2) == 'co';
                    if (co) return ' <a href="http://com.nicovideo.jp/community/' + $2 + '" target="_blank" rel="nofollow">'+ $2 + '</a> ';
                    else    return ' <a href="http://www.nicovideo.jp/watch/' + $2 + '" target="_blank" rel="nofollow">'+ $2 + '</a> ';
                }
                if ($3 != null) return ' <a href="http://www.nicovideo.jp/' + $3 + '" target="_blank" rel="nofollow">'+ $3 + '</a> (<a rel="nofollow" class="ndr_subscribe" title="ndr\u0020\u3067\u3053\u306E\u30DE\u30A4\u30EA\u30B9\u30C8\u306E\u0020RSS\u0020\u3092\u8CFC\u8AAD\u3057\u307E\u3059\u3002">\u8CFC\u8AAD</a>) ';
                if ($5 != null) return $4 + ' <a href="http://www.nicovideo.jp/watch/' + $5 + '" target="_blank" rel="nofollow">'+ $5 + '</a> ';
            });
        }
    })();
    NDR.prototype.toggleFeedPane = function() {
        if (this.isFeedPaneShowing) {
            if (!this.hideFeedPaneStyle) {
                this.hideFeedPaneStyle = addStyle(NDR_STYLE_HIDE_FEED_PANE);
            }
            this.hideFeedPaneStyle.disabled = false;
        }
        else {
            this.hideFeedPaneStyle.disabled = true;
        }
        this.isFeedPaneShowing = !this.isFeedPaneShowing;
    };
    NDR.prototype.toggleCompactMode = function() {
        if (!this.isCompactMode) {
            if (!this.compactModeStyle) {
                this.compactModeStyle = addStyle(NDR_STYLE_COMPACT_MODE);
            }
            this.compactModeStyle.disabled = false;
        }
        else {
            this.compactModeStyle.disabled = true;
        }
        this.isCompactMode = !this.isCompactMode;
        if (this.scrollObserverEntriesPanel) {
            this.scrollObserverEntriesPanel();
        }
    };
    NDR.prototype.focusSearch = function() {
        var feedSearchBox = document.getElementById('NDR_C_FEED_SEARCH');
        feedSearchBox.focus();
    };
    NDR.prototype.escapeSearchPhrase = function(str) {
        if (!str) return '';
        var p = str.replace(/^[\s|]+|[\s|]+$/g, '');
        if (!p) return '';
        return p.replace(/\s+/g, ' ').replace(/\s*\|\s*/g, '|').replace(/[|]+/g, '|').replace(/[.+?*()\[\]\\{}^$]/g, '\\$1');
    };
    NDR.prototype.createSearchTester = function(phrase) {
        if (!phrase) {
            return { test: function() { return true } };
        }
        try {
            var s_phrase = unique(phrase.split(/ /));
            if (s_phrase.length == 1) {
                return new RegExp(phrase, 'i');
            }
            else {
                testerArray = s_phrase.map(function(p) { return new RegExp(p, 'i') });
                return { test: function(str) { return testerArray.every(function(t) { return t.test(str)}) } };
            }
        }
        catch(e) {
            return null;
        }
    }
    NDR.prototype.feedSearch = function(searchBox) {
        searchBox.style.color = '';
        var phrase = this.escapeSearchPhrase(searchBox.value);
        var tester = this.createSearchTester(phrase);
        if (!tester) {
            searchBox.style.color = 'red';
            return;
        }
        var feedFilter = {
            matches : function(feedItem) {
                var matched = tester.test(feedItem.element.textContent);
                if (!matched) {
                    var feedObj = feedItem.feedObj;
                    if (feedObj) {
                        matched = 
                            tester.test(feedObj.description) ||
                            feedObj.items.some(function(item) {
                                return tester.test(item.title) || tester.test(item.description);
                            });
                    }
                }
                return matched;
            }
        };
        for (var i = 0, len = this.feedMap.size(); i < len; i++) {
            var feedItem = this.feedMap.getAt(i);
            feedItem.element.style.display = feedFilter.matches(feedItem) ? '' : 'none';
        }
        this.feedFilter = feedFilter;
    };
    NDR.prototype.createEntrySearchResultFeed = function(searchBox) {
        var phrase = this.escapeSearchPhrase(searchBox.value);
        if (!phrase) return;
        var tester = this.createSearchTester(phrase);
        if (!tester) {
            return;
        }
        var resultFeedObj = {
            title : '\u30A8\u30F3\u30C8\u30EA\u30FC\u691C\u7D22\u7D50\u679C',
            description: '',
            option : {
                emphases: unique(phrase.split(/[ |]/))
            }
        };
        var items = [];
        var dup = {};
        for (var i = 0, len = this.feedMap.size(); i < len; i++) {
            var feedItem = this.feedMap.getAt(i);
            var feedObj = feedItem.feedObj;
            if (!feedObj) continue;
            feedObj.items.forEach(function(item) {
                if (tester.test(item.title) || tester.test(item.description)) {
                    if (!dup[item.link]) {
                        var newItem = {
                            title       : item.title,
                            link        : item.link,
                            description : item.description,
                            date        : item.date,
                            from        : [feedObj.url]
                        }
                        items.push(newItem);
                        dup[item.link] = newItem;
                    }
                    else {
                        if (dup[item.link].from.indexOf(feedObj.url) < 0) {
                            dup[item.link].from.push(feedObj.url);
                        }
                    }
                }
            });
        }
        resultFeedObj.items = items;
        this.sortFeed(resultFeedObj, 'entryDate');
        return resultFeedObj;
    };
    NDR.prototype.scrollDown = function() {
        var list = document.getElementById('NDR_ENTRIES');
        var scrollTop = list.scrollTop;
        var clientHeight = list.clientHeight;
        var scrollEdge = list.scrollHeight - clientHeight;
        if (scrollTop == scrollEdge) return;
        if (this.scrollSoar) {
            if (this.scrollSoar.nextScrollTop == scrollEdge) return;
            this.scrollSoar.cancel();
        }
        var scrollTopEx = scrollTop;
        if (this.scrollSoar && this.scrollSoar.direction == 'Down') {
            scrollTopEx = this.scrollSoar.nextScrollTop;
        }
        var nextScrollTop = Math.min(Math.ceil(scrollTopEx + clientHeight / 2), scrollEdge);
        this.scrollSoar = new Soar(list);
        this.scrollSoar.nextScrollTop = nextScrollTop;
        this.scrollSoar.direction = 'Down';
        this.scrollSoar.to({scrollTop: nextScrollTop}).go();
        var self = this;
        this.scrollSoar.onFinish = function() {
            self.scrollSoar = null;
        };
    };
    NDR.prototype.scrollUp = function() {
        var list = document.getElementById('NDR_ENTRIES');
        var scrollTop = list.scrollTop;
        var clientHeight = list.clientHeight;
        if (scrollTop == 0) return;
        if (this.scrollSoar != null) {
            if (this.scrollSoar.nextScrollTop == 0) return;
            this.scrollSoar.cancel();
        }
        var scrollTopEx = scrollTop;
        if (this.scrollSoar && this.scrollSoar.direction == 'Up') {
            scrollTopEx = this.scrollSoar.nextScrollTop;
        }
        var nextScrollTop = Math.max(scrollTopEx - clientHeight / 2, 0);
        this.scrollSoar = new Soar(list);
        this.scrollSoar.nextScrollTop = nextScrollTop;
        this.scrollSoar.direction = 'Up';
        this.scrollSoar.to({scrollTop: nextScrollTop}).go();
        var self = this;
        this.scrollSoar.onFinish = function() {
            self.scrollSoar = null;
        };
    };
    NDR.prototype.scrollTo = function(item, fn) {
        if (this.scrollSoar != null) {
            this.scrollSoar.cancel();
        }
        var list = document.getElementById('NDR_ENTRIES');
        var nextScrollTop = Math.min(item.offsetTop, list.scrollHeight - list.clientHeight);
        this.scrollSoar = new Soar(list);
        this.scrollSoar.to({scrollTop: nextScrollTop}).go();
        var self = this;
        this.scrollSoar.onFinish = function() {
            self.scrollSoar = null;
            if (fn) fn();
        };
    };
    NDR.prototype.currentViewingEntry = function() {
        var entries = this.entrySelectionIterator.listElement;
        var scrollTop = entries.scrollTop;
        var scrollBottom = scrollTop + entries.clientHeight;
        var current = this.entrySelectionIterator.item;
        if (current && !current.parentNode) { // replaced entries.
            current = null;
        }
        if (current) {
            if ((current.offsetTop + current.offsetHeight) > scrollTop && current.offsetTop < scrollBottom) {
                return current;
            }
        }
        var iterator = new ListElementIterator(entries, 'ndr_entry');
        for (iterator.first(); iterator.item; iterator.next()) {
            if (iterator.item.offsetTop >= scrollTop || (iterator.item.offsetTop + iterator.item.offsetHeight) >= scrollBottom) {
                break;
            }
        }
        return iterator.item;
    };
    NDR.prototype.selectNextEntry = function() {
        var nextEntry = null;
        if (this.scrollSoar) { // now scrolling.
            nextEntry = this.entrySelectionIterator.next().isNullThenFirst().item;
        }
        else {
            var entries = this.entrySelectionIterator.listElement;
            var currentEntry = this.currentViewingEntry();
            if (currentEntry) {
                this.entrySelectionIterator.current(currentEntry);
                if (currentEntry != this.currentSelectedItem && currentEntry.offsetTop > entries.scrollTop) {
                    nextEntry = this.entrySelectionIterator.item;
                }
                else if (currentEntry.offsetTop > entries.scrollTop && (currentEntry.offsetTop + currentEntry.offsetHeight) > (entries.scrollTop + entries.clientHeight)) {
                    nextEntry = this.entrySelectionIterator.item;
                }
                else {
                    nextEntry = this.entrySelectionIterator.next().isNullThenFirst().item;
                }
            }
        }
        if (nextEntry) {
            var self = this;
            this.scrollTo(nextEntry, function() { self.selectEntryItem(nextEntry); });
        }
    };
    NDR.prototype.selectPreviousEntry = function() {
        var prevEntry = null;
        if (this.entrySelectionIterator.item == this.entrySelectionIterator.listElement.firstChild) {
            prevEntry = this.entrySelectionIterator.last().item;
        }
        else if (this.scrollSoar) { // now scrolling.
            prevEntry = this.entrySelectionIterator.previous().item;
        }
        else {
            var entries = this.entrySelectionIterator.listElement;
            var currentEntry = this.currentViewingEntry();
            if (currentEntry) {
                this.entrySelectionIterator.current(currentEntry);
                if (currentEntry.offsetTop < entries.scrollTop) {
                    prevEntry = this.entrySelectionIterator.item;
                }
                else {
                    prevEntry = this.entrySelectionIterator.previous().item;
                }
            }
        }
        if (this.entrySelectionIterator.item == null) {
            prevEntry = this.entrySelectionIterator.current(this.entrySelectionIterator.listElement.firstChild).item;
        }
        if (prevEntry) {
            var self = this;
            this.scrollTo(prevEntry, function() { self.selectEntryItem(prevEntry); });
        }
    };
    NDR.prototype.selectEntryItem = function(item) {
        if (this.currentSelectedItem) this.currentSelectedItem.style.backgroundColor = '';
        this.currentSelectedItem = item;
        if (hasClass(this.entrySelectionIterator.item, 'ndr_entry')) this.currentSelectedItem.style.backgroundColor = '#E4F5FF';
    };
    NDR.prototype.unselectEntryItem = function() {
        if (this.currentSelectedItem) this.currentSelectedItem.style.backgroundColor = '';
        this.currentSelectedItem = null;
    };
    NDR.prototype.openOlderEntries = function() {
        var nextButton = document.getElementById('NDR_C_ENTRIES_NEXT');
        if (nextButton) nextButton.click();
    };
    NDR.prototype.openNewerEntries = function() {
        var prevButton = document.getElementById('NDR_C_ENTRIES_PREV');
        if (prevButton) prevButton.click();
    };
    NDR.prototype.selectFeedItemElement = function(element) {
        if (this.currenFeedItem) {
            this.currenFeedItem.style.color = '';
            this.currenFeedItem.style.backgroundColor = '';
        }
        this.currenFeedItem = element;
        this.currenFeedItem.style.color = 'white';
        this.currenFeedItem.style.backgroundColor = '#80A0DF';
    };
    NDR.prototype.selectNextFeed = function() {
        var current = this.feedSelectionIterator.item;
        this.feedSelectionIterator.next();
        while (this.feedSelectionIterator.item && this.feedSelectionIterator.item.offsetHeight == 0) {
            this.feedSelectionIterator.next();
        }
        this.feedSelectionIterator.isNullThenFirst();
        while (this.feedSelectionIterator.item && this.feedSelectionIterator.item !== current && this.feedSelectionIterator.item.offsetHeight == 0) {
            this.feedSelectionIterator.next();
        }
        if (this.feedSelectionIterator.item == null) return;
        this.openFeedItemFromElement(this.feedSelectionIterator.item);
    };
    NDR.prototype.selectPreviousFeed = function() {
        var current = this.feedSelectionIterator.item;
        this.feedSelectionIterator.previous();
        while (this.feedSelectionIterator.item && this.feedSelectionIterator.item.offsetHeight == 0) {
            this.feedSelectionIterator.previous();
        }
        this.feedSelectionIterator.isNullThenLast();
        while (this.feedSelectionIterator.item && this.feedSelectionIterator.item !== current && this.feedSelectionIterator.item.offsetHeight == 0) {
            this.feedSelectionIterator.previous();
        }
        if (this.feedSelectionIterator.item == null) return;
        this.openFeedItemFromElement(this.feedSelectionIterator.item);
    };
    NDR.prototype.scrollToFeedItemElement = function(element) {
        var container = document.getElementById('NDR_FEED_LISTS');
        container.scrollTop = Math.min(element.offsetTop - 30, container.scrollHeight - container.clientHeight);
    };
    NDR.prototype.openFeedItemFromElement = function(element) {
        this.selectFeedItemElement(element);
        this.scrollToFeedItemElement(element);
        this.openFeedItemFromElementLater(element);
    };
    NDR.prototype.openFeedItemFromElementLater = function(element) {
        this.timer.setTimeout('openFeedItem', function() {
            var evt = document.createEvent('MouseEvents');
            evt.initEvent('click', false, false);
            element.dispatchEvent(evt);
        }, 100);
    };
    NDR.prototype.setStatus = function(status, message) {
        var statusImg = document.getElementById('NDR_STATUS_IMAGE');
        var statusMsg = document.getElementById('NDR_STATUS_MESSAGE');
        if (status == 'loading') {
            statusImg.src = NDR_IMG_LOADING;
        }
        else if (status == 'complete') {
            statusImg.src = NDR_IMG_COMPLETE;
        }
        if (message) {
            statusMsg.textContent = message;
        }
    };
    NDR.prototype.importFeedList = function(feedList) {
        for (var i = 0; i < feedList.length; i++) {
            var item = feedList[i]; // deadly.
            if (typeof item == 'string') {
                item = { url: item };
            }
            var url = item.url;
            if (this.pref.feedList.indexOf(url) < 0) {
                this.pref.feedList.push(url);
                this.loadFeed(url);
            }
            delete item.url; // save memory.
            this.pref.feedInfo[url] = item; // overwrite if exists.
        }
    };
    NDR.prototype.importPreference = function(pref) {
        if (!pref) return;
        if (pref.feedList) {
            var list = pref.feedList;
            this.importFeedList(list);
        }
    };
    NDR.prototype.loadPreference = function(retry) {
        if (!this.pref.enableStorage) return false;
        if (this.timer.timeouts['loadPreference'] && retry == 0) return false;
        var count = (retry + 1) || 30;
        var self = this;
        function _loadPreference() {
            var jsonStr;
            try {
                var storage = document.getElementById('NDR_STORAGE');
                jsonStr = storage.getData();
            }
            catch(e) {
                if (--count > 0) {
                    self.timer.setTimeout('loadPreference', _loadPreference, 500);
                }
                return false;
            }
            var storePref = (jsonStr) ? eval('(' + jsonStr + ')') : null;
            self.importPreference(storePref);
            self._loadSucceeded = true;
            return true;
        }
        return _loadPreference();
    };
    NDR.prototype.storePreference = function() {
        if (!this._loadSucceeded) {
            throw 'storage has not been loaded.';
        }
        var storage = document.getElementById('NDR_STORAGE');
        if (!storage || !storage.setData) {
            throw 'storage is unavailable.';
        }
        var storePref = this.createStorePreference();
        var jsonStr = toJSON(storePref).replace(/\\u/g,'\\u005cu');
        storage.setData(jsonStr);
    };
    NDR.prototype.createStorePreference = function() {
        var pref = { 
            version : 1.0,
            feedList : []
        };
        var feedList = pref.feedList;
        var currentFeedList = this.pref.feedList;
        var currentFeedInfo = this.pref.feedInfo;
        for (var i = 0; i < currentFeedList.length; i++) {
            var url = currentFeedList[i];
            var feedItem = currentFeedInfo[url] || {};
            feedItem.url = url;
            feedList.push(feedItem);
        }
        return pref;
    };
    NDR.prototype.loadFeed = function(url) {
        var self = this;
        this.setStatus('loading');
        feedRequest(url, function(feedObj) {
            self.processFeedObj(feedObj);
            if (feedObj.status == 'ok') {
                // if not stored, store this feed.
                var list = self.pref.feedList;
                if (list.indexOf(url) < 0) {
                    self.pref.feedList.push(url);
                    self.pref.feedInfo[url] = { title: feedObj.title };
                    self.storePreference();
                }
            }
            else {
                var feedInfo = self.pref.feedInfo[url];
                feedObj.title = (feedInfo.otitle || feedInfo.title || url) + ' (' + feedObj.status + ')';
            }
            self.addFeedItem(feedObj);
        });
    };
    NDR.prototype.reloadFeed = function(url) {
        var self = this;
        feedRequest(url, function(feedObj) {
            self.processFeedObj(feedObj);
            self.replaceFeedItem(feedObj);
            var feedItem = self.feedMap.get(url).element;
            self.selectFeedItemElement(feedItem);
            self.scrollToFeedItemElement(feedItem);
            self.openFeed(feedObj);
        });
    };
    NDR.prototype.openTemporaryFeed = function(url) {
        var self = this;
        feedRequest(url, function(feedObj) {
            self.processFeedObj(feedObj);
            self.addTemporaryFeedItem(feedObj);
            self.selectFeedItemElement(self.tempFeedMap.get(url).element);
            self.openFeed(feedObj);
        });
    };
    NDR.prototype.reloadAllFeeds = function() {
        this.setStatus('loading', 'Loading');
        this.loadPreference(0);
        this.clearFeedItems();
        var list = this.pref.feedList;
        for (var i = 0; i < list.length; i++) {
            var url = list[i];
            if (!url) continue;
            this.loadFeed(url);
        }
        if (list.length == 0) {
            this.setStatus('complete', 'Loading completed.');
        }
    };
    NDR.prototype.refreshFeedList = function() {
        var feedMap = this.feedMap;
        this.clearFeedItems();
        var list = this.pref.feedList;
        for (var i = 0; i < list.length; i++) {
            var url = list[i];
            if (!url) continue;
            var feedObj = feedMap.get(url).feedObj;
            if (feedObj) {
                if (feedObj.status == 'ok') {
                    this.sortFeed(feedObj);
                    this.sortReadEntry(feedObj);
                    this.addFeedItem(feedObj);
                }
                else {
                    this.reloadFeed(url);
                }
            }
        }
    };
    NDR.prototype.clearFeedItems = function() {
        this.unreadMixItems = [];
        this.feedMap = new ListedKeyMap();
        var range = document.createRange();
        var list = document.getElementById('NDR_FEED_LIST');
        range.selectNodeContents(list);
        range.deleteContents();
        document.getElementById('NDR_UNREAD_FEED_COUNT').textContent = '0';
        document.getElementById('NDR_UNREAD_ENTRY_COUNT').textContent = '0';
    };
    NDR.prototype.processFeedObj = function(feedObj) {
        this.filterFeed(feedObj);
        this.decorateFeed(feedObj);
        this.sortFeed(feedObj);
        this.sortReadEntry(feedObj);
        return feedObj;
    };
    NDR.prototype.filterFeed = function(feedObj) {
        var items = feedObj.items;
        var newItems = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item.link.indexOf('http://www.nicovideo.jp/watch/') == 0) {
                newItems.push(item);
            }
        }
        feedObj.items = newItems;
    };
    NDR.prototype.decorateFeed = function(feedObj) {
        var items = feedObj.items;
        var feed = {
            title : feedObj.title,
            link  : feedObj.link,
            url   : feedObj.url
        };
        var lastDate = new Date(0);
        // attach feed info, convert date string to Date.
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            item.feed = feed;
            if (item.date) {
                var itemDate = parseDate(item.date);
                item.date = itemDate;
                if (itemDate > lastDate) {
                    lastDate = itemDate;
                }
            }
        }
        if (feedObj.date) {
            feedObj.date = parseDate(feedObj.date);
        }
        else if (lastDate != new Date(0)) {
            feedObj.date = lastDate;
        }
        // attach upload date (nicovideo RSS only)
        if (/http:\/\/www\.nicovideo\.jp\/.*\?rss/.test(feedObj.url)) {
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var upload = /\"nico-info-date\">(.*?)</.exec(item.description);
                if (upload) {
                    var d = upload[1].replace(/[^\d]+/g, ' ').split(' ');
                    item.upload = new Date(d[0], d[1]-1, d[2], d[3], d[4], d[5]);
                }
            }
        }
    };
    NDR.prototype.sortFeed = function(feedObj, order) {
        if (!order) {
            var feedInfo = this.pref.feedInfo[feedObj.url];
            if (feedInfo) {
                order = feedInfo.order;
            }
        }
        if (!order) return;
        if (order == 'entryDate') {
            feedObj.items.sort(function(a, b) { return (b.date || 0) - (a.date || 0) } );
        }
        else if (order == 'uploadDate') {
            feedObj.items.sort(function(a, b) { return (b.upload || 0) - (a.upload || 0) } );
        }
    };
    NDR.prototype.sortReadEntry = function(feedObj) {
        var items = feedObj.items;
        var readItems = [];
        var unreadItems = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (VisitUtil.isVisited(item.link)) {
                readItems.push(item);
            }
            else {
                unreadItems.push(item);
            }
        }
        feedObj.readItems = readItems;
        feedObj.unreadItems = unreadItems;
    }
    NDR.prototype.replaceFeedItem = function(feedObj) {
        var feedItem = this.feedMap.get(feedObj.url);
        if (feedItem) {
            feedItem.element.parentNode.removeChild(feedItem.element);
            this.feedMap.remove(feedObj.url);
        }
        this.addFeedItem(feedObj);
    };
    NDR.prototype.addFeedItem = function(feedObj) {
        var feedInfo = this.pref.feedInfo[feedObj.url] || {};
        var feedList = document.getElementById('NDR_FEED_LIST');
        var li = document.createElement('li');
        li.className = 'ndr_feed_item';
        if (feedInfo.otitle) {
            li.textContent = feedInfo.otitle;
        }
        else {
            li.textContent = feedObj.title;
        }
        if (feedObj.unreadItems && feedObj.unreadItems.length > 0) {
            li.innerHTML += '<span class="ndr_unread_count"> (' + feedObj.unreadItems.length + ')</span>';
            appendClass(li, 'ndr_unread_feed');
        }
        appendClass(li, this.getFeedItemClass(feedObj.link));
        
        var newFeedItem = { feedObj: feedObj, element: li };
        
        if (this.feedFilter) {
            if (!this.feedFilter.matches(newFeedItem)) {
                li.style.display = 'none';
            }
        }
        
        var added = false;
        if (feedObj.date) {
            for (var i = 0, len = this.feedMap.size(); i < len; i++) {
                var feedItem = this.feedMap.getAt(i);
                if (feedObj.date > (feedItem.feedObj.date || 0)) {
                    feedList.insertBefore(li, feedItem.element);
                    this.feedMap.insertAt( i, feedObj.url, newFeedItem );
                    added = true;
                    break;
                }
            }
        }
        if (!added) {
            feedList.appendChild(li);
            this.feedMap.add( feedObj.url, newFeedItem );
        }
        
        var self = this;
        li.addEventListener('click', function(e) {
            e.preventDefault();
            self.feedSelectionIterator.current(li);
            self.selectFeedItemElement(li);
            self.openFeed(feedObj);
        }, false);
        if (feedObj.unreadItems && feedObj.unreadItems.length > 0) {
            var unreadFeedCount = document.getElementById('NDR_UNREAD_FEED_COUNT');
            unreadFeedCount.textContent = Number(unreadFeedCount.textContent) + 1;
            var unreadEntryCount = document.getElementById('NDR_UNREAD_ENTRY_COUNT');
            unreadEntryCount.textContent = Number(unreadEntryCount.textContent) + feedObj.unreadItems.length;
        }
        if (feedObj.unreadItems) {
            this.unreadMixItems = this.unreadMixItems.concat(feedObj.unreadItems);
        }
        // loading completed.
        if (this.pref.feedList.length == this.feedSelectionIterator.count()) {
            this.setStatus('complete', 'Loading completed.');
        }
    };
    NDR.prototype.addTemporaryFeedItem = function(feedObj) {
        var feedList = document.getElementById('NDR_TEMPORARY_FEED_LIST');
        var li = document.createElement('li');
        li.className = 'ndr_feed_item';
        li.innerHTML = stripTag(feedObj.title);
        if (feedObj.unreadItems && feedObj.unreadItems.length > 0) {
            li.innerHTML += '<span class="ndr_unread_count"> (' + feedObj.unreadItems.length + ')</span>';
            appendClass(li, 'ndr_unread_feed');
        }
        if (this.tempFeedMap.has(feedObj.url)) {
            feedList.removeChild(this.tempFeedMap.get(feedObj.url).element);
            this.tempFeedMap.remove(feedObj.url);
        }
        this.tempFeedMap.add( feedObj.url, { feedObj: feedObj, element: li } );
        feedList.appendChild(li);
        var self = this;
        li.addEventListener('click', function(e) {
            e.preventDefault();
            self.selectFeedItemElement(li);
            self.openFeed(feedObj);
            removeClass(li, 'ndr_unread_feed');
        }, false);
        var delButton = document.createElement('button');
        delButton.textContent = '\u00D7';
        delButton.addEventListener('click', function(e) {
            e.stopPropagation();
            li.parentNode.removeChild(li);
            self.tempFeedMap.remove(feedObj.url);
        }, false);
        li.appendChild(delButton, li.firstChild);
    };
    NDR.prototype.getFeedItemClass = function(url) {
        if (!url) return "";
        if (/nicovideo\.jp/.test(url)) {
            return 'ndr_feed_origin_nico';
        }
        var m = /^([^/]*?\/\/)([^/]*)/.exec(url);
        if (!m) return "";
        var hostName = m[2];
        var className = this.faviconClass[hostName];
        if (className != null) return className;
        className = 'ndr_feed_origin_' + hostName.replace(/\./g, '_');
        this.faviconClass[hostName] = className;
        var favicon_url = m[1] + m[2] + '/favicon.ico';
        var styleStr = '.' + className + ' { background-image: url("' + favicon_url + '") !important; } ';
        var style = addStyle(styleStr);
        var favicon_img = new Image();
        var self = this;
        favicon_img.onerror = function(e) {
            self.faviconClass[hostName] = '';
            style.parentNode.removeChild(style);
        };
        favicon_img.src = favicon_url;
        return className;
    };
    NDR.prototype.createMixFeed = function() {
        var resultFeedObj = {
            title : 'MIX',
            description: '\u8CFC\u8AAD\u3057\u3066\u3044\u308B\u30D5\u30A3\u30FC\u30C9\u304B\u3089\u30E9\u30F3\u30C0\u30E0\u306B\u62BD\u51FA\u3057\u3066\u3044\u307E\u3059\u3002'
        };
        if (this.unreadMixItems.length == 0) {
            resultFeedObj.description = '\u672A\u8996\u8074\u306E\u52D5\u753B\u306F\u3042\u308A\u307E\u305B\u3093\u3002';
            return resultFeedObj;
        }
        var items = [];
        var dup = {};
        for (var i = 0; i < this.unreadMixItems.length; i++) {
            var item = this.unreadMixItems[i];
            if (!dup[item.link]) {
                var mixItem = {
                    title       : item.title,
                    link        : item.link,
                    description : '',
                    date        : item.date,
                    from        : [item.feed.url]
                }
                items.push(mixItem);
                dup[item.link] = mixItem;
            }
            else {
                if (dup[item.link].from.indexOf(item.feed.url) < 0) {
                    dup[item.link].from.push(item.feed.url);
                }
            }
        }
        resultFeedObj.items = randomPickout(items, this.pref.mixCount);
        resultFeedObj.unreadItems = resultFeedObj.items;
        return resultFeedObj;
    };
    NDR.prototype.createHistoryFeed = function() {
        var feedObj = {
            title : '\u6700\u8FD1\u898B\u305F\u52D5\u753B',
            link : 'http://www.nicovideo.jp/history',
            description: '',
            items : []
        };
        var items = feedObj.items;
        var cookie = document.cookie;
        var nicohistory = /nicohistory=[^;]+/.exec(cookie);
        if (!nicohistory) {
            feedObj.description = '\u5C65\u6B74\u306F\u3042\u308A\u307E\u305B\u3093\u3002';
            return feedObj;
        }
        var histories = decodeURIComponent(nicohistory[0].slice(12)).split(',');
        for (var i = 0; i < histories.length; i++) {
            var video_id = histories[i].split(':')[0];
            if (!video_id) continue;
            items.push({
                title: video_id,
                link: 'http://www.nicovideo.jp/watch/' + video_id,
                description: '',
                date: null
            });
        }
        return feedObj;
    };
    NDR.prototype.clearEntriesPanel = function() {
        this.timer.clearTimeout('openFeed');
        thumbnailInfo.cancelRequest();
        hatenaStar.cancelRequest();
        this.stopObserveScrollEntriesPanel();
        var range = document.createRange();
        var entriesPane = document.getElementById('NDR_ENTRIES');
        range.selectNodeContents(entriesPane);
        range.deleteContents();
        entriesPane.scrollTop = 0;
    };
    NDR.prototype.createFeedTitle = function(feedObj) {
        var feedInfo = this.pref.feedInfo[feedObj.url] || {};
        var title = (feedObj.link) ? '<a href="' + escAttr(feedObj.link) + '" target="_blank">' + stripTag(feedInfo.otitle || feedObj.title) + '</a>'
                                   : stripTag(feedInfo.otitle || feedObj.title);
        var head_html = [
            '<h2 class="ndr_title">' + title + '</h2>',
            '<h3 class="ndr_subtitle">' + this.makeNicoLinks(stripTag(feedObj.description)) + '</h3>',
            '<ul class="ndr_entry_menu">',
            feedObj.unreadItems ? ('    <li>\u65B0\u7740: ' + feedObj.unreadItems.length + ' entry</li>') : '',
            '    <li>\u5408\u8A08: ' + feedObj.items.length + ' entry</li>',
            '</ul>',
        ].join('');
        var range = document.createRange();
        var dv = document.createElement('div');
        dv.innerHTML =head_html;
        document.createDocumentFragment().appendChild(dv);
        range.selectNodeContents(dv);
        return range.extractContents();
    };
    NDR.prototype.createFeedControls = function(feedObj, showVisited) {
        var entryPageButtons = document.createElement('div');
        appendClass(entryPageButtons, 'ndr_page_button');
        var self = this;
        if (feedObj.readItems) {
            var reloadButton = document.createElement('button');
            reloadButton.id = 'NDR_C_ENTRIES_RELOAD';
            appendClass(reloadButton, 'ndr_reload_button');
            reloadButton.textContent = '\u66F4\u65B0';
            reloadButton.addEventListener('click', function(e) {
                self.reloadFeed(feedObj.url);
            }, false);
            entryPageButtons.appendChild(reloadButton);
            var prevButton = document.createElement('button');
            prevButton.id = 'NDR_C_ENTRIES_PREV';
            appendClass(prevButton, 'ndr_page_button');
            prevButton.textContent = '<';
            if (!showVisited) prevButton.setAttribute('disabled', 'disabled');
            prevButton.addEventListener('click', function(e) {
                self.openFeed(feedObj);
            }, false);
            entryPageButtons.appendChild(prevButton);
            var nextButton = document.createElement('button');
            nextButton.id = 'NDR_C_ENTRIES_NEXT';
            appendClass(nextButton, 'ndr_page_button');
            nextButton.textContent = '>';
            if (feedObj.readItems.length == 0 || showVisited) nextButton.setAttribute('disabled', 'disabled');
            nextButton.addEventListener('click', function(e) {
                self.openFeed(feedObj, true);
            }, false);
            entryPageButtons.appendChild(nextButton);
        }
        return entryPageButtons;
    };
    NDR.prototype.openFeed = function(feedObj, showVisited) {
        this.clearEntriesPanel();
        var entriesPane = document.getElementById('NDR_ENTRIES');
        entriesPane.appendChild(this.createFeedTitle(feedObj));
        entriesPane.appendChild(this.createFeedControls(feedObj, showVisited));
        
        var items = (showVisited ? feedObj.readItems : feedObj.unreadItems) || feedObj.items;
        if (items.length == 0 && feedObj.items.length > 0) {
            if (feedObj.readItems) items = [feedObj.readItems[0]];
            else                   items = [feedObj.items[0]];
        }
        if (showVisited && feedObj.unreadItems && feedObj.unreadItems.length == 0) {
            items = items.slice(1);
        }
        items = items.concat(); // clone.
        var regTrim = /^[\s]+|[\s]+$/g,
            regCRLF = /\r?\n/,
            regThum = /(http:\/\/tn-skr[0-9a-z]*\.smilevideo\.jp\/smile\?i=[\d]+)/,
            regV_ID = /[a-z]{0,2}[0-9]+(?=\?|$)/,
            regNumb = /\d+/;
            
        var accentPhrase = null;
        if (feedObj.option && feedObj.option.emphases) {
            var emphases = feedObj.option.emphases;
            var regEmphasis = new RegExp(emphases.join('|'), 'gi');
            accentPhrase = function(str) {
                return str.replace(regEmphasis, function(s) {
                    var index = emphases.indexOf(s);
                    if (index < 0 || index >= NDR_EMPHASIS_CLASSES.length) {
                        index = NDR_EMPHASIS_CLASSES.length - 1;
                    }
                    return '<span class="' + NDR_EMPHASIS_CLASSES[index] + '">' + s + '</span>'
                });
            };
        }
        else {
            accentPhrase = function(s) { return s; };
        }
        
        var self = this;
        var feedInfo = this.pref.feedInfo[feedObj.url] || {};
        var process = function(i) {
            var item = items[i];
            var buf = [];
            var dv = document.createElement('div');
            var className = 'ndr_entry';
            if (i % 2 == 1) className += ' ndr_entry_even';
            if (self.pinAdded(item.link)) className += ' ndr_entry_pin';
            dv.className = className;
            
            var video_id = regV_ID.exec(item.link)[0];
            buf.push('<div class="ndr_entry_controls">');
            buf.push('    <button class="ndr_clip" title="\u30DE\u30A4\u30EA\u30B9\u30C8\u306B\u8FFD\u52A0"><span class="ndr_opera_icon"></span></button>');
            buf.push('    <button class="ndr_pin" title="\u30D4\u30F3\u3092\u7ACB\u3066\u308B"><span class="ndr_opera_icon"></span></button>');
            buf.push('    <button class="ndr_mark_as_read" title="\u65E2\u8AAD\u306B\u3059\u308B"><span class="ndr_opera_icon"></span></button>');
            buf.push('</div>');
            buf.push('<h4>');
            buf.push('<a href="' + escAttr(item.link) + '" target="_blank">' + accentPhrase(stripTag(item.title || video_id)) + '</a>');
            buf.push('</h4>');
            var thumbnailURL = item.image || (regThum.exec(item.description) ? RegExp.$1 : null);
            if (!thumbnailURL) {
                thumbnailURL = 'http://tn-skr2.smilevideo.jp/smile?i=' + regNumb.exec(video_id)[0];
            }
            buf.push('<p class="ndr_entry_thumbnail">');
            buf.push('<a href="' + escAttr(item.link) + '" target="_blank"><img src="' + escAttr(thumbnailURL) + '" class="ndr_entry_thumbnail" width="130" height="100" alt="' + escAttr(item.title) + '"></a>');
            if (self.pref.enableHatenaBookmark) buf.push('<a href="http://b.hatena.ne.jp/entry/' + escAttr(item.link) + '" target="_blank"><img src="http://b.hatena.ne.jp/entry/image/normal/' + escAttr(item.link) + '" height="13" alt=""></a><br>');
            if (self.pref.enableHatenaStar) buf.push('<span class="ndr_hstar"></span>');
            if (item.from) {
                buf.push('<br>from :');
                for (var j = 0; j < item.from.length; j++) {
                    buf.push('<br>');
                    var feedItem = self.feedMap.get(item.from[j]);
                    if (feedItem && feedItem.feedObj) {
                        buf.push('<a class="ndr_select_feed" href="' +  escAttr(feedItem.feedObj.link) + '" target="_blank" rel="nofollow">' + stripTag(feedItem.feedObj.title) + '</a>');
                    }
                    else {
                        buf.push(stripTag(item.from[j]));
                    }
                }
            }
            buf.push('</p>');

            var desc_html = self.makeNicoLinks(accentPhrase(stripTag(item.description).replace(regTrim, '')).split(regCRLF).join('<br>'));
            buf.push('<p>' + desc_html + '</p>');
            buf.push('<p class="ndr_entry_footer">\u6295\u7A3F: ' + (item.date ? formatDate(item.date) : '') + ' | </p>');
            dv.innerHTML = buf.join('');
            
            dv.addEventListener('click', function(e) {
                if (/^(?:a|input|button|img)$/i.test(e.target.nodeName)) return;
                if (dv != self.currentSelectedItem) {
                    self.entrySelectionIterator.current(dv);
                    self.selectEntryItem(dv);
                }
                else {
                    self.entrySelectionIterator.current(null);
                    self.unselectEntryItem(dv);
                }
            }, false);
            
            // ndr_entry_controls functions.
            (function() {
                var mylistPanel = null;
                function clipToggle() {
                    if (!hasClass(dv, 'ndr_entry_clip')) {
                        if (!mylistPanel) {
                            mylistPanel = self.createMylistPanel();
                            if (!mylistPanel) return;
                            var s = mylistPanel.getElementsByTagName('select')[0];
                            var b = mylistPanel.getElementsByTagName('input')[0];
                            mylistPanel.addEventListener('click', function(e) {
                                e.stopPropagation();
                            }, false);
                            b.addEventListener('click', function(e) {
                                nicoMylist.add(video_id, s.value);
                                removeClass(dv, 'ndr_entry_clip');
                            }, false);
                            var entry_title = dv.getElementsByTagName('h4')[0];
                            entry_title.parentNode.insertBefore(mylistPanel, entry_title.nextSibling);
                        }
                        appendClass(dv, 'ndr_entry_clip');
                    }
                    else {
                        removeClass(dv, 'ndr_entry_clip');
                    }
                }
                var mousedownOccurred = false;
                var clipButton = dv.getElementsByClassName('ndr_clip')[0];
                clipButton.addEventListener('mousedown', function(e) {
                    clipToggle();
                    mousedownOccurred = true;
                }, false);
                // for Spacial Navigation.
                clipButton.addEventListener('click', function(e) {
                    if (!mousedownOccurred) clipToggle();
                    mousedownOccurred = false;
                }, false);
            })();
            (function() {
                function pinToggle() {
                    if (!hasClass(dv, 'ndr_entry_pin')) {
                        appendClass(dv, 'ndr_entry_pin');
                        self.pinAdd(item.link, item.title);
                    }
                    else {
                        removeClass(dv, 'ndr_entry_pin');
                        self.pinRemove(item.link);
                    }
                }
                var mousedownOccurred = false;
                var pinButton = dv.getElementsByClassName('ndr_pin')[0];
                pinButton.addEventListener('mousedown', function() {
                    pinToggle();
                    mousedownOccurred = true;
                }, false);
                pinButton.addEventListener('click', function() {
                    if (!mousedownOccurred) pinToggle();
                    mousedownOccurred = false;
                }, false);
            })();
            (function() {
                function markAsRead() {
                    if (!showVisited) {
                        if (!VisitUtil.isVisited(item.link)) VisitUtil.pseudoVisit(item.link);
                        if (feedObj.unreadItems) {
                            var myIndex = feedObj.unreadItems.indexOf(item);
                            if (myIndex >= 0) {
                                feedObj.unreadItems.splice(myIndex, 1);
                                if (!feedObj.readItems) feedObj.readItems = [];
                                feedObj.readItems.unshift(item);
                            }
                        }
                        if (dv.parentNode) dv.parentNode.removeChild(dv);
                        var nextButton = document.getElementById('NDR_C_ENTRIES_NEXT');
                        if (nextButton   ) nextButton.removeAttribute('disabled');
                    }
                }
                var markAsReadButton = dv.getElementsByClassName('ndr_mark_as_read')[0];
                markAsReadButton.addEventListener('click', markAsRead, false);
            })();
            
            if (self.pref.enableHatenaStar) {
                var starPlace = dv.getElementsByClassName('ndr_hstar')[0];
                var starRequest = { uri: item.link, title: item.title, place: starPlace };
                hatenaStar.register(starRequest);
            }
            // if item's description is null then load thumbnail info.
            if (feedInfo.thumb == 'always' || ((feedInfo.thumb == null || feedInfo.thumb == 'necessary') && !item.description)) {
                thumbnailInfo.getThumbnailInfo(item.link, function(thumb_info) {
                    if (thumb_info.timeout) {
                        var info = document.createElement('p');
                        info.textContent = '\u901A\u4FE1\u3092\u4E2D\u65AD\u3057\u307E\u3057\u305F\u3002';
                        dv.insertBefore(info, dv.lastChild);
                        return;
                    }
                    items[i] = thumb_info;
                    item = thumb_info;
                    if (typeof starRequest != 'undefined') starRequest.title = thumb_info.title;
                    dv.getElementsByTagName('h4')[0].innerHTML = '<a href="' + escAttr(thumb_info.link) + '" target="_blank">' + stripTag(thumb_info.title) + '</a>';
                    var thumbnail = dv.getElementsByTagName('img')[0];
                    if (thumb_info.image) thumbnail.src = thumb_info.image;
                    thumbnail.setAttribute('alt', thumb_info.title);
                    if (thumb_info.status == 'ok') {
                        dv.lastChild.previousSibling.innerHTML = [
                            formatLength(thumb_info.length) + '<br>',
                            '\u518D\u751F\uFF1A' + formatNumber(thumb_info.view) + '<br>',
                            '\u30B3\u30E1\u30F3\u30C8\uFF1A' + formatNumber(thumb_info.comment) + '<br>',
                            '\u30DE\u30A4\u30EA\u30B9\u30C8\uFF1A' + formatNumber(thumb_info.mylist) + '<br>',
                        ].join('');
                        var p = document.createElement('p');
                        p.innerHTML = self.makeNicoLinks(stripTag(thumb_info.description));
                        dv.insertBefore(p, dv.lastChild);
                        var res = document.createElement('p');
                        appendClass(res, 'ndr_thumb_res');
                        res.innerHTML = thumb_info.response;
                        dv.insertBefore(res, dv.lastChild);
                        dv.lastChild.innerHTML = '\u6295\u7A3F: ' + formatDate(parseDate(thumb_info.date)) + ' | ';
                    }
                    else {
                        var info = document.createElement('p');
                        info.textContent = '\u52D5\u753B\u60C5\u5831\u306E\u53D6\u5F97\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002 (' + thumb_info.code + ') ';
                        dv.insertBefore(info, dv.lastChild);
                    }
                });
            }
            return dv;
        };
        var df = document.createDocumentFragment();
        for (var i = 0; i < 5 && i < items.length; i++) {
            df.appendChild(process(i));
        }
        entriesPane.appendChild(df);
        if (i < items.length) {
            var remainsContainer = document.createElement('div');
            var remainsDesc = document.createElement('p');
            remainsContainer.appendChild(remainsDesc);
            var remainsLinks = document.createElement('p');
            remainsLinks.style.display = 'none';
            entriesPane.appendChild(remainsContainer);
            
            var defferFuncs = [];
            this.timer.setTimeout('openFeed', function() {
                var buf = [];
                for (var ii = i; ii < items.length; ii++) {
                    var item = items[ii];
                    buf.push('<a href="' + escAttr(item.link) + '" id="NDR_TMP_ENTRY_' + ii + '">' + stripTag(item.title) + '</a>');
                    defferFuncs.push((function(index) {
                        return function() {
                            var ddv = process(index);
                            var entry = document.getElementById('NDR_TMP_ENTRY_' + index);
                            entry.parentNode.removeChild(entry);
                            return ddv;
                        }
                    })(ii));
                }
                remainsLinks.innerHTML = buf.join('');
                remainsContainer.appendChild(remainsLinks);
                remainsDesc.textContent = 'more ' + remainsLinks.getElementsByTagName('a').length + ' entries.';
                next();
            }, 1000);
            function next() {
                self.startObserveScrollEntriesPanel(function() {
                    var ddf = document.createDocumentFragment();
                    var len = Math.min(self.pref.loadCount, defferFuncs.length);
                    for (var j = 0; j < len; j++) {
                        ddf.appendChild(defferFuncs[j]());
                    }
                    entriesPane.insertBefore(ddf, remainsContainer);
                    defferFuncs.splice(0, len);
                    if (defferFuncs.length > 0) {
                        remainsDesc.textContent = 'more ' + remainsLinks.getElementsByTagName('a').length + ' entries.';
                    }
                    else {
                        entriesPane.removeChild(remainsContainer);
                        self.stopObserveScrollEntriesPanel();
                    }
                });
            }
        }
    };
    NDR.prototype.startObserveScrollEntriesPanel = function(func) {
        this.stopObserveScrollEntriesPanel();
        var entriesPane = document.getElementById('NDR_ENTRIES');
        var self = this;
        entriesPane.addEventListener('scroll', this.scrollObserverEntriesPanel = function() {
            self.timer.clearTimeout('scrollEntriesPanelFunc');
            if (self.wellScrolledEntriesPanel()) {
                self.timer.setTimeout('scrollEntriesPanelFunc', function() {
                    if (self.wellScrolledEntriesPanel()) func();
                }, 500);
            }
        }, false);
        this.scrollObserverEntriesPanel(); // first execute.
    };
    NDR.prototype.stopObserveScrollEntriesPanel = function() {
        this.timer.clearTimeout('scrollEntriesPanelFunc');
        if (this.scrollObserverEntriesPanel) {
            var entriesPane = document.getElementById('NDR_ENTRIES');
            entriesPane.removeEventListener('scroll', this.scrollObserverEntriesPanel, false);
            delete this.scrollObserverEntriesPanel;
        }
    };
    NDR.prototype.wellScrolledEntriesPanel = function() {
        var entriesPane = document.getElementById('NDR_ENTRIES');
        var scrollTop = entriesPane.scrollTop;
        var scrollHeight = entriesPane.scrollHeight;
        var clientHeight = entriesPane.clientHeight;
        return scrollTop > (scrollHeight - clientHeight - clientHeight*2);
    };
    NDR.prototype.blockUI = function(content) { // (ref:jQuery blockUI plugin)
        this.platform.changeMode('blockUI');
        
        // if already blocking, replace content and return;
        if (this.uiBlocker) {
            if (this.uiBlocker.content) this.uiBlocker.content.parentNode.removeChild(this.uiBlocker.content);
            this.uiBlocker.content = setContent(content);
            return;
        }
        
        function setContent(content) {
            if (!content || typeof content == 'string') {
                var message = content || '';
                content = document.createElement('p');
                content.style.cssText = 'color: white; font-size: 18px; text-align: center; max-width: 60%;';
                content.textContent = message;
            }
            if (content) {
                content.style.position = 'absolute';
                content.style.zIndex = '1001';
                content.style.visibility = 'hidden';
                content.style.left = '50%';
                content.style.top = '40%';
                document.body.appendChild(content);
                content.style.marginLeft = -(content.offsetWidth/2) + 'px';
                content.style.marginTop  = -(content.offsetHeight/2) + 'px';
                content.style.visibility = '';
                content.addEventListener('mousedown', function(e) {
                    var inputs = evaluate('descendant::*[self::input or self::select or self::button or self::textarea]', content);
                    if (inputs.indexOf(e.target) < 0) {
                        e.preventDefault();
                    }
                }, false);
            }
            return content;
        }
        
        var uiBlocker = this.uiBlocker = {
            preActive : document.activeElement
        };
        var self = this;
        var background = uiBlocker.background = document.createElement('div');
        background.style.cssText = 'width: 100%; height: 100%; position: absolute; top: 0; left: 0; z-index: 1000; background-color: #000; opacity: .3;';
        background.addEventListener('mousedown', function(e) { e.preventDefault() }, false);
        background.addEventListener('dblclick', function(e) { self.unblockUI() }, false);
        document.body.appendChild(background);
        var dummy = document.createElement('input');
        dummy.style.cssText = 'visibility: hidden; width: 0; height: 0;';
        background.appendChild(dummy);
        dummy.focus();
        
        uiBlocker.content = setContent(content);
        if (uiBlocker.content) {
            var inputs = evaluate('descendant::*[self::input or self::select or self::button or self::textarea]', uiBlocker.content);
            if (inputs.length > 0) {
                this.timer.setTimeout('focus', function() { inputs[0].focus(); }, 0);
            }
        }
        uiBlocker.handler = function(e) {
            if (e.keyCode == 27) { // Esc
                self.unblockUI();
            }
            else if (e.keyCode == 9) { // Tab
                var inputs = evaluate('descendant::*[self::input or self::select or self::button or self::textarea]', uiBlocker.content); // for dynamic change.
                if (inputs.length == 0) {
                    e.preventDefault();
                }
                else if (inputs.indexOf(e.target) < 0) {
                    e.preventDefault();
                    inputs[0].focus();
                }
                else if (e.target == inputs[0] && e.shiftKey) {
                    e.preventDefault();
                    inputs[inputs.length -1].focus();
                }
                else if (e.target == inputs[inputs.length -1] && !e.shiftKey) {
                    e.preventDefault();
                    inputs[0].focus();
                }
            }
        }
        window.addEventListener('keypress', uiBlocker.handler, false);
    };
    NDR.prototype.unblockUI = function() {
        this.platform.clearMode();
        var uiBlocker = this.uiBlocker;
        if (!uiBlocker) return;
        window.removeEventListener('keypress', uiBlocker.handler, false);
        uiBlocker.background.parentNode.removeChild(uiBlocker.background);
        if (uiBlocker.content) uiBlocker.content.parentNode.removeChild(uiBlocker.content);
        //if (uiBlocker.preActive) this.timer.setTimeout('focus', function(){ uiBlocker.preActive.focus() }, 0);
        delete this.uiBlocker;
    };
    NDR.prototype.hasSubscribed = function(url) {
        return this.pref.feedList.indexOf(url) >= 0;
    };
    NDR.prototype.addFeedURL = function(p_url) {
        if (p_url && this.hasSubscribed(p_url)) {
            alert(lang.HAS_SUBSCRIBED);
            return;
        }
        if (!this.loadPreference(0)) {
            alert('\u30B9\u30C8\u30EC\u30FC\u30B8\u304C\u8AAD\u307F\u8FBC\u307E\u308C\u3066\u3044\u306A\u3044\u305F\u3081\u3001\u5229\u7528\u3067\u304D\u307E\u305B\u3093\u3002');
            return;
        }
        this.blockUI(this.createFeedUriInputPanel(p_url));
    };
    // respect Remedie.
    NDR.prototype.createFeedUriInputPanel = function(p_url) {
        var feedInputPanel = document.createElement('div');
        feedInputPanel.className = 'ndr_feed_input_pane';
        feedInputPanel.innerHTML = [
            '<form action="javascript:void(0)">',
            '<p>\u8CFC\u8AAD\u3059\u308B\u30DA\u30FC\u30B8\uFF08\u307E\u305F\u306F\u30D5\u30A3\u30FC\u30C9\uFF09\u306EURL\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002</p>',
            '<p><input type="url" name="feed_url" class="ndr_feed_url" value="' + (p_url || '') + '"></p>',
            '<p><input type="checkbox" name="discovery_skip" id="NDR_AUTO_DISCOVERY_SKIP_CHECK"><label for="NDR_AUTO_DISCOVERY_SKIP_CHECK">RSS\u30D5\u30A3\u30FC\u30C9\u3092\u63A2\u3055\u305A\u306B\u3053\u306EURL\u3092\u8CFC\u8AAD\u3059\u308B</label></p>',
            '<p class="ndr_message"></p>',
            // TODO: OPML import.
            '<p class="ndr_feed_input_import" style="display:none"><input type="button" name="opml_import" value="OPML\u3092\u30A4\u30F3\u30DD\u30FC\u30C8"></p>',
            '<p class="ndr_feed_input_submit"><input type="submit" value="\u8CFC\u8AAD\u3059\u308B"><input type="button" name="cancel" class="ndr_button_cancel" value="\u30AD\u30E3\u30F3\u30BB\u30EB"></p>',
            '</form>',
        ].join('');
        var self = this;
        var form = feedInputPanel.getElementsByTagName('form')[0];
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            var url = form.feed_url.value;
            var message = form.getElementsByClassName('ndr_message')[0];
            if (!/https?:\/\/.+/.test(url)) {
                message.textContent = 'http\u0020\u304B\u3089\u59CB\u307E\u308B\u0020URL\u0020\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002';
                return;
            }
            else if (self.hasSubscribed(url)) {
                message.textContent = lang.HAS_SUBSCRIBED;
                return;
            }
            else {
                message.textContent = '';
            }
            self.blockUI('\u8AAD\u307F\u8FBC\u307F\u4E2D');
            if (form.discovery_skip.checked) {
                feedRequest(url, function(feedObj) {
                    self.confirmRegisterFeedProcess(feedObj);
                });
            }
            else {
                self.rssAutoDiscoveryProcess(url);
            }
        }, false);
        var cancelButton = form.cancel;
        cancelButton.addEventListener('click', function(e) {
            self.unblockUI();
        }, false);
        return feedInputPanel;
    };
    NDR.prototype.rssAutoDiscoveryProcess = function(url) {
        var self = this;
        httpRequest(url, function(xhr) {
            if (xhr.readyState < 4) { // timeout.
                alert('\u63A5\u7D9A\u304C\u30BF\u30A4\u30E0\u30A2\u30A6\u30C8\u3057\u307E\u3057\u305F\u3002');
                self.unblockUI();
                return;
            }
            if (xhr.responseText == '') {
                alert('\u6307\u5B9A\u3055\u308C\u305FURL\u304B\u3089\u60C5\u5831\u3092\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002');
                self.unblockUI();
                return;
            }
            var str = xhr.responseText;
            var responseDocument = null;
            if (/^\s*<\?xml/.test(str)) {
                var xmlDocument = new DOMParser().parseFromString(str, 'application/xml');
                if (xmlDocument.documentElement.nodeName != 'parsererror') {
                    responseDocument = xmlDocument;
                }
            }
            if (responseDocument == null) {
                var doc = document.implementation.createHTMLDocument('');
                var range = doc.createRange();
                range.selectNodeContents(doc.documentElement);
                range.deleteContents();
                range.insertNode(range.createContextualFragment(str));
                responseDocument = doc;
            }
            if (isFeedDocument(responseDocument)) {
                var feedObj = parseFeedObjectFromDocument(responseDocument);
                feedObj.url = url;
                feedObj.status = 'ok';
                if (!feedObj.link) feedObj.link = url;
                self.confirmRegisterFeedProcess(feedObj);
            }
            else {
                // http://d.hatena.ne.jp/amachang/20080808/1218171377
                var xpath = '/x:html/x:head/x:link[contains(concat(" ", @rel, " "), " alternate ") and (@type="application/x.atom+xml" or @type="application/atom+xml" or @type="application/xml" or @type="text/xml" or @type="application/rss+xml" or @type="application/rdf+xml")]';
                if (!responseDocument.documentElement.namespaceURI) xpath = xpath.replace(/x:/g, '');
                var items = responseDocument.evaluate(xpath, responseDocument, function(prefix) { return responseDocument.documentElement.namespaceURI }, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                // http://blog.fkoji.com/2009/01130110.html
                var rss, rdf, atom, xml;
                for (var i = 0; i < items.snapshotLength; i++) {
                    var item = items.snapshotItem(i);
                    var type = item.getAttribute('type');
                    var href = item.getAttribute('href');
                    if      (/rss/.test(type))  rss  = href;
                    else if (/rdf/.test(type))  rdf  = href;
                    else if (/atom/.test(type)) atom = href;
                    else                        xml  = href;
                }
                var feedURL = rss || rdf || atom || xml;
                if (!feedURL) {
                    if (confirm('RSS\u30D5\u30A3\u30FC\u30C9\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u3053\u306E\u30DA\u30FC\u30B8\u3092\u30D5\u30A3\u30FC\u30C9\u3068\u3057\u3066\u8CFC\u8AAD\u3057\u307E\u3059\u304B\uFF1F')){
                        if (self.hasSubscribed(feedURL)) {
                            alert(lang.HAS_SUBSCRIBED);
                            self.unblockUI();
                            return;
                        }
                        var feedObj = parseFeedObjectFromDocument(responseDocument);
                        feedObj.url = url;
                        feedObj.status = 'ok';
                        if (!feedObj.link) feedObj.link = url;
                        self.confirmRegisterFeedProcess(feedObj);
                        return;
                    }
                    else {
                        self.unblockUI();
                        return;
                    }
                }
                var base = responseDocument.getElementsByTagNameNS(responseDocument.namespaceURI , 'base');
                var baseURL = (base && base.href) || url;
                feedURL = getAbsoluteURL(feedURL, baseURL);
                if (self.hasSubscribed(feedURL)) {
                    alert(lang.HAS_SUBSCRIBED);
                    self.unblockUI();
                    return;
                }
                feedRequest(feedURL, function(feedObj) {
                    self.confirmRegisterFeedProcess(feedObj);
                });
            }
        });
    };
    NDR.prototype.confirmRegisterFeedProcess = function(feedObj) {
        if (feedObj.status != 'ok') {
            alert('\u30D5\u30A3\u30FC\u30C9\u306E\u8AAD\u307F\u8FBC\u307F\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\n' + feedObj.description);
            this.unblockUI();
            return;
        }
        this.blockUI(this.createFeedEditorPanel(feedObj));
    };
    NDR.prototype.createFeedEditorPanel = function(feedObj) {
        var feedEditorPanel = document.createElement('div');
        feedEditorPanel.className = 'ndr_feed_input_pane ndr_feed_editor';
        var tmp_id = "NDR_TMP_" + (new Date() * Math.random() | 0);
        var feedItemClass = this.getFeedItemClass(feedObj.url);
        feedEditorPanel.innerHTML = [
            '<form action="javascript:void(0)">',
            '<table>'
            '<tr><td>\u30BF\u30A4\u30C8\u30EB</td><td><input type="text" class="ndr_feed_title ' + feedItemClass + '" size="80" value="' + escAttr(feedObj.otitle || feedObj.title) + '"></td></tr>',
            '<tr><td></td><td><input type="checkbox" class="ndr_feed_title_check" id="' + tmp_id + 'TI"' + (feedObj.otitle ? ' checked' : '') + '><label for="' + tmp_id + 'TI">\u81EA\u5206\u3067\u3064\u3051\u305F\u30BF\u30A4\u30C8\u30EB\u3092\u4F7F\u3046</label></td></tr>',
            '<tr><td>\u30A2\u30C9\u30EC\u30B9</td><td><span class="ndr_feed_address">' + stripTag(feedObj.url) + '</span></td></tr>',
            '<tr><td>\u4E26\u3073\u9806</td>',
            '<td><select class="ndr_feed_order">',
            '<option value="entryOrder">\u30A8\u30F3\u30C8\u30EA\u30FC\u9806\uFF08\u30C7\u30D5\u30A9\u30EB\u30C8\uFF09</option>',
            '<option value="entryDate">\u30A8\u30F3\u30C8\u30EA\u30FC\u306E\u65E5\u4ED8\u9806</option>',
            '<option value="uploadDate">\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u9806\uFF08\u30CB\u30B3\u30CB\u30B3\u52D5\u753B\u306ERSS\u3067\u306E\u307F\u6709\u52B9\u3067\u3059\uFF09</option>',
            '</select></td></tr>',
            '<tr><td>\u30B5\u30E0\u30CD\u30A4\u30EB\u60C5\u5831</td>',
            '<td><select class="ndr_feed_thumb">',
            '<option value="always">\u5E38\u306B\u53D6\u5F97\u3059\u308B</option>',
            '<option value="necessary" selected>\u8AAC\u660E\u6587\u304C\u7121\u3044\u3068\u304D\u3060\u3051\u53D6\u5F97\u3059\u308B\uFF08\u30C7\u30D5\u30A9\u30EB\u30C8\uFF09</option>',
            '<option value="never">\u53D6\u5F97\u3057\u306A\u3044</option>',
            '</select></td></tr>',
            '</table>'
            '<p class="ndr_feed_input_submit"><input type="submit" value="\u8CFC\u8AAD\u3059\u308B"><input type="button" name="cancel" class="ndr_button_cancel" value="\u30AD\u30E3\u30F3\u30BB\u30EB"></p>',
            '</form>',
        ].join('');
        var self = this;
        var form = feedEditorPanel.getElementsByTagName('form')[0];
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            self.pref.feedList.push(feedObj.url);
            self.pref.feedInfo[feedObj.url] = self.createFeedInfoFromFeedEditPanel(feedObj.url, feedEditorPanel);
            self.storePreference();
            self.processFeedObj(feedObj);
            self.addFeedItem(feedObj);
            self.openFeed(feedObj);
            self.unblockUI();
        }, false);
        var cancelButton = form.cancel;
        cancelButton.addEventListener('click', function(e) {
            self.unblockUI();
        }, false);
        return feedEditorPanel;
    };
    NDR.prototype.openFeedEdit = function() {
        if (!this.loadPreference(0)) {
            alert('\u30B9\u30C8\u30EC\u30FC\u30B8\u304C\u8AAD\u307F\u8FBC\u307E\u308C\u3066\u3044\u306A\u3044\u305F\u3081\u3001\u5229\u7528\u3067\u304D\u307E\u305B\u3093\u3002');
            return;
        }
        this.clearEntriesPanel();
        var dv = document.createElement('div');
        dv.innerHTML = [
            '<h2 class="ndr_title">\u30A2\u30A4\u30C6\u30E0\u306E\u7DE8\u96C6</h2>',
            '<ul class="ndr_entry_menu">',
            '    <li></li>',
            '</ul>',
            '<div class="ndr_entry"></div>'
        ].join('');
        var entry = dv.lastChild;
        
        var controls1 = document.createElement('p');
        appendClass(controls1, 'ndr_feed_edit_controls');
        controls1.innerHTML = '<button class="ndr_feededit_save">\u4FDD\u5B58\u3059\u308B</button>';
        var controls2 = controls1.cloneNode(true);
        
        entry.appendChild(controls1);
        
        var feedEditList = document.createElement('ul');
        appendClass(feedEditList, 'ndr_feed_edit_list');
        var editorList = [];
        var list = this.pref.feedList;
        for (var i = 0; i < list.length; i++) {
            var li = document.createElement('li');
            var url = list[i];
            var feedEditPanel = this.createFeedEditPanel(url);
            li.appendChild(feedEditPanel);
            feedEditList.appendChild(li);
            editorList.push({ url: url, editor: feedEditPanel});
        }
        entry.appendChild(feedEditList);
        
        entry.appendChild(controls2);
        
        var self = this;
        function save() {
            var newList = [];
            var newInfo = {};
            for (var i = 0; i < editorList.length; i++) {
                var item = editorList[i];
                var info = self.createFeedInfoFromFeedEditPanel(item.url, item.editor);
                if (info) {
                    newList.push(item.url);
                    newInfo[item.url] = info;
                }
            }
            self.pref.feedList = newList;
            self.pref.feedInfo = newInfo;
            self.storePreference();
            self.refreshFeedList();
            self.openFeedEdit();
        }
        var save1 = controls1.getElementsByClassName('ndr_feededit_save')[0];
        var save2 = controls2.getElementsByClassName('ndr_feededit_save')[0];
        save1.addEventListener('click', save, false);
        save2.addEventListener('click', save, false);
        
        var range = document.createRange();
        var entriesPane = document.getElementById('NDR_ENTRIES');
        document.createDocumentFragment().appendChild(dv);
        range.selectNodeContents(dv);
        entriesPane.appendChild(range.extractContents());
    };
    NDR.prototype.createFeedEditPanel = function(url) {
        var feedInfo = this.pref.feedInfo[url];
        var feedItem = this.feedMap.get(url);
        var feedObj = feedItem ? feedItem.feedObj : {};
        var tmp_id = "NDR_TMP_" + (new Date() * Math.random() | 0);
        var feedItemClass = this.getFeedItemClass(url);
        
        var feedPanel = document.createElement('div');
        appendClass(feedPanel, 'ndr_feededit_pane');
        feedPanel.innerHTML = [
            '<p class="ndr_feed_del_checker"><input type="checkbox" class="ndr_feed_del_check" id="' + tmp_id + 'DEL"><label for="' + tmp_id + 'DEL">\u524A\u9664\u3059\u308B</label></p>',
            '<table>'
            '<tr><td>\u30BF\u30A4\u30C8\u30EB</td><td><input type="text" class="ndr_feed_title ' + feedItemClass + '" size="80"></td></tr>',
            '<tr><td></td><td><input type="checkbox" class="ndr_feed_title_check" id="' + tmp_id + 'TI"><label for="' + tmp_id + 'TI">\u81EA\u5206\u3067\u3064\u3051\u305F\u30BF\u30A4\u30C8\u30EB\u3092\u4F7F\u3046</label></td></tr>',
            '<tr><td>\u30A2\u30C9\u30EC\u30B9</td><td><span class="ndr_feed_address"></span></td></tr>',
            '<tr><td>\u4E26\u3073\u9806</td>',
            '<td><select class="ndr_feed_order">',
            '<option value="entryOrder">\u30A8\u30F3\u30C8\u30EA\u30FC\u9806\uFF08\u30C7\u30D5\u30A9\u30EB\u30C8\uFF09</option>',
            '<option value="entryDate">\u30A8\u30F3\u30C8\u30EA\u30FC\u306E\u65E5\u4ED8\u9806</option>',
            '<option value="uploadDate">\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u9806\uFF08\u30CB\u30B3\u30CB\u30B3\u52D5\u753B\u306ERSS\u3067\u306E\u307F\u6709\u52B9\u3067\u3059\uFF09</option>',
            '</select></td></tr>',
            '<tr><td>\u30B5\u30E0\u30CD\u30A4\u30EB\u60C5\u5831</td>',
            '<td><select class="ndr_feed_thumb">',
            '<option value="always">\u5E38\u306B\u53D6\u5F97\u3059\u308B</option>',
            '<option value="necessary" selected>\u8AAC\u660E\u6587\u304C\u7121\u3044\u3068\u304D\u3060\u3051\u53D6\u5F97\u3059\u308B\uFF08\u30C7\u30D5\u30A9\u30EB\u30C8\uFF09</option>',
            '<option value="never">\u53D6\u5F97\u3057\u306A\u3044</option>',
            '</select></td></tr>',
            '</table>'
        ].join('');
        
        var feed_del_check = feedPanel.getElementsByClassName('ndr_feed_del_check')[0];
        feed_del_check.addEventListener('click', function() {
            feedPanel.style.backgroundColor = (feed_del_check.checked) ? 'lightgray' : '';
        }, false);
        var feed_title = feedPanel.getElementsByClassName('ndr_feed_title')[0];
        if (feedInfo.otitle) feed_title.value = feedInfo.otitle;
        else                 feed_title.value = feedInfo.title || feedObj.title || url;
        var feed_title_check = feedPanel.getElementsByClassName('ndr_feed_title_check')[0];
        if (feedInfo.otitle) feed_title_check.checked = true;
        var feed_address = feedPanel.getElementsByClassName('ndr_feed_address')[0];
        feed_address.textContent = url;
        var feed_order = feedPanel.getElementsByClassName('ndr_feed_order')[0];
        if (feedInfo.order) feed_order.value = feedInfo.order;
        var feed_thumb = feedPanel.getElementsByClassName('ndr_feed_thumb')[0];
        if (feedInfo.thumb) feed_thumb.value = feedInfo.thumb;
        
        return feedPanel;
    };
    NDR.prototype.createFeedInfoFromFeedEditPanel = function(url, feedPanel) {
        var feedInfo = {};
        var feed_del_check = feedPanel.getElementsByClassName('ndr_feed_del_check')[0];
        var feed_title = feedPanel.getElementsByClassName('ndr_feed_title')[0];
        var feed_title_check = feedPanel.getElementsByClassName('ndr_feed_title_check')[0];
        var feed_order = feedPanel.getElementsByClassName('ndr_feed_order')[0];
        var feed_thumb = feedPanel.getElementsByClassName('ndr_feed_thumb')[0];
        if (feed_del_check && feed_del_check.checked) {
            return null;
        }
        var feedItem = this.feedMap.get(url);
        if (feedItem && feedItem.feedObj && feedItem.feedObj.title) {
            feedInfo.title = feedItem.feedObj.title;
        }
        if (feed_title_check.checked) {
            feedInfo.otitle = feed_title.value;
        }
        if (feed_order.value != 'entryOrder') {
            feedInfo.order = feed_order.value;
        }
        if (feed_thumb.value != 'necessary') {
            feedInfo.thumb = feed_thumb.value;
        }
        return feedInfo;
    };
    NDR.prototype.createMylistPanel = function() {
        if (!nicoMylist.mylistGroup) return null;
        if (!this.mylistPanel) {
            var mylist = nicoMylist.mylistGroup;
            var dv = document.createElement('div');
            dv.innerHTML = '\u30DE\u30A4\u30EA\u30B9\u30C8<br>';
            appendClass(dv, 'ndr_mylist_pane');
            var select = document.createElement('select');
            for (var i = 0; i < mylist.group_list.length; i++) {
                var group_id = mylist.group_list[i];
                select.add(new Option(mylist.group_info[group_id].group_name, group_id));
            }
            var button = document.createElement('input');
            button.type = 'submit';
            button.value = '\u767B\u9332';
            button.className = 'submit';
            dv.appendChild(select);
            dv.appendChild(button);
            this.mylistPanel = dv;
        }
        var mylistPanel = this.mylistPanel.cloneNode(true);
        return mylistPanel;
    };
    NDR.prototype.viewEntry = function() {
        var currentEntry = this.currentViewingEntry();
        if (!currentEntry) return;
        var playInfo = createPlayInfo(currentEntry);
        if (playInfo.items.length == 0) return;
        var video_id = playInfo.items[0];
        this.openURL(playInfo.video[video_id]);
    };
    NDR.prototype.openURL = function(url) {
        setTimeout(function(){ window.open(url, 'NDR').focus() }, 0);
    };
    NDR.prototype.viewPinnedEntries = function() {
        this.hidePinnedListLater(0);
        if (this.pinnedMap.size() > 0) {
            this.openURLs(this.pinnedMap.keys);
        }
        this.pinClear();
    };
    NDR.prototype.openURLs = function(urls) {
        this.player.add(urls);
    };
    NDR.prototype.pinToggle = function() {
        var currentEntry = this.currentViewingEntry();
        if (!currentEntry) return;
        var playInfo = createPlayInfo(currentEntry);
        if (playInfo.items.length == 0) return;
        var videoid = playInfo.items[0],
            url     = playInfo.video[videoid],
            title   = playInfo.title[videoid];
        if (!hasClass(currentEntry, 'ndr_entry_pin')) {
            appendClass(currentEntry, 'ndr_entry_pin');
            this.pinAdd(url, title);
        }
        else {
            removeClass(currentEntry, 'ndr_entry_pin');
            this.pinRemove(url);
        }
    };
    NDR.prototype.pinAdd = function(url, title) {
        this.pinnedMap.add(url, { url: url, title: title });
        var count = document.getElementById('NDR_PINNED_COUNT');
        count.textContent = this.pinnedMap.size();
    };
    NDR.prototype.pinAdded = function(url) {
        return this.pinnedMap.has(url);
    };
    NDR.prototype.pinRemove = function(url) {
        this.pinnedMap.remove(url);
        var count = document.getElementById('NDR_PINNED_COUNT');
        count.textContent = this.pinnedMap.size();
    };
    NDR.prototype.pinClear = function(time) {
        this.pinnedMap = new ListedKeyMap();
        var pinnedEntries = evaluate('/div[contains(@class, "ndr_entry_pin")]', content);
        for (var i = 0, len = pinnedEntries.length; i < len; i++) {
            removeClass(pinnedEntries[i], 'ndr_entry_pin');
        }
        var countEl = document.getElementById('NDR_PINNED_COUNT');
        countEl.textContent = '0';
    };
    NDR.prototype.showPinnedList = function() {
        this.timer.clearTimeout('pinTooltip');
        if (this.pinnedMap.size() == 0) return;
        var pinnedList = document.getElementById('NDR_PINNED_LIST');
        if (pinnedList.style.display == 'block') return;
        var range = document.createRange();
        range.selectNodeContents(pinnedList);
        range.deleteContents();
        var self = this;
        var keys = this.pinnedMap.keys;
        for (var i = 0; i < keys.length; i++) {
            var item = this.pinnedMap.get(keys[i]);
            var li = document.createElement('li');
            with({ li: li, item: item }) {
                var a = document.createElement('a');
                a.textContent = item.title;
                a.setAttribute('href', item.url);
                a.setAttribute('rel', 'nofollow');
                li.appendChild(a);
                li.addEventListener('click', function(e) {
                    e.preventDefault();
                    self.hidePinnedListLater(0);
                    self.pinRemove(item.url);
                    self.player.add([item.url]);
                    var items = evaluate('/\/div[contains(@class, "ndr_entry_pin") and descendant::a[position()=1 and @href="' + escAttr(item.url) + '"]]', content);
                    for (var i = 0, len = pinnedEntries.length; i < len; i++) {
                        removeClass(pinnedEntries[i], 'ndr_entry_pin');
                    }
                }, false);
                range.insertNode(li);
            }
        }
        var clearLi = document.createElement('li');
        clearLi.textContent = 'Clear';
        clearLi.setAttribute('class', 'clear');
        clearLi.addEventListener('click', function(e) {
            self.pinClear();
            self.hidePinnedListLater(0);
        }, false);
        range.insertNode(clearLi);
        pinnedList.style.display = 'block';
    };
    NDR.prototype.hidePinnedListLater = function(time) {
        var self = this;
        this.timer.setTimeout('pinTooltip', function() { 
            var pinnedList = document.getElementById('NDR_PINNED_LIST');
            pinnedList.style.display = '';
        }, (time == 0) ? 0 : time || 1000);
    };
    NDR.start = function() {
        var ndr = new NDR(NDR.PREFERENCES);
        ndr.initKeyBind(NDR.SHOPRTCUT);
    }
    window.NDR = NDR;

    function main() {
        document.title = 'niconico douga Reader - ' + document.title;
        var range = document.createRange();
        range.selectNodeContents(document.getElementsByTagName('body')[0]);
        range.deleteContents();
        NDR.start();
    }
    document.addEventListener('DOMContentLoaded', main, false);
})();
