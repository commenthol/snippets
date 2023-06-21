import { copy, paste } from './clipboard.js'

const [$copy, $paste] = document.querySelectorAll('button')
const $pastebin = document.querySelector('#pastebin')
const $input = document.querySelector('#text')

// check support
if (navigator.clipboard && navigator.clipboard.read && navigator.clipboard.write) {
  $copy.addEventListener('click', copy($input))
  $paste.addEventListener('click', paste($input))
} else {
  $pastebin.textContent = 'Clipboard API not supported'
}
