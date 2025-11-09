import { HtmlBuilder } from '../../html-builder/html-builder';
import type { Garage } from '../garage/garage';
import { messages } from './messages';
import { MILLISECONDS } from '../car/constants';
import { EngineStatus } from '../../source/enum';
import './car-style.css';
import type { Cars } from '../car/car';
import { TO_SECOND } from './constants';
import { Modal } from '../modal/modal';
import type { App } from '../../app';
import { Api } from '../../api';
import '../modal/modal-style.css';
export class CarRace {
  public container: HTMLDivElement;
  public isDisabled: boolean;
  private htmlBuilder: HtmlBuilder;
  private garage: Garage;
  private isRacing = false;
  private isWinner = false;
  private modal: Modal;
  private app: App;
  private winnersCount = 0;
  private startedCars = 0;
  private api: Api;
  private abortController: AbortController | null = null;
  private racePromises: Promise<void>[] = [];
  private isCancelled = false;

  constructor(garage: Garage, app: App) {
    this.htmlBuilder = new HtmlBuilder();
    this.container = this.htmlBuilder.createDiv('options-container');
    this.isDisabled = false;
    this.garage = garage;
    this.modal = new Modal();
    this.app = app;
    this.api = new Api();
    this.abortController = new AbortController();

    this.render();
  }

  public raceCars = async (): Promise<void> => {
    this.isWinner = false;
    this.winnersCount = 0;
    this.startedCars = 0;
    this.isCancelled = false;
    this.garage.allRaceStarted(true);
    this.garage.resetEnabled();

    const racePromises = await this.startAllCars();
    await this.finishRace(racePromises);
  };

  public startAllCars = async (): Promise<Promise<void>[]> => {
    const racePromises: Promise<void>[] = [];
    const carStartPromises = this.collectStartPromises();
    const startResults = await this.waitForStartResults(carStartPromises);
    this.launchCars(startResults, racePromises);
    return racePromises;
  };

  public collectStartPromises = (): Promise<{
    carInstance: Cars;
    velocity: number;
    distance: number;
  } | null>[] => {
    const carStartPromises: Promise<{
      carInstance: Cars;
      velocity: number;
      distance: number;
    } | null>[] = [];

    for (const carInstance of this.garage.carInstances) {
      const startPromise = this.api
        .patchEngine(
          carInstance.carData.id,
          EngineStatus.Started,
          this.abortController?.signal,
        )
        .then((startResponse) => {
          if ('velocity' in startResponse && !this.isCancelled) {
            return {
              carInstance,
              velocity: startResponse.velocity,
              distance: startResponse.distance,
            };
          }
          throw new Error('Invalid response');
        })
        .catch(() => {
          console.log(`Error starting car ${carInstance.carData.id}`);
          return null;
        });

      carStartPromises.push(startPromise);
    }

    return carStartPromises;
  };

  public waitForStartResults = async (
    carStartPromises: Promise<{
      carInstance: Cars;
      velocity: number;
      distance: number;
    } | null>[],
  ): Promise<{ carInstance: Cars; velocity: number; distance: number }[]> => {
    const results = await Promise.all(carStartPromises);
    return results.filter(
      (
        result,
      ): result is { carInstance: Cars; velocity: number; distance: number } =>
        result !== null,
    );
  };

  public launchCars = (
    startResults: { carInstance: Cars; velocity: number; distance: number }[],
    racePromises: Promise<void>[],
  ): void => {
    const startTime = performance.now();
    for (const { carInstance, velocity, distance } of startResults) {
      if (carInstance.carElement && carInstance.roadContainer) {
        this.startedCars++;
        this.prepareCarForRace(
          carInstance,
          velocity,
          distance,
          racePromises,
          startTime,
        );
      }
    }
  };

  public prepareCarForRace = (
    carInstance: Cars,
    velocity: number,
    distance: number,
    racePromises: Promise<void>[],
    startTime: number,
  ): void => {
    carInstance.isRacing = true;

    const duration = distance / velocity;
    carInstance.startTime = startTime;
    this.garage.activeRacingCars.add(carInstance.carData.id);

    const racePromise = Promise.all([
      carInstance.animateCar(duration),
      carInstance.driveCar(),
    ])
      .then(() => this.showRaceSuccess(carInstance))
      .catch(() => this.showRaceFailure(carInstance));

    racePromises.push(racePromise);
  };

  public showRaceSuccess = async (carInstance: Cars): Promise<void> => {
    if (this.isCancelled) return;

    const raceTime: number = Number(
      ((performance.now() - carInstance.startTime!) / MILLISECONDS).toFixed(
        TO_SECOND,
      ),
    );

    this.winnersCount++;

    if (!this.isWinner) {
      this.isWinner = true;
      this.showWinnerModal(carInstance.carData.name, raceTime);

      await this.saveWinner(carInstance.carData.id, raceTime);
    }
  };

  public showWinnerModal(name: string, time: number): void {
    const modalElement = this.modal.modalOpen();
    this.modal.winnerModalContent(name, time);
    this.app.container.append(modalElement);
    modalElement.showModal();
  }

  public showRaceFailure = (carInstance: Cars): void => {
    carInstance.isRacing = false;
    if (carInstance.animationFrameId !== null) {
      cancelAnimationFrame(carInstance.animationFrameId);
      carInstance.animationFrameId = null;
    }
  };

  public finishRace = async (racePromises: Promise<void>[]): Promise<void> => {
    try {
      await Promise.all(racePromises);
      this.isRacing = false;
      this.garage.allRaceStopped();
      if (this.winnersCount === 0 && this.startedCars > 0) {
        const modalElement = this.modal.modalOpen();
        this.modal.errorModalContent();
        this.app.container.append(modalElement);
        modalElement.showModal();
      }
    } catch {
      this.garage.allRaceStopped();
      if (this.winnersCount === 0 && this.startedCars > 0) {
        const modalElement = this.modal.modalOpen();
        this.modal.errorModalContent();
        this.app.container.append(modalElement);
        modalElement.showModal();
      }
      this.isRacing = false;
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

    const raceButton = this.htmlBuilder.createButton(
      'option-button',
      messages.raceButton,
      this.isDisabled,
      this.raceCars,
    );

    this.container.append(raceButton);

    return this.container;
  };

  public cancelRace = (): void => {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = new AbortController();
      this.isRacing = false;
      this.isWinner = false;
      this.isCancelled = true;
      this.racePromises = [];
    }

    this.garage.carInstances.forEach((carInstance) => {
      if (carInstance.animationFrameId !== null) {
        cancelAnimationFrame(carInstance.animationFrameId);
        carInstance.animationFrameId = null;
      }
      if (carInstance.carElement) {
        carInstance.carElement.style.transform =
          'translateX(0px) translateY(-50%)';
      }
      carInstance.isRacing = false;
      carInstance.startTime = null;
      carInstance.updateStartStopDisabled();
      this.garage.activeRacingCars.delete(carInstance.carData.id);
    });
  };

  private async saveWinner(carId: number, raceTime: number): Promise<void> {
    try {
      let winner;
      try {
        winner = await this.api.getWinner(carId, this.abortController?.signal);
        await this.api.updateWinner(
          carId,
          winner.wins + 1,
          Math.min(winner.time, raceTime),
          this.abortController?.signal,
        );
      } catch (error: unknown) {
        if (error instanceof Error && error.message.includes('not found')) {
          await this.api.createWinner(
            carId,
            1,
            raceTime,
            this.abortController?.signal,
          );
        } else {
          throw error;
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Failed to save winner: ${error.message}`);
      }
    }
  }
}
