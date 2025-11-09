import type { Page } from '../source/types';
import type { App } from '../app';
import { GaragePage } from '../pages/garage-page';
import { WinnersPage } from '../pages/winners-page';
import { PagePath } from '../source/enum';
import { NotFound } from '../pages/not-found';
import { DEFAULT_VALUE_PAGE } from '../source/constants';
export class Router {
  private pages: Record<string, Page>;
  private currentPath = DEFAULT_VALUE_PAGE;

  constructor(app: App) {
    this.pages = {
      [PagePath.GARAGE]: new GaragePage(app),
      [PagePath.WINNERS]: new WinnersPage(app),
      [PagePath.NOT_FOUND]: new NotFound(app),
    };
  }

  public route(path: string): void {
    if (this.currentPath === path) return;

    this.currentPath = path;
    const page = this.pages[path] || this.pages[PagePath.NOT_FOUND];
    page.render();
  }

  public navigate(path: string): void {
    globalThis.history.pushState({}, '', path);
    this.route(path);
  }

  public listen(): void {
    globalThis.addEventListener('popstate', () => {
      this.route(globalThis.location.pathname);
    });
  }
}
