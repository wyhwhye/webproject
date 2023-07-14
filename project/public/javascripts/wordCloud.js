$(document).ready(function() {
    $("input:button").click(function() {
        var startTime = $("#wc_startTime").val();
        var endTime = $("#wc_endTime").val();
        if (endTime < startTime){
            alert("请正确输入时间范围！");
            return;
        }
        $.get('/wordCloud?startTime=' + startTime + '&endTime=' + endTime, function(data) {
            // 未找到
            if (data.length === 0){
                alert("未找到！");
                return;
            }
            // console.log(data)

            // 处理数据，获得每个关键词
            var words = [];
            data.forEach(item => {
                let tmp = item.keywords.split(',');
                tmp.forEach(word =>{
                    if (word.length<=8){  // 过长的关键词掠去
                        words.push(word);
                    }
                })
            })
            // console.log(words);
            var xy = {};
            words.forEach(word => {
                if (word in xy){
                    xy[word] += 1;
                } else {
                    xy[word] = 1;
                }
            })

            // 按值排序
            // const tmp = Object.entries(xy).sort((a, b) => b[1] - a[1]);
            // const sortxy = {};
            // tmp.forEach(item => {
            //     sortxy[item[0]] = item[1];
            // });
            // console.log(sortxy);

            // 格式化为词云格式
            var x = Object.keys(xy);
            var y = Object.values(xy);
            var wcdata = [];
            for (i = 0; i < x.length && i < 100; i++){
                tmp = {
                    name:x[i],
                    value:y[i],
                }
                wcdata.push(tmp);
            }

            // 作图
            drawWordCloud(wcdata);
        });
    });
});


function drawWordCloud(data){
    var div = document.getElementById('body_wordCloudResult');
    div.style.width = '600px';
    div.style.height = '440px';
    var myChart = echarts.init(div);
    // 指定图表的配置项和数据
    option = {
        tooltip: {
            show: true
        },
        series: [
            {
                type: 'wordCloud',  // 词云图
                gridSize: 6,  //词的间距
                shape: 'circle',  // 词云形状，可选diamond，pentagon，circle，triangle，star等形状
                sizeRange: [15, 60],  // 词云大小范围
                width: 600,  // 词云显示宽度
                height: 400,  // 词云显示高度
                textStyle: {
                    color: function () {
                        // 词云的颜色随机，255太亮，180暗一点
                        return (
                            'rgb(' +
                            [
                                Math.round(Math.random() * 180),
                                Math.round(Math.random() * 180),
                                Math.round(Math.random() * 180)
                            ].join(',') +
                            ')'
                        );
                    },

                },
                data: data,
            }
        ]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option, true);
}
