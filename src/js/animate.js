function fade_in(el, done){
  el.style.opacity = 0;
  el.style.display = 'block';
  (function fade() {
    var opacity = parseFloat(el.style.opacity);
    opacity += 0.1;
    el.style.opacity = opacity;
    if (opacity === 1) {
      qp.done(done);
    } else {
      requestAnimationFrame(fade);
    }
  })();
}

function fade_out(el, done) {
  el.style.opacity = 1;
  (function fade() {
    var opacity = parseFloat(el.style.opacity);
    opacity -= 0.1;
    el.style.opacity = opacity;
    if (opacity === 0) {
      el.style.display = 'none';
      qp.done(done);
    } else {
      requestAnimationFrame(fade);
    }
  })();
}
