import { HtmlBuilder } from '../../html-builder/html-builder';
import { messages } from './messages';
import type { Garage } from '../garage/garage';
import { Api } from '../../api';
import {
  BRANDS_CARS,
  COLOR_COUNT,
  GENERATION_CARS_COUNT,
  LETTERS,
  MODELS_CARS,
  SYMBOL_COLOR,
  SYMBOLS_COUNT,
} from './constants';

export class CarGenerator {
  public container: HTMLDivElement;
  public isDisabled: boolean;
  private htmlBuilder: HtmlBuilder;
  private garage: Garage;
  private api: Api;

  constructor(garage: Garage) {
    this.htmlBuilder = new HtmlBuilder();
    this.container = this.htmlBuilder.createDiv('options-container');
    this.isDisabled = false;
    this.garage = garage;
    this.api = new Api();

    this.render();
  }

  public generationOptions = async (): Promise<void> => {
    this.disable();

    try {
      const carPromises = Array.from({ length: GENERATION_CARS_COUNT }, () =>
        this.api.createCar(
          this.generateRandomName(),
          this.generateRandomColor(),
        ),
      );

      await Promise.all(carPromises);

      await this.garage.render();
    } catch {
      console.log('Generation error');
    } finally {
      this.enable();
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

    const generatorButton = this.htmlBuilder.createButton(
      'option-button',
      messages.generateButton,
      this.isDisabled,
      this.generationOptions,
    );

    this.container.append(generatorButton);

    return this.container;
  };

  private generateRandomName(): string {
    const brands = BRANDS_CARS;
    const models = MODELS_CARS;
    const randomBrand = brands[Math.floor(Math.random() * brands.length)];
    const randomModel = models[Math.floor(Math.random() * models.length)];
    return `${randomBrand} ${randomModel}`;
  }

  private generateRandomColor(): string {
    const letters = LETTERS;
    let color = SYMBOL_COLOR;
    for (let i = 0; i < COLOR_COUNT; i++) {
      color += letters[Math.floor(Math.random() * SYMBOLS_COUNT)];
    }
    return color;
  }
}
