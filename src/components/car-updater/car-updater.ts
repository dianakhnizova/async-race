import {
  DEFAULT_COLOR,
  DEFAULT_VALUE_NAME,
  INITIAL_TOTAL_ITEMS,
  NEW_VALUE,
} from './constants';
import './car-updater-style.css';
import { UpdateHTMLBuilder } from './car-updater-html-builder';
import type { Garage } from '../garage/garage';
import { Api } from '../../api';
import type { Car } from '../../source/types';
export class CarUpdater {
  public container: HTMLDivElement;
  private carUpdaterBuilder: UpdateHTMLBuilder;
  private isDisabled: boolean;
  private garage: Garage;
  private api: Api;
  private id = INITIAL_TOTAL_ITEMS;
  private name = DEFAULT_VALUE_NAME;
  private color = DEFAULT_COLOR;

  constructor(garage: Garage) {
    this.garage = garage;
    this.carUpdaterBuilder = new UpdateHTMLBuilder();
    this.container = this.carUpdaterBuilder.createDiv('car-create-container');
    this.isDisabled = true;
    this.api = new Api();

    this.render();
  }

  public setCarData = (car: Car): void => {
    this.id = car.id || INITIAL_TOTAL_ITEMS;
    this.name = car.name;
    this.color = car.color;
    this.render();
  };

  public handleClickButton = async (): Promise<void> => {
    try {
      await this.api.updateCar(this.id, this.name || NEW_VALUE, this.color);

      await this.garage.render();
      this.resetUpdateValue();
    } catch {
      console.log('Error creating car');
    } finally {
      this.resetUpdateValue();
      this.disable();
    }
  };

  public handleTitleInput = (event: Event): void => {
    if (event.target instanceof HTMLInputElement) {
      this.name = event.target.value;
    }
  };

  public handleColorInput = (event: Event): void => {
    if (event.target instanceof HTMLInputElement) {
      this.color = event.target.value;
    }
  };

  public disable = (): void => {
    this.isDisabled = true;
    this.render();
  };

  public enable = (): void => {
    this.isDisabled = false;
    this.render();
  };

  public render = (): HTMLDivElement => {
    this.container.replaceChildren();

    const name = this.carUpdaterBuilder.createTitleInput(
      this.isDisabled,
      this.handleTitleInput,
    );
    name.value = this.name;

    const color = this.carUpdaterBuilder.createColorInput(
      this.isDisabled,
      this.handleColorInput,
    );
    color.value = this.color;

    const createButton = this.carUpdaterBuilder.createButtonElement(
      this.isDisabled,
      this.handleClickButton,
    );

    this.container.append(name, color, createButton);
    return this.container;
  };

  private resetUpdateValue = (): void => {
    this.name = DEFAULT_VALUE_NAME;
    this.color = DEFAULT_COLOR;
    this.id = INITIAL_TOTAL_ITEMS;
    this.render();
  };
}
