/* ALL ELEMENTS
----------------------------------------- */
const elements = {
  body: document.body,
  wastebin: document.getElementById('Wastebin'),
  boat: document.getElementById('Boat'),
  gas: document.getElementById('Gas'),
  arrows: document.getElementsByClassName('recycle1'),
  bucket: document.getElementById('bucket_veg'),
  waste: document.getElementsByClassName('waste'),
  pointer: document.getElementById('Pointer'),
  water: document.getElementById('Water'),
  bubble: document.getElementsByClassName('bubble'),
  m3: document.getElementsByClassName('m3gu'),
  feed: document.getElementsByClassName('feed'),
  next: document.getElementsByClassName('next'),
  js_error: document.getElementsByClassName('js-error')[0]
};

/* CONFIGURATION VARIABLES
----------------------------------------- */
const config = {
  api_url: 'https://biogas-api.herokuapp.com/api',
  api_key: '?api_key=CMD17',
}

/* ANIMATIONS
----------------------------------------- */
const animation_1 = new TimelineLite();
const animation_2 = new TimelineLite();
const animation_3 = new TimelineLite();
const animation_4 = new TimelineLite();

/* FIRST RECYCLE ANIMATION
----------------------------------------- */
animation_1.fromTo(elements.wastebin, 1, { autoAlpha: 0, },{ autoAlpha: 1, })
.fromTo(elements.arrows[0], 1, { autoAlpha: 0, },{ autoAlpha: 1, })
.fromTo(elements.boat, 1, { autoAlpha: 0, },{ autoAlpha: 1, })
.fromTo(elements.arrows[1], 1, { autoAlpha: 0, },{ autoAlpha: 1, })
.fromTo(elements.gas, 1, { autoAlpha: 0, },{ autoAlpha: 1, })
.fromTo(elements.arrows[2], 1, { autoAlpha: 0, },{ autoAlpha: 1, })
.fromTo(elements.wastebin, 0.5, { scale: 1, },{ scale: 1.1, })
.to(elements.wastebin, 0.5, { scale: 1, })
.fromTo(elements.boat, 0.5, { scale: 1, },{ scale: 1.1, })
.to(elements.boat, 0.5, { scale: 1, })
.fromTo(elements.gas, 0.5, { scale: 1, },{ scale: 1.1, })
.to(elements.gas, 0.5, { scale: 1, })
.to(elements.next[1], 1, { autoAlpha: 1 });

/* SECOND BUCKET WITH WASTE ANIMATION
----------------------------------------- */
animation_2.to(elements.bucket, 2.25, {
  rotation: 160,
  ease:Power1.easeInOut,
})
.staggerTo(elements.waste, 2, {
  y: -140,
  ease: Power1.easeInOut,
}, 0.25, "-=1.25")
.to('.next', 2, {
  autoAlpha: 1,
});

/* GAS PUMP ANIMATION
----------------------------------------- */
animation_3.to(elements.pointer, 1.5, {
  rotation: "360_cww",
  transformOrigin:"50% 90%",
  ease:Linear.easeNone,
  repeat:-1
})
.to(elements.water, 10, {
  fill: 'green',
});

/* INTERACTIVE BOAT ANIMATIONS
----------------------------------------- */
animation_4.staggerFromTo(elements.bubble, 1, {
  scale: 1,
  ease: Power1.easeInOut,
},
{
  scale: 1.35,
  ease: Power1.easeInOut,
}, 1);

/* MAIN APPLICATION
----------------------------------------- */
const app = {
  init() {
    elements.js_error.style.display = 'none';
    /* PREVENT ANIMATIONS FROM STARTING AUTOMATICALLY
    ----------------------------------------- */
    animation_1.pause();
    animation_2.pause();
    animation_3.pause();
    /* GET API DATA
    ----------------------------------------- */
    data.get(`${config.api_url}/status/gas${config.api_key}`, 'gas');
    data.get(`${config.api_url}/status/feed${config.api_key}`, 'input');
  }
}

/* DATA OBJECT
----------------------------------------- */
const data = {
  /* XMLHTTPREQUEST TO API DATA
  ----------------------------------------- */
  get(getUrl, type) {
    let response = '';
    const request = new XMLHttpRequest();
    request.open('GET', getUrl, true);
    request.onload = () => {
      if(request.status >= 200 && request.status < 400) {
        response = JSON.parse(request.responseText);
        data.insert(response, type);
      } else {
        console.log('error');
      }
    }
    request.send()
  },
  /* INSERT THE ACTUAL DATA INTO THE VIEW
  ----------------------------------------- */
  insert(data, type) {
    if(type === 'gas') {
      let used = Math.floor(data.used);
      let generated = Math.floor(data.generated);
      elements.m3[0].textContent = used;
      elements.m3[1].textContent = generated;
    } else if(type === 'input') {
      let kg = Math.floor(data['kilograms']);
      elements.feed[0].textContent = kg;
      elements.feed[1].textContent = kg;
    }
  }
}


/* SCROLL FUNCTIONALITY
----------------------------------------- */
const animation = {
  /* INITIALIZE SCROLLING FUNCTIONALITY
  ----------------------------------------- */
  init(targetElement) {
    let actualOffset = this.getOffset();
    /* GET THE OFFSET OF THE TARGET
    ----------------------------------------- */
    let targetPosition = document.getElementById(targetElement).offsetTop;
    this.doScroll(actualOffset, targetPosition, targetElement);
  },
  /* GET THE ACTUAL OFFSET POSITION FROM THE TOP OF THE PAGE
  ----------------------------------------- */
  getOffset() {
    let ActualyOffset = 0;
    if (window.pageYOffset) {
      ActualyOffset = window.pageYOffset;
    } else {
      ActualyOffset = document.body.scrollTop;
    }
    return ActualyOffset;
  },
  doScroll(actual, target, targetElement) {
    /* ENABLE SCROLLING TRANSITIONS ON THE BODY AND TRANSLATE POSITION TO CALCULATED Y VALUE
    ----------------------------------------- */
    elements.body.classList.add('scrolling');
    elements.body.style.transform = `translate(0, -${(target - actual)}px)`;
    this.defineNextAnimation(targetElement)
  },
  defineNextAnimation(target) {
    /* START ANIMATION BASED ON THE PAGE THE USER GOES TO
    ----------------------------------------- */
    switch(target) {
      case 'page_1':
        this.startNextAnimation(animation_1);
        break;
      case 'page_2':
        this.startNextAnimation(animation_2);
        break;
      case 'page_3':
        this.startNextAnimation(animation_3);
        break;
      default:
    }
  },
  /* WAIT ONE SECOND BEFORE STARTING THE ANIMATION
  ----------------------------------------- */
  startNextAnimation(animation) {
    setTimeout(function() {
      animation.play();
    }, 1000)
  }
}

/* INITIALIZE THE APPLICATION
----------------------------------------- */
app.init();

/* EVENT LISTENERS */
