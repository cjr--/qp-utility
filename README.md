#### `noop()`

no operation

#### `string escape_re(string reg_exp)`

escape special chars in a regular expression string

`reg_exp` regular expression string

`string` escaped string

#### `boolean is_number(object value)`

`value` to check

`boolean` true if value is a `function`

#### `boolean is_function(object value)`

`value` to check

`boolean` true if value is a `function`

#### `number random(number min, number max)`

`number` minimum value
`number` maximum value

`number` a random number between minimum and maximum values

#### `boolean is_empty(object value)`

`value` to check

`boolean` true if value is `undefined`, `null` or `length === 0`

#### `boolean not_empty(object value)`

`value` to check

`boolean` inverse of `is_empty`

#### `string trim(string value, string chars)`

`value` the string to trim
`chars` the characters to trim from `value`

`string` remove characters from both sides of the string

#### `string ltrim(string value, string chars)`

`value` the string to trim
`chars` trim characters

`string` remove the trim characters from the left side of the string

#### `string rtrim(string value, string chars)`

`value` the string to trim
`chars` trim characters

`string` remove the trim characters from the right side of the string

#### `string build(string | string[], ...)`

flattens and compacts arguments of strings string arrays and joins them

````
qp.build(
  '<h1>',
    'hello world',
  '</h1>'
);

=> <h1>hello world</h1>
````

#### `string escape(string html)`

`html` string to escape

`string` escape special chars to html entities

#### `string unescape(string html)`

`html` string to unescape

`string` unescape html entities to special chars

#### `string lpad(string value, string pad, number len)`

`value` the string to pad
`pad` padding characters
`len` pad to length

`string` pad left side of `value`

#### `string rpad(string value, string pad, number len)`

`value` the string to pad
`pad` padding characters
`len` pad to length

`string` pad right side of `value`

#### `boolean starts(string value, string match)`

`value` the string to test
`match` starts with

`boolean` does the string start with `match`

#### `boolean ends(string value, string match)`

`value` the string to test
`match` ends with

`boolean` does the string end with `match`

#### `string between(string value, string left, string right)`

`value` the string to process
`left` left hand delimiter
`right` right hand delimiter (defaults to `left`)

````
qp.between('<div>hello world</div>', '<div>', '</div>');
=> hello world
````

#### `string camel_case(string value)`

`value` the string to process

`string` convert to `CamelCase`

#### `string kebab_case(string value)`

`value` the string to process

`string` convert to `kebab-case`

#### `string snake_case(string value)`

`value` the string to process

`string` convert to `snake_case`

#### `string repeat(string value, number times, string delimiter)`

`value` the string to repeat
`times` the number of times to repeat the string
`delimiter` the delimiter between the repeats (defaults to '')

`string` repeated string

#### `string replace_all(string value, string|regexp search, string replace)`

`value` the string to process
`search` the string to search for | regular expression
`replace` the replacement string

`string` replace all occurrences of one string within another

#### `string get_utf8_length(string value)`

see <http://stackoverflow.com/a/12206089>

`value` the string to process

`string` the string length in bytes with regard for the encoding

#### `string stringify(object value, boolean simple)`

'value' the object to convert to a string
'simple' if true, produces simplified output, does not process children

`string` string representation of `value`

````
qp.stringify({ one: 'two', three: { four: 'five' } });
> "{ one: two, three: { four: five } }"
````

#### `array map(array items, function map, object context)`

`items` the source array
`map` the map function

> `object function map(object item, number index, array items)`
>
> `item` current item being processed
> `index` current item index
> `items` the source array
>
> `object:` the item to be added to the mapped array

`context` context of map function

`array:` a new array produced via the `map` function

#### `object reduce(array items, function reduce, object value)`

`items` the source array
`reduce` the reduce function
`value` the initial reduce value

`object:`

#### `array arg(arguments args)`

`args` the arguments object

`array:` containing the passed arguments

#### `to_array(value)`

- (value) the value to convert to an array

attempts to convert the passed value to an array. converts array like objects, strings are split to chars, single values are placed inside a new array, otherwise an empty array is returned

#### `flatten(value|array, ...)`

concatenates arrays, values and arguments to a single array

#### `compact(array)`

removes `falsey` values from an array

#### `now()`

#### `timer()`

#### `date()`

#### `file_date()`

#### `date_time()`

#### `bind(object, object)`

- (object) source object
- (object) context object (defaults to source object)

Iterates functions of source object and binds them to the context object

#### `invoke(function|[function], object)`

- (function)

#### `invoke_after()`

#### `invoke_delay()`

#### `invoke_next()`

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
