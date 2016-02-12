module.exports = function(target) {

  var fns = [
    'noop','noop_callback','escape_re','is_number','is_function','is_string','defined',
    'undefined:not_defined','random','dfault','empty','not_empty','trim',
    'ltrim','rtrim','split','build','escape','unescape','pad','lpad','rpad','starts','clean_whitespace','lines','plural',
    'ends','between','title_case','repeat','replace_all','format',
    'camel_to','to_camel','snake_to_camel','camel_to_snake','snake_to_kebab','kebab_to_snake','camel_to_kebab','kebab_to_camel',
    'get_utf8_length','stringify','sum','min','max','avg','map','reduce',
    'arg','to_array','flatten','compact','now','date','date_time','file_date','get_fn_name','timer',
    'combine','done','bind','invoke','invoke_after','invoke_delay','invoke_next','invoke_when','debounce','throttle',
    'typeof:qp_typeof','is','is_not','size','each','each_own','assign',
    'assign_own','assign_if','equals','clone','copy','merge','extend','override',
    'make','first','last','rest','at','range','in:_in','not_in','find_predicate',
    'find','any','find_all','find_index','remove','remove_all','pick_predicate',
    'pick','pick_own','pairs','keys','values','pick_values','sort','get_comparer','group','ungroup','ns',
    'options:qp_options','id','uuid','series','parallel','get','take','has','set',
    'union','unique','clear','push','load','contains','inlist','pick_path','get_data',
    'set_data','eq','neq','count','all','none','exists','replace','upsert',
    'build_match','match','get_matches','has_key','select'
  ];

  if (target === 'node') {
    //
  } else if (target === 'browser') {
    fns = fns.concat([
      'fade_in','fade_out','debug','get_attributes','get_attribute','is_element','element',
      'show','hide','add_class','remove_class','html','attr','parents_until','dom_ready','http_request',
      'select_all','select_each','select_first','create_view'
    ]);
  }

  return 'var qp = {\n' + fns.map(function(fn) {
    fn = fn.split(':');
    return '  ' + fn[0] + ': ' + (fn[1] || fn[0]);
  }).join(',\n') + '\n};';
};
