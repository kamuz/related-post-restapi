(function($){
    $('.get-related-posts').on('click', function(event){
        event.preventDefault();
        
        $('.ajax-loader').show();
        $('a.get-related-posts').hide();

        var jsonUrl = postdata.json_url;
        var postId = postdata.post_id;

        // The AJAX request
        $.ajax({
            dataType: 'json',
            url: jsonUrl
        })

        .done(function(response){
            $('#related-posts').append('<h2>Related Posts:</h2>');
            // console.log(response);
            // Loop throught each of the related posts
            $.each(response, function(index, object){
                if(object.id == postId) return;
                function get_featured_image(){
                    var feat_img;
                    if(object.featured_media == 0){
                        feat_img = '';
                    } else {
                        feat_img = '<figure class="related-featured"><img src="' + object._embedded['wp:featuredmedia'][0].media_details.sizes.thumbnail.source_url + '" alt="' + object.title.rendered +'"></figure>';
                    }
                    return feat_img;
                }
                // Set up HTML to be added
                var related_loop =  '<aside class="related-post clear">' +
                                    '<a href="' + object.link + '">' +
                                    '<h3 class="related-post-title">' + object.title.rendered + '</h3>' +
                                    '<p class="related-author">by <em>' + object._embedded.author[0].name + '</em></div>' +
                                    '<div class="related-excerpt">' +
                                    get_featured_image() + 
                                    object.excerpt.rendered +
                                    '</div>' +
                                    '</a>' +
                                    '</aside>';
                $('.ajax-loader').hide();
                // Append HTML to existing content
                $('#related-posts').append(related_loop);
            });
        })

        .fail(function(){
        })

        .always(function(){
        });

    })
})(jQuery);