import type { InputProps } from '../source/types';
export class HtmlBuilder {
  public createDiv(classname: string): HTMLDivElement {
    const div = document.createElement('div');
    div.classList.add(classname);
    return div;
  }

  public createTitle(classname: string, title: string): HTMLHeadingElement {
    const titleElement = document.createElement('h1');
    titleElement.classList.add(classname);
    titleElement.textContent = title;

    return titleElement;
  }

  public createButton(
    classname: string,
    buttontext: string,
    isDisabled: boolean,
    onClick: (event: Event) => void | Promise<void>,
  ): HTMLButtonElement {
    const button = document.createElement('button');
    button.classList.add(classname);
    button.textContent = buttontext;
    button.disabled = isDisabled;
    button.addEventListener('click', (event: Event): void => {
      void onClick(event);
    });

    return button;
  }

  public createInput = (props: InputProps): HTMLInputElement => {
    const input = document.createElement('input');
    input.classList.add(props.classname);
    input.disabled = props.isDisabled;
    input.value = props.value;
    input.placeholder = props.placeholder;
    input.type = props.type || 'text';
    input.addEventListener('input', props.onInput);
    return input;
  };

  public createModalElement = (classname: string): HTMLDialogElement => {
    const modalElement = document.createElement('dialog');
    modalElement.classList.add(classname);

    return modalElement;
  };

  public createParagraph = (
    classname: string,
    textContent: number | string,
  ): HTMLParagraphElement => {
    const paragraph = document.createElement('p');
    paragraph.classList.add(classname);
    paragraph.textContent = textContent.toString();
    return paragraph;
  };

  public createSpan = (
    classname: string,
    textContent: number | string,
  ): HTMLSpanElement => {
    const span = document.createElement('span');
    span.classList.add(classname);
    span.textContent = textContent.toString();
    return span;
  };
}
