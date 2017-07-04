const bucket = document.getElementById('bucket_veg');

document.getElementById("empty").addEventListener("click", startAnimation);

function startAnimation() {
  let delay = 2.23;
  TweenLite.to(bucket, 2.25, {
    rotation: 160,
    ease:Power1.easeInOut
  });
  TweenMax.staggerTo('svg .waste', 2.25, {
    transform: "translateY(-140px)",
    ease: Power1.easeInOut,
    delay: delay
  }, 0.25);
}

const textEl = document.getElementById('introtext');
TweenLite.to(textEl, 4, {
  text: {
    value: "De Biogasboot zet organisch afval om in biogas",
    delimiter: " "
  },
  ease:Power1.easeIn
});

// TweenLite.to(text, 2, {text:"This is the new text", ease:Linear.easeNone});

function start() {
  console.log('Animation started');
}

function update() {
  console.log('Animation updated');
}

function complete() {
  console.log('Animation completed')
}
