function createPost(post){
    var elem = document.querySelector('#postTemp');
    var clone = elem.cloneNode(true);
    clone.id = 'post-' + post['postNumber'];
    clone.getElementsByClassName("post-image")[0].src = post['picture'];
    clone.getElementsByClassName("post-title")[0].innerHTML = "<h3><b>" + post['title'] + "</b></h3><h5>" + post['subtitle'] + ", <span class='w3-opacity'>" + post['date'] + ', ' + post['time'] + "</span></h5>";
    clone.getElementsByClassName("post-content")[0].textContent = post['content'];
    clone.getElementsByClassName("post-comment")[0].href = "mailto:abolhoseini.sina@gmail.com?subject=Blog post: " + post['title'];
    elem.before(clone);   
}

$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "https://raw.githubusercontent.com/abolhoseinisina/abolhoseinisina.github.io/main/content/posts.csv",
        dataType: "text",
        success: function(posts) {
            console.log(posts)
            posts = $.csv.toObjects(posts);
            
            for (let i = 0; i < posts.length; i++) {
                createPost(posts[i]);
            }
            
            var elem = document.querySelector('#postTemp');
            elem.remove()
        }
     });
});