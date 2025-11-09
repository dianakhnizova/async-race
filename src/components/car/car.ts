import { HtmlBuilder } from '../../html-builder/html-builder';
import { SvgHTMLBuilder } from '../../html-builder/svg-builder';
import { messages } from './messages';
import type { Car } from '../../source/types';
import type { CarUpdater } from '../car-updater/car-updater';
import { Api } from '../../api';
import type { Garage } from '../garage/garage';
import {
  DEFAULT_VALUE,
  LEFT_CAR_POSITION,
  START_POSITION,
  LENGTH_OF_NAME,
} from '../car/constants';
import './car-style.css';
import { EngineStatus } from '../../source/enum';

export class Cars {
  public htmlBuilder: HtmlBuilder;
  public svgBuilder: SvgHTMLBuilder;
  public container: HTMLDivElement;
  public roadContainer: HTMLDivElement;
  public itemsPerPage: number = DEFAULT_VALUE;
  public isRacing = false;
  public carData: Car;
  public carElement: SVGElement | null = null;
  public startTime: number | null = null;
  public animationFrameId: number | null = null;
  private isDisabled = false;
  private carUpdater: CarUpdater;
  private api: Api;
  private garage: Garage;
  private selectButton: HTMLButtonElement;
  private removeButton: HTMLButtonElement;
  private startButton: HTMLButtonElement;
  private stopButton: HTMLButtonElement;

  constructor(carData: Car, carUpdater: CarUpdater, garage: Garage) {
    this.htmlBuilder = new HtmlBuilder();
    this.roadContainer = this.htmlBuilder.createDiv('road-container');
    this.svgBuilder = new SvgHTMLBuilder();
    this.container = this.htmlBuilder.createDiv('car-container');
    this.carData = carData;
    this.carUpdater = carUpdater;
    this.api = new Api();
    this.garage = garage;
    this.garage.activeRacingCars = this.garage.activeRacingCars || new Set();

    this.selectButton = this.htmlBuilder.createButton(
      'option-button',
      messages.selectButton,
      this.isDisabled || this.isRacing,
      this.selectOptions,
    );
    this.removeButton = this.htmlBuilder.createButton(
      'option-button',
      messages.removeButton,
      this.isDisabled || this.isRacing,
      this.removeOptions,
    );

    this.startButton = this.svgBuilder.createSVGButton(
      'start-race',
      this.isRacing,
      () => this.startRace(),
    );
    this.stopButton = this.svgBuilder.createSVGButton(
      'start-race',
      !this.isRacing,
      this.stopRace,
    );
    this.stopButton.classList.add('stop-race');

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

  public selectOptions = (): void => {
    this.carUpdater.setCarData(this.carData);
    this.carUpdater.enable();
  };

  public removeOptions = async (): Promise<void> => {
    try {
      await this.api.removeCar(this.carData.id);

      const updatedTotalItems = this.garage.getTotalItems() - 1;
      await this.garage.pagination.updateAfterDelete(updatedTotalItems);

      await this.garage.render();
    } catch (error) {
      console.log('Error removing car:', error);
    }
  };

  public async startRace(): Promise<void> {
    try {
      const startResponse = await this.api.patchEngine(
        this.carData.id,
        EngineStatus.Started,
      );

      if ('velocity' in startResponse && 'distance' in startResponse) {
        const { velocity, distance } = startResponse;

        if (this.carElement && this.roadContainer && velocity && distance) {
          this.isRacing = true;
          this.garage.activeRacingCars.add(this.carData.id);
          this.garage.oneRaceStarted(true);
          this.updateStartStopDisabled();
          this.garage.resetEnabled();

          if (this.carElement) {
            this.carElement.style.transition = 'none';
          }

          const duration = distance / velocity;
          this.startTime = performance.now();

          await Promise.all([this.animateCar(duration), this.driveCar()]);
        }
      } else {
        throw new Error(
          'Invalid response from engine start: missing velocity or distance',
        );
      }
    } catch (error) {
      console.error('Error in race:', error);
    }
  }

  public async driveCar(): Promise<void> {
    try {
      await this.api.patchEngine(this.carData.id, EngineStatus.Drive);
    } catch (error) {
      console.error('Drive mode error');
      this.isRacing = false;
      if (this.animationFrameId !== null) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
        this.startTime = null;
      }
      throw error;
    }
  }

