<?php
/** 
 * Plugin Name: Mandala Plugin Ibict
 * Plugin URI: https://github.com/becahp
 * Description: Implementa a mandala e o editor customizado
 * Version: 2.0 
 * Author: Rebeca Moura
 * Author URI: https://github.com/becahp
*/

//Definicoes
define('MANDALA_PATH', plugin_dir_path(__FILE__) . '/');
define('MANDALA_JS_PATH', plugin_dir_path(__FILE__) . 'js/');
define('MANDALA_JS_URL', plugin_dir_url(__FILE__) . 'js/');
define('MANDALA_JS_ORG_URL', plugin_dir_url(__FILE__) . 'js-original/');
define('MANDALA_CSS_PATH', plugin_dir_path(__FILE__) . 'css/');
define('MANDALA_CSS_URL', plugin_dir_url(__FILE__) . 'css/');

function mandalaScripts(){
	
	$ver = time();

	//Mandala highcharts : carregar js só na primeira página
	if (is_front_page()) {
		wp_enqueue_script( 'js_mandala_hc', MANDALA_JS_URL . 'functions-highcharts.js' , array('js_hc', 'js_hc_sunburst', 'js_hc_exporting', 'js_hc_export_data', 'js_hc_accessibility'), false, $ver );
		wp_enqueue_script( 'js_hc', MANDALA_JS_ORG_URL . 'highcharts.js' , array(), $ver );
		wp_enqueue_script( 'js_hc_sunburst', MANDALA_JS_ORG_URL . 'sunburst.js' , array(), $ver );
		wp_enqueue_script( 'js_hc_exporting', MANDALA_JS_ORG_URL . 'exporting.js' , array(), $ver );
		wp_enqueue_script( 'js_hc_export_data', MANDALA_JS_ORG_URL . 'export-data.js' , array(), $ver );
		wp_enqueue_script( 'js_hc_accessibility', MANDALA_JS_ORG_URL . 'accessibility.js' , array(), $ver );
	}

	wp_register_style( 'css_mandala_hc', MANDALA_CSS_URL . 'style-highcharts.css', false, $ver );
	wp_enqueue_style ( 'css_mandala_hc' );

	wp_register_style( 'css_breadcrumb', MANDALA_CSS_URL . 'style-breadcrumb.css', false, $ver );
	wp_enqueue_style ( 'css_breadcrumb' );
}
add_action('wp_enqueue_scripts', 'mandalaScripts');

/** Função que renderiza a mandala Sunburst
	Ex: [shortcode_mandala] 
**/
function mandalaFunction($params) {
	$html = "<div id='chart'></div>";
	return $html;
}
add_shortcode('shortcode_mandala', 'mandalaFunction');

/** Função que renderiza a mandala HighCharts
	Ex: [shortcode_mandala_hc] 
**/
function mandalaHighCharts($params) {
	$html = '<div class="highcharts-figure">
				<div id="container-mandala"></div>
			</div>';
	return $html;
}
add_shortcode('shortcode_mandala_hc', 'mandalaHighCharts');


/** Função que adiciona página ao menu admin
 * https://themes.artbees.net/blog/wordpress-custom-admin-pages/
**/
function mandala_menu() {
	add_menu_page(
		__( 'Editor Mandala', 'mandala-plugin' ),
		__( 'Mandala', 'mandala-plugin' ),
		'edit_posts',//'manage_options',
		'mandala-editor',
		'mandala_admin_page'
	);

	add_submenu_page( 
		'mandala-editor',
		__( 'Visualizar Mandala', 'mandala-plugin' ),
		__( 'Visualizar', 'mandala-plugin' ),
		'manage_options',
		'mandala-view',
		'mandala_admin_view'
	);
}
add_action( 'admin_menu', 'mandala_menu' );

