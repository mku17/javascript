let currentPage = 0;
const limit = 5;
let isLoading = false;
let hasMore = true;

$(document).ready(function() {
    loadPosts();
    
    $(window).scroll(function() {
        if (shouldLoadMore()) {
            loadPosts();
        }
    });
    
    $('#loadMoreBtn').click(function() {
        if (!isLoading && hasMore) {
            loadPosts();
        }
    });
    

    $('#errorBtn').click(function() {
        simulateError();
    });
});

function shouldLoadMore() {
    return $(window).scrollTop() + $(window).height() > $(document).height() - 100 && 
           !isLoading && 
           hasMore;
}

function loadPosts() {
    isLoading = true;
    showLoading();
    
    const apiUrl = `https://jsonplaceholder.typicode.com/posts?_start=${currentPage * limit}&_limit=${limit}`;
    
    $.get(apiUrl)
        .done(handlePostsResponse)
        .fail(handleError)
        .always(resetLoadingState);
}

function handlePostsResponse(posts) {
    if (posts.length === 0) {
        hasMore = false;
        updateLoadButton();
        return;
    }
    
    appendPostsToContainer(posts);
    currentPage++;
    
    if (currentPage * limit >= 20) {
        hasMore = false;
        updateLoadButton();
    }
}

function appendPostsToContainer(posts) {
    posts.forEach(function(post) {
        $('#postContainer').append(`
            <div class="post">
                <h3>${post.id}. ${post.title}</h3>
                <p>${post.body}</p>
            </div>
        `);
    });
}


function handleError(jqXHR, textStatus, errorThrown) {
    $('#errorMessage').html(`
        <strong>Hata oluştu!</strong><br>
        ${textStatus}: ${errorThrown}<br>
        <small>API isteği başarısız oldu. Lütfen daha sonra tekrar deneyin.</small>
    `).show();
}

function resetLoadingState() {
    isLoading = false;
    hideLoading();
    $('#loadMoreBtn').prop('disabled', false);
}

function showLoading() {
    $('#loadingIndicator').show();
    $('#errorMessage').hide();
    $('#loadMoreBtn').prop('disabled', true);
}

function hideLoading() {
    $('#loadingIndicator').hide();
}


function updateLoadButton() {
    $('#loadMoreBtn').text('Tüm Postlar Yüklendi').prop('disabled', true);
}

//hata
function simulateError() {
    isLoading = true;
    showLoading();
    
    const wrongUrl = `https://jsonplaceholder.typicode.com/nonexistent?_start=${currentPage * limit}&_limit=${limit}`;
    
    $.get(wrongUrl)
        .done(function() {
            $('#postContainer').append(`<div class="post"><h3>Test Postu</h3><p>Bu bir test postudur</p></div>`);
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            $('#errorMessage').html(`
                <strong>Test Hatası Oluşturuldu!</strong><br>
                ${textStatus}: ${errorThrown}<br>
                <small>Bu bir test hatasıdır. Sayfayı yenileyerek normal işleme devam edebilirsiniz.</small>
            `).show();
        })
        .always(resetLoadingState);
}