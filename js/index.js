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

$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "https://raw.githubusercontent.com/abolhoseinisina/abolhoseinisina.github.io/main/content/posts.csv",
        dataType: "text",
        success: function(posts) {
            posts = $.csv.toObjects(posts);
            
            for (let i = 0; i < posts.length; i++) {
                createPost(posts[i]);
            }
            
            for (let i = 0; i < 3; i++) {
                if(posts[i] != undefined){
                    createPopularPost(posts[i])
                }
            }

            var elem = document.querySelector('#postTemp');
            elem.remove();
            var elem = document.querySelector('#popularPostTemp');
            elem.remove();
        }
     });
});