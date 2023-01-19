const TRESHOLD = 40;

export function swipe(node: Node) {
  let startX: number;
  let startY: number;

  const swipeRight = new CustomEvent('swipeRight', { bubbles: true });
  const swipeLeft = new CustomEvent('swipeLeft', { bubbles: true });
  const swipeUp = new CustomEvent('swipeUp', { bubbles: true });
  const swipeDown = new CustomEvent('swipeDown', { bubbles: true });

  const handleStart: EventListener = (e: Event) => {
    const touch = (e as TouchEvent).touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
  };

  const handleEnd = (e: Event) => {
    const touch = (e as TouchEvent).changedTouches[0];
    const endX = touch.clientX;
    const endY = touch.clientY;

    const direction = Math.abs(startX - endX) > Math.abs(startY - endY) ? 'horizontal' : 'vertical';
    if (direction === 'vertical') {
      if (Math.abs(startY - endY) >= TRESHOLD)
        node.dispatchEvent(startY > endY ? swipeDown : swipeUp);
    } else {
      if (Math.abs(startX - endX) >= TRESHOLD)
        node.dispatchEvent(startX > endX ? swipeRight : swipeLeft);
    }
  };

  node.addEventListener('touchstart', handleStart);
  node.addEventListener('touchend', handleEnd);

  return {
    destroy() {
      node.removeEventListener('touchstart', handleStart);
      node.removeEventListener('touchend', handleEnd);
    }
  };
}
