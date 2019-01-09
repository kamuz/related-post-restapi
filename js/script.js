(function($){
    $('.get-related-posts').on('click', function(event){
        event.preventDefault();
        var jsonUrl = postdata.json_url;
        var postId = postdata.post_id;

        // The AJAX request
        $.ajax({
            dataType: 'json',
            url: jsonUrl
        })

        .done(function(response){
            console.log(response);
            // Loop throught each of the related posts
            $.each(response, function(index, object){
                $('#related-posts').append('<h3>' + object.title.rendered + '</h3>');
            });
        })

        .fail(function(){
            console.log('Sorry, AJAX request failed!');
        })

        .always(function(){
            console.log('Complete!');
        });

    })
})(jQuery);