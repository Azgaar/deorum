export const allowHotkeys = () => {
  const el = document.activeElement;

  const tag = el?.tagName ?? '';
  if (['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON', 'A'].includes(tag)) return false;
  if (tag === 'DIV' && (el as HTMLDivElement)?.contentEditable === 'true') return false;
  if (document.getSelection()?.toString()) return false;
  return true;
};
