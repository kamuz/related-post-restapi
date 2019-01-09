# Связанные записи с использованием REST API

## Что такое WordPress REST API

**WordPress REST API** - это RESTful API, который может быть доступен через простые HTTP запросы для доступа к данным сайта в JSON формате. WordPress REST API - это новый вид доступа к данным WordPress без использования системы темизации, RSS или XML-RPC.

С использованием WordPress REST API у вас есть возможность создавать CRUD приложение, то есть мы можете считывать, создавать, редактировать и удалять данные без взаимодействия с WordPress напрямую без использования админки WordPress.

При стандартном подходе, вы можете использовать WordPress только в браузере, но с использованием WP REST API вы можете взаимодействовать с WordPress через мобильные или десктопные приложения, предоставлять данные для сторонних сервисов или использовать данные сайта для веб-приложений или в WordPress плагинах, а также вы использовать любое приложение или любой язык программирования для взаимодействия или использования возможностей вашего сайта.

## Что такое REST и JSON

**REST** - это акроним для **RE**presantational **S**tate **T**ransfer.

**REST** - это архитектура приложения для веб. **RESTful application** обычное приложение, которое использует стандартные запросы **GET**, **POST**, **PUT**, **DELETE** для получения/отправки данных от/к удалённому серверу.

RESTful приложение использует ресурсы (**resources**), что фактически представляют собой URL для взаимодействия с внешними системами.

**API** - это акроним для **A**pplication **P**rogramming **I**nterface. API это набор подпрограмм, протоколов и инструментов создания приложений и интерфейсов. Мы часто используете API даже тогда когда об этом не знаете, например Google Map.

В итоге **RESTful API** - это интерфейс прикладного программирования, который использует URL ресурсы для выполнения операций на удалённом сервере через HTTP запросы.

Вы можете отправлять URL к серверу и получать обратно данные в JSON формате. JSON обычно используется для ассинхронных взаимодействий между браузером и сервером.

**Endpoint** (конечная точка) - это функции доступны через API в форме глаголов **GET**, **POST**, **PUT**, **DELETE**. Конечная точка выполняет определённую функцию с переданными параметрами и возвратом результата клиенту.

**Route** (маршрут) - это имя используемое для доступа к доступным конечным точкам.

`GET wp/v2/posts/5`, где `GET` - конечная точка, `wp/v2/posts/` - роут. Возвратит данные для поста с ID 5 в виде объекта.
`PUT wp/v2/posts/5` - обновит данные, `DELETE wp/v2/posts/5` - удалит текущий пост.

* **API index** - `GET /wp-json/wp/v2/` мы получаем список всех дефолтных роутов и конечных точек, а также список аргументов.
* **Post index** (10 latest posts) - `GET /wp-json/wp/v2/posts`
* **Post index** (2 posts) - `GET /wp-json/wp/v2/posts?per_page=2`
* **Single post based on ID** - `GET /wp-json/wp/v2/posts/{post_id}`
* **Page index** (10 latest pages) - `GET /wp-json/wp/v2/pages`
* **Page index** (2 pages) - `GET /wp-json/wp/v2/pages?per_page=2`
* **Single page based on ID** - `GET /wp-json/wp/v2/pages/{post_id}`
* **Category index** (10 first categories, alpabetically) - `GET /wp-json/wp/v2/categories`
* **Category index** (2 categories) - `GET /wp-json/wp/v2/categories?per_page=3`
* **Single category based on ID** - `GET /wp-json/wp/v2/categories/{post_id}`
* **Tag index** (10 first tags, alpabetically) - `GET /wp-json/wp/v2/tags`
* **Tag index** (2 tags) - `GET /wp-json/wp/v2/tags?per_page=3`
* **Single tag based on ID** - `GET /wp-json/wp/v2/tags/{post_id}`
* **Post in category based on category IDs** - `GET /wp/v2/posts?categories=198,4`
* **Post in category and tag by ID** - `GET /wp-json/wp/v2/posts?tags=199&categories=4`
* **User index** (10 recent) - `GET /wp-json/wp/v2/users`
* **Current logged in user** - `GET /wp-json/wp/v2/users/me`
* **Single user by ID** - `GET /wp-json/wp/v2/users/1`
* **Comments index** (10 recent) - `GET /wp-json/wp/v2/comments`
* **10 latest comments on specific post based on post ID** - `GET /wp-json/wp/v2/comments?post=6`

Чтобы найти похожие записи нам нужно подставлять посты из той же категории что и текущий пост. Для этого нам подойдёт примерно такой URL для WP REST API: `GET /wp-json/wp/v2/posts?categories=198,4&per_page=2`.

В самом начале создадим хедер для основного файла плагина:

*wp-content/plugins/kmz-related-posts-restapi/kmz-related-posts-restapi.php*

```php
<?php
/*
Plugin Name: KMZ Related Posts REST
Description: Display links to related posts through the WP REST API
Version: 0.1
Author: Vladimir Kamuz
Author URI: https://wpdev.pp.ua
Plugin URI: https://wpdev.pp.ua/kmzrel_rest
Licence: GPL2
Text Domain: kmzrelrest
*/
```

Подключим CSS:

*wp-content/plugins/kmz-related-posts-restapi/kmz-related-posts-restapi.php*

```php
/**
 * Load CSS and JavaScript files
 */
function kmzrelrest_css_js() {
    if( is_single() && is_main_query() ) {
        // Get plugin styles
        wp_enqueue_style( 'kmzrelres_main_css', plugin_dir_url(__FILE__) . 'css/style.css', '0.1', 'all' );
    }
}
add_action( 'wp_enqueue_scripts', 'kmzrelrest_css_js' );
```

Выведем пока что тестовый блок после контента статьи:

