import { fireevent } from './fireevent.js'

// fire the events on all spans
function toggleAll () {
  document.querySelectorAll('div > span')
    .forEach(el => fireevent(el, 'click'))
}

function toggleClass (el, className) {
  if (el.classList.contains(className)) {
    el.classList.remove(className)
  } else {
    el.classList.add(className)
  }
}

document.querySelector('button').addEventListener('click', toggleAll)

document.querySelectorAll('div')
  .forEach(el => {
    el.addEventListener('click',
      () => toggleClass(el.querySelector('span'), 'hidden')
    )
  })
