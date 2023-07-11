
$(document).ready(function() {
    $("input:button").click(function() {
        $.get('/search?keywords1=' + $("#keywords1").val()+ '&condition=' + $("#condition").val() +
            '&keywords2=' + $("#keywords2").val() + '&sortkw=' + $("#sort_kw").val() +'&sortrule=' +
            $("#sort_rule").val() + '&range='+ $("#range").val(), function(data) {
            // 未找到
            if (data.length === 0){
                alert("未找到！");
                $("#resTable").empty();
                return;
            }
            $("#resTable").empty();
            $("#resTable").append(
                '<tr class="body_searchResult">' +
                '<th>id</th>' +
                '<th>title</th>' +
                '<th>author</th>' +
                '<th>source_name</th>' +
                '<th>url</th>' +
                '<th>publish_date</th>' +
                '</tr>');
            // 使表格间隔行有颜色
            var flag = 1;
            for (let list of data) {
                if (flag%2 === 0){
                    var table = '<tr class="ss"><td>' + flag + '</td>';
                    flag += 1;
                } else {
                    var table = '<tr><td>' + flag + '</td>';
                    flag += 1;
                }
                Object.values(list).forEach(element => {
                    table += ('<td>' + element + '</td>');
                });
                $("#resTable").append(table + '</tr>');
            }
        });
    });
});
