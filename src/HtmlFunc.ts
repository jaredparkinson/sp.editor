export function scrollIntoView(
  query: Element | HTMLElement | string | null | undefined,
  // query: string | undefined,
) {
  if (query) {
    if ((query as any).scrollIntoView) {
      (query as any).scrollIntoView();
    } else if (typeof query === 'string') {
      scrollIntoView(document.querySelector(query));
    }
  }
}

export async function getBoundingClientRect(cloneRange: Range | undefined) {
  if (cloneRange && cloneRange.startContainer.parentElement) {
    return cloneRange.startContainer.parentElement.getBoundingClientRect();
  }
}

export async function cloneRange() {
  const selection = window.getSelection();

  if (selection) {
    return selection.getRangeAt(0).cloneRange();
  }
}
