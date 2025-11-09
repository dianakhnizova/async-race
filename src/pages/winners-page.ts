import type { Page } from '../source/types';
import type { App } from '../app';
import { NavigationBar } from '../components/navigation/navigation';
import { PagePath } from '../source/enum';
import { Winners } from '../components/winners/winners';
export class WinnersPage implements Page {
  public navigationPages: NavigationBar;
  private winners: Winners;
  private app: App;

  constructor(app: App) {
    this.navigationPages = new NavigationBar(app);
    this.winners = new Winners();
    this.app = app;
  }

  public backPage = (): void => {
    this.app.router.navigate(PagePath.GARAGE);
  };

  public render(): void {
    this.app.cleanContainer();

    const topButtonsContainer = this.navigationPages.container;
    const winnerTable = this.winners.container;

    this.app.container.append(topButtonsContainer, winnerTable);

    this.winners.render().catch((error) => {
      console.error('Error rendering winners:', error);
    });
  }
}
