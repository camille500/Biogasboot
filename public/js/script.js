/* ALL ELEMENTS
----------------------------------------- */
const elements = {
  body: document.body,
  bucket: document.getElementById('bucket_veg'),
};

/* ANIMATIONS
----------------------------------------- */
const timeLine = new TimelineLite();
let drop = -140;

timeLine.to(elements.bucket, 2.25, {
  rotation: 160,
  ease:Power1.easeInOut,
})
.staggerTo('svg .waste', 2, {
  y: -140,
  ease: Power1.easeInOut,
  onComplete: function() {
    drop = drop - 10;
  }
}, 0.25, "-=1.25")
.to('.next', 2, {
  autoAlpha: 1,
});

function startAnimation() {
  timeLine.play();
}

/* SCROLL FUNCTIONALITY
----------------------------------------- */
const smoothScroll = {
  init(target) {
    let actualOffset = smoothScroll.getOffset();
    let targetPosition = document.getElementById(target).offsetTop;
    smoothScroll.doScroll(actualOffset, targetPosition);
  },
  getOffset() {
    let ActualyOffset = 0;
    if (window.pageYOffset) {
      ActualyOffset = window.pageYOffset;
    } else {
      ActualyOffset = document.body.scrollTop;
    }
    return ActualyOffset;
  },
  doScroll(actual, target) {
    elements.body.classList.add('scrolling');
    elements.body.style.transform = `translate(0, -${(target - actual)}px)`;
  },
  startNextAnimation(target) {

  }
}

smoothScroll.init('page_1');


/* EVENT LISTENERS */
