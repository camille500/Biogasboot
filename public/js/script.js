/* ALL ELEMENTS
----------------------------------------- */
const elements = {
  body: document.body,
  bucket: document.getElementById('bucket_veg'),
  m3used: document.getElementById('m3used'),
};

const config = {
  api_url: 'https://biogas-api.herokuapp.com/api',
  api_key: '?api_key=CMD17',
}

/* ANIMATIONS
----------------------------------------- */
const animation_2 = new TimelineLite();
const animation_3 = new TimelineLite();

animation_2.to(elements.bucket, 2.25, {
  rotation: 160,
  ease:Power1.easeInOut,
})
.staggerTo('svg .waste', 2, {
  y: -140,
  ease: Power1.easeInOut,
}, 0.25, "-=1.25")
.to('.next', 2, {
  autoAlpha: 1,
});

animation_3.to('#Pointer', 1.5, {
  rotation: "360_cww",
  transformOrigin:"50% 90%",
  ease:Linear.easeNone,
  repeat:-1
})
.to('#Water', 10, {
  fill: 'green',
});

/* MAIN APPLICATION
----------------------------------------- */
const app = {
  init() {
    animation_2.pause();
    animation_3.pause();
    data.get(`${config.api_url}/status/gas${config.api_key}`, 'gas');
  }
}

const data = {
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
  insert(data, type) {
    if(type === 'gas') {
      let used = Math.floor(data.used);
      let generated = Math.floor(data.generated);
      elements.m3used.textContent = used;
    }
  }
}


/* SCROLL FUNCTIONALITY
----------------------------------------- */
const animation = {
  init(targetElement) {
    let actualOffset = this.getOffset();
    let targetPosition = document.getElementById(targetElement).offsetTop;
    this.doScroll(actualOffset, targetPosition, targetElement);
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
  doScroll(actual, target, targetElement) {
    elements.body.classList.add('scrolling');
    elements.body.style.transform = `translate(0, -${(target - actual)}px)`;
    this.defineNextAnimation(targetElement)
  },
  defineNextAnimation(target) {
    switch(target) {
      case 'page_1':
        console.log('1')
        break;
      case 'page_2':
        this.startNextAnimation(animation_2);
        break;
      case 'page_3':
        this.startNextAnimation(animation_3);
        break;
      default:
        console.log('no animation')
    }
  },
  startNextAnimation(animation) {
    setTimeout(function() {
      animation.play();
    }, 1000)
  }
}

app.init();

/* EVENT LISTENERS */
