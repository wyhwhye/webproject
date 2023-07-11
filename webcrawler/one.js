var fs = require('fs');                // 写入文件
var myRequest = require('request');    // 发起请求
var myCheerio = require('cheerio');    // 解码网页
var myIconv = require('iconv-lite');   // 转换编码
require('date-utils');                 // 处理日期
const mysql = require("./mysql");      // 数据库


var source_name = "新浪新闻";
var domain = 'https://news.163.com/';
var myEncoding = "utf-8";
var myURL = 'https://mil.news.sina.com.cn/zonghe/2023-07-05/doc-imyzrqyn9786965.shtml';


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

    // if (/工作室《谈心社》栏目/.test(html)) return;
    //
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
        fetch.title = $('.main-title').text();
        // 来源
        var source_and_date = $('.date-source').text();
        fetch.source = source_and_date.match(/\t\t(.*)\n/)[1];
        // 发布日期
        var pd = source_and_date.match(/((\d{4})年(\d{2})月(\d{2})日)/)[0];
        pd = pd.replace("年", "-").replace("月", "-").replace("日", "");
        fetch.publish_date = pd;
        // 关键词
        fetch.keywords = $('meta[name="keywords"]').eq(0).attr("content");
        // 作者
        fetch.author = $('.show_author').text().match(/责任编辑：(.*) /)[1];
        // 内容
        fetch.content = $('#article p').text();
    } catch (e) {  console.log('出错：' + e + myURL);}

    console.log(fetch);

    });

