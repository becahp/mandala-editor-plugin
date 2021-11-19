# mandala-editor-plugin

Plugin que implementa uma Mandala, um gráfico Sunburst (explosão solar) ideal para exibir dados hierárquicos e um editor customizado.


## Mandala
O código javascript que implementa a Mandala é baseado na biblioteca [Highcharts.js](https://www.highcharts.com/), versão 9.2.2. 

![Visualização da Mandala](mandala.png)

São usados os módulos da Highcharts.js:
- js-original/highcharts.js
- js-original/sunburst.js
- js-original/exporting.js
- js-original/export-data.js
- js-original/accessibility.js

A customização foi feita no arquivo **js/functions-highcharts.js**

Resumo da costumização: 
- Definição de cores das folhas
- Redirecionamento para links no último nó de uma folha da Mandala
- Traduções do menu de exportação

## Editor
O editor da Mandala é baseado na biblioteca [OrgChart](https://www.jqueryscript.net/chart-graph/Create-An-Editable-Organization-Chart-with-jQuery-orgChart-Plugin.html) que utiliza o jQuery na versão 1.11.1.

![Editor da Mandala](editor-mandala.png)

A customização foi feita no arquivo **js/jquery-orgchart.js** enquanto a implementação está no **js/functions-editor.js**.

Resumo da costumização:
- Conexão do Editor à Mandala por meio de um arquivo de texto *dados-mandala.txt*
- Criação e exclusão de folhas e nós na Mandala
- Edição de Nomes, Links e Cores dos dados da Mandala
- Visualização dos dados com botões de mostrar/esconder