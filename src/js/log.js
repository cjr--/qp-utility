global.log = function() {
  console.log.apply(console, format.concat(slice.call(arguments)));
};
