import { HtmlBuilder } from '../../html-builder/html-builder';
import { messages } from '../../source/messages';
import type { App } from '../../app';
import { PagePath } from '../../source/enum';

export class NavigationBar {
  public container: HTMLDivElement;
  private htmlBuilder: HtmlBuilder;
  private app: App;
  private isDisabled = false;

  constructor(app: App) {
    this.htmlBuilder = new HtmlBuilder();
    this.app = app;
    this.container = this.htmlBuilder.createDiv('option-top-container');

    this.render();
  }

  public disable = (): void => {
    this.isDisabled = true;
    this.render();
  };

  public enable = (): void => {
    this.isDisabled = false;
    this.render();
  };

  public garageOptions = (): void => {
    this.app.router.navigate(PagePath.GARAGE);
  };

  public winnersOptions = (): void => {
    this.app.router.navigate(PagePath.WINNERS);
  };

  public render = (): HTMLDivElement => {
    this.container.replaceChildren();

    const garageButton = this.htmlBuilder.createButton(
      'button',
      messages.garageButton,
      this.isDisabled,
      this.garageOptions,
    );

    const winnersButton = this.htmlBuilder.createButton(
      'button',
      messages.winnersButton,
      this.isDisabled,
      this.winnersOptions,
    );

    this.container.append(garageButton, winnersButton);
    return this.container;
  };
}
