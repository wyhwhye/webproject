var xy = {'a':1, 'b':3, 'c':6, 'd':2};

var x = Object.keys(xy);
var y = Object.values(xy);
var wcdata = [];
for (i = 0; i < x.length; i++){
    tmp = {
        name:x[i],
        value:y[i],
    }
    wcdata.push(tmp);
}


console.log(wcdata);