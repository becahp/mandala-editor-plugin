var dataJS = [
  { id: "1", name: "", parent: "" },
  { id: "2", name: "Amarelo", url: "http://teste.com", value: 1, parent: "1" },
  { id: "3", name: "Verde", url: "http://teste.com", value: 1, parent: "1" },
  { id: "4", name: "Vermelho", url: "http://teste.com", value: 1, parent: "1" },
  { id: "5", name: "Preto", url: "http://teste.com", value: 1, parent: "1" },
  { id: "6", name: "Cinza", url: "http://teste.com", value: 1, parent: "2" },
  { id: "7", name: "Roxo", url: "http://teste.com", value: 1, parent: "3" },
  { id: "8", name: "Rosa", url: "http://teste.com", value: 1, parent: "4" }
];

fetch('/wp-content/plugins/mandala-editor-plugin/dados-mandala.txt', { mode: 'no-cors' })
  .then((res) => res.text())
  .then((data) => {
    dataJS = JSON.parse(data);
    chamaHighChart(dataJS);
  });

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
    exitFullscreen: "Sair da tela cheia"
  }
});

function chamaHighChart(data) {

  const chart = Highcharts.chart('container-mandala', {

    chart: {
      height: '100%',
      backgroundColor: '#1351b4',
      events: {
        load: function () {
          this.series[0].data.forEach(el => {
            if (el.node.level === 3) {
              let rgbColor = el.color.slice(3, el.color.length - 1)
              el.update({
                color: `rgba${rgbColor}, 0.6)`
              }, false)
            }
            if (el.node.level === 4) {
              let rgbColor = el.color.slice(3, el.color.length - 1)
              el.update({
                color: `rgba${rgbColor}, 0.4)`
              }, false)
            }
            if (el.node.level === 5) {
              let rgbColor = el.color.slice(3, el.color.length - 1)
              el.update({
                color: `rgba${rgbColor}, 0.2)`
              }, false)
            }
          });
          this.redraw();
        }
      },
    },

    navigation: {
      buttonOptions: {
        symbolStroke: 'white',
        theme: {
          'stroke-width': 1,
          stroke: 'none',
          fill: 'transparent',
          r: 0,
          states: {
            hover: {
              fill: '#4d8bf0'
            },
            select: {
              stroke: '#333',
              fill: '#4d8bf0'
            }
          }
        }
      }
    },

    exporting: {
      buttons: {
        contextButton: {
          menuItems: ["printChart",
            "separator",
            "downloadPNG",
            "downloadJPEG",
            "downloadPDF",
            "downloadSVG",
            "separator",
            "downloadCSV",
            "downloadXLS",
            //"viewData",
            "openInCloud"]
        }
      }
    },

    // Let the center circle be transparent
    colors: ['transparent'].concat(Highcharts.getOptions().colors),

    title: {
      text: ''
    },

    subtitle: {
      text: ''
    },

    series: [{
      type: 'sunburst',
      borderWidth: 0,
      data: data,
      allowDrillToNode: true,
      cursor: 'pointer',
      point: {
        events: {
          click: function (e) {
            // https://www.highcharts.com/forum/viewtopic.php?f=9&t=45715
            let clickedNode = e.point.node;

            if (!clickedNode.children || clickedNode.children.length == 0 || clickedNode.children === []) {
              //if there are no children to the clicked node, we've hit the button of the sunburst chart
              //console.log('target acquired')

              if (this.options.url !== undefined) {
                //console.log("Cliquei aqui!")
                //console.log(this.children)
                window.open(this.options.url);
                //window.location.href = this.options.url;
                //location.href = this.options.url;
              }
            }
          }
        }
      },
      dataLabels: {
        format: '{point.name}',
        filter: {
          property: 'innerArcLength',
          operator: '>',
          value: 16
        },
        rotationMode: 'circular',
        style: { textOutline: 'none', fontSize: '13px' }
      },
      levels: [{
        level: 1,
        levelIsConstant: false,
        dataLabels: {
          filter: {
            property: 'outerArcLength',
            operator: '>',
            value: 64
          },
          style: { fontSize: '30px' }
        },
        colorVariation: {
          key: 'brightness',
          to: -1
        }
      }, {
        level: 2,
        colorByPoint: true
      },
      {
        level: 3,
        opacity: 0.1,
        colorVariation: {
          key: 'brightness',
          to: -0.4
        }
      }, {
        level: 4,

      }, {
        level: 5,
      }]

    }],

    tooltip: {
      headerFormat: '',
      formatter: function () {
        if (!this.point.noTooltip) {
          return this.point.name;
        }
        return false;
      }
    }
  });

  return chart;
}