[![npm license][licence-image]][licence-url]
[![npm version][npm-version-image]][npm-version-url]
[![dependency status][david-dm-image]][david-dm-url]

### install

`npm install qp-utility --save`

`<script src="qp-utility.min.js"></script>`   
`<link href="qp-utility.min.css" rel="stylesheet">`

### build

````
cd qp-utility
node build
````

&nbsp;

---
#### `void noop()`

no operation

---
#### `string escape_re(string reg_exp)`

- `reg_exp` regular expression string

escape special chars in a regular expression string

**`return`** escaped string

---
#### `boolean is_number(object value)`

- `value` to check

**`return`** true if value is a `function`

---
#### `boolean is_function(object value)`

- `value` to check

**`return`** true if value is a `function`

---
#### `number random(number min, number max)`

- `number` minimum value
- `number` maximum value

**`return`** a random number between minimum and maximum values

---
#### `boolean is_empty(object value)`

- `value` to check

**`return`** true if value is `undefined`, `null` or `length === 0`

---
#### `boolean not_empty(object value)`

- `value` to check

**`return`** inverse of `is_empty`

---
#### `string trim(string value, string chars)`

- `value` the string to trim
- `chars` the characters to trim from `value`

**`return`** remove characters from both sides of the string

---
#### `string ltrim(string value, string chars)`

- `value` the string to trim
- `chars` trim characters

**`return`** remove the trim characters from the left side of the string

---
#### `string rtrim(string value, string chars)`

- `value` the string to trim
- `chars` trim characters

**`return`** remove the trim characters from the right side of the string

---
#### `string build(string | string[] value, ...)`

- `value` any combination of strings, string arrays and arguments
- `...` further `value`s

`flatten` and `compact` `values` into a flat array and then `join`s them

**`return`** string

````
qp.build(
  '<h1>',
    'hello world',
  '</h1>'
);

=> <h1>hello world</h1>
````

---
#### `string escape(string html)`

- `html` string to escape

**`return`** escape special chars to html entities

---
#### `string unescape(string html)`

- `html` string to unescape

**`return`** unescape html entities to special chars

---
#### `string lpad(string value, string pad, number len)`

- `value` the string to pad
- `pad` padding characters
- `len` pad to length

**`return`** pad left side of `value`

---
#### `string rpad(string value, string pad, number len)`

- `value` the string to pad
- `pad` padding characters
- `len` pad to length

**`return`** pad right side of `value`

---
#### `boolean starts(string value, string match)`

- `value` the string to test
- `match` starts with

**`return`** does the string start with `match`

---
#### `boolean ends(string value, string match)`

- `value` the string to test
- `match` ends with

**`return`** does the string end with `match`

---
#### `string between(string value, string left, string right)`

- `value` the string to process
- `left` left hand delimiter
- `right` right hand delimiter (defaults to `left`)

**`return`** the string between the delimiters

````
qp.between('<div>hello world</div>', '<div>', '</div>');
=> hello world
````

---
#### `string camel_case(string value)`

- `value` the string to process

**`return`** converted to `CamelCase`

---
#### `string kebab_case(string value)`

- `value` the string to process

**`return`** converted to `kebab-case`

---
#### `string snake_case(string value)`

- `value` the string to process

**`return`** converted to `snake_case`

---
#### `string repeat(string value, number times, string delimiter)`

- `value` the string to repeat
- `times` the number of times to repeat the string
- `delimiter` the delimiter between the repeats (defaults to `''`)

**`return`** repeated string

---
#### `string replace_all(string value, string search, string replace)`

- `value` the string to process
- `search` the string to search for. optionally a regular expression
- `replace` the replacement string

**`return`** replace all occurrences of one string within another

---
#### `string get_utf8_length(string value)`

see <http://stackoverflow.com/a/12206089>

- `value` the string to process

**`return`** the string length in bytes with regard for the encoding

---
#### `string stringify(object value, boolean simple)`

- `value` the object to convert to a string
- `simple` if true, produces simplified output, does not process children

