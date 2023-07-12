var currentPage = 1;
const resultsPerPage = 10;
var data = [];

function showResults() {
    var resultContainer = document.getElementById('body_searchResult');
    var resultBody = document.getElementById('tbody');
    var prevButton = document.getElementById('prev-btn');
    var nextButton = document.getElementById('next-btn');
    var totalPages = Math.ceil(data.length / resultsPerPage);

    resultBody.innerHTML = '';

    resultContainer.style.display = "block";

    var startIndex = (currentPage - 1) * resultsPerPage;
    var endIndex = startIndex + resultsPerPage;

    var id = 1;
    for (let i = startIndex; i < endIndex && i < data.length; i++) {
        var news = data[i];
        var row = document.createElement('tr');
        if (id%2 === 0){
            row.className = 'ss';
        }
        row.innerHTML = `
                        <td>${id}</td>
                        <td>${news.title}</td>
                        <td>${news.author}</td>
                        <td>${news.source_name}</td>
                        <td><a href="${news.url}" target="_blank">查看详情</a></td>
<!--                        <td>${news.url}</td>-->
                        <td>${news.publish_date}</td>
                      `;
        resultBody.appendChild(row);
        id += 1;
    }

    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;

}

function goToPrevPage() {
    if (currentPage > 1) {
        currentPage--;
        showResults();
    }
}

function goToNextPage() {
    const totalPages = Math.ceil(data.length / resultsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        showResults();
    }
}


$(document).ready(function() {
    $("input:button").click(function() {
        $.get('/search?keywords1=' + $("#keywords1").val()+ '&condition=' + $("#condition").val() +
            '&keywords2=' + $("#keywords2").val() + '&sortkw=' + $("#sort_kw").val() +'&sortrule=' +
            $("#sort_rule").val() + '&range='+ $("#range").val(), function(result) {
            // 未找到
            if (result.length === 0) {
                alert("未找到！");
                $("#resTable").empty();
                return;
            }
            console.log(result);
            data = result;
            showResults();
        });

            // $("#resTable").empty();
            // $("#resTable").append(
            //     '<tr class="body_searchResult">' +
            //     '<th>id</th>' +
            //     '<th>title</th>' +
            //     '<th>author</th>' +
            //     '<th>source_name</th>' +
            //     '<th>url</th>' +
            //     '<th>publish_date</th>' +
            //     '</tr>');
            // // 使表格间隔行有颜色
            // var flag = 1;
            // for (let list of data) {
            //     if (flag%2 === 0){
            //         var table = '<tr class="ss"><td>' + flag + '</td>';
            //         flag += 1;
            //     } else {
            //         var table = '<tr><td>' + flag + '</td>';
            //         flag += 1;
            //     }
            //     Object.values(list).forEach(element => {
            //         table += ('<td>' + element + '</td>');
            //     });
            //     $("#resTable").append(table + '</tr>');
            // }
    });
});