/** Página de edição */
function mandala_admin_page() {
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

/** Página de visualização */
function mandala_admin_view() {
	echo '<h1>Visualizador da Mandala:</h1>';
	echo '<div style="width: 50%;">';
	echo do_shortcode( '[shortcode_mandala_hc]' );
	echo ' </div>';
}

//Adding Styles and Scripts to WordPress Custom Admin Pages
function load_custom_wp_mandala_editor($hook) {
	$ver = time();

	// Load only on ?page=mypluginname
	if( $hook != 'toplevel_page_mandala-editor' ) {
		 return;
	}
	wp_register_style( 'css_mandala_admin', MANDALA_CSS_URL . 'admin-style.css', false, $ver );
	wp_enqueue_style ( 'css_mandala_admin' );

	// para o orgchart
	wp_register_style( 'css_orgchart', MANDALA_CSS_URL . 'jquery.orgchart.css', false, $ver );
	wp_enqueue_style ( 'css_orgchart' );

	wp_enqueue_script( 'js_mandala_admin', MANDALA_JS_URL . 'functions-editor.js' , array('js_orgchart', 'js_jquery_orgchart'), $ver );
	wp_enqueue_script( 'js_orgchart', MANDALA_JS_URL . 'jquery.orgchart.js' , array('js_jquery_orgchart'), $ver );
	wp_enqueue_script( 'js_jquery_orgchart', MANDALA_JS_URL . 'jquery-1.11.1.min.js' , array(), $ver );
}
add_action( 'admin_enqueue_scripts', 'load_custom_wp_mandala_editor' );

//Adding Styles and Scripts to WordPress Custom Admin Pages
function load_custom_wp_mandala_viewer($hook) {
	$ver = time();

	// Load only on ?page=mypluginname
	if( $hook != 'mandala_page_mandala-view' ) {
		 return;
	}
	// para o visualizador da mandala
	wp_enqueue_script( 'js_mandala_hc', MANDALA_JS_URL . 'functions-highcharts.js' , array('js_hc', 'js_hc_sunburst', 'js_hc_exporting', 'js_hc_export_data', 'js_hc_accessibility'), false, $ver );
	wp_enqueue_script( 'js_hc', MANDALA_JS_ORG_URL . 'highcharts.js' , array(), $ver );
	wp_enqueue_script( 'js_hc_sunburst', MANDALA_JS_ORG_URL . 'sunburst.js' , array(), $ver );
	wp_enqueue_script( 'js_hc_exporting', MANDALA_JS_ORG_URL . 'exporting.js' , array(), $ver );
	wp_enqueue_script( 'js_hc_export_data', MANDALA_JS_ORG_URL . 'export-data.js' , array(), $ver );
	wp_enqueue_script( 'js_hc_accessibility', MANDALA_JS_ORG_URL . 'accessibility.js' , array(), $ver );

}
add_action( 'admin_enqueue_scripts', 'load_custom_wp_mandala_viewer' );

function salvar_txt_mandala() {
	// Pega variável do ajax
	$json_content = $_POST['json_content'];

	$file_name = MANDALA_PATH . "dados-mandala.txt"; 
	$myfile = fopen($file_name, "w") or die("Unable to open file!");
	
	$json_content_clean = html_entity_decode( stripslashes ($json_content ) );
	$json_content_clean = str_replace("},{", "},\n{", $json_content_clean); //incluir quebra de linha
	//$json_content_clean = str_replace(',"parent"', ',"value":1,"parent"', $json_content_clean); //incluir value

	fwrite($myfile, $json_content_clean);
	fclose($myfile);

	//resposta para o ajax
	//echo $file_name;
	echo 'Dados salvos na mandala!';
	
	backup_txt_mandala($file_name);

	wp_die(); // this is required to terminate immediately and return a proper response
}
add_action( 'wp_ajax_salvar_txt_mandala', 'salvar_txt_mandala' );

/*Função para backup dos dados da mandala*/
function backup_txt_mandala($file_name){
	$current_user = wp_get_current_user();
	$user_login = esc_html( $current_user->user_login );
	$timestamp = str_replace(" ", "_", current_time('mysql'));
	
	$novo_nome = MANDALA_PATH . 'backup/'. $timestamp .'_dados-mandala_' . $user_login . '.txt';
	
	copy($file_name, $novo_nome);
}
