type Page = {
  render(): void;
};

type Car = {
  id: number;
  name: string;
  color: string;
};

type InputProps = {
  classname: string;
  isDisabled: boolean;
  value: string;
  placeholder: string;
  onInput: (event: Event) => void;
  type?: 'text' | 'number' | 'color';
};

type EngineState =
  | {
      velocity: number;
      distance: number;
    }
  | { success: true };

type Winner = {
  id: number;
  wins: number;
  time: number;
};

export { Page, Car, InputProps, EngineState, Winner };
