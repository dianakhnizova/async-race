import { HtmlBuilder } from '../../html-builder/html-builder';
import { messages } from './messages';
import { SortField, SortOrder } from '../../source/enum';
import './winners-header-style.css';
import type { Winners } from '../winners/winners';

export class WinnersHeader {
  public htmlBuilder: HtmlBuilder;
  public container: HTMLDivElement;
  public currentSort: SortField = SortField.WINS;
  public currentOrder: SortOrder = SortOrder.DESC;
  private winners: Winners;

  constructor(winners: Winners) {
    this.htmlBuilder = new HtmlBuilder();
    this.container = this.htmlBuilder.createDiv('winners-header');
    this.winners = winners;

    this.render();
  }

  public winnersSort = (): void => {
    this.currentSort = SortField.WINS;
    this.currentOrder =
      this.currentOrder === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC;
    void this.winners.winnersTable.render(
      this.winners.getCurrentPage(),
      this.currentSort,
      this.currentOrder,
    );
  };

  public timeSort = (): void => {
    this.currentSort = SortField.TIME;
    this.currentOrder =
      this.currentOrder === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC;
    void this.winners.winnersTable.render(
      this.winners.getCurrentPage(),
      this.currentSort,
      this.currentOrder,
    );
  };

  public render = (): HTMLDivElement => {
    this.container.replaceChildren();

    const idCar = this.htmlBuilder.createSpan('span-title', messages.carID);
    const car = this.htmlBuilder.createSpan('span-title', messages.carModel);
    const nameCar = this.htmlBuilder.createSpan('span-title', messages.carName);

    const winnersButton = this.htmlBuilder.createButton(
      'winner-button',
      messages.winnersButton,
      false,
      this.winnersSort,
    );

    const timeButton = this.htmlBuilder.createButton(
      'winner-button',
      messages.timeButton,
      false,
      this.timeSort,
    );

    this.container.append(idCar, car, nameCar, winnersButton, timeButton);
    return this.container;
  };
}
