/** Pure helper for controlled textareas: insert `text` at selection and return new caret position. */
export function insertTextAtSelection(
  value: string,
  selectionStart: number,
  selectionEnd: number,
  text: string
): { nextValue: string; caret: number } {
  const nextValue =
    value.slice(0, selectionStart) + text + value.slice(selectionEnd);
  return { nextValue, caret: selectionStart + text.length };
}
