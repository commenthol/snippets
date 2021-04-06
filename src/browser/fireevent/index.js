export function fireevent (el, evtype) {
  if (el.fireEvent) {
    el.fireEvent('on' + evtype)
  } else {
    var evObj = document.createEvent('Events')
    evObj.initEvent(evtype, true, false)
    el.dispatchEvent(evObj)
  }
}
