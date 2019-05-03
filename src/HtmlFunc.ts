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
