var currentPage = 1;
var resultsPerPage = 10;
var data = [];

function showResults() {
    var resultContainer = document.getElementById('body_searchResult');
    var resultBody = document.getElementById('tbody');
    var prevButton = document.getElementById('prev-btn');
    var nextButton = document.getElementById('next-btn');
    var paginationContainer = document.getElementById('pagination');
    var totalPages = Math.ceil(data.length / resultsPerPage);

    resultBody.innerHTML = '';
    resultContainer.style.display = "block";
    paginationContainer.innerHTML = ''; // 清空分页索引容器

    var startIndex = (currentPage - 1) * resultsPerPage;
    var endIndex = startIndex + resultsPerPage;

    // var id = 1;
    for (let i = startIndex; i < endIndex && i < data.length; i++) {
        var news = data[i];
        var row = document.createElement('tr');
        if ((i+1)%2 === 0){
            row.className = 'ss';
        }
        row.innerHTML = `
                        <td>${i+1}</td>
                        <td>${news.title}</td>
                        <td>${news.author}</td>
                        <td>${news.source_name}</td>
                        <td><a href="${news.url}" target="_blank">查看详情</a></td>
<!--                        <td>${news.url}</td>-->
                        <td>${news.publish_date}</td>
                      `;
        resultBody.appendChild(row);
        // id += 1;
    }

    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;

    // 添加分页索引按钮
    for (let i = 1; i <= totalPages; i++) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.innerText = i;
        a.id = i;
        a.onclick = function() {
            currentPage = i;
            showResults();
        };

        if (currentPage === i) {
            a.style.color = "black"; // 设置当前页按钮的颜色
            a.classList.add('show-after');
        }
        li.appendChild(a);
        paginationContainer.appendChild(li);
    }
}

function goToPrevPage() {
    if (currentPage > 1) {
        currentPage--;
        showResults();
    }
}

function goToNextPage() {
    var totalPages = Math.ceil(data.length / resultsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        showResults();
    }
}


$(document).ready(function() {
    $("input:button").click(function() {
        $.get('/search?keywords1=' + $("#keywords1").val()+
            '&condition=' + $("#condition").val() +
            '&keywords2=' + $("#keywords2").val() +
            '&sortkw=' + $("#sort_kw").val() +
            '&sortrule=' + $("#sort_rule").val() +
            '&range='+ $("#range").val(),   function(result) {
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
    });
});

