import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';

interface ICardsContainer {
    catalog: HTMLElement[];
    counter: number;
}

export class Page extends Component<ICardsContainer> {
    protected _catalog: HTMLElement;
    protected basketButton: HTMLButtonElement;
    protected _counter: HTMLElement;
    protected events: IEvents;


    constructor(protected container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;
        this.basketButton = ensureElement<HTMLButtonElement>('.header__basket');
        this._counter = ensureElement<HTMLElement>('.header__basket-counter')

        this.basketButton.addEventListener('click', () =>
			this.events.emit('basket:open'))
    }

    set catalog(items: HTMLElement[]) {
        this.container.replaceChildren(...items);
    }

    set counter(count: number) {
        this._counter.textContent = count.toString()
    }
}