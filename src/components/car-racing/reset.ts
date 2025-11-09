import { HtmlBuilder } from '../../html-builder/html-builder';
import { messages } from './messages';
import type { Garage } from '../garage/garage';
import { EngineStatus } from '../../source/enum';
import type { CarRace } from './race';
import { MILLISECONDS } from './constants';

export class CarReset {
  public container: HTMLDivElement;
  public isDisabled: boolean;
  private htmlBuilder: HtmlBuilder;
  private garage: Garage;
  private race: CarRace;

  constructor(garage: Garage, race: CarRace) {
    this.htmlBuilder = new HtmlBuilder();
    this.container = this.htmlBuilder.createDiv('options-container');
    this.isDisabled = true;
    this.garage = garage;
    this.race = race;

    this.render();
  }

  public resetCars = async (): Promise<void> => {
    this.garage.resetDisabled();
    this.race.cancelRace();

    this.garage.carInstances.forEach((carInstance) => {
      if (carInstance.animationFrameId !== null) {
        cancelAnimationFrame(carInstance.animationFrameId);
        carInstance.animationFrameId = null;
      }
      if (carInstance.carElement) {
        carInstance.carElement.style.transition = 'transform 5s ease-out';
        carInstance.carElement.style.transform =
          'translateX(0px) translateY(-50%)';
      }
      carInstance.isRacing = false;
      carInstance.startTime = null;
      carInstance.updateStartStopDisabled();
      this.garage.activeRacingCars?.delete(carInstance.carData.id);
    });

    await new Promise((resolve) => setTimeout(resolve, MILLISECONDS));
    const stopPromises = this.garage.carInstances.map(async (carInstance) => {
      try {
        await this.garage.api.patchEngine(
          carInstance.carData.id,
          EngineStatus.Stopped,
        );
      } catch (error) {
        console.log(`Error stopping car ${carInstance.carData.id}:`, error);
      }
    });

    await Promise.all(stopPromises);
    this.garage.allRaceStopped();
    await this.garage.render();
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

    const resetButton = this.htmlBuilder.createButton(
      'option-button',
      messages.resetButton,
      this.isDisabled,
      this.resetCars,
    );

    this.container.append(resetButton);

    return this.container;
  };
}
