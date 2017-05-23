function ns(scope, _ns, value) {
  scope = scope || global;
  var setter = arguments.length === 3;
  each(_ns.split('.'), function(part, index, parts) {
    if (setter && index === parts.length - 1) {
      if (!scope[part]) {
        scope[part] = {};
      }
      scope = (scope[part] = value);
    } else {
      scope = scope[part] || (scope[part] = {});
    }
  });
  return scope;
}
