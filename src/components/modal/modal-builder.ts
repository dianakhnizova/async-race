import { HtmlBuilder } from '../../html-builder/html-builder';
import { messages } from './messages';

export class ModalBuilder extends HtmlBuilder {
  private titleContainer = this.createDiv('modal-title-container');

  public createModal(
    onClose: (modalElement: HTMLDialogElement) => void,
  ): HTMLDialogElement {
    const modalElement = this.createModalElement('modal-dialog');
    const modalContent = this.createDiv('modal-content');

    const buttonModalContainer = this.createDiv('btn-container');
    const okButton = this.createButton(
      'option-button',
      messages.okButton,
      false,
      () => {
        onClose(modalElement);
      },
    );

    buttonModalContainer.append(okButton);
    modalContent.append(this.titleContainer, buttonModalContainer);
    modalElement.append(modalContent);

    modalElement.addEventListener('click', (event: Event) => {
      if (event.target === modalElement) {
        onClose(modalElement);
      }
    });

    return modalElement;
  }

  public winnerModalContent(carName: string, raceTime: number): void {
    this.titleContainer.replaceChildren();

    const title = this.createTitle('modal-text', 'Winner: ');
    this.titleContainer.append(title);

    const name = this.createParagraph('modal-text', `Car: ${carName}`);
    this.titleContainer.append(name);

    const time = this.createParagraph('modal-text', `Time: ${raceTime} sec`);
    this.titleContainer.append(time);
  }

  public errorModalContent(): void {
    this.titleContainer.replaceChildren();
    const title = this.createTitle('modal-text', 'No Winners! ');
    this.titleContainer.append(title);
  }
}
