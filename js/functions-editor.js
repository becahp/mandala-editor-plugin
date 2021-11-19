// Precisa do $function pq está em outra página
$(function(){
    // Função para criar um chart novo, recebe a variável de dados
    
    function startChart(testData){
        org_chart = $('#orgChart').orgChart({
            data: testData,
            showControls: true,
            allowEdit: true
        });
        return org_chart;
    }

    // adiciona a função ao botão de mostrar 
    $('#btn-mostrar').click(function(){
        //console.log(JSON.stringify(org_chart.getData()));
        alert(JSON.stringify(org_chart.getData()));
    });

    // Funcção para carregar novos dados
    $('#btn-carregar').click(function(){
        //crio novos dados diferentes
        var novo = [
            {id: 1, name: 'Azul', url: 'http://teste.comdjkfhlskjfhldskjfhlsdkjfhsdlkjfhsdlkjfhsldkj', parent: 0},
            {id: 2, name: 'Amarelo', url: 'http://teste.com', parent: 1},
            {id: 3, name: 'Verde', url: 'http://teste.com', parent: 1},
            {id: 4, name: 'Vermelho', url: 'http://teste.com', parent: 1},
            {id: 6, name: 'Cinza', url: 'http://teste.com', parent: 2},
            {id: 7, name: 'Roxo', url: 'http://teste.com', parent: 3},
            {id: 8, name: 'Rosa', url: 'http://teste.com', parent: 4},
            {id: 5, name: 'Preto', url: 'http://teste.com', parent: 1},
            ];

        //instancio novamente a org_chart com esses valores (uso a mesma variável para manter o funcionamento do btn-mostrar)
        org_chart = startChart(novo);
    });

    // Função para baixar o conteúdo do json
    $('#btn-download').click(function(){
        const a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([JSON.stringify(org_chart.getData())], {
            type: "text/plain"
        }));
        
        a.setAttribute("download", "data.json");
        document.body.appendChild(a);
        
        a.click();
        document.body.removeChild(a);
    });

    // Função para mostrar todos
    $('#btn-show-all').click(function(){
        org_chart.showAllChildren();
    });

    // Função para fechar todos
    $('#btn-hide-all').click(function(){
        org_chart.hideAllChildren();
    });

    // Função para salvar o conteúdo do json
    $('#btn-save').click(function(){
        var json_content = JSON.stringify(org_chart.getData());

        //salvava "id":1, mas preciso que seja "id":"1"
        json_content = json_content.replace(/"id":(\d+)/g,'"id":"$1"');

        // mesma coisa para parent
        json_content = json_content.replace(/"parent":(\d+)/g,'"parent":"$1"');

        //https://codex.wordpress.org/AJAX_in_Plugins
        var data = {
            'action': 'salvar_txt_mandala',
            'json_content': json_content
        };

        // since 2.8 ajaxurl is always defined in the admin header and points to admin-ajax.php
        /*$.post(ajaxurl, data, function(response) {
            alert(response);
        }); */

        // Variáveis para o jquery
        var loaderContainer, loader;
        var filterVal = 'blur(5px)';

        $.ajax({
            type: "POST",
            url: ajaxurl,
            data: data,
            beforeSend: function () {
                loaderContainer = $('<span/>', {
                    'class': 'loader-image-container'
                }).insertBefore($('#btn-save'));

                loader = $('<img/>', {
                    src: 'images/loading.gif',
                    'class': 'loader-image'
                }).appendTo(loaderContainer);

                //aplicar filtro
                $('#orgChart')
                    .css('filter', filterVal)
                    .css('webkitFilter', filterVal)
                    .css('mozFilter', filterVal)
                    .css('oFilter', filterVal)
                    .css('msFilter', filterVal);
            },
            success: function(response) {
                filterVal = 'blur(0px)';
                
                alert(response);

                //remover filtro
                $('#orgChart')
                    .css('filter', filterVal)
                    .css('webkitFilter', filterVal)
                    .css('mozFilter', filterVal)
                    .css('oFilter', filterVal)
                    .css('msFilter', filterVal);
                
                loaderContainer.remove();
            }
        });

    });    

    // Assim ele pega os dados do arquivo que ele mesmo criou
    fetch('/wp-content/plugins/mandala-editor-plugin/dados-mandala.txt',{mode: 'no-cors'})
      .then((res) => res.text())
      .then((data) => {
        dataJS = JSON.parse(data);
        org_chart = startChart(dataJS);
    });
});