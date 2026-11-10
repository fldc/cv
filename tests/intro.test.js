import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Intro } from '../src/lib/utils/intro.js';

function setup(t, { reducedMotion = false, canvasAvailable = true } = {}) {
  const frames = new Map();
  const classes = new Set();
  const listeners = new Set();
  let frameId = 0;
  let visibilityCallback;
  let disconnected = false;
  let draws = 0;
  const before = { textContent: 'Hello! My name is', style: {} };
  const after = { textContent: "and I'm a systems developer.", style: {} };
  const canvas = {
    attributes: {},
    removed: false,
    setAttribute(name, value) {
      this.attributes[name] = value;
    },
    getContext() {
      return canvasAvailable ? context : null;
    },
    remove() {
      this.removed = true;
    },
  };
  const context = {
    canvas,
    clearRect() {
      draws++;
    },
    fillRect() {},
    fillText() {},
    measureText() {
      return { width: 12 };
    },
  };
  const heading = {
    textContent: 'Fredrik Storm',
    previousElementSibling: before,
    nextElementSibling: after,
    after(node) {
      this.nextElementSibling = node;
    },
  };
  const container = {
    classList: {
      add(name) {
        classes.add(name);
      },
      remove(name) {
        classes.delete(name);
      },
    },
    querySelector(selector) {
      assert.equal(selector, 'h1');
      return heading;
    },
  };
  const motion = {
    matches: reducedMotion,
    addEventListener(type, fn) {
      assert.equal(type, 'change');
      listeners.add(fn);
    },
    removeEventListener(type, fn) {
      assert.equal(type, 'change');
      listeners.delete(fn);
    },
  };
  const globals = {
    document: { createElement: () => canvas },
    window: {
      getComputedStyle: () => ({ getPropertyValue: () => '20px' }),
      matchMedia(query) {
        assert.equal(query, '(prefers-reduced-motion: reduce)');
        return motion;
      },
      requestAnimationFrame(fn) {
        const id = frameId++;
        frames.set(id, fn);
        return id;
      },
      cancelAnimationFrame(id) {
        frames.delete(id);
      },
    },
    IntersectionObserver: class {
      constructor(fn) {
        visibilityCallback = fn;
      }
      observe() {}
      disconnect() {
        disconnected = true;
      }
    },
  };
  const restoreGlobals = [];
  for (const [key, value] of Object.entries(globals)) {
    const original = Object.getOwnPropertyDescriptor(globalThis, key);
    Object.defineProperty(globalThis, key, { configurable: true, value });
    restoreGlobals.push(() => {
      if (original) Object.defineProperty(globalThis, key, original);
      else delete globalThis[key];
    });
  }
  const intro = new Intro(container);
  t.after(() => {
    intro.destroy();
    for (const restore of restoreGlobals) restore();
  });
  return {
    intro,
    frames,
    heading,
    canvas,
    classes,
    listeners,
    before,
    after,
    get draws() {
      return draws;
    },
    get disconnected() {
      return disconnected;
    },
    visible(isIntersecting) {
      visibilityCallback([{ isIntersecting }]);
    },
    reduced(matches) {
      motion.matches = matches;
      for (const listener of listeners) listener();
    },
    tick() {
      const callbacks = [...frames.values()];
      frames.clear();
      for (const fn of callbacks) fn();
    },
  };
}

test('repeated visible notifications keep one loop and leaving cancels it', (t) => {
  const env = setup(t);
  env.visible(true);
  env.visible(true);
  assert.equal(env.frames.size, 1);
  env.tick();
  assert.equal(env.frames.size, 1);
  env.visible(false);
  assert.equal(env.frames.size, 0);
  env.visible(true);
  assert.equal(env.frames.size, 1);
});

test('reduced motion draws a static header without scheduling animation', (t) => {
  const env = setup(t, { reducedMotion: true });
  assert.equal(env.draws, 1);
  env.visible(true);
  assert.equal(env.frames.size, 0);
  assert.ok(env.before.style.backgroundImage.startsWith('linear-gradient'));
  assert.ok(env.after.style.backgroundImage.startsWith('linear-gradient'));
});

test('motion preference changes stop and resume only while visible', (t) => {
  const env = setup(t);
  env.visible(true);
  env.reduced(true);
  assert.equal(env.frames.size, 0);
  env.reduced(false);
  assert.equal(env.frames.size, 1);
  env.visible(false);
  env.reduced(true);
  env.reduced(false);
  assert.equal(env.frames.size, 0);
});

test('enhancement preserves the heading and cleanup removes animation resources', (t) => {
  const env = setup(t);
  assert.equal(env.heading.textContent, 'Fredrik Storm');
  assert.equal(env.heading.nextElementSibling, env.canvas);
  assert.equal(env.canvas.attributes['aria-hidden'], 'true');
  assert.ok(env.classes.has('intro-ready'));
  env.visible(true);
  env.intro.destroy();
  assert.equal(env.frames.size, 0);
  assert.equal(env.listeners.size, 0);
  assert.ok(env.disconnected);
  assert.ok(env.canvas.removed);
  assert.ok(!env.classes.has('intro-ready'));
  assert.equal(env.before.style.backgroundImage, '');
  assert.equal(env.after.style.backgroundImage, '');
  env.visible(true);
  assert.equal(env.frames.size, 0);
});

test('unavailable canvas keeps the original readable header', (t) => {
  const env = setup(t, { canvasAvailable: false });
  assert.equal(env.heading.nextElementSibling, env.after);
  assert.ok(!env.classes.has('intro-ready'));
  assert.equal(env.draws, 0);
  assert.equal(env.frames.size, 0);
  assert.equal(env.listeners.size, 0);
});
