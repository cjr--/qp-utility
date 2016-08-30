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
    'clone', 'copy', 'equals', 'extend', 'merge', 'ns', 'options', 'override', 'pick', 'data', 'collection',
    'iteration', 'async', 'find', 'id', 'make', 'sort', 'group', 'math', 'match', 'select', 'validate'
  ]);

  css_files = css_files.concat([
    'normalize', 'base', 'code', 'form', 'misc', 'text', 'media',
    'grid', 'grid-xs', 'grid-sm', 'grid-md', 'grid-lg',
    'flex-grid'
  ]);

  fns = fns.concat([
    'noop','noop_callback','escape_re','is_value','is_number','is_function','is_string','defined',
    'undefined:not_defined','random','dfault','empty','not_empty','upper','lower','trim',
    'ltrim','rtrim','split','build','escape','unescape','pad','lpad','rpad','starts','clean_whitespace','lines','plural',
    'ends','between','before','before_last','after','after_last','title_case','repeat','replace_all','format',
    'camel_to','to_camel','snake_to_camel','camel_to_snake','snake_to_kebab','kebab_to_snake','camel_to_kebab','kebab_to_camel',
    'increase_indent','title_case','get_utf8_length','stringify','eol',
    'sum','min','max','avg','map','reduce','arg','to_array','flatten','compact',
    'now','date','date_time','file_date','get_fn_name','timer',
    'combine','done','bind','invoke','invoke_after','invoke_delay','invoke_next','invoke_when','debounce','throttle','patch',
    'typeof:qp_typeof','is','is_not','size','each','each_own','assign',
    'assign_own','assign_if','eq','neq','clone','copy','merge','extend','override',
    'make','first','last','rest','at','range','in:_in','not_in','find_predicate',
    'find','any','find_all','find_last','find_index','remove','remove_all','pick_predicate',
    'pick','pick_own','pairs','keys','values','pick_values','sort','get_comparer','group','ungroup','ns',
    'options:qp_options','id','uuid','series','parallel','get','take','has','set',
    'union','unique','clear','push','load','contains','inlist','pick_path','get_data',
    'set_data','count','all','none','exists','replace','upsert',
    'build_match','match','get_matches','has_key','select',
    'is_alpha_numeric','is_length'
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
      'debug', 'log', 'browser_request', 'dom', 'animate', 'selector', 'app'
    ]);
    fns = fns.concat([
      'fade_in','fade_out','debug','get_attributes','get_attribute','is_element','element','on','off','nodefault',
      'show','hide','add_class','remove_class','html','attr','parents_until','ready','request:http_request',
      'select_all','select_each','select_first'
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
