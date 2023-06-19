// Jquery do wordpress precisa desse jQuery(document)
jQuery(document).ready(function ($) {

  // Função para pegar as informações da Mandala CPT
  wp.api.loadPromise.done(function () {
    // Obtém o ID do post do campo de entrada oculto
    var postID = document.getElementById("post_ID").value;
    console.log(postID);

    var mandala = new wp.api.models.Mandala({ id: postID });

    // fetch da mandala específica
    mandala.fetch().done(function () {
      console.log("mandala.get( 'id' )");
      console.log(mandala.get("id"));
      console.log("mandala.get( 'dados' )");
      // console.log( mandala.get( 'dados' ));

      // Pega os dados da Mandala
      dataJS = JSON.parse(mandala.get("dados"));
      // Usa os dados para abrir o OrgChart
      org_chart = startChart(dataJS);
    });
  });

  /**
   * Cria um novo chart de organização a partir de dados fornecidos e retorna o objeto chart.
   *
   * @param dados - um array de objetos que contém as informações dos nós do chart de organização.
   * @returns - o objeto chart do chart de organização criado.
   */
  function startChart(dados) {
    org_chart = $("#orgChart").orgChart({
      data: dados,
      showControls: true,
      allowEdit: true,
    });
    return org_chart;
  }

  // adiciona a função ao botão de mostrar
  $("#btn-mostrar").click(function () {
    // exibe um alerta com os dados do org_chart em formato JSON
    alert(JSON.stringify(org_chart.getData()));
  });

  // Função para carregar novos dados, que serão exibidos no chart
  $("#btn-carregar").click(function () {
    // Criação de um novo array de dados com valores diferentes
    var novo = [
      {
        id: 1,
        showChildren: "true",
        name: "Raiz",
        url: "Insira um link",
        parent: 0,
        value: 1,
      },
      {
        id: 2,
        name: "Amarelo",
        showChildren: "false",
        url: "http://teste.com",
        parent: 1,
        color: "#ffd236",
        value: 1,
      },
      {
        id: 3,
        name: "Verde",
        showChildren: "false",
        url: "http://teste.com",
        parent: 1,
        color: "#3ea055",
        value: 1,
      },
      {
        id: 4,
        name: "Vermelho",
        showChildren: "false",
        url: "http://teste.com",
        parent: 1,
        color: "#dd2026",
        value: 1,
      },
      {
        id: 6,
        name: "Cinza",
        showChildren: "false",
        url: "http://teste.com",
        parent: 2,
        color: "#808080",
        value: 1,
      },
      {
        id: 7,
        name: "Roxo",
        showChildren: "false",
        url: "http://teste.com",
        parent: 3,
        color: "#9975bb",
        value: 1,
      },
      {
        id: 8,
        name: "Rosa",
        showChildren: "false",
        url: "http://teste.com",
        parent: 4,
        color: "#ff7bbc",
        value: 1,
      },
      {
        id: 5,
        name: "Preto",
        showChildren: "false",
        url: "http://teste.com",
        parent: 1,
        color: "#000000",
        value: 1,
      },
    ];

    // Reinstanciando a org_chart com os novos valores (usando a mesma variável para manter o funcionamento do botão de mostrar)
    org_chart = startChart(novo);
  });

  // Função que cria um link de download para o conteúdo do JSON gerado pela org_chart.
  $("#btn-download").click(function () {
    // Cria um elemento <a> para ser utilizado como link de download
    const a = document.createElement("a");

    // Cria um Blob com o conteúdo do JSON gerado pela org_chart e define a URL do link de download como a URL do Blob criado
    a.href = URL.createObjectURL(
      new Blob([JSON.stringify(org_chart.getData())], {
        type: "text/plain",
      })
    );

    // Define o atributo de download do link de download
    a.setAttribute("download", "data.json");

    // Adiciona o link de download ao corpo da página
    document.body.appendChild(a);

    // Dispara o clique do link de download
    a.click();

    // Remove o link de download do corpo da página
    document.body.removeChild(a);
  });

  // Função para mostrar todos os nós do chart
  $("#btn-show-all").click(function () {
    org_chart.showAllChildren();
  });

  // Função para fechar todos os nós do chart
  $("#btn-hide-all").click(function () {
    org_chart.hideAllChildren();
  });

  // Função para salvar o conteúdo do json
  $("#btn-save").click(function () {
    var postID = document.getElementById("post_ID").value;
    var json_content = JSON.stringify(org_chart.getData());

    //salvava "id":1, mas preciso que seja "id":"1"
    json_content = json_content.replace(/"id":(\d+)/g, '"id":"$1"');

    // mesma coisa para parent
    json_content = json_content.replace(/"parent":(\d+)/g, '"parent":"$1"');

    var data = {
      action: "salvar_dados_mandala",
      json_content: json_content,
      post_id: postID,
    };

    // Variáveis para o jQuery
    var loaderContainer, loader;
    var filterVal = "blur(5px)";

    $.ajax({
      type: "POST",
      url: ajaxurl,
      data: data,
      beforeSend: function () {
        loaderContainer = $("<span/>", {
          class: "loader-image-container",
        }).insertBefore($("#btn-save"));

        loader = $("<img/>", {
          src: "images/loading.gif",
          class: "loader-image",
        }).appendTo(loaderContainer);

        //aplicar filtro
        $("#orgChart")
          .css("filter", filterVal)
          .css("webkitFilter", filterVal)
          .css("mozFilter", filterVal)
          .css("oFilter", filterVal)
          .css("msFilter", filterVal);
      },
      success: function (response) {
        filterVal = "blur(0px)";

        alert(response);

        //remover filtro
        $("#orgChart")
          .css("filter", filterVal)
          .css("webkitFilter", filterVal)
          .css("mozFilter", filterVal)
          .css("oFilter", filterVal)
          .css("msFilter", filterVal);

        loaderContainer.remove();
      },
    });
  });
});
