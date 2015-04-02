var qp = {

  // core.js
  noop: noop,
  escape_re: escape_re,
  is_number: is_number,
  is_function: is_function,
  random: random,
  is_empty: is_empty,
  is_not_empty: is_not_empty,

  // string.js
  trim: trim,
  ltrim: ltrim,
  rtrim: rtrim,
  build: build,
  escape: escape,
  unescape: unescape,
  lpad: lpad,
  rpad: rpad,
  starts: starts,
  ends: ends,
  between: between,
  snake_to_camel: snake_to_camel,
  camel_to_snake: camel_to_snake,
  repeat: repeat,
  replace_all: replace_all,
  get_utf8_length: get_utf8_length,
  stringify: stringify,

  // array.js
  map: map,
  reduce: reduce,
  arg: arg,
  to_array: to_array,
  flatten: flatten,
  compact: compact,

  // date.js
  now: now,
  date: date,
  file_date: file_date,

  // function.js
  bind: bind,
  invoke: invoke,
  invoke_after: invoke_after,
  invoke_delay: invoke_delay,

  // typeof.js
  typeof: qp_typeof,
  is: is,
  is_not: is_not,

  // iteration.js
  size: size,
  each: each,
  each_own: each_own,
  assign: assign,
  assign_own: assign_own,
  assign_if: assign_if,

  // equals.js
  equals: equals,
  // clone.js
  clone: clone,
  // copy.js
  copy: copy,
  // merge.js
  merge: merge,
  // extend.js
  extend: extend,
  // override
  override: override,
  // make.js
  make: make,

  // collection.js
  first: first,
  last: last,
  rest: rest,
  at: at,
  range: range,
  in: _in,
  not_in: not_in,

  // find.js
  find_predicate: find_predicate,
  find: find,
  any: any,
  exists: any,
  find_all: find_all,
  find_index: find_index,
  remove: remove,
  remove_all: remove_all,

  // pick
  pick_predicate: pick_predicate,
  pick: pick,
  pick_own: pick_own,
  pairs: pairs,
  keys: keys,
  values: values,
  pick_values: pick_values,

  // sort.js
  sort: sort,
  sort_on: sort_on,
  group_on: group_on,
  group_by: group_by,

  // ns.js
  ns: ns,

  // options.js
  options: options,

  // id.js
  id: id,
  uuid: uuid,

  // async.js
  series: series,
  parallel: parallel

};
