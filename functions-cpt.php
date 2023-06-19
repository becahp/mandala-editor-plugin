<?php


/**
 * Criar CPT da mandala
 */

function registrar_mandala_cpt()
{
    $nome_slug = 'mandala';

    $labels = array(
        'name'                  => _x('Mandalas', 'Nome geral do tipo de conteúdo', 'text_domain'),
        'singular_name'         => _x('Mandala', 'Nome singular do tipo de conteúdo', 'text_domain'),
        'menu_name'             => __('Mandalas', 'text_domain'),
        'name_admin_bar'        => __('Mandala', 'text_domain'),
        'add_new'               => __('Adicionar nova', 'text_domain'),
        'add_new_item'          => __('Adicionar nova mandala', 'text_domain'),
        'new_item'              => __('Nova mandala', 'text_domain'),
        'edit_item'             => __('Editar mandala', 'text_domain'),
        'view_item'             => __('Ver mandala', 'text_domain'),
        'all_items'             => __('Todas as mandalas', 'text_domain'),
        'search_items'          => __('Buscar mandalas', 'text_domain'),
        'parent_item_colon'     => __('Mandala pai:', 'text_domain'),
        'not_found'             => __('Nenhuma mandala encontrada.', 'text_domain'),
        'not_found_in_trash'    => __('Nenhuma mandala encontrada na lixeira.', 'text_domain'),
        'featured_image'        => __('Imagem destacada', 'text_domain'),
        'set_featured_image'    => __('Definir imagem destacada', 'text_domain'),
        'remove_featured_image' => __('Remover imagem destacada', 'text_domain'),
        'use_featured_image'    => __('Usar como imagem destacada', 'text_domain'),
        'archives'              => __('Arquivos de mandalas', 'text_domain'),
        'insert_into_item'      => __('Inserir na mandala', 'text_domain'),
        'uploaded_to_this_item' => __('Enviado para esta mandala', 'text_domain'),
        'filter_items_list'     => __('Filtrar lista de mandalas', 'text_domain'),
        'items_list_navigation' => __('Navegação da lista de mandalas', 'text_domain'),
        'items_list'            => __('Lista de mandalas', 'text_domain'),
    );

    $args = [
        'label' => __('Mandala', 'text_domain'),
        'description' => __('Tipo de conteúdo para mandalas', 'text_domain'),
        'labels' => $labels,
        "public" => true,
        "publicly_queryable" => true,
        "show_ui" => true,
        "show_in_rest" => true,
        "rest_base" => "mandala",
        "rest_controller_class" => "WP_REST_Posts_Controller",
        "rest_namespace" => "wp/v2",
        "has_archive" => true,
        "show_in_menu" => true,
        "show_in_nav_menus" => true,
        "delete_with_user" => false,
        "exclude_from_search" => true,
        "capability_type" => "post",
        "map_meta_cap" => true,
        "hierarchical" => false,
        "can_export" => false,
        "rewrite" => ["slug" => $nome_slug, "with_front" => true],
        "query_var" => true,
        "menu_position" => 6,
        "menu_icon" => "dashicons-search",
        "supports" => ["title", "author", "thumbnail", "excerpt"],
        "show_in_graphql" => false,
    ];

    register_post_type($nome_slug, $args);
}
add_action('init', 'registrar_mandala_cpt');


/** Dados versão json em texto ***************************************************************************************/


// Cria o campo personalizado para o seu CPT
function adicionar_meta_box_mandala()
{
    add_meta_box(
        'meta_box_mandala', // ID do campo personalizado
        'Dados da Mandala', // Título do campo personalizado
        'callback_meta_box_mandala', // Função que irá gerar o conteúdo do campo personalizado
        'mandala', // Slug do CPT para o qual este campo será adicionado
        'side', // Contexto em que o campo será exibido (normal, side, advanced)
        'default' // Prioridade do campo (high, core, default, low)
    );
}
add_action('add_meta_boxes', 'adicionar_meta_box_mandala');

// Gera o conteúdo do campo personalizado
function callback_meta_box_mandala($post)
{
    // Recupera o valor atual do campo personalizado, se já existir
    $valor_atual = get_post_meta($post->ID, 'dados', true);
?>
    <label for="dados">Dados da Mandala</label>
    <textarea readonly class="dados-mostrar" rows="1" cols="40" name="dados" id="dados" style="width:100%" value="<?php echo esc_attr($valor_atual); ?>"><?php echo esc_attr($valor_atual); ?></textarea>

    <?php
}

// Salva o valor do campo personalizado
function salvar_meta_box_mandala($post_id)
{

    // Salva o valor do campo personalizado
    if (isset($_POST['dados'])) {

        update_post_meta($post_id, 'dados', sanitize_text_field($_POST['dados']));

        //https://wordpress.stackexchange.com/questions/404161/how-to-store-and-return-json-in-a-custom-post-meta-field
        //echo sanitize_text_field($_POST['dados']);
    }
}
// removi essa função pois está sendo feito por ajax
// add_action('save_post_mandala', 'salvar_meta_box_mandala');


/** Códigos para edição rápida ***************************************************************************************/

