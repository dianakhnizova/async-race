import { ModalBuilder } from './modal-builder';

export class Modal {
  private modalHtmlBuilder: ModalBuilder;
  constructor() {
    this.modalHtmlBuilder = new ModalBuilder();
  }

  public okButton = (modalElement: HTMLDialogElement): void => {
    modalElement.close();
    modalElement.remove();
    document.body.style = 'overflow: none';
  };

  public modalOpen(): HTMLDialogElement {
    const modalElement = this.modalHtmlBuilder.createModal(this.okButton);

    document.body.style = 'overflow: hidden';
    const closeOnEsc = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        this.okButton(modalElement);
        document.removeEventListener('keydown', closeOnEsc);
      }
    };

    document.addEventListener('keydown', closeOnEsc);
    return modalElement;
  }

  public winnerModalContent(carName: string, raceTime: number): void {
    this.modalHtmlBuilder.winnerModalContent(carName, raceTime);
  }

  public errorModalContent(): void {
    this.modalHtmlBuilder.errorModalContent();
  }
}
