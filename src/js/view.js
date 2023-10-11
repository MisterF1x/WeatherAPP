export class View {
  insertHTML(el, html) {
    el.insertAdjacentHTML('afterbegin', html);
  }
  replaceHTML(el, html) {
    el.replaceChildren();
    this.insertHTML(el, html);
  }
}
