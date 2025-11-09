import { HtmlBuilder } from '../../html-builder/html-builder';
import { messages } from './messages';

export class TitleWinnerBuilder extends HtmlBuilder {
  public titleRender = (totalCount: number, page: number): HTMLDivElement => {
    const titleContainer = this.createDiv('title-container');
    const numberPageContainer = this.createDiv('number-container');
    const titleMainContainer = this.createDiv('title-main-container');

    const titleGarage = this.createTitle('title-main', messages.winnerTitle);
    const numberCars = this.createParagraph('title-main', totalCount);

    const titlePage = this.createTitle('title-main', messages.pageTitle);
    titlePage.classList.add('title-page');

    const numberPage = this.createParagraph('title-main', page);
    numberPage.classList.add('title-page');

    numberPageContainer.append(titlePage, numberPage);
    titleContainer.append(titleGarage, numberCars);
    titleMainContainer.append(titleContainer, numberPageContainer);

    return titleMainContainer;
  };
}
