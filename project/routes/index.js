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
    var range1 = req.query.range1;
    var cd = req.query.condition;
    var kw2 = req.query.keywords2;
    var range2 = req.query.range2;
    var sortkw = req.query.sortkw;
    var sortrule;
    if (req.query.sortrule==="升序"){
        sortrule= 'ASC';
    } else {
        sortrule= 'DESC';
    }

    //sql字符串和参数
    switch (cd){
        case "-":
            if (range1 === "全部"){
                var fetchSql = `
                    SELECT title, author, source_name, url, publish_date 
                    FROM fetches 
                    WHERE title LIKE '%${kw1}%'
                    OR content LIKE '%${kw1}%'   
                    OR author LIKE '%${kw1}%'
                    ORDER BY ${sortkw} ${sortrule}
                `;
            }
            else {
                var fetchSql = `
                    SELECT title, author, source_name, url, publish_date 
                    FROM fetches 
                    WHERE ${range1} LIKE '%${kw1}%'
                    ORDER BY ${sortkw} ${sortrule}
                `;
            }
            break;
        case "AND":
            if (range1 === "全部" && range2 === "全部"){
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
            }
            else if (range1 !== "全部" && range2 === "全部"){
                var fetchSql = `
                    SELECT title, author, source_name, url, publish_date 
                    FROM fetches 
                    WHERE (${range1} LIKE '%${kw1}%')
                    AND (title LIKE '%${kw2}%'
                    OR content LIKE '%${kw2}%'   
                    OR author LIKE '%${kw2}%')
                    ORDER BY ${sortkw} ${sortrule}
                `;
            }
            else if (range1 === "全部" && range2 !== "全部"){
                var fetchSql = `
                    SELECT title, author, source_name, url, publish_date 
                    FROM fetches 
                    WHERE (title LIKE '%${kw1}%'
                    OR content LIKE '%${kw1}%'   
                    OR author LIKE '%${kw1}%')
                    AND (${range2} LIKE '%${kw2}%')
                    ORDER BY ${sortkw} ${sortrule}
                `;
            }
            else if (range1 !== "全部" && range2 !== "全部"){
                var fetchSql = `
                    SELECT title, author, source_name, url, publish_date 
                    FROM fetches 
                    WHERE ${range1} LIKE '%${kw1}%'
                    AND ${range2} LIKE '%${kw2}%'
                    ORDER BY ${sortkw} ${sortrule}
                `;
            }
            break
        case "OR":
            if (range1 === "全部" && range2 === "全部"){
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
            }
            else if (range1 !== "全部" && range2 === "全部"){
                var fetchSql = `
                    SELECT title, author, source_name, url, publish_date 
                    FROM fetches 
                    WHERE (${range1} LIKE '%${kw1}%')
                    OR (title LIKE '%${kw2}%'
                    OR content LIKE '%${kw2}%'   
                    OR author LIKE '%${kw2}%')
                    ORDER BY ${sortkw} ${sortrule}
                `;
            }
            else if (range1 === "全部" && range2 !== "全部"){
                var fetchSql = `
                    SELECT title, author, source_name, url, publish_date 
                    FROM fetches 
                    WHERE (title LIKE '%${kw1}%'
                    OR content LIKE '%${kw1}%'   
                    OR author LIKE '%${kw1}%')
                    OR (${range2} LIKE '%${kw2}%')
                    ORDER BY ${sortkw} ${sortrule}
                `;
            }
            else if (range1 !== "全部" && range2 !== "全部"){
                var fetchSql = `
                    SELECT title, author, source_name, url, publish_date 
                    FROM fetches 
                    WHERE ${range1} LIKE '%${kw1}%'
                    OR ${range2} LIKE '%${kw2}%'
                    ORDER BY ${sortkw} ${sortrule}
                `;
            }
            break
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
