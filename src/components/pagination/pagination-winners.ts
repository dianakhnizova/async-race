import { HtmlBuilder } from '../../html-builder/html-builder';
import type { Winners } from '../winners/winners';
import { messages } from './messages';
import { DEFAULT_ITEMS_PER_PAGE, INITIAL_TOTAL_ITEMS } from './constants';

export class PaginationWinners extends HtmlBuilder {
  public container: HTMLDivElement;
  private winners: Winners;
  private isDisabled = false;
  private totalItems = INITIAL_TOTAL_ITEMS;

  constructor(winners: Winners) {
    super();
    this.container = this.createDiv('options-container');
    this.winners = winners;

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

  public setCurrentPage(): void {
    this.render();
  }

  public prevOptions = (): void => {
    const currentPage = this.winners.getCurrentPage();
    if (currentPage > 1) {
      this.winners.setPage(currentPage - 1);
    }
  };

  public nextOptions = (): void => {
    const currentPage = this.winners.getCurrentPage();
    const itemsPerPage = this.winners.itemsPerPage || DEFAULT_ITEMS_PER_PAGE;
    const totalItems = this.winners.getTotalItems();
    const maxPages = Math.ceil(totalItems / itemsPerPage);
    if (currentPage < maxPages) {
      this.winners.setPage(currentPage + 1);
    }
  };

  public render = (): HTMLDivElement => {
    this.container.replaceChildren();

    const itemsPerPage = this.winners.itemsPerPage || DEFAULT_ITEMS_PER_PAGE;
    this.totalItems = this.winners.getTotalItems();
    const currentPage = this.winners.getCurrentPage();

    const maxPages = Math.ceil(this.totalItems / itemsPerPage);

    const previousButton = this.createButton(
      'option-button',
      messages.prevButton,
      this.isDisabled || currentPage === 1,
      this.prevOptions,
    );

    const nextButton = this.createButton(
      'option-button',
      messages.nextButton,
      this.isDisabled || currentPage === maxPages,
      this.nextOptions,
    );

    this.container.append(previousButton, nextButton);
    return this.container;
  };
}
