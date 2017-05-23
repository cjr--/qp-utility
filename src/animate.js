function animate(o) {
  var effect = o.effect || 'none';
  var done = o.done || noop;
  var el = o.el;
  var interval = o.interval;

  if (effect === 'none' || not_element(el)) {
    invoke_next(done);
  } else if (effect === 'fade_in') {
    el.style.opacity = 0;
    el.style.display = 'block';
    interval = interval || 0.25;
    fade_in();
  } else if (effect === 'fade_out') {
    el.style.opacity = 1;
    interval = interval || 0.25;
    fade_out();
  }

  function fade_in() {
    var opacity = parseFloat(el.style.opacity);
    opacity += interval;
    el.style.opacity = opacity;
    if (opacity >= 1) {
      qp.done(done);
    } else {
      requestAnimationFrame(fade_in);
    }
  }

  function fade_out() {
    var opacity = parseFloat(el.style.opacity);
    opacity -= interval;
    el.style.opacity = opacity;
    if (opacity <= 0) {
      el.style.display = 'none';
      done();
    } else {
      requestAnimationFrame(fade_out);
    }
  }

}
