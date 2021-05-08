export const copy = ($input) => async (ev) => {
  ev.preventDefault()
  try {
    const text = $input.value
    await navigator.clipboard.writeText(text)
    console.log(`${text} copied to clipboard`)
  } catch (err) {
    console.error('Failed to copy: ', err)
  }
}

export const paste = ($pastebin) => async (ev) => {
  ev.preventDefault()
  try {
    const text = await navigator.clipboard.readText()
    $pastebin.textContent = text
    console.log('Pasted content: ', text)
  } catch (err) {
    console.error('Failed to read clipboard contents: ', err)
  }
}
