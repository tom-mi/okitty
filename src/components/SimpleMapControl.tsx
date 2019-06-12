import Control from "ol/control/Control";

export default class SimpleMapControl extends Control {

    constructor(html: string, position: [number, number], onClick: (() => void), className: string = '') {
        super({
            element: document.createElement('div'),
        });
        const button = document.createElement('button');
        button.innerHTML = html;
        this.element.className = `ol-control ${className}`;
        this.element.style.left = `${(position[0] * 1.6) + 0.5}em`;  // TODO this is not perfect
        this.element.style.top = `${(position[1] * 1.6) + 0.5}em`;
        this.element.appendChild(button);
        this.element.addEventListener('click', onClick);
    }

    setVisibility = (visible: boolean): void => {
        this.element.style.visibility = visible ? 'visible' : 'hidden';
    }
}
