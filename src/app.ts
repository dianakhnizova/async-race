import { AppHTMLBuilder } from './html-builder/app-builder';
import { Router } from './router/router';
export class App {
  public container: HTMLDivElement;
  public router: Router;
  private appBuilder: AppHTMLBuilder;
  private layout: HTMLDivElement;

  constructor() {
    this.router = new Router(this);
    this.appBuilder = new AppHTMLBuilder();
    this.container = this.appBuilder.createDiv('section');
    this.layout = this.appBuilder.pageLayout(this.container);
  }

  public cleanContainer(): void {
    this.container.replaceChildren();
  }

  public initRouting(): void {
    this.router.listen();
    const path = globalThis.location.pathname;
    this.router.navigate(path);
  }

  public start(): void {
    document.body.append(this.layout);
    this.initRouting();
  }
}
