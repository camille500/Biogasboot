(function() {
  /* ALL ELEMENTS
  ----------------------------------------- */
  const elements = {
    body: document.body,
    wastebin: document.querySelector('#Wastebin'),
    boat: document.querySelector('#Boat'),
    gas: document.querySelector('#Gas'),
    arrows: document.querySelectorAll('.recycle1'),
    bucket: document.querySelector('#bucket_veg'),
    waste: document.querySelectorAll('.waste'),
    pointer: document.querySelector('#Pointer'),
    water: document.querySelector('#Water'),
    bubble: document.querySelectorAll('.bubble'),
    m3: document.querySelectorAll('.m3gu'),
    feed: document.querySelectorAll('.feed'),
    next: document.querySelectorAll('.navigate'),
    buttons: document.querySelectorAll('.buttons'),
    co2: document.querySelector('.co2'),
    trees: document.querySelector('.trees'),
    carkm: document.querySelector('.carkm')
  };

  /* CONFIGURATION VARIABLES
  ----------------------------------------- */
  const config = {
    api_url: 'https://biogas-api.herokuapp.com/api',
    api_key: '?api_key=CMD17'
  }

  /* ANIMATIONS
  ----------------------------------------- */
  const animation_1 = new TimelineLite();
  const animation_2 = new TimelineLite();
  const animation_3 = new TimelineLite();
  const animation_4 = new TimelineLite();

  /* FIRST RECYCLE ANIMATION
  ----------------------------------------- */
  animation_1.fromTo(elements.wastebin, 1, {
    autoAlpha: 0
  }, {autoAlpha: 1}).fromTo(elements.arrows[0], 1, {
    autoAlpha: 0
  }, {autoAlpha: 1}).fromTo(elements.boat, 1, {
    autoAlpha: 0
  }, {autoAlpha: 1}).fromTo(elements.arrows[1], 1, {
    autoAlpha: 0
  }, {autoAlpha: 1}).fromTo(elements.gas, 1, {
    autoAlpha: 0
  }, {autoAlpha: 1}).fromTo(elements.arrows[2], 1, {
    autoAlpha: 0
  }, {autoAlpha: 1}).fromTo(elements.wastebin, 0.5, {
    scale: 1
  }, {scale: 1.1}).to(elements.wastebin, 0.5, {scale: 1}).fromTo(elements.boat, 0.5, {
    scale: 1
  }, {scale: 1.1}).to(elements.boat, 0.5, {scale: 1}).fromTo(elements.gas, 0.5, {
    scale: 1
  }, {scale: 1.1}).to(elements.gas, 0.5, {scale: 1}).to(elements.buttons[0], 1, {autoAlpha: 1});

  /* SECOND BUCKET WITH WASTE ANIMATION
  ----------------------------------------- */
  animation_2.to(elements.bucket, 2.25, {
    rotation: 160,
    ease: Power1.easeInOut
  }).staggerTo(elements.waste, 2, {
    y: -140,
    ease: Power1.easeInOut
  }, 0.25, "-=1.25")
  .to(elements.buttons[1], 1, {
    autoAlpha: 1
  });

  /* GAS PUMP ANIMATION
  ----------------------------------------- */
  animation_3.to(elements.pointer, 1.5, {
    rotation: "360_cww",
    transformOrigin: "50% 90%",
    ease: Linear.easeNone,
    repeat: -1,
  })
  .to(elements.next[4], 1, {
    autoAlpha: 1
  })
  .to(elements.buttons[2], 1, {
    autoAlpha: 1
  })
  .to(elements.water, 10, {
    fill: 'green'
  });

  /* INTERACTIVE BOAT ANIMATIONS
  ----------------------------------------- */
  animation_4.staggerFromTo(elements.bubble, 1, {
    scale: 1,
    ease: Power1.easeInOut
  }, {
    scale: 1.35,
    ease: Power1.easeInOut
  }, 1);

  /* MAIN APPLICATION
  ----------------------------------------- */
  const app = {
    init() {
      /* PREVENT ANIMATIONS FROM STARTING AUTOMATICALLY
      ----------------------------------------- */
      animation_1.pause();
      animation_2.pause();
      animation_3.pause();
      animation_4.play();
      /* GET API DATA
      ----------------------------------------- */
      data.get(`${config.api_url}/status/gas${config.api_key}`, 'gas');
      data.get(`${config.api_url}/status/feed${config.api_key}`, 'input');
      eventListeners.init();
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
        if (request.status >= 200 && request.status < 400) {
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
      if (type === 'gas') {
        let used = Math.floor(data.used);
        let generated = Math.floor(data.generated);
        this.calculateCO2(used);
        elements.m3[0].textContent = used;
        elements.m3[1].textContent = generated;
      } else if (type === 'input') {
        let kg = Math.floor(data['kilograms']);
        elements.feed[0].textContent = kg;
        elements.feed[1].textContent = kg;
      }
    },
    calculateCO2(gas) {
      /* 2.2KG CO2 for each M3 GAS
      ----------------------------------------- */
      let co2 = Math.floor(gas * 2.2);
      elements.co2.textContent = co2;
      this.calculateTreeCompensation(co2);
      this.calculateKmInCar(co2);
    },
    calculateTreeCompensation(co2) {
      elements.trees.textContent = Math.floor(co2 / 20);
    },
    calculateKmInCar(co2) {
      elements.carkm.textContent = Math.floor(co2 / 0.125);
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
      elements.body.style.transform = `translate(0, -${ (target - actual)}px)`;
      this.defineNextAnimation(targetElement)
    },
    defineNextAnimation(target) {
      /* START ANIMATION BASED ON THE PAGE THE USER GOES TO
      ----------------------------------------- */
      switch (target) {
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

  const eventListeners = {
    init() {
      elements.next.forEach(function(button) {
        button.addEventListener("click", eventListeners.handle);
      });
    },
    handle(event) {
      let linkTo = event.target.getAttribute("data-link-to");
      animation.init(linkTo);
    }
  }

  /* INITIALIZE THE APPLICATION
  ----------------------------------------- */
  app.init();

})();
