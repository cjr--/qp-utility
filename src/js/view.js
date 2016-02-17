function create_view(config) { return new View(config); }

function View(config) {
  this.bind.bind(this);
  this.parse.bind(this);
  this.parse_node.bind(this);
  this.update_view.bind(this);
  this.update_model.bind(this);

  this.element = config.el;
  this.model = config.model;
  this.bindings = [];
  this.bind();
}

View.prototype.bind = function() {
  this.parse(this.element, this.bindings);
};

View.prototype.update_view = function() {
  qp.each(this.bindings, function(binding) {
    binding.update_view(this.model);
  }.bind(this));
};

View.prototype.update_model = function() {
  qp.each(this.bindings, function(binding) {
    binding.update_model(this.model);
  }.bind(this));
};

View.prototype.parse = function(element, bindings) {
  bindings = bindings || [];
  this.parse_node(element, bindings);
  if (element.parentNode) {
    qp.each(element.children, function(child_element) {
      this.parse(child_element, bindings);
    }.bind(this));
  }
  return bindings;
};

View.prototype.parse_node = function(element, bindings) {
  qp.each(qp.get_attributes(element), function(attribute) {
    if (attribute.name.slice(0, 2) === 'v-') {
      var binding = {
        key: attribute.name,
        path: attribute.value,
        element: element
      };
      if (attribute.name === 'v-text') {
        binding.type = 'text';
      } else if (attribute.name === 'v-html') {
        binding.type = 'html';
      } else if (attribute.name === 'v-data-id') {
        binding.type = 'id';
      } else if (qp.match(attribute.name, 'v-on-*')) {
        binding.type = 'on';
        binding.item_name = attribute.name.slice(5);
      } else if (qp.match(attribute.name, 'v-each-*')) {
        binding.type = 'each';
        binding.item_name = attribute.name.slice(7);
      }
      this[binding.type](binding);
      bindings.push(binding);
      element.removeAttribute(binding.key);
    }
  }.bind(this));
};

View.prototype.text = function(binding) {
  binding.update_view = function(model) { binding.element.textContent = qp.get(model, binding.path); };
  binding.update_model = function(model) { qp.set(model, binding.path, binding.element.textContent); };
};

View.prototype.html = function(binding) {
  binding.update_view = function(model) { binding.element.innerHTML = qp.get(model, binding.path); };
  binding.update_model = function(model) { qp.set(model, binding.path, binding.element.innerHTML); };
};

View.prototype.id = function(binding) {
  binding.update_view = function(model) { binding.element.setAttribute('data-id', qp.get(model, binding.path)); };
  binding.update_model = function(model) { qp.set(model, binding.path, binding.element.getAttribute('data-id')); };
};

View.prototype.on = function(binding) {
  binding.update_view = function(model) {
    binding.event_listener = function(e) {
      e.stopPropagation();
      var id = binding.element.getAttribute('data-id');
      if (!id) {
        id = qp.parents_until(e.target, binding.element, function(el) {
          return el.getAttribute('data-id');
        });
      }
      qp.get(model, binding.path).call(model, Number(id));
    };
    binding.element.addEventListener(binding.item_name, binding.event_listener, false);
  };
  binding.update_model = function(model) { };
};

View.prototype.each = function(binding) {
  binding.container = binding.element.parentNode;
  binding.template = binding.container.removeChild(binding.element);
  binding.container.innerHTML = '';
  binding.update_view = function(model) {
    binding.container.innerHTML = '';
    qp.each(qp.get(model, binding.path), function(item) {
      model[binding.item_name] = item;
      var child_element = binding.container.appendChild(binding.template.cloneNode(true));
      child_element.setAttribute('data-id', item.id);
      qp.each(this.parse(child_element), function(binding) {
        binding.update_view(model);
      });
    }.bind(this));
  }.bind(this);
  binding.update_model = function(model) { };
};
