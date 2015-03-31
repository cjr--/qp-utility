#### `noop()`

no operation

#### `escape_re(regexp)`

escape a regular expression string

#### `is_number(value)`

checks if `value` is a `Number`

#### `is_function(value)`

checks if `value` is a `Function`

#### `random(min, max)`

create a random number between `min` and `max`

#### `is_empty(value)`

is `value`; `undefined`, `null` or has a `length` equal to zero

#### `is_not_empty()`

reverse of `is_empty`

#### `trim([string=' '], [chars=' '])`

remove `chars` from both sides of `string`

#### `ltrim([string=' '], [chars=' '])`

remove `chars` from the left side of `string`

#### `rtrim([string=' '], [chars=' '])`

remove `chars` from the right side of `string`

#### `build(string|array)`

flattens and compacts arguments of string arrays or strings and joins them

````
var content = 'hello world';
var fragment = qp.build(
  '<h1>',
    content,
  '</h1>'
);
````

#### `escape(string)`

escape special chars to html entities

#### `unescape(string)`

unescape html entities to special chars

#### `lpad()`

#### `rpad()`

#### `starts()`

#### `ends()`

#### `between()`

#### `snake_to_camel()`

#### `camel_to_snake()`

#### `repeat()`

#### `replace_all()`

#### `get_utf8_length()`

#### `stringify()`

#### `map()`

#### `reduce()`

#### `arg()`

#### `to_array()`

#### `flatten()`

#### `compact()`

#### `now()`

#### `date()`

#### `file_date()`

#### `bind()`

#### `invoke()`

#### `invoke_after()`

#### `invoke_delay()`

#### `typeof()`

#### `is()`

#### `is_not()`

#### `size()`

#### `each()`

#### `each_own()`

#### `assign()`

#### `assign_if()`

#### `equals()`

#### `clone()`

#### `copy()`

#### `merge()`

#### `extend()`

#### `override()`

#### `first()`

#### `last()`

#### `rest()`

#### `at()`

#### `range()`

#### `in()`

#### `not_in()`

#### `find_predicate()`

#### `find()`

#### `any()`

#### `find_all()`

#### `find_index()`

#### `remove()`

#### `pick_predicate()`

#### `pick()`

#### `pick_own()`

#### `pairs()`

#### `keys()`

#### `values()`

#### `pick_values()`

#### `sort()`

#### `sort_on()`

#### `group_on()`

#### `group_by()`

#### `ns()`

#### `options()`

#### `id()`

#### `uuid()`

#### `series()`

#### `parallel()`
