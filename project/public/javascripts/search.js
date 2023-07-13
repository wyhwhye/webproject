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
                        <td>${news.publish_date}</td>
                      `;
        resultBody.appendChild(row);
    }

    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;


    /* 添加分页索引按钮 */
    if (totalPages <= 7){
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
    } else if (totalPages > 7){
        console.log(currentPage);
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
                        a.style.color = "black"; // 设置当前页按钮的颜色
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
                        a.style.color = "black"; // 设置当前页按钮的颜色
                        a.classList.add('show-after');
                    }
                    li.appendChild(a);
                    paginationContainer.appendChild(li);
                }
                break;

            default:  // < 1 ... x-1 x x+1 ... c >
                console.log("进default");
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
                        a.style.color = "black"; // 设置当前页按钮的颜色
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

