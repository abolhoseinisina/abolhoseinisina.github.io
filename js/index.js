const numberOfPostInAPage = 4;

function format(command, value) {
    document.execCommand(command, false, value);
}

function setUrl() {
    var url = document.getElementById('txtFormatUrl').value;
    var sText = document.getSelection();
    document.execCommand('insertHTML', false, '<a href="' + url + '" target="_blank">' + sText + '</a>');
    document.getElementById('txtFormatUrl').value = '';
}

function setAsCode() {
    var sText = document.getSelection();
    document.execCommand('insertHTML', false, '<code style="color: #970000">' + sText + '</code>');
}

function setImage() {
    var url = document.getElementById('imgFromUrl').value;
    var imgWidth = document.getElementById('imgWidth').value;
    previousContent = document.getElementById('sampleeditor').innerHTML;
    document.getElementById('sampleeditor').innerHTML = previousContent + '<br><div class="image-container w3-center"><img src="' + url + '" width="' + imgWidth + '" /><div class="image-overlay">Reference: ' + url.split('/').slice(0, 3).join('/') + '</div><br></div>'
    document.getElementById('imgFromUrl').value = '';
}

function addPostToContent(content) {
    postNumber = parseInt(document.getElementsByClassName('post-container')[0].id.split('-')[1]) + 1;
    category = document.getElementById('category-selector').value;
    date = document.getElementById('postDatetime').value.split('T')[0];
    time = document.getElementById('postDatetime').value.split('T')[1];
    title = document.getElementById('postTitle').value;
    subtitle = document.getElementById('postSubTitle').value;
    postImage = document.getElementById('postImage').value;
    row = postNumber + ',' + category + ',' + date + ',' + time + ',' + title + ',' + subtitle + ',' + postImage + ',"' + content.replaceAll('"', "'") + '"';
    document.getElementById('generatedHTML').textContent = row;
}

function Post() {
    var textEditor = document.getElementById('sampleeditor');
    addPostToContent(textEditor.innerHTML);
}

function createPost(post) {
    var elem = document.querySelector('#postTemp');
    var clone = elem.cloneNode(true);

    const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
    };
    postDatetime = new Date(post['date'] + ' ' + post['time']);
    date = postDatetime.toLocaleString("default", options);

    clone.id = 'post-' + post['postNumber'];
    clone.style = 'display: block';
    clone.className += ' post-container';
    clone.getElementsByClassName("post-image")[0].src = post['picture'];
    clone.getElementsByClassName("image-overlay")[0].textContent = "Reference: " + post['picture'].split('/').slice(0, 3).join('/');
    clone.getElementsByClassName("post-title")[0].innerHTML = "<h3><b>" + post['title'] + "</b></h3><h5>" + post['subtitle'] +
        ", <span class='w3-opacity'>" + date + "</span></h5>";
    clone.getElementsByClassName("post-content")[0].innerHTML = post['content'];
    clone.getElementsByClassName("post-comment")[0].href = "mailto:abolhoseini.sina@gmail.com?subject=Blog post: " + post['title'];
    clone.getElementsByClassName("post-category")[0].innerHTML = "Category: <a href='#'>" + post['subject'] + "</a>"
    elem.before(clone);
}

function createPopularPost(post) {
    var elem = document.querySelector('#popularPostTemp');
    var clone = elem.cloneNode(true);

    clone.getElementsByClassName("popular-post-image")[0].src = post['picture'];
    clone.getElementsByClassName("popular-post-title")[0].innerHTML = post['title'];
    clone.getElementsByClassName("popular-post-subtitle")[0].innerHTML = post['subtitle'];

    elem.after(clone);
}

function filterPosts(subject, pageNumber, callback) {
    $.ajax({
        type: "GET",
        url: "https://raw.githubusercontent.com/abolhoseinisina/abolhoseinisina.github.io/main/content/posts.csv",
        dataType: "text",
        success: function (posts) {
            posts = $.csv.toObjects(posts);
            document.querySelectorAll('.post-container').forEach(el => el.remove());
            subjectPosts = []
            for (let i = 0; i < posts.length; i++) {
                if (subject === 'all') {
                    subjectPosts.push(posts[posts.length - 1 - i])
                } else if (posts[posts.length - 1 - i]['subject'] === subject) {
                    subjectPosts.push(posts[posts.length - 1 - i])
                }
            }
            
            for (let i = (pageNumber - 1) * numberOfPostInAPage; i < Math.min(pageNumber * numberOfPostInAPage, subjectPosts.length); i++) {
                callback(subjectPosts[i])
            }
            
            createPaginationButtons(subjectPosts.length)
            setPageNumber(pageNumber);
            setPageCategory(subject);
        }
    });
}

