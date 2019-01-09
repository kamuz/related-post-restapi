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
                // Set up HTML to be added
                var related_loop =  '<aside class="related-post clear">' +
                                    '<a href="' + object.link + '">' +
                                    '<h3 class="related-post-title">' + object.title.rendered + '</h3>' +
                                    '<div class="related-excerpt">' +
                                    object.excerpt.rendered +
                                    '</div>' +
                                    '</a>' +
                                    '</aside>';

                // Append HTML to existing content
                $('#related-posts').append(related_loop);
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