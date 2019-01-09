(function($){
    $('.get-related-posts').on('click', function(event){
        event.preventDefault();
        var jsonUrl = postdata.json_url;
        var postId = postdata.post_id;
        console.log(jsonUrl);
        console.log(postId);
    })
})(jQuery);