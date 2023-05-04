//Getting the form data
const postForm = document.getElementById("articlePostForm");
postForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(postForm);
    const articlePost = new ArticlePost;
    articlePost.createPost(formData);
});