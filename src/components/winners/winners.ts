import { TitleWinnerBuilder } from '../title-builder/title-winner-builder';
import { WinnersHeader } from '../winners-header/winners-header';
import { WinnersTable } from '../winners-table/winners-table';
import {
  DEFAULT_ITEMS_PER_TABLE,
  FIRST_PAGE,
  INITIAL_TOTAL_ITEMS,
} from '../pagination/constants';
import { PaginationWinners } from '../pagination/pagination-winners';

export class Winners {
  public itemsPerPage: number = DEFAULT_ITEMS_PER_TABLE;
  public container: HTMLDivElement;
  public winnersTable: WinnersTable;
  private titleRender: TitleWinnerBuilder;
  private winnersHeader: WinnersHeader;
  private totalCount = INITIAL_TOTAL_ITEMS;
  private paginationWinners: PaginationWinners;
  private currentPage = FIRST_PAGE;

  constructor() {
    this.titleRender = new TitleWinnerBuilder();
    this.container = this.titleRender.createDiv('winners');
    this.winnersTable = new WinnersTable();
    this.winnersHeader = new WinnersHeader(this);
    this.paginationWinners = new PaginationWinners(this);
  }

  public getTotalItems(): number {
    return this.totalCount;
  }

  public setPage(page: number): void {
    this.currentPage = page;
    this.paginationWinners.setCurrentPage();
    void this.render();
  }

  public getCurrentPage = (): number => {
    return this.currentPage;
  };

  public render = async (): Promise<void> => {
    await this.winnersTable.render(
      this.currentPage,
      this.winnersHeader.currentSort,
      this.winnersHeader.currentOrder,
    );
    this.container.replaceChildren();

    this.totalCount = this.winnersTable.getTotalCount();

    const titleElement = this.titleRender.titleRender(
      this.totalCount,
      this.currentPage,
    );

    const winnersHeader = this.winnersHeader.container;

    const winnersTable = this.winnersTable.container;

    this.container.append(titleElement, winnersHeader, winnersTable);

    const maxPages = Math.ceil(this.totalCount / this.itemsPerPage);

    if (maxPages > 1) {
      this.paginationWinners.render();
      this.paginationWinners.setCurrentPage();
      this.container.append(this.paginationWinners.container);
    }
  };
}
