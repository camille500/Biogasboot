(function() {

  if(document.getElementsByClassName('tour').length > 0) {

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
      trees: document.querySelectorAll('.Tree'),
      co2_clouds: document.querySelectorAll('.co2_clouds'),
      speed_pointer: document.querySelector('#speed_pointer'),
      food: document.querySelectorAll('.food'),
      bubble: document.querySelectorAll('.bubble'),
      next: document.querySelectorAll('.navigate'),
      options: document.querySelectorAll('.options'),
      buttons: document.querySelectorAll('.buttons'),
      value: document.querySelectorAll('.value')
    };

      /* ANIMATIONS
      ----------------------------------------- */
      const animation_1 = new TimelineLite();
      const animation_2 = new TimelineLite();
      const animation_3 = new TimelineLite();
      const animation_4 = new TimelineLite();
      const animation_5 = new TimelineLite();
      const animation_6 = new TimelineLite();
      const animation_7 = new TimelineLite();

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

      /* FOOD ANIMATIONS
      ----------------------------------------- */
      animation_4.staggerFromTo(elements.food, 1, {
        autoAlpha: 0,
        ease: Power1.easeInOut
      }, {
        autoAlpha: 1,
        ease: Power1.easeInOut
      }, .6)
      .to(elements.buttons[3], 1, {
        autoAlpha: 1
      });

      /* CO2 ANIMATIONS
      ----------------------------------------- */
      animation_5.to(elements.co2_clouds, 7.5, {
        autoAlpha: 0,
        y: -20,
        ease: Power1.easeInOut
      }, 1)
      .to(elements.buttons[4], 1, {
        autoAlpha: 1
      }, "-=6");

      /* TREE ANIMATIONS
      ----------------------------------------- */
      animation_6.staggerFromTo(elements.trees, 1, {
        autoAlpha: 0,
        ease: Power1.easeInOut
      }, {
        autoAlpha: 1,
        ease: Power1.easeInOut
      }, .75)
      .to(elements.buttons[5], 1, {
        autoAlpha: 1
      });

      /* CAR ANIMATION
      ----------------------------------------- */
      animation_7.to(elements.speed_pointer, 15, {
        rotation: "180_cww",
        transformOrigin: "85% 50%",
        ease: Linear.easeNone,
      })
      .to(elements.buttons[5], 1, {
        autoAlpha: 1
      });

    /* MAIN APPLICATION
    ----------------------------------------- */
    const app = {
      init() {
        this.enhance();
        /* PREVENT ANIMATIONS FROM STARTING AUTOMATICALLY
        ----------------------------------------- */
          animation_1.pause();
          animation_2.pause();
          animation_3.pause();
          animation_4.pause();
          animation_5.pause();
          animation_6.pause();
          animation_7.pause();

        /* GET API DATA
        ----------------------------------------- */
        eventListeners.init();
      },
      enhance() {
        elements.buttons.forEach(function(button) {
          button.classList.add('invisible');
        });
        elements.next.forEach(function(link) {
          let linkto = link.getAttribute('href');
          if(linkto != '/check' && linkto != '#intro' && linkto != '#interactive') {
            link.setAttribute('href', '#');
          }
        });
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
          case 'page_4':
            this.startNextAnimation(animation_4);
            break;
          case 'page_5':
            this.startNextAnimation(animation_5);
            break;
          case 'page_6':
            this.startNextAnimation(animation_6);
            break;
          case 'page_7':
            this.startNextAnimation(animation_7);
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
        elements.options.forEach(function(button) {
          button.addEventListener("click", eventListeners.reset);
        })
      },
      handle(event) {
        let linkTo = event.target.getAttribute("data-link-to");
        animation.init(linkTo);
      },
      reset() {
        animation_1.restart(0).pause();
        animation_2.restart(0).pause();
        animation_3.restart(0).pause();
        animation_5.restart(0).pause();
      }
    }

    const socket = io();
    socket.on('update', function(amount) {
      let elements = document.querySelectorAll('.amount');
      elements.forEach(function(element) {
        let total = Number(element.textContent).toFixed(2);
        element.textContent = total + amount;
      })
    });

    /* INITIALIZE THE APPLICATION
    ----------------------------------------- */
    app.init();

  } else {

    const shareOptions = (event) => {
      event.preventDefault();
      const shareForm = document.querySelector('#shareForm');
      const buttons = document.querySelectorAll('.ashare');
      buttons.forEach(function(button) {
        button.style.display = 'none';
      });
      shareForm.classList.add('formPosition');
    }

    const share = document.getElementById('mailMe');
    share.addEventListener("click", shareOptions);

  }

})();
