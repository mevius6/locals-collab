{
  const MathUtils = {
    map: (x, a, b, c, d) => (x - a) * (d - c) / (b - a) + c,
    lerp: (a, b, n) => (1 - n) * a + n * b,
    getRandomFloat: (min, max) => (Math.random() * (max - min) + min).toFixed(2)
  };

  const body = document.body;

  let winsize;
  const calcWinsize = () => winsize = {
    width: window.innerWidth,
    height: window.innerHeight
  };
  calcWinsize();

  window.addEventListener('resize', calcWinsize);

  let docScroll;
  let lastScroll;
  let scrollingSpeed = 0;

  const getPageYScroll = () => docScroll = window.pageYOffset || document.documentElement.scrollTop;
  window.addEventListener('scroll', getPageYScroll);

  const getMousePos = e => {
    let posx = 0;
    let posy = 0;
    if (!e) e = window.event
    if (e.pageX || e.pageY) {
      posx = e.pageX
      posy = e.pageY
    } else if (e.clientX || e.clientY) {
      posx = e.clientX + body.scrollLeft + document.documentElement.scrollLeft
      posy = e.clientY + body.scrollTop + document.documentElement.scrollTop
    }
    return {
      x: posx,
      y: posy
    }
  };

  let mousepos = {
    x: winsize.width / 2,
    y: winsize.height / 2
  };

  window.addEventListener('mousemove', ev => (mousepos = getMousePos(ev)));

  class Cursor {
    constructor(el) {
      this.DOM = {
        el: el
      };
      this.DOM.circle = this.DOM.el.querySelector(".cursor__inner");
      this.bounds = this.DOM.circle.getBoundingClientRect();
      this.lastMousePos = {
        x: 0,
        y: 0
      };
      this.scale = 1
      this.lastScale = 1
      requestAnimationFrame(() => this.render());
    }
    render() {
      this.lastMousePos.x = MathUtils.lerp(
        this.lastMousePos.x,
        mousepos.x - this.bounds.width / 2,
        0.3
      );
      this.lastMousePos.y = MathUtils.lerp(
        this.lastMousePos.y,
        mousepos.y - this.bounds.height / 2,
        0.3
      );
      this.lastScale = MathUtils.lerp(this.lastScale, this.scale, 0.15);
      this.DOM.circle.style.transform = `translateX(${this.lastMousePos.x}px) translateY(${this.lastMousePos.y}px) scale(${this.lastScale})`;
      requestAnimationFrame(() => this.render());
    }
    enter() {
      this.scale = 1.5
    }
    leave() {
      this.scale = 1
    }
    click() {
      this.lastScale = 0.5
    }
  };

  const cursor = new Cursor(document.querySelector(".cursor"));

  [...document.querySelectorAll("a")].forEach(link => {
    link.addEventListener("mouseenter", () => cursor.enter())
    link.addEventListener("mouseleave", () => cursor.leave())
  });

  class Item {
    constructor(el) {
      this.DOM = {
        el: el
      };
      this.DOM.image = this.DOM.el.querySelector('.content__item-img');
      this.DOM.imageWrapper = this.DOM.image.parentNode;
      this.DOM.el.style.perspective = '1000px';
      this.DOM.imageWrapper.style.transformOrigin = '50% 100%';
      this.DOM.imageWrapper.onclick = () => {
        let dataBrand = (el).dataset.brandName;
        switch (dataBrand) {
          case 'futureisnown': window.open("https://mdf.verstka.io/@bettercallvik/2"); break;
          case 'futureisnown1': window.open("https://mdf.verstka.io/@vsbikeeva/1"); break;
          case 'ziq&yoni': window.open("https://mdf.verstka.io/@ilnur/1"); break;
          case 'kruzhok': window.open("https://mdf.verstka.io/@bettercallvik/4"); break;
          case 'volchok': window.open("https://mdf.verstka.io/@bettercallvik/7"); break;
          case 'sowhat': window.open("https://mdf.verstka.io/@tintin/1"); break;
          case 'fusion': window.open("https://mdf.verstka.io/@rymanpols/5"); break;
          case 'novaya': window.open("https://mdf.verstka.io/@flogerosa/3"); break;
          case 'liars': window.open("/"); break;
          case 'antonlisin': window.open("https://mdf.verstka.io/@olyapav/4"); break;
          default:
        }
      };
      this.ry = MathUtils.getRandomFloat(-0.25, 0.25);
      this.rz = MathUtils.getRandomFloat(-0.25, 0.25);
      this.renderedStyles = {
        innerTranslationY: {
          previous: 0,
          current: 0,
          ease: 0.1,
          setValue: () => {
            const toValue = parseInt(getComputedStyle(this.DOM.image).getPropertyValue('--overflow'), 10);
            const fromValue = -1 * toValue;
            return Math.max(Math.min(MathUtils.map(this.props.top - docScroll, winsize.height, -1 * this.props.height, fromValue, toValue), toValue), fromValue);
          }
        },
        itemRotation: {
          previous: 0,
          current: 0,
          ease: 0.1,
          toValue: Number(MathUtils.getRandomFloat(-70, -50)),
          setValue: () => {
            const toValue = this.renderedStyles.itemRotation.toValue;
            const fromValue = toValue * -1;
            const val = MathUtils.map(this.props.top - docScroll, winsize.height * 1.5, -1 * this.props.height, fromValue, toValue);
            return Math.min(Math.max(val, toValue), fromValue);
          }
        }
      };
      this.getSize();
      this.update();
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => this.isVisible = entry.intersectionRatio > 0);
      });
      this.observer.observe(this.DOM.el);
      this.initEvents();
    }
    update() {
      for (const key in this.renderedStyles) {
        this.renderedStyles[key].current = this.renderedStyles[key].previous = this.renderedStyles[key].setValue();
      }

      this.layout();
    }
    getSize() {
      const rect = this.DOM.el.getBoundingClientRect();
      this.props = {
        height: rect.height,
        top: docScroll + rect.top
      }
    }
    initEvents() {
      window.addEventListener('resize', () => this.resize());
    }
    resize() {
      this.getSize();
      this.update();
    }
    render() {
      for (const key in this.renderedStyles) {
        this.renderedStyles[key].current = this.renderedStyles[key].setValue();
        this.renderedStyles[key].previous = MathUtils.lerp(this.renderedStyles[key].previous, this.renderedStyles[key].current, this.renderedStyles[key].ease);
      }

      this.layout();
    }
    layout() {
      this.DOM.image.style.transform = `translate3d(0,${this.renderedStyles.innerTranslationY.previous}px,0)`;
      this.DOM.imageWrapper.style.transform = `rotate3d(1,${this.ry},${this.rz},${this.renderedStyles.itemRotation.previous}deg)`;
    }
  }

  class SmoothScroll {
    constructor() {
      this.DOM = {
        main: document.querySelector('main')
      };
      this.DOM.scrollable = this.DOM.main.querySelector('div[data-scroll]');
      this.items = [];
      this.DOM.content = this.DOM.main.querySelector('.content');
      [...this.DOM.content.querySelectorAll('.content__item')].forEach(item => this.items.push(new Item(item)));
      this.renderedStyles = {
        translationY: {
          previous: 0,
          current: 0,
          ease: 0.1,
          setValue: () => docScroll
        }
      };
      this.setSize();
      this.update();
      this.style();
      this.initEvents();

      requestAnimationFrame(() => this.render());
    }
    update() {
      for (const key in this.renderedStyles) {
        this.renderedStyles[key].current = this.renderedStyles[key].previous = this.renderedStyles[key].setValue();
      }
      this.layout();
    }
    layout() {
      this.DOM.scrollable.style.transform = `translate3d(0,${-1*this.renderedStyles.translationY.previous}px,0)`;
    }
    setSize() {
      body.style.height = `${this.DOM.scrollable.scrollHeight}px`;
    }
    style() {
      this.DOM.main.style.position = 'fixed';
      this.DOM.main.style.width = this.DOM.main.style.height = '100%';
      this.DOM.main.style.top = this.DOM.main.style.left = 0;
      this.DOM.main.style.overflow = 'hidden';
    }
    initEvents() {
      window.addEventListener('resize', () => this.setSize());
    }
    render() {
      scrollingSpeed = Math.abs(docScroll - lastScroll);
      lastScroll = docScroll;

      for (const key in this.renderedStyles) {
        this.renderedStyles[key].current = this.renderedStyles[key].setValue();
        this.renderedStyles[key].previous = MathUtils.lerp(this.renderedStyles[key].previous, this.renderedStyles[key].current, this.renderedStyles[key].ease);
      }

      this.layout();

      for (const item of this.items) {
        if (item.isVisible) {
          if (item.insideViewport) {
            item.render();
          } else {
            item.insideViewport = true;
            item.update();
          }
        } else {
          item.insideViewport = false;
        }
      }

      requestAnimationFrame(() => this.render());
    }
  }

  const preloadImages = () => {
    return new Promise((resolve, reject) => {
      imagesLoaded(document.querySelectorAll('.content__item-img'), {
        background: true
      }, resolve);
    });
  };

  preloadImages().then(() => {
    document.body.classList.remove('loading');

    getPageYScroll();
    lastScroll = docScroll;

    new SmoothScroll();
  });
}
