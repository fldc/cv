import { PageHeaderAscii } from './ascii.js';

export class Intro {
  #animationRef = null;
  #container;
  #before;
  #after;
  #motion;
  #visible = false;
  #destroyed = false;
  #backgroundColor;
  #cellWidth;
  #cellHeight;
  #ctx;
  #lastFrame = Date.now();
  #observer;
  #shape;

  constructor(container) {
    this.#container = container;
    this.#ctx = this.#setupCanvas(container);
    if (!this.#ctx) return;

    this.#draw();
    container.classList.add('intro-ready');
    this.#motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.#motion.addEventListener('change', this.#updateMotion);

    this.#observer = this.#observeVisibility(container);
  }

  destroy() {
    this.#destroyed = true;
    this.#cancelAnimation();
    this.#observer?.disconnect();
    this.#motion?.removeEventListener('change', this.#updateMotion);
    this.#container.classList.remove('intro-ready');
    this.#ctx?.canvas.remove();
    if (this.#ctx) {
      this.#before.style.backgroundImage = '';
      this.#after.style.backgroundImage = '';
    }
  }

  #cancelAnimation() {
    if (this.#animationRef !== null) {
      window.cancelAnimationFrame(this.#animationRef);
      this.#animationRef = null;
    }
  }

  #draw() {
    this.#ctx.clearRect(0, 0, this.#ctx.canvas.width, this.#ctx.canvas.height);

    this.#ctx.fillStyle = this.#backgroundColor;
    this.#ctx.fillRect(0, 0, this.#ctx.canvas.width, this.#ctx.canvas.height);

    this.#shape.forEach((line, y) => {
      line.split('').forEach((char, x) => {
        if (char !== ' ') {
          const drawX = x * this.#cellWidth;
          const drawY = (y + 1) * this.#cellHeight;

          this.#ctx.fillStyle = this.#getColor(x, y);
          this.#ctx.fillText(char, drawX, drawY);
        }
      });
    });

    this.#before.style.backgroundImage = this.#getGradient(
      0,
      this.#before.textContent.trim().length
    );
    this.#after.style.backgroundImage = this.#getGradient(
      this.#shape.length,
      this.#after.textContent.trim().length
    );
  }

  #getColor(x, y) {
    const h = Math.floor(((this.#lastFrame / 50 + x + y) % 360) / 12) * 12;

    return `hsl(${h}, 100%, 50%)`;
  }

  #getGradient(y, length) {
    const start = this.#getColor(0, y);
    const middle = this.#getColor(length / 2, y);
    const end = this.#getColor(length, y);

    return `linear-gradient(to left, ${end}, ${middle}, ${start})`;
  }

  #observeVisibility(node) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          this.#visible = entry.isIntersecting;
          this.#updateMotion();
        });
      },
      {
        rootMargin: '100% 0px 100% 0px',
        threshold: [0.01, 0.99],
      }
    );

    observer.observe(node);

    return observer;
  }

  #updateMotion = () => {
    if (this.#destroyed || !this.#visible || this.#motion.matches) {
      this.#cancelAnimation();
    } else if (this.#animationRef === null) {
      this.#render();
    }
  };

  #render() {
    if (Date.now() - this.#lastFrame > 60) {
      this.#draw();
      this.#lastFrame = Date.now();
    }

    this.#animationRef = window.requestAnimationFrame(() => this.#render());
  }

  #setupCanvas(parentElement) {
    const h1 = parentElement.querySelector('h1');
    this.#before = h1.previousElementSibling;
    this.#after = h1.nextElementSibling;

    // Convert title to ascii art
    this.#shape = PageHeaderAscii.split('\n');

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');

    // Get context
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Setup font
    let font;

    if ('computedStyleMap' in parentElement) {
      // Chrome
      const styles = parentElement.computedStyleMap();

      font = ['font-weight', 'font-size', 'font-family'].map((key) =>
        styles.get(key)
      );
      this.#backgroundColor = styles.get('background-color');
    } else {
      // Firefox
      const styles = window.getComputedStyle(parentElement);

      font = ['font-weight', 'font-size', 'font-family'].map((key) =>
        styles.getPropertyValue(key)
      );
      this.#backgroundColor = styles.getPropertyValue('background-color');
    }

    font = font.join(' ');

    // Calculate width and height
    ctx.font = font;
    this.#cellWidth = Math.floor(ctx.measureText('0').width - 0.5);
    this.#cellHeight = Math.floor(this.#cellWidth * 1.4);

    const shapeWidth = Math.max(...this.#shape.map((line) => line.length));
    const shapeHeight = this.#shape.length;

    canvas.width = shapeWidth * this.#cellWidth;
    canvas.height = shapeHeight * this.#cellHeight;

    // Context is losing font settings after resizing canvas
    ctx.font = font;
    ctx.imageSmoothingEnabled = false;

    h1.after(canvas);

    return ctx;
  }
}
