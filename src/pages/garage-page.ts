import type { App } from '../app';
import type { Page } from '../source/types';
import { CarCreator } from '../components/car-creator/car-creator';
import { CarUpdater } from '../components/car-updater/car-updater';
import { CarRace } from '../components/car-racing/race';
import { CarReset } from '../components/car-racing/reset';
import { CarGenerator } from '../components/car-generation/car-generation';
import { HtmlBuilder } from '../html-builder/html-builder';
import { Garage } from '../components/garage/garage';
import { NavigationBar } from '../components/navigation/navigation';
export class GaragePage implements Page {
  public carUpdater: CarUpdater;
  public carCreator: CarCreator;
  public generator: CarGenerator;
  public navigationPages: NavigationBar;
  public race: CarRace;
  public reset: CarReset;
  private app: App;
  private htmlBuilder: HtmlBuilder;
  private garage: Garage;

  constructor(app: App) {
    this.app = app;
    this.htmlBuilder = new HtmlBuilder();
    this.navigationPages = new NavigationBar(app);
    this.garage = new Garage(this);
    this.carUpdater = new CarUpdater(this.garage);
    this.carCreator = new CarCreator(this.garage);
    this.race = new CarRace(this.garage, this.app);
    this.reset = new CarReset(this.garage, this.race);
    this.generator = new CarGenerator(this.garage);
  }

  public render(): void {
    this.app.cleanContainer();

    const topButtonsContainer = this.navigationPages.container;
    const middleButtonsContainer =
      this.htmlBuilder.createDiv('options-container');
    const carCreator = this.carCreator.container;
    const carUpdater = this.carUpdater.container;
    const carRace = this.race.container;
    const carReset = this.reset.container;
    const carGenerator = this.generator.container;
    const garage = this.garage.container;

    middleButtonsContainer.append(carRace, carReset, carGenerator);

    this.app.container.append(
      topButtonsContainer,
      carCreator,
      carUpdater,
      middleButtonsContainer,
      garage,
    );

    this.garage.render().catch((error) => {
      console.error('Error rendering garage:', error);
    });
  }
}
