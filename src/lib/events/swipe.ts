// create custom event on swipe gesture
export const createSwipeListener = (el: HTMLElement | Window, treshold = 50) => {
  let start: number;
  let end: number;

  const swipeRight = new CustomEvent('swipe-right', { bubbles: true });
  const swipeLeft = new CustomEvent('swipe-left', { bubbles: true });

  const handleStart: EventListener = (e: Event) => {
    start = (e as TouchEvent).touches[0].clientX;
  };

  const handleEnd = (e: Event) => {
    end = (e as TouchEvent).changedTouches[0].clientX;
    if (Math.abs(start - end) < treshold) return;
    el.dispatchEvent(start > end ? swipeRight : swipeLeft);
  };

  el.addEventListener('touchstart', handleStart);
  el.addEventListener('touchend', handleEnd);

  // cleanup
  return () => {
    el.removeEventListener('touchstart', handleStart);
    el.removeEventListener('touchend', handleEnd);
  };
};