*wp-content/plugins/kmz-related-posts-restapi/kmz-related-posts-restapi.php*

```php
/**
 * Output HTML onto bottom of sinle post
 */
function kmzrelrest_display($content){
    if( is_single() && is_main_query() ) {
        $content .= '<h3>Hello, REST API</h3>';
    }
    return $content;
}
add_filter( 'the_content', 'kmzrelrest_display' );
```

Теперь на нескольких строках выведем уже кнопку, которая нам уже будет полезная:

*wp-content/plugins/kmz-related-posts-restapi/kmz-related-posts-restapi.php*

```php
/**
 * Output HTML onto bottom of sinle post
 */
function kmzrelrest_display($content){
    if( is_single() && is_main_query() ) {
        $content  = '<section id="related-posts" class="related-posts">';
        $content .= '<a href="#" class="get-related-posts">Get related posts</a>';
        $content .= '<div class="ajax-loader"><img src="' . plugin_dir_url( __FILE__ ) . 'css/spinner.svg" width="32" height="32" /></div>';
        $content .= '</section><!-- .related-posts -->';
    }
    return $content;
}
add_filter( 'the_content', 'kmzrelrest_display' );
```

Видим что уже применились наши стили, также анимационный спинер у нас по умолчанию скрывается.

Теперь сформируем URL для REST API, которым будет генерировать динамически для текущей страницы:

*wp-content/plugins/kmz-related-posts-restapi/kmz-related-posts-restapi.php*

```php
/**
 * Create REST API URL
 * - Get the current categories
 * - Get the category IDs
 * - Create the arguments for categories and pagination
 * - Create URL (example - /wp-json/wp/v2/posts?categories=198,4&per_page=5)
 */
function kmzrelrest_get_json_query(){
    $cats = get_the_category();
    $cat_ids = array();
    foreach( $cats as $cat ) {
        $cat_ids[] = $cat->term_id;
    }

    $args = array(
        'categories' => implode(",", $cat_ids),
        'per_page' => 5
    );

    $url = add_query_arg( $args, rest_url('wp/v2/posts') );

    return $url;
}
```

Проверим результат:

*wp-content/plugins/kmz-related-posts-restapi/kmz-related-posts-restapi.php*

```php
function kmzrelrest_display($content){
    if( is_single() && is_main_query() ) {
        $content .= '<a href="' . kmzrelrest_get_json_query() . '">' . kmzrelrest_get_json_query() . '</a>';
        $content .= '<section id="related-posts" class="related-posts">';
        //..
```

Создадим файл скриптов, в котором пока что создадим обработчик кнопки по клику:

*wp-content/plugins/kmz-related-posts-restapi/js/script.js*

```js
(function($){
    $('.get-related-posts').on('click', function(event){
        event.preventDefault();
        console.log("Click!!!");
    })
})(jQuery);
```

Подключим скрипт и проверим работу по клику:

*wp-content/plugins/kmz-related-posts-restapi/kmz-related-posts-restapi.php*

```php
function kmzrelrest_css_js() {
    if( is_single() && is_main_query() ) {
        // Get plugin styles
        wp_enqueue_style( 'kmzrelres_main_css', plugin_dir_url(__FILE__) . 'css/style.css', '0.1', 'all' );
        wp_enqueue_script( 'kmzrelres_main_js', plugin_dir_url(__FILE__) . 'js/script.js', array('jquery'), '0.1', true );
    }
}
```

В WordPress есть функция `wp_localize_script()`, которая как правило используется для того чтобы передавать переменные перевода в JavaScript, но в нашем случае эта функция удобна тем что с её помощью мы можем передавать данные из PHP в наш JavaScript файл, например URL для REST API и любую другую информацию. Данная функция принимает три параметра: идентификатор подключённого JavaScript файла, префикс передаваемый в переменную и массив передаваемых данных.

Передадим созданные ранее URL и ID текущего поста:

*wp-content/plugins/kmz-related-posts-restapi/kmz-related-posts-restapi.php*

```php
/**
 * Load CSS and JavaScript files
 */
function kmzrelrest_css_js() {
    if( is_single() && is_main_query() ) {
        // Get plugin styles
        wp_enqueue_style( 'kmzrelres_main_css', plugin_dir_url(__FILE__) . 'css/style.css', '0.1', 'all' );
        wp_enqueue_script( 'kmzrelres_main_js', plugin_dir_url(__FILE__) . 'js/script.js', array('jquery'), '0.1', true );

        global $post;
        $post_id = $post->ID;

        // Send data to JavaScript
        wp_localize_script('kmzrelres_main_js', 'postdata',
            array(
                'json_url' => kmzrelrest_get_json_query(),
                'post_id' => $post_id
            )
        );
    }
}
```

Теперь выведем эти данные в консоль при клике:

*wp-content/plugins/kmz-related-posts-restapi/js/script.js*

```js
(function($){
    $('.get-related-posts').on('click', function(event){
        event.preventDefault();
        var jsonUrl = postdata.json_url;
        var postId = postdata.post_id;
        console.log(jsonUrl);
        console.log(postId);
    })
})(jQuery);
```

Теперь получим первый результат в результате AJAX запроса:

*wp-content/plugins/kmz-related-posts-restapi/js/script.js*

```js
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
```

Добавим чуть больше деталей:

*wp-content/plugins/kmz-related-posts-restapi/js/script.js*

```js
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
```

Скроем лишнее из анотации:

*wp-content/plugins/kmz-related-posts-restapi/kmz-related-posts-restapi.php*

```php
/**
 * Remove Read More links from all excerpts
 */
function custom_excerpt_more( $more ) {
    return '…';
}
add_filter( 'excerpt_more', 'custom_excerpt_more', 100);
```