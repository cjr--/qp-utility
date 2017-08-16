module.exports = function(target) {

  var js_files = [];
  var css_files = [];
  var fns = [];
  var type_definitions = [];

  if (target === 'node') {
    js_files = js_files.concat([
      'node_core'
    ]);
    fns = fns.concat([]);
  } else if (target === 'browser') {
    js_files = js_files.concat([
      'browser_core'
    ]);
    fns = fns.concat([]);
  }

  js_files = js_files.concat([
    'core', 'string', 'array', 'object', 'date', 'function', 'accessor', 'assign', 'typeof',
    'clone', 'copy', 'equals', 'merge', 'options', 'override', 'data', 'collection',
    'iteration', 'async', 'pick', 'find', 'id', 'make', 'module', 'sort', 'group', 'math', 'currency', 'match', 'select', 'validate',
    'filter', 'watch', 'define_property'
  ]);

  css_files = css_files.concat([ ]);

  fns = fns.concat([
    'noop','noop_callback','escape_re','is_value','is_boolean','is_number','is_function','is_string','is_array','is_array_like','defined',
    'undefined:not_defined','random','dfault','boolean','no:empty','not','empty','not_empty',
    'empty_or_whitespace','upper','lower','trim',
    'ltrim','rtrim','split','join','build','escape','unescape','pad','lpad','rpad','starts','clean_whitespace','lines','plural',
    'ends','between','before','before_last','after','after_last','title_case','to_title_case','repeat','replace_all','format',
    'camel_to','to_camel','snake_to_camel','camel_to_snake','snake_to_kebab','kebab_to_snake','camel_to_kebab','kebab_to_camel',
    'increase_indent','hashcode','title_case','get_utf8_length','stringify','json','eol',
    'sum','min','max','avg','round','max_number','truncate','clamp',
    'currency','currency_list','Money','money','Decimal','decimal',
    'map','reduce','arg','to_array','flatten','compact',
    'now','date','date_time','file_date','get_fn_name','timer',
    'combine','done','bind','partial','invoke','invoke_after','invoke_delay','invoke_next','invoke_when','debounce','throttle','patch',
    'typeof:qp_typeof','is','is_not','size','each','each_own','assign',
    'assign_own','assign_if','eq','neq','clone','copy','merge','override',
    'make','module:_module','first','last','rest','at','range','in:_in','not_in','find_predicate',
    'find','any','find_all','find_last','find_last_index','find_index','remove','remove_all',
    'sort','get_comparer','group','ungroup',
    'options:qp_options','id:qp_id','uuid','get','take','has','set',
    'each_series','series','parallel','pick',
    'union','unique','clear','push','load','contains','inlist','get_data',
    'set_data','count','all','none','exists','replace','upsert',
    'build_match','match','get_matches','has_key','delete_key','delete:qp_delete','select',
    'is_alpha_numeric','is_length','validate_type','validate_number','validate_not_empty','validate_string',
    'filter_key','filter_display','filter_predicate','filter',
    'define_property','watch','unwatch','watch_property','unwatch_property'
  ]);

  if (target === 'node') {
    js_files = js_files.concat([
      'node_request'
    ]);
    fns = fns.concat([
      'request:http_request'
    ]);
  } else if (target === 'browser') {
    js_files = js_files.concat([
      'debug', 'log', 'browser_request', 'dom', 'selector'
    ]);
    fns = fns.concat([
      'debug','get_attributes','set_attributes','get_attribute','set_attribute','has_attribute','remove_attribute',
      'is_element','not_element','element','on','off','nodefault',
      'show','hide','visible','hidden','text','add_class','remove_class','has_class','html','swap',
      'set_style','get_style','attr','has_attr',
      'parents_until','ready', 'select_all','select_children','matches','select_each','select_first',
      'request:http_request'
    ]);
    type_definitions = type_definitions.concat([
      'browser_socket','browser_store'
    ]);
  }

  return {

    platform: target,

    files: {
      js: js_files,
      css: css_files,
      type_definitions: type_definitions
    },

    fns: 'var qp = {\n' + fns.map(function(fn) {
      fn = fn.split(':');
      return '  ' + fn[0] + ': ' + (fn[1] || fn[0]);
    }).join(',\n') + '\n};'

  };

};
