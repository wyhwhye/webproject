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

    // 清空分页
    resultBody.innerHTML = '';
    paginationContainer.innerHTML = '';
    // 显示内容
    resultContainer.style.display = "block";

    // 每页显示的页码范围
    var startIndex = (currentPage - 1) * resultsPerPage;
    var endIndex = startIndex + resultsPerPage;

    /* 将条目加入表格中 */
    for (let i = startIndex; i < endIndex && i < data.length; i++) {
        var news = data[i];
        var row = document.createElement('tr');
        if ((i+1)%2 === 0){  // 设置间隔背景颜色
            row.className = 'ss';
        }
        row.innerHTML = `
                        <td>${i+1}</td>
                        <td>${news.title}</td>
                        <td>${news.author}</td>
                        <td>${news.source_name}</td>
                        <td><a href="${news.url}" target="_blank">查看详情</a></td>
                        <td>${news.publish_date}</td>
                      `;
        resultBody.appendChild(row);
    }

    // if (currentPage === 1) {
    //     prevButton.disabled = true;
    // }
    // if (currentPage === totalPages) {
    //     nextButton.disabled = true;
    // }
    prevButton.disabled = currentPage === 1;  // 第一页，关闭prevButton
    nextButton.disabled = currentPage === totalPages;  // 最后一页，关闭nextButton


    /* 添加分页按钮 */
    if (totalPages <= 7){  // 如果 totalPages <= 7页，全部显示
        // 创建  <li><a></a></li> 标签作为按钮
        for (let i = 1; i <= totalPages; i++) {
            var li = document.createElement('li');
            var a = document.createElement('a');
            a.innerText = i;
            a.id = i;
            a.onclick = function() {
                currentPage = i;
                showResults();
            };
            if (currentPage === i) {  // 更改当前所在页的格式
                a.style.color = "black";
                a.classList.add('show-after');
            }
            li.appendChild(a);
            paginationContainer.appendChild(li);
        }
    }
    else if (totalPages > 7){  // 如果 totalPages > 7页，部分显示
        // console.log(currentPage);
        /* 根据当前页决定分页显示格式，“...”相应为中间页 */
        switch (currentPage){
            case 1:  // < 1 2 3 4 5 ... c >
            case 2:  // < 1 2 3 4 5 ... c >
            case 3:  // < 1 2 3 4 5 ... c >
            case 4:  // < 1 2 3 4 5 ... c >
                for (let i = 1; i <= 5; i++) {
                    var li = document.createElement('li');
                    var a = document.createElement('a');
                    a.innerText = i;
                    a.id = i;
                    a.onclick = function() {
                        currentPage = i;
                        showResults();
                    };
                    if (currentPage === i) {
                        a.style.color = "black";
                        a.classList.add('show-after');
                    }
                    li.appendChild(a);
                    paginationContainer.appendChild(li);
                }

                // ...
                var li = document.createElement('li');
                var a = document.createElement('a');
                a.innerText = '...';
                a.id = '...';
                a.onclick = function() {
                    currentPage = Math.ceil((5+totalPages)/2);
                    showResults();
                };
                li.appendChild(a);
                paginationContainer.appendChild(li);

                // 末页
                var li = document.createElement('li');
                var a = document.createElement('a');
                a.innerText = totalPages;
                a.id = totalPages;
                a.onclick = function() {
                    currentPage = totalPages;
                    showResults();
                };
                li.appendChild(a);
                paginationContainer.appendChild(li);
                break;

            case totalPages-3:  // < 1 ... c-4 c-3 c-1 c-1 c >
            case totalPages-2:  // < 1 ... c-4 c-3 c-1 c-1 c >
            case totalPages-1:  // < 1 ... c-4 c-3 c-1 c-1 c >
            case totalPages:    // < 1 ... c-4 c-3 c-1 c-1 c >

                // 首页
                var li = document.createElement('li');
                var a = document.createElement('a');
                a.innerText = 1;
                a.id = 1;
                a.onclick = function() {
                    currentPage = 1;
                    showResults();
                };
                li.appendChild(a);
                paginationContainer.appendChild(li);

                // ...
                var li = document.createElement('li');
                var a = document.createElement('a');
                a.innerText = '...';
                a.id = '...';
                a.onclick = function() {
                    currentPage = Math.ceil((1 + totalPages-4)/2);
                    showResults();
                };
                li.appendChild(a);
                paginationContainer.appendChild(li);

                for (let i = totalPages-4; i <= totalPages; i++) {
                    var li = document.createElement('li');
                    var a = document.createElement('a');
                    a.innerText = i;
                    a.id = i;
                    a.onclick = function() {
                        currentPage = i;
                        showResults();
                    };
                    if (currentPage === i) {
                        a.style.color = "black";
                        a.classList.add('show-after');
                    }
                    li.appendChild(a);
                    paginationContainer.appendChild(li);
                }
                break;

            // < 1 ... x-1 x x+1 ... c >
            default:
                // 首页
                var li = document.createElement('li');
                var a = document.createElement('a');
                a.innerText = 1;
                a.id = 1;
                a.onclick = function() {
                    currentPage = 1;
                    showResults();
                };
                li.appendChild(a);
                paginationContainer.appendChild(li);

                // ...
                var li = document.createElement('li');
                var a = document.createElement('a');
                a.innerText = '...';
                a.id = '...';
                a.onclick = function() {
                    currentPage = Math.ceil((1 + currentPage-1)/2);
                    showResults();
                };
                li.appendChild(a);
                paginationContainer.appendChild(li);

                for (let i = currentPage-1; i <= currentPage+1; i++) {
                    var li = document.createElement('li');
                    var a = document.createElement('a');
                    a.innerText = i;
                    a.id = i;
                    a.onclick = function() {
                        currentPage = i;
                        showResults();
                    };
                    if (currentPage === i) {
                        a.style.color = "black";
                        a.classList.add('show-after');
                    }
                    li.appendChild(a);
                    paginationContainer.appendChild(li);
                }

                // ...
                var li = document.createElement('li');
                var a = document.createElement('a');
                a.innerText = '...';
                a.id = '...';
                a.onclick = function() {
                    currentPage = Math.ceil((currentPage+1 + totalPages)/2);
                    showResults();
                };
                li.appendChild(a);
                paginationContainer.appendChild(li);

                // 末页
                var li = document.createElement('li');
                var a = document.createElement('a');
                a.innerText = totalPages;
                a.id = totalPages;
                a.onclick = function() {
                    currentPage = totalPages;
                    showResults();
                };
                li.appendChild(a);
                paginationContainer.appendChild(li);

        }
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
        currentPage = 1;
        $.get('/search?keywords1=' + $("#s_keywords").val()+
            '&condition=' + $("#condition").val() +
            '&keywords2=' + $("#s_keywords2").val() +
            '&sortkw=' + $("#sort_kw").val() +
            '&sortrule=' + $("#sort_rule").val() +
            '&range='+ $("#range").val(),   function(result) {
            // 未找到
            if (result.length === 0) {
                alert("未找到！");
                // $("#resTable").empty();
                return;
            }
            console.log(result);
            data = result;
            showResults();
        });
    });
});

