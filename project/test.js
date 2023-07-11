var kw1 = "男";
var kw2 = "孩";


var fetchSql = " fetches where (title like '%"+ kw1 +"%'" +
    " or content like '%"+ kw1 +"%'" + " or author like '%"+ kw1 +"%')" + " and " +
"(title like '%"+ kw2 +"%'" + " or content like '%"+ kw2 +"%'" + " or author like '%"+ kw2 +"%')" ;

console.log(fetchSql);