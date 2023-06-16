/**
 * Definição de uma estrutura de dados em JavaScript, representando uma Mandala com os seguintes campos:
 * id: um identificador único para cada nó na Mandala;
 * name: o nome do nó;
 * url: uma URL associada ao nó, que pode ser clicada pelo usuário;
 * value: um valor associado ao nó, que pode ser utilizado para diferenciar nós com o mesmo nome;
 * parent: o identificador do nó pai, que define a hierarquia na Mandala.
 */

var dataJS = [
  { id: "1", name: "", parent: "" },
  { id: "2", name: "Amarelo", url: "http://teste.com", value: 1, parent: "1" },
  { id: "3", name: "Verde", url: "http://teste.com", value: 1, parent: "1" },
  { id: "4", name: "Vermelho", url: "http://teste.com", value: 1, parent: "1" },
  { id: "5", name: "Preto", url: "http://teste.com", value: 1, parent: "1" },
  { id: "6", name: "Cinza", url: "http://teste.com", value: 1, parent: "2" },
  { id: "7", name: "Roxo", url: "http://teste.com", value: 1, parent: "3" },
  { id: "8", name: "Rosa", url: "http://teste.com", value: 1, parent: "4" },
];

/**
 * Realiza uma requisição fetch para obter o conteúdo do arquivo "dados-mandala.txt", localizado no diretório do plugin "mandala-editor-plugin".
 * O parâmetro "mode" é definido como "no-cors", que significa que a requisição não irá retornar informações de cabeçalho CORS.
 * Após receber a resposta, o conteúdo do arquivo é convertido de texto para um objeto JavaScript utilizando a função JSON.parse().
 * Em seguida, a função chamaHighChart() é chamada passando o objeto JavaScript como argumento.
 */
fetch("/wp-content/plugins/mandala-editor-plugin/dados-mandala.txt", {
  mode: "no-cors",
})
  .then((res) => res.text())
  .then((data) => {
    dataJS = JSON.parse(data);
    chamaHighChart(dataJS);
  });

// Configuração de opções de tradução para alguns módulos do Highcharts
Highcharts.setOptions({
  lang: {
    contextButtonTitle: "Menu de contexto da mandala",
    downloadCSV: "Download arquivo CSV",
    downloadJPEG: "Download imagem JPEG",
    downloadPDF: "Download documento PDF",
    downloadPNG: "Download imagem PNG",
    downloadSVG: "Download imagem SVG",
    downloadXLS: "Download XLS",
    printChart: "Imprimir mandala",
    viewData: "Ver tabela de dados",
    viewFullscreen: "Ver em tela cheia",
    exitFullscreen: "Sair da tela cheia",
  },
});

/**
 * A função chamaHighChart é responsável por renderizar o gráfico do tipo sunburst na página,
 * utilizando a biblioteca Highcharts. Ela recebe um parâmetro 'data', que é um array contendo
 * os dados a serem exibidos no gráfico.
 *
 * @param {Array} data - Array com os dados a serem exibidos no gráfico.
 * @return {Object} - Retorna um objeto Highcharts que representa o gráfico criado.
 */
function chamaHighChart(data) {
  const chart = Highcharts.chart("container-mandala", {
    chart: {
      // Define a altura do gráfico como 100% e a cor de fundo como azul.
      height: "100%",
      backgroundColor: "#1351b4",
      events: {
        // Define um evento de carregamento do gráfico, que será executado quando o gráfico for criado.
        load: function () {
          // Define a cor dos elementos do gráfico de acordo com o nível de cada um.
          this.series[0].data.forEach((el) => {
            if (el.node.level === 3) {
              let rgbColor = el.color.slice(3, el.color.length - 1);
              el.update(
                {
                  color: `rgba${rgbColor}, 0.6)`,
                },
                false
              );
            }
            if (el.node.level === 4) {
              let rgbColor = el.color.slice(3, el.color.length - 1);
              el.update(
                {
                  color: `rgba${rgbColor}, 0.4)`,
                },
                false
              );
            }
            if (el.node.level === 5) {
              let rgbColor = el.color.slice(3, el.color.length - 1);
              el.update(
                {
                  color: `rgba${rgbColor}, 0.2)`,
                },
                false
              );
            }
          });
          // Redesenha o gráfico com as novas configurações de cor.
          this.redraw();
        },
      },
    },

    // Configuração dos botões de navegação do gráfico.
    navigation: {
      buttonOptions: {
        symbolStroke: "white",
        theme: {
          "stroke-width": 1,
          stroke: "none",
          fill: "transparent",
          r: 0,
          states: {
            hover: {
              fill: "#4d8bf0",
            },
            select: {
              stroke: "#333",
              fill: "#4d8bf0",
            },
          },
        },
      },
    },

    // Configuração dos botões de exportação do gráfico.
    exporting: {
      buttons: {
        contextButton: {
          menuItems: [
            "printChart",
            "separator",
            "downloadPNG",
            "downloadJPEG",
            "downloadPDF",
            "downloadSVG",
            "separator",
            "downloadCSV",
            "downloadXLS",
            "openInCloud",
          ],
        },
      },
    },

    // Define a cor do círculo central como transparente e as demais cores de acordo com o padrão da biblioteca.
    colors: ["transparent"].concat(Highcharts.getOptions().colors),

    // Define o título e subtítulo do gráfico como vazios.
    title: {
      text: "",
    },

    subtitle: {
      text: "",
    },

    // Define as configurações da série de dados do gráfico.
    series: [
      {
        type: "sunburst",
        borderWidth: 0,
        data: data,
        allowDrillToNode: true,
        cursor: "pointer",
        point: {
          events: {
            // Implementa a funcionalidade de redirecionamento ao clicar no último nó filho que tenha um link
            click: function (e) {
              let clickedNode = e.point.node;
              if (
                !clickedNode.children ||
                clickedNode.children.length == 0 ||
                clickedNode.children === []
              ) {
                //if there are no children to the clicked node, we've hit the button of the sunburst chart
                if (this.options.url !== undefined) {
                  window.open(this.options.url);
                }
              }
            },
          },
        },
        dataLabels: {
          format: "{point.name}",
          filter: {
            property: "innerArcLength",
            operator: ">",
            value: 16,
          },
          rotationMode: "circular",
          style: { textOutline: "none", fontSize: "13px" },
        },
        levels: [
          {
            level: 1,
            levelIsConstant: false,
            dataLabels: {
              filter: {
                property: "outerArcLength",
                operator: ">",
                value: 64,
              },
              style: { fontSize: "30px" },
            },
            colorVariation: {
              key: "brightness",
              to: -1,
            },
          },
          {
            level: 2,
            colorByPoint: true,
          },
          {
            level: 3,
            opacity: 0.1,
            colorVariation: {
              key: "brightness",
              to: -0.4,
            },
          },
          {
            level: 4,
          },
          {
            level: 5,
          },
        ],
      },
    ],

    // Define as configurações da tooltip que aparece ao passar o mouse por cima de um nó
    tooltip: {
      headerFormat: "",
      formatter: function () {
        if (!this.point.noTooltip) {
          return this.point.name;
        }
        return false;
      },
    },
  });

  return chart;
}
