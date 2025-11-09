import { HtmlBuilder } from '../../html-builder/html-builder';
import { messages } from './messages';
import {
  DEFAULT_PLACEHOLDER,
  DEFAULT_COLOR,
  DEFAULT_VALUE_NAME,
} from './constants';
export class UpdateHTMLBuilder extends HtmlBuilder {
  public createTitleInput(
    isDisabled: boolean,
    onInput: (event: Event) => void,
  ): HTMLInputElement {
    const name = this.createInput({
      classname: 'input',
      isDisabled: isDisabled,
      value: DEFAULT_VALUE_NAME,
      placeholder: messages.inputTitle,
      onInput,
      type: 'text',
    });
    return name;
  }

  public createColorInput(
    isDisabled: boolean,
    onInput: (event: Event) => void,
  ): HTMLInputElement {
    const color = this.createInput({
      classname: 'color',
      isDisabled: isDisabled,
      value: DEFAULT_COLOR,
      placeholder: DEFAULT_PLACEHOLDER,
      onInput,
      type: 'color',
    });
    return color;
  }

  public createButtonElement(
    isDisabled: boolean,
    onClick: () => Promise<void>,
  ): HTMLButtonElement {
    const updateButton = this.createButton(
      'update-button',
      messages.updateButton,
      isDisabled,
      onClick,
    );
    return updateButton;
  }
}
