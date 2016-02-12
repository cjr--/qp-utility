global.debug = function() {
  var format = ['%cDEBUG:','color:black;background-color:yellow;'];
  console.log.apply(console, format.concat(slice.call(arguments)));
};
