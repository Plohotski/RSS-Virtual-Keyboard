import './style.css';
import qwerty from './tranlate';

function component(type, inner, addClass) {
  const element = document.createElement(type);
  element.innerHTML = inner;
  element.classList.add(addClass);
  return element;
}

document.body.appendChild(component('h1', 'Virtual keyboard', 'hello'));
document.body.appendChild(component('textarea', '', 'textarea'));

const inputText = document.querySelector('.textarea');
let isInput = false;
inputText.onclick = function isInp() { isInput = true; };

document.body.appendChild(component('div', '', 'keyboard'));
document.body.appendChild(component('div', 'Switch language: leftCtrl + leftShift', 'text'));

let lang = 'en';

const keyboard = ['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0',
  'Minus', 'Equal', 'Backspace', 'Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft',
  'BracketRight', 'Delete', 'CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote',
  'Backslash', 'Enter', 'ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash', 'ArrowUp',
  'ShiftRight', 'ControlLeft', 'MetaLeft', 'AltLeft', 'Space', 'AltRight', 'ArrowLeft', 'ArrowDown', 'ArrowRight', 'ControlRight'];

const outArr = ['Backspace', 'Win', 'Ctrl', 'Tab', 'Delete', 'CapsLock', 'Enter', 'Shift', 'Control', 'Meta', 'Alt', 'AltLeft', 'AltRight', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'];

const textarea = [];

function init() {
  let out = '';
  for (let i = 0; i < keyboard.length; i += 1) {
    if (i === 14 || i === 28 || i === 42 || i === 55) {
      out += '<div class="clearfix"></div>';
    }
    out += `<div class="k-key" data-name="${qwerty[lang][keyboard[i]].code}">${qwerty[lang][keyboard[i]].key}</div>`;
  }
  document.querySelector('.keyboard').innerHTML = out;
}
init();

const allData = document.querySelectorAll('[data-name]');

let isShift = false;
let isCaps = false;

document.onkeydown = function keyboardEvent(KeyboardEvent) {
  document.querySelector(`[data-name="${KeyboardEvent.code}"]`).classList.add('active');

  let tempKey = qwerty[lang][KeyboardEvent.code].key;
  if (isShift) tempKey = qwerty[lang][KeyboardEvent.code].shiftKey;
  if (isCaps) tempKey = qwerty[lang][KeyboardEvent.code].capsKey;
  switch (tempKey) {
    case 'Tab':
      textarea.push('\t');
      if (isInput === false) inputText.value = textarea.join('');
      break;
    case 'Enter':
      textarea.push('\n\r');
      if (isInput === false) inputText.value = textarea.join('');
      break;
    case 'Backspace':
      textarea.pop();
      if (isInput === false) inputText.value = textarea.join('');
      break;
    case 'CapsLock':
      if (isCaps === false) document.querySelector(`[data-name="${KeyboardEvent.code}"]`).classList.add('active');
      else document.querySelector(`[data-name="${KeyboardEvent.code}"]`).classList.remove('active');
      break;
    default:
      break;
  }
  if (outArr.includes(tempKey) !== true) {
    if (isInput === false) inputText.value += tempKey;
    textarea.push(tempKey);
  }
  setInterval(() => {
    if (tempKey !== 'CapsLock') document.querySelector(`[data-name="${KeyboardEvent.code}"]`).classList.remove('active');
  }, 500);
};

document.querySelectorAll('.k-key').forEach((element) => {
  element.addEventListener('click', function mouseEvent() {
    document.querySelectorAll('.k-key').forEach((el) => {
      if (el.dataset.name !== 'CapsLock' || el.dataset.name !== 'ShiftLeft' || el.dataset.name !== 'ShiftRight') el.classList.remove('active');
    });
    isInput = false;
    const code = this.dataset.name;
    this.classList.add('active');

    let tempKey = qwerty[lang][code].key;

    if (isShift) tempKey = qwerty[lang][code].shiftKey;
    if (isCaps) tempKey = qwerty[lang][code].capsKey;
    switch (tempKey) {
      case 'Tab':
        textarea.push('\t');
        inputText.value = textarea.join('');
        break;
      case 'Enter':
        textarea.push('\n\r');
        inputText.value = textarea.join('');
        break;
      case 'Backspace':
        textarea.pop();
        inputText.value = textarea.join('');
        break;
      case 'Shift':
        if (isShift === true) {
          isShift = false;
          this.classList.remove('active');
          if (isCaps === false) {
            for (let i = 0; i < allData.length; i += 1) {
              const temp = allData[i].dataset.name;
              allData[i].textContent = qwerty[lang][temp].key;
            }
          } else {
            for (let i = 0; i < allData.length; i += 1) {
              const temp = allData[i].dataset.name;
              allData[i].textContent = qwerty[lang][temp].capsKey;
            }
          }
        } else {
          isShift = true;
          for (let i = 0; i < allData.length; i += 1) {
            const temp = allData[i].dataset.name;
            allData[i].textContent = qwerty[lang][temp].shiftKey;
          }
          this.classList.add('active');
        }
        break;
      case 'CapsLock':
        if (isCaps === true) {
          isCaps = false;
          for (let i = 0; i < allData.length; i += 1) {
            const temp = allData[i].dataset.name;
            allData[i].textContent = qwerty[lang][temp].key;
          }
          this.classList.remove('active');
        } else {
          isCaps = true;
          for (let i = 0; i < allData.length; i += 1) {
            const temp = allData[i].dataset.name;
            allData[i].textContent = qwerty[lang][temp].capsKey;
          }
          this.classList.add('active');
        }
        break;
      default:
        break;
    }
    if (outArr.includes(tempKey) !== true) {
      inputText.value = textarea.join('');
      textarea.push(tempKey);
      setTimeout(() => {
        if (tempKey !== 'CapsLock' || tempKey !== 'Shift') this.classList.remove('active');
      }, 520);
    }
  });
});

function getTranslate() {
  for (let i = 0; i < allData.length; i += 1) {
    const temp = allData[i].dataset.name;
    allData[i].textContent = qwerty[lang][temp].key;
  }
}

document.addEventListener('keydown', (event) => {
  if (event.code === 'ShiftLeft' && (event.ctrlKey || event.metaKey)) {
    if (lang === 'en') { lang = 'ru'; } else lang = 'en';
    getTranslate();
  }

  if (event.code === 'ShiftLeft') {
    isShift = true;
    for (let i = 0; i < allData.length; i += 1) {
      const temp = allData[i].dataset.name;
      allData[i].textContent = qwerty[lang][temp].shiftKey;
    }
  }

  if (event.code === 'CapsLock') {
    if (isCaps === true) {
      isCaps = false;
      for (let i = 0; i < allData.length; i += 1) {
        const temp = allData[i].dataset.name;
        allData[i].textContent = qwerty[lang][temp].key;
      }
    } else {
      isCaps = true;
      for (let i = 0; i < allData.length; i += 1) {
        const temp = allData[i].dataset.name;
        allData[i].textContent = qwerty[lang][temp].capsKey;
      }
    }
  }
});

document.addEventListener('keyup', (event) => {
  if (event.code === 'ShiftLeft') {
    isShift = false;
    if (isCaps === false) {
      for (let i = 0; i < allData.length; i += 1) {
        const temp = allData[i].dataset.name;
        allData[i].textContent = qwerty[lang][temp].key;
      }
    } else {
      for (let i = 0; i < allData.length; i += 1) {
        const temp = allData[i].dataset.name;
        allData[i].textContent = qwerty[lang][temp].capsKey;
      }
    }
  }
});
