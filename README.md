### qp-library

modularise and reuse javascript between browser and server. introduces a global function called library which can be used like require on all platforms.

#### Install

`npm install qp-library --save`

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
      - index.css
  - package.json
````

````
::serve.js
require('./../library');
````
````
::worker.js
var my_module = library('my-module')
````