function createSubjectButton(subject) {
    var elem = document.querySelector('.category-button');
    button = "<button id='category-" + subject + "' class='w3-button w3-khaki w3-xlarge category-button' style='width:20%; text-transform: capitalize;' onclick='filterPosts(" + '"' + subject + '"' + ", 1, createPost)'>" + subject + "</button>";
    elem.innerHTML = elem.innerHTML + button;
}

function checkWebLocation() {
    switch (window.location.protocol) {
        case 'http:':
        case 'https:':
            document.getElementById('postEditor').style = 'display: none';
            console.log('In production mode.')
            break;
        case 'file:':
            document.getElementById('postEditor').style = 'display: block';
            console.log('In editor mode.')
            break;
        default:
            document.getElementById('postEditor').style = 'display: none';
            console.log('Could not detect where you are working!')
    }
}

function setPageNumber(number) {
    document.getElementById('page-number').innerText = number;
    elems = document.getElementsByClassName('pagination-button');
    for(let i = 0; i < elems.length; i++){
        elems[i].classList.remove('w3-yellow');
    }
    document.getElementById('pagination-' + number).classList.add('w3-yellow');
}

function setPageCategory(category) {
    document.getElementById('page-category').innerText = category;
    elems = document.getElementsByClassName('category-button');
    for(let i = 0; i < elems.length; i++){
        elems[i].classList.remove('w3-yellow');
    }
    document.getElementById('category-' + category).classList.add('w3-yellow');
}

function getPageNumber() {
    return parseInt(document.getElementById('page-number').innerText);
}

function getPageCategory() {
    return document.getElementById('page-category').innerText;
}

function gotoPage(pageNumber) {
    setPageNumber(pageNumber);
    filterPosts(getPageCategory(), getPageNumber(), createPost);
}

function createPaginationButtons(postsNumber) {
    elem = document.getElementById('pagination-buttons');
    elem.innerHTML = null;
    for (let i = 0; i < postsNumber / numberOfPostInAPage; i++) {
        button = "<button class='w3-button w3-khaki w3-small pagination-button' id='pagination-" + (i + 1) + "' style='text-transform: capitalize;' onclick='gotoPage(" + (i + 1) + ")'>" + (i + 1) + "</button>";
        elem.innerHTML = elem.innerHTML + button;
    }
}

function setCounter(){
    $.ajax({
        type: "GET",
        url: 'https://api.counterapi.dev/v1/abolhoseinisina/blog/up',
        success: function (counter) {
            $("#visitors").text(counter.count);
        },
        error: function (error){
            $("#visitors").text('#');
        }
    });
}

$(document).ready(function () {
    document.getElementById('sampleeditor').setAttribute('contenteditable', 'true');
    setCounter();
    checkWebLocation();
    $.ajax({
        type: "GET",
        url: "https://raw.githubusercontent.com/abolhoseinisina/abolhoseinisina.github.io/main/content/posts.csv",
        dataType: "text",
        success: function (posts) {
            posts = $.csv.toObjects(posts);
            subjects = _.keys(_.countBy(posts, function (posts) { return posts.subject; }));
            createSubjectButton('all');
            for (let i = 0; i < subjects.length; i++) {
                createSubjectButton(subjects[i]);
            }
            setPageCategory('all');
            createPaginationButtons(posts.length);
            setPageNumber(1);
            
            for (let i = getPageNumber() - 1; i < Math.min(getPageNumber() * numberOfPostInAPage, posts.length); i++) {
                createPost(posts[posts.length - 1 - i]);
            }

            for (let i = 0; i < 3; i++) {
                if (posts[i] != undefined) {
                    createPopularPost(posts[posts.length - 1 - i])
                }
            }

            var elem = document.querySelector('#popularPostTemp');
            elem.remove();

        }
    });
});