// Add the custom columns to the book post type:
add_filter('manage_mandala_posts_columns', 'set_custom_edit_mandala_columns');
function set_custom_edit_mandala_columns($columns)
{
    // unset( $columns['author'] );
    $columns['shortcode'] = __('Shortcode', 'your_text_domain');
    $columns['dados'] = __('Dados', 'your_text_domain');

    return $columns;
}

// Add the data to the custom columns for the book post type:
add_action('manage_mandala_posts_custom_column', 'custom_mandala_column', 10, 2);
function custom_mandala_column($column, $post_id)
{
    switch ($column) {
        case 'shortcode':
            ob_start();
    ?>
            <span>
                <input type="text" onfocus="this.select();" readonly="readonly" style="width: 220px;" value="[shortcode_mandala id='<?php echo esc_attr($post_id); ?>']">
            </span>
    <?php

            ob_get_contents();
            break;

        case 'dados':
            echo wp_trim_words(get_post_meta($post_id, 'dados', true), 20);
            break;
    }
}



/** Dados versão json em OrgChart  ***************************************************************************************/

// Cria o campo personalizado para o seu CPT
function adicionar_meta_box_mandala_orgchart()
{
    add_meta_box(
        'meta_box_mandala_orgchart', // ID do campo personalizado
        'Edite a Mandala', // Título do campo personalizado
        'callback_meta_box_mandala_orgchart', // Função que irá gerar o conteúdo do campo personalizado
        'mandala', // Slug do CPT para o qual este campo será adicionado
        'normal', // Contexto em que o campo será exibido (normal, side, advanced)
        'high' // Prioridade do campo (high, core, default, low)
    );
}
add_action('add_meta_boxes', 'adicionar_meta_box_mandala_orgchart');

// Gera o conteúdo do campo personalizado
function callback_meta_box_mandala_orgchart($post)
{
    // Recupera o valor atual do campo personalizado, se já existir
    // $valor_atual = get_post_meta($post->ID, 'dados', true);
    ?>
    <h2> Edite a Mandala </h2>
    <button type='button' id='btn-mostrar'>MOSTRAR - OK</button>
    <button type='button' id='btn-carregar'>CARREGAR - OK</button>
    <button type='button' id='btn-download'>DOWNLOAD - OK</button>
    <button type='button' id='btn-save'>SAVE</button>

    <button type='button' id='btn-show-all'>Mostrar todos os nós</button>
    <button type='button' id='btn-hide-all'>Esconder todos os nós</button>

    <div id="orgChartContainer" style="overflow: auto;">
        <div id="orgChart"></div>
    </div>

<?php
}

// Necessário para disponibilizar os dados na wp/v2/mandala, que será chamado pelo javascript
register_rest_field('mandala', 'dados', array(
    'get_callback' => function ($data) {
        return get_post_meta($data['id'], 'dados', true);
    },
));


// Função para carregar o estilo personalizado
function carregar_estilo_mandala_orgchart()
{
    $ver = time();
    global $typenow;

    if ($typenow == 'mandala') {
        // wp_register_style('css_mandala_edit', MANDALA_CSS_URL . 'mandala-editor.css', false, $ver);
        // wp_enqueue_style('css_mandala_edit');

        // Registra e enfileira os estilos necessários
        wp_register_style('css_orgchart', MANDALA_CSS_URL . 'jquery.orgchart.css', false, $ver);
        wp_enqueue_style('css_orgchart');
    }
}
add_action('admin_print_styles-post.php', 'carregar_estilo_mandala_orgchart');
add_action('admin_print_styles-post-new.php', 'carregar_estilo_mandala_orgchart');


// Função para carregar o estilo personalizado
function carregar_scripts_mandala_orgchart()
{
    $ver = time();
    global $typenow;

    if ($typenow == 'mandala') {
        // Registra e enfileira os scripts necessários, definindo dependências de outros scripts
        wp_enqueue_script('js_mandala_admin', MANDALA_JS_URL . 'functions-editor-cpt.js', array('js_orgchart', 'wp-api'), $ver);
        wp_enqueue_script('js_orgchart', MANDALA_JS_URL . 'jquery.orgchart.js', array('jquery'), $ver);
    }
}
add_action('admin_print_scripts-post.php', 'carregar_scripts_mandala_orgchart');
add_action('admin_print_scripts-post-new.php', 'carregar_scripts_mandala_orgchart');


function salvar_dados_mandala()
{
    // Recebe o conteúdo da Mandala em formato JSON por meio da variável 
    $json_content = sanitize_text_field($_POST['json_content']);
    // recebe o post id
    $post_id = sanitize_text_field($_POST['post_id']);

    // Tenta realizar o update do post meta
    $resultado = update_post_meta($post_id, 'dados', $json_content);

    // Informa ao usuário que os dados foram salvos com sucesso.
    if ($resultado) {
        echo 'Dados salvos na mandala!';
    } else {
        echo 'ERRO';
    }

    // Finaliza a execução da requisição AJAX.
    wp_die();
}
add_action('wp_ajax_salvar_dados_mandala', 'salvar_dados_mandala');
