var alpha_numeric_re = /^[a-z0-9]+$/i;

function is_valid(s, re) {
  if (is(s, 'string')) {
    return re.test(s);
  }
  return false;
}

function is_alpha_numeric(s) {
  return alpha_numeric_re.test(s);
}

function is_length(s, l0, l1) {
  if (is(s, 'string')) {
    if (arguments.length === 2) {
      return s.length === l0;
    } else if (arguments.length === 3) {
      return s.length >= l0 && s.length <= l1;
    }
  }
  return false;
}

function validate_type(key, type, name) {
  return {
    key: key,
    name: qp.title_case(name || key),
    validate: 'validate_type',
    type: type,
    fn: function(value, model) {
      if (qp.is_not(value, this.type)) {
        return { message: this.name + ' is not a ' + this.type };
      }
    }
  };
}

function validate_number(key, min, max, name) {
  return {
    key: key,
    name: qp.title_case(name || key),
    validate: 'validate_number',
    min_value: min,
    max_value: max,
    fn: function(value, model) {
      if (qp.is_not(value, 'number')) {
        return { message: this.name + ' is not a number' };
      } else if (value > this.max_value) {
        return { message: this.name + ' cannot be larger than ' + this.max_value };
      } else if (value < this.min_value) {
        return { message: this.name + ' cannot be less than ' + this.min_value };
      }
    }
  };
}

function validate_not_empty(key, name) {
  return {
    key: key,
    name: qp.title_case(name || key),
    validate: 'validate_not_empty',
    fn: function(value, model) {
      if (qp.empty(value)) {
        return { message: 'Please provide a value for ' + this.name };
      }
    }
  };
}

function validate_string(key, min_length, max_length, name) {
  return {
    key: key,
    name: qp.title_case(name || key),
    validate: 'validate_string',
    min_length: min_length,
    max_length: max_length,
    fn: function(value, model) {
      if (qp.is_not(value, 'string')) {
        return { message: this.name + ' is not a text value' };
      } else if (min_length === 1 && value.length === 0) {
        return { message: 'Please provide a value for ' + this.name };
      } else if (value.length < min_length) {
        return { message: this.name + ' must be longer than ' + this.min_length + ' characters' };
      } else if (value.length > max_length) {
        return { message: this.name + ' cannot be longer than ' + this.max_length + ' characters' };
      }
    }
  };
}
