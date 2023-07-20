var fs = require('fs');                     // 写入文件
var myRequest = require('request');         // 发起请求
var myCheerio = require('cheerio');         // 解码网页
var myIconv = require('iconv-lite');        // 转换编码
require('date-utils');                      // 处理日期
const mysql = require("./mysql");           // 数据库
var schedule = require('node-schedule');    // 定时执行


var source_name = "新浪新闻";
var domain = 'https://news.sina.com.cn/';
var myEncoding = "utf-8";
var seedURL = 'https://news.sina.com.cn/';
// myURL  https://news.sina.com.cn/s/2023-07-06/doc-imyztazt2314866.shtml

var url_reg = /\/news.sina.com.cn\//;
var url_reg1 = /(\d{4})-(\d{2})-(\d{2})\/doc-(\w{15}).shtml/;

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
        timeout: 10000,
    }
    myRequest(options, callback)
}


// 定时执行
var rule = new schedule.RecurrenceRule();
var times = [0, 12]; //每天2次自动执行
var times2 = 5; //定义在第几分钟执行
rule.hour = times;
rule.minute = times2;

//定时执行httpGet()函数
schedule.scheduleJob(rule, function() {
    seedget();
});

function seedget(){
    request(seedURL, function (err, res, body) {
        try {
            // 用iconv转换编码
            var html = myIconv.decode(body, myEncoding);
            // console.log(html);
            // 准备用cheerio解析html
            var $ = myCheerio.load(html, { decodeEntities: true });
        } catch (e) { console.log('读种子页面并转码出错：' + e) }

        var seedurl_news = "";
        try {
            seedurl_news = $('a');
        } catch (e) { console.log('url列表所处的html块识别出错：' + e) }

        seedurl_news.each(function(i, e) {  // 遍历种子页面里所有的a链接
            var myURL = "";
            try {
                //得到具体新闻url
                var href = "";
                href = $(e).attr("href");
                if (href === undefined) return;
                // console.log(href);
                myURL = href;
            } catch (e) { console.log('识别种子页面中的新闻链接出错：' + e); }

            if (!url_reg.test(myURL) || !url_reg1.test(myURL)) return;  // 检验是否符合新闻url的正则表达式
            // console.log(myURL);
            // newsGet(myURL);  // 读取新闻页面


            var fetch_url_Sql = 'select url from fetches where url=?';
            var fetch_url_Sql_Params = [myURL];
            mysql.query(fetch_url_Sql, fetch_url_Sql_Params, function(qerr, vals, fields) {
                if (vals.length > 0) {
                    console.log('URL duplicate!')
                } else newsGet(myURL); //读取新闻页面
            });
        });
    })
}


function newsGet(myURL) {  // 读取新闻页面
    request(myURL, function(err, res, body) {  // 读取新闻页面
        try {
            var html_news = myIconv.decode(body, myEncoding);  // 用iconv转换编码
            // if (/工作室《谈心社》栏目/.test(html_news)) return;  // 去掉奇怪的网页
            // console.log(html_news);
            // 准备用cheerio解析html_news
            var $ = myCheerio.load(html_news, { decodeEntities: true });
        } catch (e) {  console.log('读新闻页面并转码出错:' + e + " " + myURL); return;}
        console.log("转码读取成功:" + myURL);
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
            var source_and_date= $('.date-source').text();
            fetch.source = source_and_date.match(/\t\t\t\t(.*)\t\t\t/)[1];
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
        } catch (e) {  console.log('获取内容出错：' + e + myURL);}



        // var filename = source_name + "_" + (new Date()).toFormat("YYYY-MM-DD") +
        //     "_" + myURL.substr(myURL.lastIndexOf('/') + 1) + ".json";
        // // 存储json
        // fs.writeFileSync(filename, JSON.stringify(fetch));

        // mysql写入
        var fetchAddSql = 'INSERT INTO fetches(url,source_name,source_encoding,title,keywords,author,publish_date,crawltime,content) VALUES(?,?,?,?,?,?,?,?,?)';
        var fetchAddSql_Params = [ fetch.url, fetch.source_name, fetch.source_encoding, fetch.title, fetch.keywords, fetch.author,
            fetch.publish_date, fetch.crawltime.toFormat("YYYY-MM-DD HH24:MI:SS"), fetch.content ];

        //执行sql，数据库中fetch表里的url属性是unique的，不会把重复的url内容写入数据库
        mysql.query(fetchAddSql, fetchAddSql_Params, function(qerr, vals, fields) {
            if (qerr) {
                console.log(qerr);
            }
        });

    });
}




