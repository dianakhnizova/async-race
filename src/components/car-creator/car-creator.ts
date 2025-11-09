import { CreateHTMLBuilder } from './car-creator-html-builder';
import { DEFAULT_COLOR, DEFAULT_VALUE, NEW_VALUE } from './constants';
import './car-creator-style.css';
import { Api } from '../../api';
import type { Garage } from '../garage/garage';

export class CarCreator {
  public container: HTMLDivElement;
  private carCreatorBuilder: CreateHTMLBuilder;
  private isDisabled: boolean;
  private api: Api;
  private name = DEFAULT_VALUE;
  private color = DEFAULT_COLOR;
  private garage: Garage;

  constructor(garage: Garage) {
    this.garage = garage;
    this.carCreatorBuilder = new CreateHTMLBuilder();
    this.container = this.carCreatorBuilder.createDiv('car-create-container');
    this.isDisabled = false;
    this.api = new Api();

    this.render();
  }

  public handleClickButton = async (): Promise<void> => {
    try {
      await this.api.createCar(this.name || NEW_VALUE, this.color);

      await this.garage.render();
      this.name = DEFAULT_VALUE;
      this.color = DEFAULT_COLOR;
      this.render();
    } catch {
      console.log('Error creating car');
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

    const name = this.carCreatorBuilder.createTitleInput(
      this.isDisabled,
      this.handleTitleInput,
    );

    const color = this.carCreatorBuilder.createColorInput(
      this.isDisabled,
      this.handleColorInput,
    );
    const createButton = this.carCreatorBuilder.createButtonElement(
      this.isDisabled,
      this.handleClickButton,
    );

    this.container.append(name, color, createButton);
    return this.container;
  };
}
