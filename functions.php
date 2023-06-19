<?php

/** 
 * Plugin Name: Mandala Plugin Ibict
 * Plugin URI: https://github.com/becahp
 * Description: Implementa a mandala e o editor customizado
 * Version: 3.0
 * Author: Rebeca Moura
 * Author URI: https://github.com/becahp
 */

/**
Variáveis globais e definições -- TODO: deletar não usados
 */
define('MANDALA_PATH', plugin_dir_path(__FILE__) . '/');
define('MANDALA_JS_PATH', plugin_dir_path(__FILE__) . 'js/');
define('MANDALA_JS_URL', plugin_dir_url(__FILE__) . 'js/');
define('MANDALA_JS_ORG_URL', plugin_dir_url(__FILE__) . 'js-original/');
define('MANDALA_CSS_PATH', plugin_dir_path(__FILE__) . 'css/');
define('MANDALA_CSS_URL', plugin_dir_url(__FILE__) . 'css/');

/**
Carrega os scripts e estilos necessários para a exibição da Mandala.
@return void
 */
function mandalaScripts()
{
	// Versão dos arquivos, baseado no tempo atual em Unix timestamp
	$ver = time();

	// Carrega os scripts do Highcharts somente na página inicial
	if (is_front_page()) {
		wp_enqueue_script('js_mandala_hc', MANDALA_JS_URL . 'functions-highcharts.js', array('js_hc', 'js_hc_sunburst', 'js_hc_exporting', 'js_hc_export_data', 'js_hc_accessibility'), false, $ver);
		wp_enqueue_script('js_hc', MANDALA_JS_ORG_URL . 'highcharts.js', array(), $ver);
		wp_enqueue_script('js_hc_sunburst', MANDALA_JS_ORG_URL . 'sunburst.js', array(), $ver);
		wp_enqueue_script('js_hc_exporting', MANDALA_JS_ORG_URL . 'exporting.js', array(), $ver);
		wp_enqueue_script('js_hc_export_data', MANDALA_JS_ORG_URL . 'export-data.js', array(), $ver);
		wp_enqueue_script('js_hc_accessibility', MANDALA_JS_ORG_URL . 'accessibility.js', array(), $ver);
	}

	// Carrega o estilo CSS da Mandala
	wp_register_style('css_mandala_hc', MANDALA_CSS_URL . 'style-highcharts.css', false, $ver);
	wp_enqueue_style('css_mandala_hc');

	// Carrega o estilo CSS do breadcrumb
	wp_register_style('css_breadcrumb', MANDALA_CSS_URL . 'style-breadcrumb.css', false, $ver);
	wp_enqueue_style('css_breadcrumb');
}
add_action('wp_enqueue_scripts', 'mandalaScripts');


/**
Função que renderiza a mandala usando a biblioteca HighCharts a partir de um shortcode.
@param array $params - lista de parâmetros, não utilizados nesta função
@return string - retorna uma string contendo o HTML que renderiza a mandala da biblioteca HighCharts.
@shortcode shortcode_mandala_hc
Exemplo de uso: [shortcode_mandala_hc]
 **/
function mandalaHighCharts($params)
{
	$html = '<div class="highcharts-figure">
				<div id="container-mandala"></div>
			</div>';
	return $html;
}
// Adiciona o shortcode "shortcode_mandala_hc" para renderizar a mandala na página
add_shortcode('shortcode_mandala_hc', 'mandalaHighCharts');

/**
Adiciona uma nova página ao menu de administração do WordPress para o editor da Mandala.
A função utiliza o WordPress API add_menu_page() para criar uma nova página no menu admin e a
add_submenu_page() para adicionar uma subpágina de visualização da mandala.
@return void
 */
