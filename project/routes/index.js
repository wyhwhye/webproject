var express = require('express');
var router = express.Router();
const mysql = require("../public/javascripts/mysql");
require('date-utils');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/search', function(req, res) {
    var kw1 = req.query.keywords1;
    var cd = req.query.condition;
    var kw2 = req.query.keywords2;
    var range = req.query.range;
    var sortkw = req.query.sortkw;
    var sortrule;
    if (req.query.sortrule==="升序"){
        sortrule= 'ASC';
    } else {
        sortrule= 'DESC';
    }

    //sql字符串和参数
    if (range === "全部"){
        switch (cd){
            case "-":
                // var fetchSql = "select title,author,source_name,url,publish_date from fetches where title like '%"+ kw1 +"%'" +
                //     " or content like '%"+ kw1 +"%'" + " or author like '%"+ kw1 +"%'" + ' order by '+sortkw+' '+sortrule;
                var fetchSql = `
                    SELECT title, author, source_name, url, publish_date 
                    FROM fetches 
                    WHERE title LIKE '%${kw1}%'
                    OR content LIKE '%${kw1}%'   
                    OR author LIKE '%${kw1}%'
                    ORDER BY ${sortkw} ${sortrule}
                `;
                break;
            case "AND":
                // var fetchSql = "select title,author,source_name,url,publish_date from fetches where (title like '%"+ kw1 +"%'" +
                //     " or content like '%"+ kw1 +"%'" + " or author like '%"+ kw1 +"%')" + " and " +
                //     "(title like '%"+ kw2 +"%'" + " or content like '%"+ kw2 +"%'" + " or author like '%"+ kw2 +"%')"  + ' order by '+sortkw+' '+sortrule;
                var fetchSql = `
                    SELECT title, author, source_name, url, publish_date 
                    FROM fetches 
                    WHERE (title LIKE '%${kw1}%'
                    OR content LIKE '%${kw1}%'   
                    OR author LIKE '%${kw1}%')
                    AND (title LIKE '%${kw2}%'
                    OR content LIKE '%${kw2}%'   
                    OR author LIKE '%${kw2}%')
                    ORDER BY ${sortkw} ${sortrule}
                `;
                break;
            case "OR":
                // var fetchSql = "select title,author,source_name,url,publish_date from fetches where title like '%"+ kw1 +"%'" +
                //     " or title like '%"+ kw2 +"%'" + " or content like '%"+ kw1 +"%'" + " or content like '%"+ kw2 +"%'" +
                //     " or author like '%"+ kw1 +"%'" + " or author like '%"+ kw2 +"%'"  + ' order by '+sortkw+' '+sortrule;
                var fetchSql = `
                    SELECT title, author, source_name, url, publish_date 
                    FROM fetches 
                    WHERE title LIKE '%${kw1}%'
                    OR content LIKE '%${kw1}%'   
                    OR author LIKE '%${kw1}%'
                    OR title LIKE '%${kw2}%'
                    OR content LIKE '%${kw2}%'   
                    OR author LIKE '%${kw2}%'
                    ORDER BY ${sortkw} ${sortrule}
                `;
                break;
        }

    } else {
        switch (cd){
            case "-":
                // var fetchSql = "select title,author,source_name,url,publish_date from fetches where "+ range +" like '%"+ kw1 +"%'" + ' order by '+sortkw+' '+sortrule;
                var fetchSql = `
                    SELECT title, author, source_name, url, publish_date 
                    FROM fetches 
                    WHERE ${range} LIKE '%${kw1}%'
                    ORDER BY ${sortkw} ${sortrule}
                `;
                break;
            case "AND":
                // var fetchSql = "select title,author,source_name,url,publish_date from fetches where "+
                //     range +" like '%"+ kw1 +"%'" + " and " + range +" like '%"+ kw2 +"%'" + ' order by '+sortkw+' '+sortrule;
                var fetchSql = `
                    SELECT title, author, source_name, url, publish_date 
                    FROM fetches 
                    WHERE ${range} LIKE '%${kw1}%'
                    AND ${range} LIKE '%${kw2}%'
                    ORDER BY ${sortkw} ${sortrule}
                `;
                break;
            case "OR":
                // var fetchSql = "select title,source_name,url,publish_date from fetches where "+
                //     range +" like '%"+ kw1 +"%'" + " or " + range +" like '%"+ kw2 +"%'" + ' order by '+sortkw+' '+sortrule;
                var fetchSql = `
                    SELECT title, author, source_name, url, publish_date 
                    FROM fetches 
                    WHERE ${range} LIKE '%${kw1}%'
                    OR ${range} LIKE '%${kw2}%'
                    ORDER BY ${sortkw} ${sortrule}
                `;
                break;
        }

    }
    // console.log(fetchSql);
    mysql.query(fetchSql, function(err, result, fields) {
        if (err) {
            console.log(err);
            return;
        }
        result.forEach(element => {
            element.publish_date = element.publish_date.toFormat("YYYY-MM-DD");
        });
        // console.log(JSON.stringify(result));
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify(result));
        res.end();
    });
});


router.get('/heatMap', function(req, res) {
    var kw = req.query.keywords;
    var fetchSql =`
        SELECT title, publish_date 
        FROM fetches 
        WHERE content LIKE '%${kw}%' 
        ORDER BY publish_date
    `;
    // console.log(fetchSql);
    mysql.query_noparam(fetchSql, function (err, result, fields) {
        if (err) {
            console.log(err);
            return;
        }
        result.forEach(element => {
            element.publish_date = element.publish_date.toFormat("YYYY-MM-DD");
        });
        // console.log(JSON.stringify(result));
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify(result));
        res.end();
    });
});


router.get('/wordCloud', function(req, res) {
    var starttime = req.query.startTime;
    var endtime = req.query.endTime;
    // select keywords from fetches where publish_date between "2023-07-06" and "2023-07-08";
    var fetchSql = `
        SELECT keywords 
        FROM fetches
        WHERE publish_date
        BETWEEN '${starttime}' AND '${endtime}'
    `;
    // console.log(fetchSql);
    mysql.query_noparam(fetchSql, function (err, result, fields) {
        if (err) {
            console.log(err);
            return;
        }
        // console.log(JSON.stringify(result));
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify(result));
        res.end();
    });
});

module.exports = router;
