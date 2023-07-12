
$(document).ready(function() {
    $("input:button").click(function() {
        var h_kw = $("#keywords").val();
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
            div.style.width = '600px';
            div.style.height = '400px';
            // console.log(data)
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
                title: {
                    text:'"' + h_kw + '"'+ '在新闻中的出现次数随时间变化图'
                },
                xAxis: {
                    type: 'category',
                    data: Object.keys(xy)
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: Object.values(xy),
                    type: 'line',
                    itemStyle: {normal: {label: {show: true}}}
                }],
            };

            myChart.setOption(option, true);

        });
    });
});