**`return`** string representation of `value`

````
qp.stringify({ one: 'two', three: { four: 'five' } });
> "{ one: two, three: { four: five } }"
````

---
#### `array map(array items, function map, object context)`

- `items` the source array
- `object function map(object item, number index, array items)`

    - `item` current item being processed
    - `index` current item index
    - `items` the source array

    **`return`** the item to be added to the mapped array
- `context` context of map function

**`return`** a new array produced via the `map` function

---
#### `object reduce(array items, function reduce, object value)`

- `items` the source array
- `reduce` the reduce function
- `value` the initial reduce value

**`return`**

---
#### `array arg(arguments args)`

- `args` the arguments object

**`return`** containing the passed arguments

---
#### `array to_array(object value)`

- `value` the value to convert to an array

attempts to convert the passed value to an array. converts array like objects, strings are split to chars, single values are placed inside a new array, otherwise an empty array is returned

**`return`** value converted to array

#### `array union(array items, ...)`

- `items` array of items
- `...` further items to concatenate

concatenate arrays passed as items

**`return`** a single array

---
#### `array flatten(object | array value, ...)`

- `value`
- `...`

concatenates items, arrays and arguments to a single array

**`return`** a one dimensional array

---
#### `array compact(array items)`

- `items` the items to compact

**`return`** items with `falsey` values removed

---
#### `now()`

---
#### `timer()`

---
#### `date()`

---
#### `file_date()`

---
#### `date_time()`

---
#### `object bind(object source, object context)`

- `source` source of functions to bind
- `context` context object (defaults to source object)

Iterates functions of source object and binds them to the context object

**`return`** source object

---
#### `object invoke(function fn, object context)`

- `fn` the function to invoke (also function[])
- `context` the context object

**`return`** the return value of `fn` (or array if function[] is passed)

---
#### `void function invoke_after(function fn, number n, object context)`

- `fn` the function to invoke
- `n` the number of times `fn` is called before it is to be invoked
- `context` the context object

**`return`** the wrapped `function`

---
#### `void invoke_delay(function fn, number milli)`

- `fn` the function to invoke
- `milli` the delay in milliseconds

---
#### `void invoke_next(function fn, function check, number milli)`

- `fn` the function to invoke
- `check` the check function must return `true` for `fn` to be invoked
- `milli` the interval to invoke `check` at

---
#### `string typeof(object value, boolean ctor)`

- `value` the value on which to call `Object.prototype.toString`
- `ctor` pass true to return `constructor.name` if available (defaults to false)

if `ctor` is true and the class name is `object` then `pojo` is returned if a constructor name is not available.

possible values of class name (lower case);

`object`, `array`, `function`, `date`, `regexp`, `string`, `number`, `boolean`, `error`, `math`, `json`, `arguments`, `null` & `undefined`

**`return`** the class name of `value`

````
var example = { str: 's', int: 1, bool: true };

qp.typeof(example);
> 'object'

qp.typeof(example, true);
> 'pojo'

qp.typeof(example.bool)
> 'boolean'

function Shape() { }
Shape.prototype.draw = function() { };
var s = new Shape();

qp.typeof(s);
> 'object'

qp.typeof(s, true);
> 'shape'

````

---
#### `boolean is(object value, string class, ...)`

- `value` the value to test
- `class` the class name (or constructor name) to match
- `...` further class names to match

**`return`** if the class name of `value` equals `class`

---
#### `boolean is_not(object value, string class, ...)`

- `value` the value to test
- `class` the class name (or constructor name) to match
- `...` further class names to match

**`return`** if the class name of `value` does not equal `class`

---
#### `number size(object value)`

- `value` to test

if `value` is an array then `length` is returned else `Object.keys().length`

**`return`** the "size" of `value`

---
#### `boolean each(object value, function fn, object context)`

- `value`
- `boolean function fn(object item, number index, object value)`

    - `item`
    - `index`
    - `value`

    **`return`**
- `context`

**`return`** if the loop exited early

