const bucket = document.getElementById('bucket_veg');
const vegetables = [
  document.getElementById('CARROT'),
  document.getElementById('APPLE'),
  document.getElementById('BANANA'),
  document.getElementById('POTATO1'),
  document.getElementById('POTATO2'),
];

/* Move box to the left in 0.7 seconds */
// TweenLite.to(box, 0.7, {left: 0, x: 0});

/* Animates from below defined styling to the stylesheet defined styling
   autoAlpha combines opacity and visability into one property */
// TweenLite.from(box, 3, {x: '-=200px', autoAlpha: 0});

/* Set the properties of the elements without animations
   Set the properties, and a delay in seconds between the changes */
// TweenLite.set(box, {x: '-=200px', scale: 0.3});
// TweenLite.set(box, {x: '+=100px', scale: 0.6, delay: 1});
// TweenLite.set(box, {x: '-50%', scale: 1, delay: 2});

/* Animate the selected element from any properties to other properties
   Start with the from properties, after that the to properties
   This overwrites the CSS from the stylesheet

   Now the animation eases in and out using the ease property

   Use onStart, onComplete or onUpdate to initialize a callback function */

 // TweenLite.fromTo(box, 2, {x: '-=200px'}, {x: 150, ease:Power4.easeInOut, onStart: start, onComplete: complete});

 // TweenLite.to(box, 0.4, {top: '100%', y: '-100%', ease:Bounce.easeOut, delay: 0});
 // TweenLite.to(box, 0.7, {x: '-=200px', y: '-100%', ease:Back.easeInOut, delay: 2});
 // TweenLite.to(box, 0.8, {x: '-=200px', y: '-100%', ease:Back.easeInOut, delay: 3.5});
 // TweenLite.to(box, 2.5, {top: '50%', y: '-50%', ease:Power0.easeNone, delay: 4.2});
 // TweenLite.to(box, 2.5, {x: '+=400px', ease:Elastic.easeInOut, delay: 7.7});
 // TweenLite.to(box, 2.5, {x: '-=400px', rotation: -720, ease: SlowMo.ease.config(0.1, 0.7, false), delay: 10.4});


document.getElementById("empty").addEventListener("click", startAnimation);

function startAnimation() {
  let delay = 2.23;
  TweenLite.to(bucket, 2.25, {
    rotation: 160,
    ease:Power1.easeInOut
  });
  vegetables.forEach(function(vegetable) {
    TweenLite.to(vegetable, 2.25, {
      delay: delay,
      transform: "translateY(-140px)",
      ease: Power1.easeInOut,
    });
    delay += 0.2;
  })
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
