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
                function get_featured_image(){
                    var feat_img;
                    if(object.featured_media == 0){
                        feat_img = '';
                    } else {
                        feat_img = '<img src="' + object._embedded['wp:featuredmedia'][0].media_details.sizes.thumbnail.source_url + '">'
                    }
                    return feat_img;
                }
                // Set up HTML to be added
                var related_loop =  '<aside class="related-post clear">' +
                                    '<a href="' + object.link + '">' +
                                    '<h3 class="related-post-title">' + object.title.rendered + '</h3>' +
                                    '<p class="related-author">by <em>' + object._embedded.author[0].name + '</em></div>' +
                                    '<div class="related-excerpt">' +
                                    '<figure class="related-featured">' +
                                    get_featured_image() + 
                                    '</figure>' +
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