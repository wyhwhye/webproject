
$(document).ready(function() {
    $("input:button").click(function() {
        var kw = $("#wc_keywords").val();
        $.get('/wordCloud?keywords=' + kw, function(data) {
            // 未找到
            if (data.length === 0){
                alert("未找到！");
                return;
            }

            // console.log(data)
            var words = [];
            data.forEach(item => {
                let tmp = item.keywords.split(',');
                tmp.forEach(word =>{
                    if (word.length<=8){
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
    div.style.height = '300px';
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
                sizeRange: [12, 45],  // 词云大小范围
                width: 600,  // 词云显示宽度
                height: 300,  // 词云显示高度
                // textStyle: {
                //     normal: {
                //         color: function() {
                //             return 'rgb(' +
                //                 Math.round(Math.random() * 255) +
                //                 ', ' + Math.round(Math.random() * 255) +
                //                 ', ' + Math.round(Math.random() * 255) + ')'
                //         }
                //     }
                // },
                textStyle: {
                    normal: {
                        color: function () {
                            // 词云的颜色随机
                            return (
                                'rgb(' +
                                [
                                    Math.round(Math.random() * 160),
                                    Math.round(Math.random() * 160),
                                    Math.round(Math.random() * 160)
                                ].join(',') +
                                ')'
                            );
                        }
                    },
                    emphasis: {
                        shadowBlur: 10,  // 阴影的模糊等级
                        shadowColor: '#333'  // 鼠标悬停在词云上的阴影颜色
                    }
                },
                data: data,
            }
        ]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option, true);
}
