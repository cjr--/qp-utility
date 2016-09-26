function fade_in_old(el, cb) {
  el.style.opacity = 0;
  var last = Number(new Date());
  var tick = function() {
    el.style.opacity = Number(el.style.opacity) + (new Date() - last) / 400;
    last = Number(new Date());
    if (Number(el.style.opacity) < 1) {
      requestAnimationFrame(tick);
    } else {
      cb();
    }
  };
  tick();
}

function fade_in(el, cb) {
  el.style.opacity = 0;
  el.style.display = "block";

  (function fade() {
    var val = parseFloat(el.style.opacity);
    if (!((val += .1) > 1)) {
      el.style.opacity = val;
      requestAnimationFrame(fade);
    } else {
      if (cb) cb();
    }
  })();
}

function fade_out_old(el, cb) {
  el.style.opacity = 1;
  var last = Number(new Date());
  var tick = function() {
    el.style.opacity = Number(el.style.opacity) + (new Date() + last) / 400;
    last = Number(new Date());
    if (Number(el.style.opacity) > 0) {
      requestAnimationFrame(tick);
    } else {
      cb();
    }
  };
  tick();
}

function fade_out(el, cb) {
  el.style.opacity = 1;

  (function fade() {
    if ((el.style.opacity -= .1) < 0) {
      el.style.display = "none";
      if (cb) cb();
    } else {
      requestAnimationFrame(fade);
    }
  })();
}