  public setSelectRemoveDisabled(state: boolean): void {
    this.selectButton.disabled = state;
    this.removeButton.disabled = state;
  }

  public setStartStopDisabled(state: boolean): void {
    this.startButton.disabled = state;
    this.stopButton.disabled = state;
    this.removeButton.disabled = state;
  }

  public updateStartStopDisabled(): void {
    this.startButton.disabled = this.isRacing;
    this.stopButton.disabled = !this.isRacing;
  }

  public animateCar(duration: number): Promise<void> {
    const startPosition = START_POSITION;
    const carElement = this.carElement;
    const roadContainer = this.roadContainer;

    if (!carElement || !roadContainer || !this.startTime) {
      return Promise.resolve();
    }

    const carWidth = carElement.getBoundingClientRect().width;
    const initialLeft =
      Number.parseInt(getComputedStyle(carElement).left, 10) ||
      LEFT_CAR_POSITION;
    const roadWidth = roadContainer.offsetWidth;
    const maxPosition = roadWidth - initialLeft - carWidth;

    return new Promise((resolve) => {
      const animate = (currentTime: number): void => {
        const elapsedTime = currentTime - this.startTime!;
        const progress = Math.min(elapsedTime / duration, 1);
        let currentPosition = startPosition + maxPosition * progress;

        currentPosition = Math.min(currentPosition, maxPosition);

        carElement.style.transform = `translateX(${currentPosition}px) translateY(-50%)`;

        if (currentPosition >= maxPosition) {
          resolve();
          return;
        }

        if (progress < 1 && this.isRacing) {
          this.animationFrameId = requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };

      this.animationFrameId = requestAnimationFrame(animate);
    });
  }

  public stopRace = async (): Promise<void> => {
    try {
      await this.api.patchEngine(this.carData.id, EngineStatus.Stopped);

      if (this.animationFrameId !== null) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
        this.startTime = null;
      }

      if (this.carElement) {
        this.carElement.style.transform = 'translateX(0px) translateY(-50%)';
      }

      this.isRacing = false;
      this.garage.activeRacingCars.delete(this.carData.id);

      const isLastCarStopped = this.garage.activeRacingCars.size === 0;

      this.updateStartStopDisabled();

      if (isLastCarStopped) {
        this.garage.oneRaceStopped();
      }

      this.render();
    } catch {
      console.log('Error stopping engine');
    }
  };

  public createSelectRemoveOptions = (): HTMLDivElement => {
    const buttonContainer = this.htmlBuilder.createDiv('select-container');

    const maxLength = LENGTH_OF_NAME;
    let displayName = this.carData.name;
    if (displayName.length > maxLength) {
      displayName = `${displayName.slice(0, maxLength)}...`;
    }

    const carInfo = this.htmlBuilder.createParagraph(
      'car-name',
      `${displayName}`,
    );

    buttonContainer.append(this.selectButton, this.removeButton, carInfo);
    return buttonContainer;
  };

  public createStartStopRace = (): HTMLDivElement => {
    this.carElement = this.svgBuilder.createSVGCar('car', this.carData.color);

    const finishElement = this.svgBuilder.createSVGFinish(
      'finish',
      this.carData.color,
    );

    this.roadContainer.append(
      this.startButton,
      this.stopButton,
      this.carElement,
      finishElement,
    );
    return this.roadContainer;
  };

  public render = (): HTMLDivElement => {
    this.container.replaceChildren();

    this.roadContainer.replaceChildren();

    this.updateStartStopDisabled();

    this.container.append(
      this.createSelectRemoveOptions(),
      this.createStartStopRace(),
    );

    return this.container;
  };
}