function mandala_menu()
{
	add_menu_page(
		__('Editor Mandala', 'mandala-plugin'), // Título da página
		__('Mandala', 'mandala-plugin'), // Título do menu
		'edit_posts', // Capacidade do usuário para acessar a página
		'mandala-editor', // Slug da página
		'mandala_admin_page' // Função de callback que renderiza a página
	);

	add_submenu_page(
		'mandala-editor', // Slug da página pai
		__('Visualizar Mandala', 'mandala-plugin'), // Título da subpágina
		__('Visualizar', 'mandala-plugin'), // Título do link no menu
		'manage_options', // Capacidade do usuário para acessar a página
		'mandala-view', // Slug da subpágina
		'mandala_admin_view' // Função de callback que renderiza a página
	);
}
add_action('admin_menu', 'mandala_menu');

/**
Define a página do editor da mandala no painel de administração do WordPress.
Ao acessar essa página, o usuário verá os botões "Salvar mandala", "Mostrar todos os nós" e "Esconder todos os nós", 
que permitem salvar as alterações realizadas, mostrar todos os nós da mandala ou esconder todos os nós, respectivamente. 
Além disso, o usuário verá o contêiner da mandala, definido pelo elemento "orgChartContainer", que contém o elemento "orgChart", onde a mandala é exibida.
Esses elementos possuem estilos para garantir que a mandala seja exibida corretamente na página.
@return void
 */
function mandala_admin_page()
{
?>
	<h1>Editor da Mandala:</h1>

	<button id='btn-save'>Salvar mandala</button>
	<button id='btn-show-all'>Mostrar todos os nós</button>
	<button id='btn-hide-all'>Esconder todos os nós</button>

	<div id="orgChartContainer" style="overflow: auto;">
		<div id="orgChart"></div>
	</div>
	<div id="consoleOutput"></div>

<?php
}

/**
Define a página do visualizador da mandala no painel de administração do WordPress.
Ao acessar essa página, o usuário verá o título "Visualizador da Mandala" e a mandala será exibida utilizando o shortcode "[shortcode_mandala_hc]".
O elemento contendo a mandala é definido dentro de um elemento "div" com largura definida em 50% para melhor visualização.
@return void
 */
function mandala_admin_view()
{
	echo '<h1>Visualizador da Mandala:</h1>';
	echo '<div style="width: 50%;">';
	echo do_shortcode('[shortcode_mandala_hc]');
	echo ' </div>';
}


/**
Adiciona estilos e scripts às páginas personalizadas do painel de administração do WordPress para o Editor da Mandala.
Verifica se o hook da página é 'toplevel_page_mandala-editor' para registrar e enfileirar os estilos e scripts necessários.
Os estilos adicionados incluem 'jquery.orgchart.css'. Os scripts adicionados incluem 'functions-editor.js', 'jquery.orgchart.js' e 'jquery'.
@param string $hook O hook da página no painel de administração do WordPress.
@return void
 */
function load_custom_wp_mandala_editor($hook)
{
	// Versão dos arquivos, baseado no tempo atual em Unix timestamp
	$ver = time();

	// Verifica se o hook da página é 'toplevel_page_mandala-editor' para registrar e enfileirar os estilos e scripts necessários
	if ($hook != 'toplevel_page_mandala-editor') {
		return;
	}

	// Registra e enfileira os estilos necessários
	wp_register_style('css_orgchart', MANDALA_CSS_URL . 'jquery.orgchart.css', false, $ver);
	wp_enqueue_style('css_orgchart');

	// Registra e enfileira os scripts necessários, definindo dependências de outros scripts
	wp_enqueue_script('js_mandala_admin', MANDALA_JS_URL . 'functions-editor.js', array('js_orgchart'), $ver);
	wp_enqueue_script('js_orgchart', MANDALA_JS_URL . 'jquery.orgchart.js', array('jquery'), $ver);
}
add_action('admin_enqueue_scripts', 'load_custom_wp_mandala_editor');


