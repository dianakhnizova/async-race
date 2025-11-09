import { messages } from '../source/messages';
import { HtmlBuilder } from './html-builder';

export class AppHTMLBuilder extends HtmlBuilder {
  public pageLayout(container: HTMLDivElement): HTMLDivElement {
    const wrapper = this.createDiv('wrapper');
    const header = this.createDiv('header');
    const title = this.createTitle('title', messages.appTitle);

    wrapper.append(header, container);
    header.append(title);
    return wrapper;
  }
}
