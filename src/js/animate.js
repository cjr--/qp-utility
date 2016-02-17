function fade_in(el) {
  el.style.opacity = 0;
  var last = Number(new Date());
  var tick = function() {
    el.style.opacity = Number(el.style.opacity) + (new Date() - last) / 400;
    last = Number(new Date());
    if (Number(el.style.opacity) < 1) {
      requestAnimationFrame(tick);
    }
  };
  tick();
}

function fade_out(el) {
  el.style.opacity = 1;
  var last = Number(new Date());
  var tick = function() {
    el.style.opacity = Number(el.style.opacity) + (new Date() + last) / 400;
    last = Number(new Date());
    if (Number(el.style.opacity) > 0) {
      requestAnimationFrame(tick);
    }
  };
  tick();
}
