
$(document).ready(function() {
    $("input:button").click(function() {
        var h_kw = $("#hm_keywords").val();
        if (h_kw === ''){
            alert("请输入关键词！");
            return;
        }
        var div = document.getElementById("body_heatMapResult");
        $.get('/heatMap?keywords=' + h_kw, function(data) {
            // 未找到
            if (data.length === 0){
                alert("未找到！");
                return;
            }
            // console.log(data)

            // 更改画布大小
            div.style.width = '600px';
            div.style.height = '420px';

            // 处理数据格式
            var xy = {};
            data.forEach(item => {
                if (item.publish_date in xy){
                    xy[item.publish_date] += 1;
                } else {
                    xy[item.publish_date] = 1;
                }
            })
            console.log(xy)

            // 作图
            var myChart = echarts.init(div);
            option = {
                title: {  // 标题
                    text:'"' + h_kw + '"'+ '在新闻中的出现次数随时间变化图'
                },
                xAxis: {  // x轴
                    type: 'category',
                    data: Object.keys(xy)
                },
                yAxis: {  // y轴
                    type: 'value'
                },
                series: [{  // 数据、类型
                    data: Object.values(xy),
                    type: 'line',
                    itemStyle: {normal: {label: {show: true}}}
                }],
            };

            myChart.setOption(option, true);

        });
    });
});
