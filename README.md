#### `noop()`

no operation

#### `escape_re(string)`

escape a regular expression string

#### `is_number(value)`

checks if `value` is a `Number`

#### `is_function(value)`

checks if `value` is a `Function`

#### `random(number, number)`

- (number) minimum value
- (number) maximum value

create a random number between minimum and maximum values

#### `is_empty(value)`

is `value`; `undefined`, `null` or has a `length` equal to zero

#### `is_not_empty(value)`

reverse of `is_empty`

#### `trim(string, string=' ')`

- (string) the string to trim
- (string) trim characters

remove the trim characters from both sides of the string

#### `ltrim(string, string=' ')`

- (string) the string to trim
- (string) trim characters

remove the trim characters from the left side of the string

#### `rtrim(string, string=' ')`

- (string) the string to trim
- (string) trim characters

remove the trim characters from the right side of the string

#### `build(string|[string], ...)`

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

#### `lpad(string, string, number)`

- (string) the string to pad
- (string) padding characters
- (number) pad to length

pad the left hand side of a string with the pad characters until to total length of the string is greater than or equal to the length.

#### `rpad(string, string, number)`

- (string) the string to pad
- (string) padding characters
- (number) pad to length

pad the right hand side of a string with the pad characters until to total length of the string is greater than or equal to the length.

#### `starts(string, string)`

- (string) the string to test
- (string) starts with

#### `ends(string, string)`

- (string) the string to test
- (string) ends with

#### `between(string, string, string=left_delimiter)`

- (string) the string to process
- (string) left hand delimiter
- (string) right hand delimiter

`qp.between('<div>hello</div>', '<div>', '</div>');`
`> hello`

#### `snake_to_camel(string)`

convert `snake_case` to upper `CamelCase`

#### `snake_to_kebab(string)`

convert `snake_case` to `kebab-case`

#### `camel_to_snake(string)`

convert upper `CamelCase` to `snake_case`

#### `camel_to_kebab(string)`

convert upper `CamelCase` to `kebab-case`

#### `kebab_to_camel(string)`

convert `kebab-case` to upper `CamelCase`

#### `kebab_to_snake(string)`

convert `kebab-case` to `snake_case`

#### `repeat(string, number, string='')`

- (string) the string to repeat
- (number) the number of times to repeat the string
- (string) the delimiter between the repeats

#### `replace_all(string, string='', string='')`

- (string) the string to process
- (string) the string to search for | regular expression
- (string) the replacement string

Replace all occurences of one string within another, optionally search using a RegExp

#### `get_utf8_length(string)`

see <http://stackoverflow.com/a/12206089>

- (string) the string to process

Returns to the string length in bytes with regard for the encoding

#### `stringify(object, boolean)`

- (object) the object to convert to a string
- (boolean) if true, procduces simplified output, does not process children

`qp.stringify({ one: 'two', three: { four: 'five' } });`
`> "{ one: two, three: { four: five } }"`

#### `map(array, function, object)`

- (array) the source array
- (function) the map function
- (object) scope within which to call the map function

#### `reduce(array, function, value)`

- (array) the source array
- (function) the reduce function
- (value) the initial reduce value

#### `arg(arguments)`

- (arguments) the array like arguments object

returns a array containing the passed arguments

#### `to_array(value)`

- (value) the value to convert to an array

attempts to convert the passed value to an array. converts array like objects, strings are split to chars,
single values are placed inside a new array, otherwise an empty array is returned

#### `flatten(value|array, ...)`

concatenates arrays, values and arguments to a single array

#### `compact(array)`

removes `falsey` values from an array

#### `now()`

#### `timer()`

#### `date()`

#### `file_date()`

#### `date_time()`

#### `bind()`

#### `invoke()`

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
