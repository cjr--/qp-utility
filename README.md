# UNDER CONSTRUCTION

### qp-library

modularise and reuse javascript between browser and server. introduces a global function called library which can be used like require on all platforms.

#### Install

###### node:
`npm install qp-library --save`
###### browser:
`<script src="/library.min.js"></script>`

#### Usage
````
- my-project
  - library
    - my-module
      - index.js
      - package.json
  + node_modules
  - src
    - serve.js
    - worker.js
    - www
      - index.html
      - index.js
      - index.css
  - package.json
````

````
/src/serve.js
require('./../library');
````
````
/src/worker.js
var my_module = library('my-module');
````
````
/src/www/index.js
var my_module = library('my-module');
````
````
/library/my-module/index.js
library(module, {
  ns: 'my-module',
  mixins: [],

  init: function() { }
});
````
