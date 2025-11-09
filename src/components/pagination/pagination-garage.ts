import { HtmlBuilder } from '../../html-builder/html-builder';
import { messages } from './messages';
import type { Garage } from '../garage/garage';
import {
  DEFAULT_ITEMS_PER_PAGE,
  FIRST_PAGE,
  INITIAL_TOTAL_ITEMS,
} from './constants';

export class PaginationGarage extends HtmlBuilder {
  public container: HTMLDivElement;
  private isDisabled = false;
  private currentPage = FIRST_PAGE;
  private garage: Garage;
  private totalItems = INITIAL_TOTAL_ITEMS;

  constructor(garage: Garage) {
    super();
    this.container = this.createDiv('options-container');
    this.garage = garage;

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

  public async updateAfterDelete(totalItems: number): Promise<void> {
    this.totalItems = totalItems;
    const itemsPerPage = this.garage.itemsPerPage || DEFAULT_ITEMS_PER_PAGE;
    const maxPages = Math.ceil(this.totalItems / itemsPerPage);

    if (this.totalItems === 0) {
      this.currentPage = FIRST_PAGE;
    } else if (this.currentPage > maxPages && this.currentPage > 1) {
      this.currentPage = maxPages;
    }

    await this.garage.setPage(this.currentPage);
    this.render();
  }

  public setCurrentPage(page: number): void {
    this.currentPage = page;
    this.render();
  }

  public prevOptions = async (): Promise<void> => {
    if (this.currentPage > 1) {
      this.currentPage -= 1;
      await this.garage.setPage(this.currentPage);
      this.render();
    }
  };

  public nextOptions = async (): Promise<void> => {
    this.currentPage += 1;
    await this.garage.setPage(this.currentPage);
    this.render();
  };

  public render = (): HTMLDivElement => {
    this.container.replaceChildren();

    const itemsPerPage = this.garage.itemsPerPage || DEFAULT_ITEMS_PER_PAGE;
    this.totalItems = this.garage.getTotalItems();

    const maxPages = Math.ceil(this.totalItems / itemsPerPage);

    const previousButton = this.createButton(
      'option-button',
      messages.prevButton,
      this.isDisabled || this.currentPage === 1,
      this.prevOptions,
    );

    const nextButton = this.createButton(
      'option-button',
      messages.nextButton,
      this.isDisabled || this.currentPage === maxPages,
      this.nextOptions,
    );

    this.container.append(previousButton, nextButton);
    return this.container;
  };
}
