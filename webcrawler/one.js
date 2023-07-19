var fs = require('fs');                // 写入文件
var myRequest = require('request');    // 发起请求
var myCheerio = require('cheerio');    // 解码网页
var myIconv = require('iconv-lite');   // 转换编码
require('date-utils');                 // 处理日期
const mysql = require("./mysql");      // 数据库


var source_name = "新";
var myEncoding = "utf-8";
var myURL = 'http://www.news.cn/politics/2023-07/19/c_1129756752.htm';


// 防止网站屏蔽我们的爬虫
var headers = {
    'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.67',
}

// request模块异步fetch url
function request(url, callback) {
    var options = {
        url: url,
        encoding: null,
        headers: headers,
        timeout: 10000
    }
    myRequest(options, callback)
}
request(myURL, function (err, res, body) {
    try {
        // 用iconv转换编码
        var html = myIconv.decode(body, myEncoding);
        // console.log(html);
        // 准备用cheerio解析html
        var $ = myCheerio.load(html, { decodeEntities: true });
    } catch (e) { console.log('读种子页面并转码出错：' + e) }


    // 动态执行format字符串，构建json对象准备写入文件或数据库
    var fetch = {};
    fetch.title = "";
    fetch.source = "";
    fetch.publish_date ="";
    fetch.keywords = "";
    fetch.author = "";
    fetch.url = myURL;
    fetch.source_name = source_name;
    fetch.source_encoding = myEncoding;  // 编码
    fetch.crawltime = new Date();
    fetch.content = "";

    try{
        // 标题
        fetch.title = $('.mheader .title').text().split(/[\t\r\f\n\s]*/g).join("");
        // 来源
        var source_and_date = $('.mheader .info').text();
        fetch.source = source_and_date.match(/来源：\n(.*)\n\n/)[1];
        // 发布日期
        fetch.publish_date  = source_and_date.match(/((\d{4})-(\d{2})-(\d{2}))/)[0];
        // 关键词
        fetch.keywords = $('meta[name="keywords"]').eq(0).attr("content").split(/[\t\r\f\n\s]*/g).join("");
        if (fetch.keywords == ''){
            fetch.keywords = fetch.title;
        }
        // 作者
        fetch.author = $('#articleEdit').text().match(/责任编辑:(.*)/)[1];
        // 内容
        fetch.content = $('#detail p').text().split(/[\t\r\f\n\s]*/g).join("");
    } catch (e) {  console.log('出错：' + e + myURL);}

    console.log(fetch);

    });

