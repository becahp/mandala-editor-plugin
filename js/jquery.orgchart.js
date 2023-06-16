(function ($) {
  /**
   * Função para criar um plugin jQuery que permite criar um OrgChart.
   * Recebe um objeto options como parâmetro que é mesclado com as opções padrão.
   * Retorna um novo objeto OrgChart.
   */
  $.fn.orgChart = function (options) {
    var opts = $.extend({}, $.fn.orgChart.defaults, options);
    return new OrgChart($(this), opts);
  };

  /**
   * Definições padrão do plugin orgChart.
   * Parâmetros:
   * data: os dados a serem exibidos na estrutura da orgChart. O padrão é um objeto com um nó raiz.
   * showControls: se os controles de adição e exclusão de nó devem ser exibidos. O padrão é false.
   * allowEdit: se os nós podem ser editados ou não. O padrão é false.
   * onAddNode: função de retorno de chamada a ser executada quando um nó é adicionado. O padrão é null.
   * onDeleteNode: função de retorno de chamada a ser executada quando um nó é excluído. O padrão é null.
   * onClickNode: função de retorno de chamada a ser executada quando um nó é clicado. O padrão é null.
   * newNodeText: o texto a ser exibido no botão de adicionar nó. O padrão é "Adicionar".
   */
  $.fn.orgChart.defaults = {
    data: [{ id: 1, name: "Root", parent: 0 }],
    showControls: false,
    allowEdit: false,
    onAddNode: null,
    onDeleteNode: null,
    onClickNode: null,
    newNodeText: "Adicionar",
  };

  /**
  Creates a new OrgChart instance.
  @constructor
  @param {Object} $container - The container element where the org chart will be rendered.
  @param {Object} opts - The options to configure the org chart.
  */
  function OrgChart($container, opts) {
    var data = opts.data;
    var nodes = {};
    var rootNodes = [];
    this.opts = opts;
    this.$container = $container;
    var self = this;

    // Renders the org chart on the container element.
    this.draw = function () {
      $container.empty().append(rootNodes[0].render(opts));
      $container.find(".node").click(function () {
        if (self.opts.onClickNode !== null) {
          self.opts.onClickNode(nodes[$(this).attr("node-id")]);
        }
      });

      if (opts.allowEdit) {
        $container.find(".node h2").click(function (e) {
          var thisId = $(this).parent().attr("node-id");
          self.startEdit(thisId);
          e.stopPropagation();
        });
        $container.find(".node h3").click(function (e) {
          var thisId = $(this).parent().attr("node-id");
          self.startEdit2(thisId);
          e.stopPropagation();
        });
        $container.find('.node input[type="color"]').click(function (e) {
          var thisId = $(this).parent().attr("node-id");
          self.startEdit3(thisId);
          e.stopPropagation();
        });
      }

      // add "add button" listener
      $container.find(".org-add-button").click(function (e) {
        var thisId = $(this).parent().attr("node-id");

        if (self.opts.onAddNode !== null) {
          self.opts.onAddNode(nodes[thisId]);
        } else {
          self.newNode(thisId);
        }
        e.stopPropagation();
      });

      // add "del button" listener
      $container.find(".org-del-button").click(function (e) {
        var thisId = $(this).parent().attr("node-id");
        if (
          confirm(
            "Tem certeza que quer deletar esse nó? Os filhos também serão deletados."
          )
        ) {
          if (self.opts.onDeleteNode !== null) {
            self.opts.onDeleteNode(nodes[thisId]);
          } else {
            self.deleteNode(thisId);
          }
        }
        e.stopPropagation();
      });

      // add "show button" listener
      $container.find(".org-show-button").click(function (e) {
        var thisId = $(this).parent().attr("node-id");
        nodes[thisId].data.showChildren = "true";
        self.draw();
        e.stopPropagation();
      });

      // add "hide button" listener
      $container.find(".org-hide-button").click(function (e) {
        var thisId = $(this).parent().attr("node-id");
        nodes[thisId].data.showChildren = "false";

        // função para setar todas as children com showChildren = 'false'
        self.showChildrenFalse(thisId);
        self.draw();
        e.stopPropagation();
      });
    };

    // Shows all the children of the specified node.
    this.showAllChildren = function (id = 1) {
      $.each(nodes[id].children, function (i, value) {
        nodes[value.data.id].data.showChildren = "true";

        // recursivamente chama os filhos
        self.showChildrenTrue(value.data.id);
      });

      self.draw();
    };

    // Hides all the children of the specified node.
    this.hideAllChildren = function (id = 1) {
      $.each(nodes[id].children, function (i, value) {
        nodes[value.data.id].data.showChildren = "false";

        // recursivamente chama os filhos
        self.showChildrenFalse(value.data.id);
      });

      self.draw();
    };

    // Mostrar todos os filhos de um nó
    this.showChildrenTrue = function (id) {
      // loop para passar por todas as children
      $.each(nodes[id].children, function (i, value) {
        nodes[value.data.id].data.showChildren = "true";

        // recursivamente chama os filhos
        self.showChildrenTrue(value.data.id);
      });
    };

    // Esconder todos os filhos de um nó
    this.showChildrenFalse = function (id) {
      // loop para passar por todas as children
      $.each(nodes[id].children, function (i, value) {
        nodes[value.data.id].data.showChildren = "false";

        // recursivamente chama os filhos
        self.showChildrenFalse(value.data.id);
      });
    };

    // Iniciar a edição de um input do nó, do tipo texto identificado pela tag h2
    this.startEdit = function (id) {
      var inputElement = $(
        '<input class="org-input" placeholder="Insira um nome" type="text" value="' +
          nodes[id].data.name +
          '"/>'
      );
      $container.find("div[node-id=" + id + "] h2").replaceWith(inputElement);
      var commitChange = function () {
        var h2Element = $("<h2>" + nodes[id].data.name + "</h2>");
        if (opts.allowEdit) {
          h2Element.click(function () {
            self.startEdit(id);
          });
        }
        inputElement.replaceWith(h2Element);
      };
      inputElement.focus();
      inputElement.keyup(function (event) {
        if (event.which == 13) {
          commitChange();
        } else {
          nodes[id].data.name = inputElement.val();
        }
      });
      inputElement.blur(function (event) {
        commitChange();
      });
    };

    // Iniciar a edição de um input do nó, do tipo texto identificado pela tag h3
    this.startEdit2 = function (id) {
      if (nodes[id].data.url == "Insira um link") {
        var inputElement = $(
          '<input class="org-input" placeholder="Insira um link" type="text" value=""/>'
        );
      } else {
        var inputElement = $(
          '<input class="org-input" placeholder="Insira um link" type="text" value="' +
            nodes[id].data.url +
            '"/>'
        );
      }

      $container.find("div[node-id=" + id + "] h3").replaceWith(inputElement);
      var commitChange = function () {
        var h2Element = $("<h3>" + nodes[id].data.url + "</h3>");
        if (opts.allowEdit) {
          h2Element.click(function () {
            self.startEdit2(id);
          });
        }
        inputElement.replaceWith(h2Element);
      };
      inputElement.focus();
      inputElement.keyup(function (event) {
        if (event.which == 13) {
          commitChange();
        } else {
          nodes[id].data.url = inputElement.val();
        }
      });
      inputElement.blur(function (event) {
        commitChange();
      });
    };

    // Iniciar a edição de um input do nó, do tipo cor
    this.startEdit3 = function (id) {
      var inputElement = $container.find(
        "div[node-id=" + id + '] input[type="color"]'
      );

      var commitChange = function () {
        var h2Element = $(
          '<input type="color" value=' + nodes[id].data.color + ">"
        );
        if (opts.allowEdit) {
          h2Element.click(function () {
            self.startEdit3(id);
          });
        }
        inputElement.replaceWith(h2Element);
      };
      // no caso do input type color, apenas o blur funciona
      inputElement.blur(function (event) {
        nodes[id].data.color = inputElement.val();
        commitChange();
      });
    };

    // Criar um novo nó
    this.newNode = function (parentId) {
      var nextId = Object.keys(nodes).length;
      while (nextId in nodes) {
        nextId++;
      }
      //Checar quando crio novo node para acrescentar color nos filhos da raiz
      if (parentId == 1) {
        self.addNode({
          id: nextId,
          name: "",
          url: "Insira um link",
          color: "#FFFFFF",
          parent: parentId,
        });
      } else {
        self.addNode({
          id: nextId,
          name: "",
          url: "Insira um link",
          parent: parentId,
        });
      }
    };

    // Adicionar um novo nó a um nó pai
    this.addNode = function (data) {
      var newNode = new Node(data);
      nodes[data.id] = newNode;
      nodes[data.parent].addChild(newNode);

      self.draw();
      self.startEdit(data.id);
    };

    // Deletar um nó e seus filhos
    this.deleteNode = function (id) {
      while (nodes[id].children.length > 0) {
        i = 0;
        self.deleteNode(nodes[id].children[i].data.id);
      }
      nodes[nodes[id].data.parent].removeChild(id);
      delete nodes[id];
      self.draw();
    };

    // Obter os dados do organograma
    this.getData = function () {
      var outData = [];
      for (var i in nodes) {
        nodes[i].data["value"] = 1;
        outData.push(nodes[i].data);
      }
      return outData;
    };

    // constructor
    for (var i in data) {
      var node = new Node(data[i]);
      nodes[data[i].id] = node;
    }

    // generate parent child tree
    for (var i in nodes) {
      if (nodes[i].data.parent == 0) {
        rootNodes.push(nodes[i]);
      } else {
        nodes[nodes[i].data.parent].addChild(nodes[i]);
      }
    }

    // draw org chart
    $container.addClass("orgChart");
    self.draw();
  }

  /**
  Constructor for Node object.
  @param {Object} data - Data object containing node information.
  */
  function Node(data) {
    this.data = data;
    this.children = [];
    var self = this;

    // Adds a child node to the current node.
    this.addChild = function (childNode) {
      this.children.push(childNode);
    };

    // Removes a child node from the current node.
    this.removeChild = function (id) {
      for (var i = 0; i < self.children.length; i++) {
        if (self.children[i].data.id == id) {
          self.children.splice(i, 1);
          return;
        }
      }
    };

    //Renders the node as HTML using the provided options.
    this.render = function (opts) {
      var childLength = self.children.length,
        mainTable;

      mainTable = "<table cellpadding='0' cellspacing='0' border='0'>";
      var nodeColspan = childLength > 0 ? 2 * childLength : 2;
      mainTable +=
        "<tr><td colspan='" +
        nodeColspan +
        "'>" +
        self.formatNode(opts) +
        "</td></tr>";

      if (self.data.showChildren == "true" && childLength > 0) {
        var downLineTable =
          "<table cellpadding='0' cellspacing='0' border='0'><tr class='lines x'><td class='line left half'></td><td class='line right half'></td></table>";
        mainTable +=
          "<tr class='lines'><td colspan='" +
          childLength * 2 +
          "'>" +
          downLineTable +
          "</td></tr>";

        var linesCols = "";
        for (var i = 0; i < childLength; i++) {
          if (childLength == 1) {
            linesCols += "<td class='line left half'></td>"; // keep vertical lines aligned if there's only 1 child
          } else if (i == 0) {
            linesCols += "<td class='line left'></td>"; // the first cell doesn't have a line in the top
          } else {
            linesCols += "<td class='line left top'></td>";
          }

          if (childLength == 1) {
            linesCols += "<td class='line right half'></td>";
          } else if (i == childLength - 1) {
            linesCols += "<td class='line right'></td>";
          } else {
            linesCols += "<td class='line right top'></td>";
          }
        }
        mainTable += "<tr class='lines v'>" + linesCols + "</tr>";

        mainTable += "<tr>";
        for (var i in self.children) {
          mainTable +=
            "<td colspan='2'>" + self.children[i].render(opts) + "</td>";
        }
        mainTable += "</tr>";
      }
      mainTable += "</table>";
      return mainTable;
    };

    //Formats the node object with the provided options.
    this.formatNode = function (opts) {
      var nameString = "",
        descString = "",
        urlString = "",
        colorString = "";

      // If para não permitir a edição do Raiz
      if (data.name == "RCC") {
        nameString = "<span>" + self.data.name + "</span>";
      } else {
        if (typeof data.name !== "undefined") {
          nameString = "<h2>" + self.data.name + "</h2>";
        }
        if (typeof data.url !== "undefined") {
          urlString = "<h3>" + self.data.url + "</h3>";
        }
        if (typeof data.description !== "undefined") {
          descString = "<p>" + self.data.description + "</p>";
        }
        if (typeof data.color !== "undefined") {
          colorString = '<input type="color" value="' + self.data.color + '">';
        }
      }

      if (opts.showControls) {
        if (data.showChildren == "true") {
          var buttonsHtml =
            "<div id='btn-hide-" +
            this.data.id +
            "' class='org-hide-button'></div>\
                                        <div id='btn-show-" +
            this.data.id +
            "' class='org-show-button' style='display:none;'></div>\
                                        <div class='org-add-button'>" +
            opts.newNodeText +
            "</div>\
                                        <div class='org-del-button'>Excluir</div>";
        } else {
          var buttonsHtml =
            "<div id='btn-hide-" +
            this.data.id +
            "' class='org-hide-button' style='display:none;'></div>\
                                        <div id='btn-show-" +
            this.data.id +
            "' class='org-show-button'></div>\
                                        <div class='org-add-button' style='display:none;'>" +
            opts.newNodeText +
            "</div>\
                                        <div class='org-del-button' style='display:none;'>Excluir</div>";
        }
      } else {
        buttonsHtml = "";
      }
      return (
        "<div class='node' id='editor-" +
        this.data.id +
        "' node-id='" +
        this.data.id +
        "'>" +
        nameString +
        urlString +
        descString +
        colorString +
        buttonsHtml +
        "</div>"
      );
    };
  }
})(jQuery);
