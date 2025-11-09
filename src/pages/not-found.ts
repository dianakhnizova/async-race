import type { Page } from '../source/types';
import type { App } from '../app';
import { messages } from '../source/messages';
import { PagePath } from '../source/enum';
import { HtmlBuilder } from '../html-builder/html-builder';

export class NotFound implements Page {
  private htmlBuilder: HtmlBuilder;
  private app: App;
  private isDisabled: boolean;

  constructor(app: App) {
    this.app = app;
    this.htmlBuilder = new HtmlBuilder();
    this.isDisabled = false;
  }

  public garagePage = (): void => {
    this.app.router.navigate(PagePath.GARAGE);
  };

  public render(): void {
    this.app.cleanContainer();
    const notFoundMessage = this.htmlBuilder.createParagraph(
      'paragraph',
      messages.notFoundTitle,
    );
    const backButton = this.htmlBuilder.createButton(
      'button',
      messages.homeButton,
      this.isDisabled,
      this.garagePage,
    );

    this.app.container.append(notFoundMessage, backButton);
  }
}