---
#### `boolean each_own(object value, function fn, object context)`

- `value`
- `boolean function fn(object item, number index, object value)`

    - `item`
    - `index`
    - `value`

    **`return`**
- `context`

**`return`** if the loop exited early

---
#### `object assign(object target, object source, ...)`

- `target`
- `source`
- `...`

**`return`**

---
#### `object assign_own(object target, object source, ...)`

- `target`
- `source`
- `...`

**`return`**

---
#### `object assign_if(object target, object source, ...)`

- `target`
- `source`
- `...`

**`return`**

---
#### `boolean equals(object value_a, object value_b)`

- `value_a` first object
- `value_b` second object

performs a deep comparison of objects, and arrays

**`return`** `true` if value_a exactly equals value_b

---
#### `object clone(object value)`

- `value` the value to clone

performas a deep clone of object and arrays. also clones `Date` objects

**`return`** a copy of `value`

---
#### `object copy(object value)`

- `value` the value to copy

performs a shallow copy

**`return`** a copy `value`

---
#### `object merge(object target, object source, ...)`

- `target` the destination object
- `source` the values to merge into `target`
- `...` further `source` objects

merges `source` objects into `target`, working from left to right

**`return`** the `target` object

---
#### `object extend(object target, function | object source, ...)`

- `target` the object to extend
- `source`
  - `function` the function is called and the return value is used as `source`
  - `...` the arguments passed to `function`
  - `object` copy `source` keys to `target`

copy keys from `source` to `target`. if `source` is `function` its return value is used as `source`

**`return`** the extended `target` object

---
#### `object override(object value_a, object value_b)`

- `value_a`
- `value_b`

**`return`**

---
#### `object | array first(array items, number count)`

- `items`
- `count`

**`return`** the first item in `items`, or first `count` items

---
#### `object | array last(array items, number count)`

- `items`
- `count`

**`return`** the last item in `items`, or last `count` items

---
#### `array rest(array items, number from)`

- `items`
- `from`

**`return`**

---
#### `object at(array items, number index)`

- `items`
- `index`

**`return`**

---
#### `array range(array items, number from, number to)`

**`return`**

---
#### `boolean in(object item, array items)`

**`return`**

---
#### `boolean not_in(object item, array items)`

**`return`**

---
#### `function find_predicate(function | object | string arg1, object arg2)`

- `arg1`
  - `function`
  - `object`
  - `string`
- `arg2`
  - `object` context
  - `undefined`
  - `object` value to match

**`return`**

---
#### `find()`

**`return`**

---
#### `any()`

**`return`**

---
#### `find_all()`

**`return`**

---
#### `find_index()`

**`return`**

---
#### `remove()`

**`return`**

---
#### `pick_predicate()`

**`return`**

---
#### `pick()`

**`return`**

---
#### `pick_own()`

**`return`**

---
#### `pairs()`

**`return`**

---
#### `keys()`

**`return`**

---
#### `values()`

**`return`**

---
#### `pick_values()`

**`return`**

---
#### `sort()`

**`return`**

---
#### `sort_on()`

**`return`**

---
#### `group_on()`

**`return`**

---
#### `group_by()`

**`return`**

---
#### `ns()`

**`return`**

---
#### `options()`

**`return`**

---
#### `id()`

**`return`**

---
#### `uuid()`

**`return`**

---
#### `series()`

**`return`**

---
#### `each_series()`

**`return`**

---
#### `parallel()`

**`return`**

---
#### `each_parallel()`

**`return`**

---

[licence-image]: https://img.shields.io/npm/l/qp-utility.svg
[npm-version-image]: http://img.shields.io/npm/v/qp-utility.svg
[david-dm-image]:https://img.shields.io/david/cjr--/qp-utility.svg

[licence-url]: https://github.com/cjr--/qp-utility/blob/master/LICENSE
[npm-version-url]: https://npmjs.org/package/qp-utility
[david-dm-url]:https://david-dm.org/cjr--/qp-utility
