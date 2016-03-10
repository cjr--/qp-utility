/*
  - create syntax which allows user to pick parts of the binding tree and keep local ref
    - the bindings and the element type probably allow this tree to be built automatically
      - perhaps classes like .input-group act as sign posts?
      - v-node="user_name", would declare a node in the view tree
        - walk dom tree creating bindings
          - create some binding automatically; eg input > enabled, visible
        - walk bindings looking for nodes and create view tree
    - 1-way binding for control state / meta-data
    - form: {
        refresh: function() { ... },
        control1: {
          refresh: function() { ... },
          enabled: true,
          visible: true
        }
      }
    - this handles the meta data aspect, the actual control <-> data binding is going to be on the model
    - each binding
      - data-id attr automatically set to model.id
      - v-click="fn_name" -> data-click-handler="fn_name"
      - v-on-click in outer scope receives 2 args; handler and id, default calls handler with id arg
*/

define(module, function(exports, require, make) {

  make({

    ns: 'ViewModel',

    properties: {
      model: null,
      element: null,
      bindings: []
    },

    init: function(config) {
      this.model = config.model;
      this.element = config.el || config.element;
    },

    bind: function() {
      this.bindings = this.parse({
        element: this.element,
        bindings: []
      });
    },

    update_view: function() {
      qp.each(this.bindings, function(binding) {
        binding.update_view(this.model);
      }.bind(this));
    },

    update_model: function() {
      qp.each(this.bindings, function(binding) {
        binding.update_model(this.model);
      }.bind(this));
    },

    parse: function(node) {
      this.parse_node(node);
      if (node.element.parentNode) {
        node.children = qp.map(node.element.children, function(child_element) {
          return this.parse({
            element: child_element,
            bindings: []
          });
        }.bind(this));
      }
      return node;
    },

    parse_node: function(node) {
      qp.each(qp.get_attributes(node.element), function(attribute) {
        if (attribute.name.slice(0, 2) === 'v-') {
          var binding = this.create_binding(node, attribute);
          if (binding.name === 'if') {
            binding.type = 'if';
          } else if (qp.inlist(binding.name, 'show', 'hide')) {
            binding.type = 'visible';
            binding.show = binding.name === 'show';
            binding.hide = !binding.show;
          } else if (qp.inlist(binding.name, 'readonly', 'disabled')) {
            binding.attribute = binding.name;
            binding.boolean = true;
          } else if (binding.name === 'text') {
            binding.property = 'textContent';
          } else if (binding.name === 'html') {
            binding.property = 'innerHTML';
          } else if (binding.name === 'value') {
            binding.property = 'value';
          } else if (binding.name === 'template') {
            binding.type = 'template';
          } else if (binding.name === 'each') {
            var items = binding.path.split(' in ');
            binding.item_name = items[0];
            binding.path = items[1];
          } else if (binding.name === 'add-class') {
            binding.type = 'add_class';
          } else if (qp.match(binding.name, 'on-*')) {
            binding.type = 'on';
            binding.event = binding.name.slice(4);
          } else if (qp.match(binding.name, 'class-*')) {
            binding.type = 'class';
            binding.class = binding.name.slice(7);
          } else if (qp.match(binding.name, 'style-*')) {
            binding.type = 'style';
            binding.style = binding.name.slice(7);
          } else {
            binding.attribute = binding.type;
          }

          if (binding.property) {
            this.property(binding, node.element);
          } else if (binding.attribute) {
            this.attribute(binding, node.element);
          } else {
            this[binding.type](binding, node.element);
          }
        }
      }.bind(this));
    },

    create_binding: function(node, attribute) {
      var attribute_name = attribute.name.slice(2);
      var binding = {
        name: attribute_name,
        type: attribute_name,
        path: attribute.value,
        negate: false,
        priority: 99
      };
      if (qp.match(attribute_name, 'not *')) {
        binding.path = attribute.value.slice(4);
        binding.negate = true;
      }
      node.element.removeAttribute(binding.name);
      node.bindings.push(binding);
      return binding;
    },

    if: function(binding, element) {
      binding.priority = 1;
    },

    visible: function(binding, element) {
      binding.update_view = function(model) {
        var toggle = qp.get(model, binding.path);
        if ((binding.show && toggle) || (binding.hide && !toggle)) {
          qp.show(element);
        } else {
          qp.hide(element);
        }
      };
      binding.update_model = function(model) {
        qp.set(model, binding.path, (element.style.display === 'block' && binding.show));
      };
    },

    class: function(binding, element) {
      binding.update_view = function(model) {
        if (qp.get(model, binding.path)) {
          qp.add_class(element, binding.class);
        } else {
          qp.remove_class(element, binding.class);
        }
      };
      binding.update_model = function(model) {
        qp.set(model, binding.path, qp.has_class(element));
      };
    },

    style: function(binding, element) {
      binding.update_view = function(model) {
        qp.set_style(element, binding.style, qp.get(model, binding.path));
      };
      binding.update_model = function(model) {
        qp.set(model, binding.path, qp.get_style(element, binding.style));
      };
    },

    template: function(binding, element) {
      binding.update_view = function(model) {
        element.textContent = qp.format(binding.path, model);
      };
      binding.update_model = function(model) { };
    },

    property: function(binding, element) {
      binding.update_view = function(model) {
        element[binding.property] = qp.get(model, binding.path);
      };
      binding.update_model = function(model) {
        qp.set(model, binding.path, element[binding.property]);
      };
    },

    attribute: function(binding, element) {
      if (binding.boolean) {
        binding.update_view = function(model) {
          if (qp.get(model, binding.path)) {
            element.setAttribute(binding.attribute);
          } else {
            element.removeAttribute(binding.attribute);
          }
        };
        binding.update_model = function(model) {
          qp.set(model, binding.path, element.hasAttribute(binding.attribute));
        };
      } else {
        binding.update_view = function(model) {
          element.setAttribute(binding.attribute, qp.get(model, binding.path));
        };
        binding.update_model = function(model) {
          qp.set(model, binding.path, element.getAttribute(binding.attribute));
        };
      }
    },

    on: function(binding, element) {
      binding.update_view = function(model) {
        binding.event_listener = function(e) {
          qp.nodefault(e);
          var id = element.getAttribute('data-id');
          if (!id) {
            id = qp.parents_until(e.target, element,
              function(el) { return el.getAttribute('data-id'); }
            );
          }
          qp.get(model, binding.path).call(model, Number(id));
        };
        qp.on(element, binding.event, binding.event_listener);
      };
      binding.update_model = function(model) { };
    },

    each: function(binding, element) {
      binding.container = element.parentNode;
      binding.template = binding.container.removeChild(element);
      binding.container.innerHTML = '';
      binding.update_view = function(model) {
        binding.container.innerHTML = '';
        qp.each(qp.get(model, binding.path), function(item) {
          model[binding.item_name] = item;
          var node = {
            element: binding.container.appendChild(binding.template.cloneNode(true)),
            bindings: []
          };
          node.element.setAttribute('data-id', item.id);
          qp.each(this.parse(node), function(binding) {
            binding.update_view(model);
          });
        }.bind(this));
      }.bind(this);
      binding.update_model = function(model) { };
    }

  });

});
