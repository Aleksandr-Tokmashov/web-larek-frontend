import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';

interface ISuccess {
    successDescription: HTMLElement;
    successButton: HTMLButtonElement
}

export class Success  extends Component<ISuccess >{
    protected _successDescription: HTMLElement;
    protected successButton: HTMLButtonElement
    protected events: IEvents;


    constructor(protected container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;
        this.successButton = this.container.querySelector('.order-success__close');
        this._successDescription = this.container.querySelector('.order-success__description');

        this.successButton.addEventListener('click', () =>
			this.events.emit('success:сlose'))
    }

    set successDescription(totalPrice: number) {
        this._successDescription.textContent = `Списано ${totalPrice} синапсов`
    }
}