/**
Adiciona estilos e scripts às páginas personalizadas do painel de administração do WordPress para o Visualizador da Mandala.
Verifica se o hook da página é 'toplevel_page_mandala-view' para registrar e enfileirar os estilos e scripts necessários.
Os scripts adicionados incluem 'functions-highcharts.js', 'highcharts.js', 'sunburst.js', 'exporting.js', 'export-data.js' e 'accessibility.js'
@param string $hook O hook da página no painel de administração do WordPress.
@return void
 */
function load_custom_wp_mandala_viewer($hook)
{
	// Versão dos arquivos, baseado no tempo atual em Unix timestamp
	$ver = time();

	// Verifica se o hook da página é 'toplevel_page_mandala-view' para registrar e enfileirar os estilos e scripts necessários
	if ($hook != 'mandala_page_mandala-view') {
		return;
	}

	// Registra e enfileira os scripts necessários, definindo dependências de outros scripts
	wp_enqueue_script('js_mandala_hc', MANDALA_JS_URL . 'functions-highcharts.js', array('js_hc', 'js_hc_sunburst', 'js_hc_exporting', 'js_hc_export_data', 'js_hc_accessibility'), false, $ver);
	wp_enqueue_script('js_hc', MANDALA_JS_ORG_URL . 'highcharts.js', array(), $ver);
	wp_enqueue_script('js_hc_sunburst', MANDALA_JS_ORG_URL . 'sunburst.js', array(), $ver);
	wp_enqueue_script('js_hc_exporting', MANDALA_JS_ORG_URL . 'exporting.js', array(), $ver);
	wp_enqueue_script('js_hc_export_data', MANDALA_JS_ORG_URL . 'export-data.js', array(), $ver);
	wp_enqueue_script('js_hc_accessibility', MANDALA_JS_ORG_URL . 'accessibility.js', array(), $ver);
}
add_action('admin_enqueue_scripts', 'load_custom_wp_mandala_viewer');


/**
Função para salvar os dados da Mandala em um arquivo de texto.
Esta função é chamada por meio de uma requisição AJAX e recebe o conteúdo
da Mandala em formato JSON. O conteúdo é então salvo em um arquivo de texto
e uma mensagem é retornada para o usuário informando que a operação foi concluída.
@return void
 */
function salvar_txt_mandala()
{
	// Recebe o conteúdo da Mandala em formato JSON por meio da variável 
	$json_content = $_POST['json_content'];

	$file_name = MANDALA_PATH . "dados-mandala.txt";
	$myfile = fopen($file_name, "w") or die("Unable to open file!");

	// Decodifica o conteúdo da Mandala para remover as barras invertidas e entidades HTML.
	$json_content_clean = html_entity_decode(stripslashes($json_content));

	// Adiciona uma quebra de linha entre os nós para facilitar a leitura do arquivo.
	$json_content_clean = str_replace("},{", "},\n{", $json_content_clean);

	// Escreve o conteúdo da Mandala no arquivo de texto.
	fwrite($myfile, $json_content_clean);
	fclose($myfile);

	// Informa ao usuário que os dados foram salvos com sucesso.
	echo 'Dados salvos na mandala!';

	backup_txt_mandala($file_name);

	// Finaliza a execução da requisição AJAX.
	wp_die();
}
add_action('wp_ajax_salvar_txt_mandala', 'salvar_txt_mandala');

/**
Faz o backup dos dados da mandala salvos em um arquivo de texto.
@param string $file_name O caminho completo do arquivo de texto com os dados da mandala.
@return void
 */
function backup_txt_mandala($file_name)
{
	$current_user = wp_get_current_user();
	$user_login = esc_html($current_user->user_login);
	$timestamp = str_replace(" ", "_", current_time('mysql'));

	$novo_nome = MANDALA_PATH . 'backup/' . $timestamp . '_dados-mandala_' . $user_login . '.txt';

	// Faz uma cópia do arquivo com os dados da mandala no diretório de backup.
	copy($file_name, $novo_nome);
}


include 'functions-cpt.php';