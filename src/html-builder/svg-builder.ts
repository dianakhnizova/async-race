export class SvgHTMLBuilder {
  public createSVGButton(
    classname: string,
    isDisabled: boolean,
    onClick?: (event: Event) => void | Promise<void>,
  ): HTMLButtonElement {
    const svgButton = document.createElement('button');
    svgButton.classList.add(classname);
    svgButton.disabled = isDisabled;
    if (onClick) {
      svgButton.addEventListener('click', (event: Event): void => {
        void onClick(event);
      });
    }

    return svgButton;
  }

  public createSVGCar(classname: string, color: string): SVGSVGElement {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add(classname);
    svg.setAttribute('width', '80px');
    svg.setAttribute('height', '80px');
    svg.setAttribute('viewBox', '0 0 50 50');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute(
      'd',
      'M5.96875 5C4.332031 5 3 6.355469 3 8L3 24.40625C2.605469 24.679688 2.214844 24.96875 1.84375 25.28125C1.398438 25.65625 1.34375 26.335938 1.71875 26.78125C2.09375 27.226563 2.773438 27.277344 3.21875 26.90625C5.757813 24.769531 8.964844 23.59375 12.28125 23.59375C20.066406 23.59375 26.40625 29.933594 26.40625 37.71875C26.40625 38.300781 26.886719 38.75 27.46875 38.75C28.050781 38.75 28.5 38.300781 28.5 37.71875C28.5 37.480469 28.480469 37.238281 28.46875 37L42.96875 37C44.484375 37 46.429688 35.605469 46.96875 34.125L49.875 26.1875C50.125 25.5 50.035156 24.804688 49.625 24.21875C49.109375 23.484375 48.105469 23 47.0625 23L28.78125 23L24.65625 7.78125C24.292969 6.066406 23.140625 5 21.6875 5 Z M 41 9.9375C36.585938 9.9375 33.9375 12.503906 33.9375 16.8125L33.9375 21L40.0625 21L40.0625 17C40.0625 14.65625 40.746094 14.089844 40.9375 14.0625C41.226563 14.082031 41.503906 13.980469 41.71875 13.78125C41.933594 13.582031 42.0625 13.292969 42.0625 13L42.0625 11C42.0625 10.417969 41.582031 9.9375 41 9.9375 Z M 8 10L20.46875 10L22.90625 19L8 19 Z M 12 26C5.382813 26 0 31.382813 0 38C0 44.617188 5.382813 50 12 50C18.617188 50 24 44.617188 24 38C24 31.382813 18.617188 26 12 26 Z M 12 33.5C14.480469 33.5 16.5 35.519531 16.5 38C16.5 40.480469 14.480469 42.5 12 42.5C9.519531 42.5 7.5 40.480469 7.5 38C7.5 35.519531 9.519531 33.5 12 33.5 Z M 45.96875 38.09375C45.023438 38.65625 43.960938 39 42.96875 39L41.625 39C42.464844 39.734375 43 40.800781 43 42C43 44.203125 41.203125 46 39 46C36.796875 46 35 44.203125 35 42C35 40.800781 35.535156 39.734375 36.375 39L31.59375 39C31.210938 39.9375 31 40.949219 31 42C31 46.410156 34.589844 50 39 50C43.410156 50 47 46.410156 47 42C47 40.609375 46.636719 39.277344 45.96875 38.09375Z',
    );
    path.setAttribute('fill', color);

    g.append(path);
    svg.append(g);

    return svg;
  }

  public createSVGFinish(classname: string, color: string): SVGSVGElement {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add(classname);
    svg.setAttribute('width', '80px');
    svg.setAttribute('height', '80px');
    svg.setAttribute('viewBox', '0 0 32 32');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute(
      'd',
      'M26.5,4.8c-0.3-0.2-0.7-0.2-1,0c-3.5,2.2-6.1,0.8-9-0.8c-3-1.6-6.5-3.4-11-0.7C5.2,3.6,5,3.9,5,4.3V18v0.3V29 c0,0.6,0.4,1,1,1s1-0.4,1-1V18.9c3.3-1.8,5.7-0.5,8.5,1c1.9,1,4,2.1,6.4,2.1c1.4,0,3-0.4,4.6-1.4c0.3-0.2,0.5-0.5,0.5-0.9v-14 C27,5.3,26.8,5,26.5,4.8z',
    );
    path.setAttribute('fill', color);

    g.append(path);
    svg.append(g);

    return svg;
  }
}
