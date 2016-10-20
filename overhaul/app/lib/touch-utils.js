
// https://developer.mozilla.org/en-US/docs/Web/API/Touch_events#Finding_an_ongoing_touch
export function findTouchById(touchList, identifier) {
  for (let i = 0; i < touchList.length; i++) {
    let touch = touchList.item(i);
    if (touch.identifier === identifier) {
      return touch;
    }
  }
}

export function isFakeClick(mouseEvent) {
  if (mouseEvent) {
    console.log(mouseEvent);
    // https://developer.mozilla.org/en-US/docs/Web/API/InputDeviceCapabilities
    const isChromeFakeClick = mouseEvent.sourceCapabilities && mouseEvent.sourceCapabilities.firesTouchEvents === true;
    // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/mozInputSource
    const isMozFakeClick = mouseEvent.mozInputSource === 5;
    // https://github.com/ftlabs/fastclick/blob/3db9f899c25b7b2e1517dc5cc17494ec9094bc43/lib/fastclick.js#L304
    const isFastClickFakeClick = mouseEvent.forwardedTouchEvent === true;

    return isChromeFakeClick || isMozFakeClick || isFastClickFakeClick;
  }
  return false;
}
