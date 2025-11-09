import { HtmlBuilder } from '../../html-builder/html-builder';
import { LIMIT_OF_WINNERS } from '../../source/constants';
import { Api } from '../../api';
import { SvgHTMLBuilder } from '../../html-builder/svg-builder';
import './winners-table-style.css';
import { INITIAL_TOTAL_ITEMS } from '../car/constants';
import { SortField, SortOrder } from '../../source/enum';
import { FIRST_PAGE } from '../pagination/constants';
import type { Car } from '../../source/types';

export class WinnersTable {
  public htmlBuilder: HtmlBuilder;
  public container: HTMLDivElement;
  private api: Api;
  private svgBuilder: SvgHTMLBuilder;
  private totalCount = INITIAL_TOTAL_ITEMS;

  constructor() {
    this.htmlBuilder = new HtmlBuilder();
    this.container = this.htmlBuilder.createDiv('winners-table');
    this.api = new Api();
    this.svgBuilder = new SvgHTMLBuilder();

    void this.render();
  }

  public async render(
    page: number = FIRST_PAGE,
    sortBy: SortField = SortField.WINS,
    sortOrder: SortOrder = SortOrder.DESC,
  ): Promise<void> {
    const { winners, totalCount } = await this.api.getWinners(
      page,
      LIMIT_OF_WINNERS,
      sortBy,
      sortOrder,
    );
    this.totalCount = totalCount;

    const promises: Promise<Car>[] = [];
    winners.forEach((winner) => {
      const promise = this.api.getCar(winner.id);
      promises.push(promise);
    });

    const carData = await Promise.all(promises);

    this.container.replaceChildren();

    carData.forEach((carData: Car, index: number) => {
      const row = this.htmlBuilder.createDiv('winner-row');

      const number = this.htmlBuilder.createSpan(
        'winner-cell',
        `${(page - 1) * LIMIT_OF_WINNERS + index + 1}`,
      );

      const car = this.svgBuilder.createSVGCar('tractor', carData.color);

      const name = this.htmlBuilder.createSpan('winner-cell', carData.name);

      const wins = this.htmlBuilder.createSpan(
        'winner-cell',
        `${winners[index].wins}`,
      );

      const time = this.htmlBuilder.createSpan(
        'winner-cell',
        `${winners[index].time}`,
      );

      row.append(number, car, name, wins, time);
      this.container.append(row);
    });
  }

  public getTotalCount(): number {
    return this.totalCount;
  }
}
