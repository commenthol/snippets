export function fireevent(el, evtype) {
  if (el.fireEvent) {
    el.fireEvent('on' + evtype)
  } else {
    const evObj = document.createEvent('Events')
    evObj.initEvent(evtype, true, false)
    el.dispatchEvent(evObj)
  }
}
