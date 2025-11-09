import {
  ERROR_STATUS_400,
  ERROR_STATUS_404,
  ERROR_STATUS_429,
  ERROR_STATUS_500,
  JSON_HEADERS,
  LIMIT_OF_WINNERS,
} from './source/constants';
import type { Car, EngineState, Winner } from './source/types';
import { SortField, SortOrder } from './source/enum';
import type { EngineStatus } from './source/enum';

export class Api {
  private origin = 'http://127.0.0.1:3000';

  public async getCars(
    page: number,
  ): Promise<{ cars: Car[]; totalCount: number }> {
    const response = await fetch(
      `${this.origin}/garage?_page=${page}&_limit=7`,
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch cars: ${response.status}`);
    }

    const cars: Car[] = await response.json();
    const totalCount = Number(response.headers.get('X-Total-Count')) || 0;
    return { cars, totalCount };
  }

  public async getCar(id: number): Promise<Car> {
    const response = await fetch(`${this.origin}/garage/${id}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Failed to get car`);
    }

    const car: Car = await response.json();
    return car;
  }

  public async createCar(name: string, color: string): Promise<Car> {
    const response = await fetch(`${this.origin}/garage`, {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify({ name, color }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create car`);
    }

    const data: Car = await response.json();
    return data;
  }

  public async getWinners(
    page: number,
    limit: number = LIMIT_OF_WINNERS,
    sort: SortField = SortField.ID,
    order: SortOrder = SortOrder.ASC,
  ): Promise<{ winners: Winner[]; totalCount: number }> {
    const response = await fetch(
      `${this.origin}/winners?_page=${page}&_limit=${limit}&_sort=${sort}&_order=${order}`,
    );

    if (!response.ok) {
      throw new Error(`Failed to get winners`);
    }

    const winners: Winner[] = await response.json();
    const totalCount = Number(response.headers.get('X-Total-Count')) || 0;
    return { winners, totalCount };
  }

  public async updateCar(
    id: number,
    name: string,
    color: string,
  ): Promise<Car> {
    const response = await fetch(`${this.origin}/garage/${id}`, {
      method: 'PUT',
      headers: JSON_HEADERS,
      body: JSON.stringify({ name, color }),
    });

    if (!response.ok) {
      throw new Error(`Don't update car`);
    }

    const data: Car = await response.json();
    return data;
  }

  public async removeCar(id: number): Promise<void> {
    const garageResponse = await fetch(`${this.origin}/garage/${id}`, {
      method: 'DELETE',
      headers: JSON_HEADERS,
    });

    if (!garageResponse.ok) {
      throw new Error(`Failed to delete car`);
    }

    const winnersResponse = await fetch(`${this.origin}/winners/${id}`, {
      method: 'DELETE',
      headers: JSON_HEADERS,
    });

    if (!winnersResponse.ok && winnersResponse.status !== ERROR_STATUS_404) {
      throw new Error(`Failed to delete winner: ${winnersResponse.status}`);
    }
  }
  public async patchEngine(
    id: number,
    status: EngineStatus,
    signal?: AbortSignal,
  ): Promise<EngineState> {
    const response = await fetch(
      `${this.origin}/engine?id=${id}&status=${status}`,
      {
        method: 'PATCH',
        signal,
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      this.errorState(response.status, errorText);
    }

    const data: EngineState = await response.json();
    return data;
  }

  public errorState = (status: number, errorText: string): never => {
    switch (status) {
      case ERROR_STATUS_400: {
        throw new Error(
          'Wrong parameters: "id" should be any positive number, "status" should be "started", "stopped" or "drive"',
        );
      }
      case ERROR_STATUS_404: {
        throw new Error(
          'Engine parameters for car with such id was not found in the garage. Have you tried to set engine status to "started" before?',
        );
      }
      case ERROR_STATUS_429: {
        throw new Error(
          "Drive already in progress. You can't run drive for the same car twice while it's not stopped.",
        );
      }
      case ERROR_STATUS_500: {
        throw new Error(
          "Car has been stopped suddenly. It's engine was broken down.",
        );
      }
      default: {
        throw new Error(`Failed to patch engine: ${status} - ${errorText}`);
      }
    }
  };

  public async getWinner(id: number, signal?: AbortSignal): Promise<Winner> {
    const response = await fetch(`${this.origin}/winners/${id}`, {
      method: 'GET',
      signal,
    });

    if (!response.ok) {
      if (response.status === ERROR_STATUS_404) {
        throw new Error(`Winner with id ${id} not found`);
      }
      throw new Error(`Failed to get winner`);
    }

    const winner: Winner = await response.json();
    return winner;
  }

  public async createWinner(
    id: number,
    wins: number,
    time: number,
    signal?: AbortSignal,
  ): Promise<Winner> {
    const response = await fetch(`${this.origin}/winners`, {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify({ id, wins, time }),
      signal,
    });

    if (!response.ok) {
      if (response.status === ERROR_STATUS_500) {
        throw new Error('Failed to create winner: duplicate id');
      }
      throw new Error(`Failed to create winner`);
    }

    const data: Winner = await response.json();
    return data;
  }

  public async updateWinner(
    id: number,
    wins: number,
    time: number,
    signal?: AbortSignal,
  ): Promise<Winner> {
    const response = await fetch(`${this.origin}/winners/${id}`, {
      method: 'PUT',
      headers: JSON_HEADERS,
      body: JSON.stringify({ wins, time }),
      signal,
    });

    if (!response.ok) {
      if (response.status === ERROR_STATUS_404) {
        throw new Error(`Winner with id ${id} not found`);
      }
      throw new Error(`Failed to update winner`);
    }

    const data: Winner = await response.json();
    return data;
  }
}
