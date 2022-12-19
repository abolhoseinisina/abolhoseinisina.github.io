function format(command, value) {
    document.execCommand(command, false, value);
}

function setUrl() {
    var url = document.getElementById('txtFormatUrl').value;
    var sText = document.getSelection();
    document.execCommand('insertHTML', false, '<a href="' + url + '" target="_blank">' + sText + '</a>');
    document.getElementById('txtFormatUrl').value = '';
}

function setImage(){
    var url = document.getElementById('imgFromUrl').value;
    var imgWidth = document.getElementById('imgWidth').value;
    previousContent = document.getElementById('sampleeditor').innerHTML;
    document.getElementById('sampleeditor').innerHTML = previousContent + '<br><img src="' + url + '" width="' + imgWidth + '" /><br>'
}

function addPostToContent(content){
    console.log(content)
}

function Post(){
    var textEditor = document.getElementById('sampleeditor');
    addPostToContent(textEditor.innerHTML);
}

function createPost(post){
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
    clone.getElementsByClassName("post-image")[0].src = post['picture'];
    clone.getElementsByClassName("post-title")[0].innerHTML = "<h3><b>" + post['title'] + "</b></h3><h5>" + post['subtitle'] + 
                                                              ", <span class='w3-opacity'>" + date + "</span></h5>";
    clone.getElementsByClassName("post-content")[0].innerHTML = post['content'];
    clone.getElementsByClassName("post-comment")[0].href = "mailto:abolhoseini.sina@gmail.com?subject=Blog post: " + post['title'];
    clone.getElementsByClassName("post-category")[0].innerHTML = "Category: <a href='#'>" + post['subject'] + "</a>"
    elem.before(clone);   
}

function createPopularPost(post){
    var elem = document.querySelector('#popularPostTemp');
    var clone = elem.cloneNode(true);
    
    clone.getElementsByClassName("popular-post-image")[0].src = post['picture'];
    clone.getElementsByClassName("popular-post-title")[0].innerHTML = post['title'];
    clone.getElementsByClassName("popular-post-subtitle")[0].innerHTML = post['subtitle'];
    
    elem.after(clone);
}

function checkWebLocation(){
    switch(window.location.protocol) {
        case 'http:':
        case 'https:':
            document.getElementById('postEditor').style = 'display: none';
            console.log('Not in editor mode.')
            break;
        case 'file:':
            document.getElementById('postEditor').style = 'display: block';
            console.log('In editor mode.')
            break;
        default: 
            document.getElementById('postEditor').style = 'display: none';
            console.log('I could not detect where you are working!')
     }
}

$(document).ready(function() {
    document.getElementById('sampleeditor').setAttribute('contenteditable', 'true');
    checkWebLocation();

    $.ajax({
        type: "GET",
        url: "https://raw.githubusercontent.com/abolhoseinisina/abolhoseinisina.github.io/main/content/posts.csv",
        dataType: "text",
        success: function(posts) {
            posts = $.csv.toObjects(posts);
            
            for (let i = 0; i < posts.length; i++) {
                createPost(posts[posts.length - 1 - i]);
            }
            
            for (let i = 0; i < 3; i++) {
                if(posts[i] != undefined){
                    createPopularPost(posts[posts.length - 1 - i])
                }
            }

            var elem = document.querySelector('#postTemp');
            elem.remove();
            var elem = document.querySelector('#popularPostTemp');
            elem.remove();
        }
     });
});