import { Api } from '../../api';
import { HtmlBuilder } from '../../html-builder/html-builder';
import type { Car } from '../../source/types';
import './garage-style.css';
import { Cars } from '../car/car';
import type { GaragePage } from '../../pages/garage-page';
import { PaginationGarage } from '../pagination/pagination-garage';
import { DEFAULT_VALUE, FIRST_PAGE, INITIAL_TOTAL_ITEMS } from './constants';
import { TitleGarageBuilder } from '../title-builder/title-garage-builder';
export class Garage {
  public htmlBuilder: HtmlBuilder;
  public container: HTMLDivElement;
  public pagination: PaginationGarage;
  public itemsPerPage: number = DEFAULT_VALUE;
  public activeRacingCars: Set<number>;
  public carInstances: Cars[] = [];
  public api: Api;
  private page = FIRST_PAGE;
  private currentCars: Car[];
  private totalCount = INITIAL_TOTAL_ITEMS;
  private garagePage: GaragePage;
  private titleRender: TitleGarageBuilder;

  constructor(garagePage: GaragePage) {
    this.garagePage = garagePage;
    this.htmlBuilder = new HtmlBuilder();
    this.container = this.htmlBuilder.createDiv('garage');
    this.api = new Api();
    this.currentCars = [];
    this.pagination = new PaginationGarage(this);
    this.activeRacingCars = new Set();
    this.titleRender = new TitleGarageBuilder();

    this.render().catch((error) => {
      console.log('Error start rendering', error);
    });
  }

  public oneRaceStarted(isGlobal: boolean = false): void {
    if (isGlobal) {
      this.carInstances.forEach((car) => car.setSelectRemoveDisabled(true));
    }
    this.garagePage.carUpdater.disable();
    this.garagePage.carCreator.disable();
    this.pagination.disable();
    this.garagePage.generator.disable();
    this.garagePage.navigationPages.disable();
    this.garagePage.race.disable();
  }

  public allRaceStarted(isGlobal: boolean = false): void {
    if (isGlobal) {
      this.carInstances.forEach((car) => car.setSelectRemoveDisabled(true));
      this.carInstances.forEach((car) => {
        car.setStartStopDisabled(true);
      });
    }
    this.garagePage.carUpdater.disable();
    this.garagePage.carCreator.disable();
    this.pagination.disable();
    this.garagePage.generator.disable();
    this.garagePage.navigationPages.disable();
    this.garagePage.race.disable();
  }

  public oneRaceStopped(): void {
    if (this.activeRacingCars.size === 0) {
      this.carInstances.forEach((car) => car.setSelectRemoveDisabled(false));
      this.resetDisabled();
      this.garagePage.carCreator.enable();
    }
    this.garagePage.carCreator.enable();
    this.pagination.enable();
    this.garagePage.generator.enable();
    this.garagePage.navigationPages.enable();
    this.garagePage.race.enable();
  }

  public allRaceStopped(): void {
    if (this.activeRacingCars.size === 0) {
      this.carInstances.forEach((car) => car.setSelectRemoveDisabled(false));
      this.carInstances.forEach((car) => {
        car.setStartStopDisabled(false);
      });
      this.resetDisabled();
      this.garagePage.carCreator.enable();
    }
    this.garagePage.carCreator.enable();
    this.pagination.enable();
    this.garagePage.generator.enable();
    this.garagePage.navigationPages.enable();
    this.garagePage.race.enable();
  }

  public resetDisabled(): void {
    this.garagePage.reset.disable();
  }

  public resetEnabled(): void {
    this.garagePage.reset.enable();
  }

  public async setPage(page: number): Promise<void> {
    this.page = page;
    await this.render();
  }

  public getTotalItems(): number {
    return this.totalCount;
  }

  public render = async (): Promise<void> => {
    const { cars, totalCount } = await this.getAllCars();
    this.currentCars = cars;
    this.totalCount = totalCount;

    this.container.replaceChildren();
    this.carInstances = [];

    const titleElement = this.titleRender.titleRender(
      this.totalCount,
      this.page,
    );

    this.container.append(titleElement);

    this.currentCars.forEach((car) => {
      if (this.garagePage.carUpdater) {
        const carData = new Cars(car, this.garagePage.carUpdater, this);
        this.carInstances.push(carData);
        this.container.append(carData.render());
      }
    });

    const maxPages = Math.ceil(this.totalCount / this.itemsPerPage);
    if (maxPages > 1) {
      this.container.append(this.pagination.render());
      this.pagination.setCurrentPage(this.page);
    }
  };

  private getAllCars = async (): Promise<{
    cars: Car[];
    totalCount: number;
  }> => {
    try {
      const result = await this.api.getCars(this.page);
      console.log('Data from server:', result);
      return result;
    } catch {
      return { cars: [], totalCount: INITIAL_TOTAL_ITEMS };
    }
  };
}
