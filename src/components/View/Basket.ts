import { IEvents } from '../base/events';
import { Component } from '../base/Component';

interface IBasket {
    items: HTMLElement[];
    totalPrice: HTMLElement;
}

export class Basket extends Component<IBasket> {
    protected _items: HTMLElement[];
    protected basketList: HTMLUListElement;
    protected _totalPrice: HTMLElement;
    protected orderButton: HTMLButtonElement;
    protected events: IEvents;
	  
	constructor(protected container: HTMLTemplateElement, events: IEvents) {
		super(container);
		this.events = events;

		this.basketList = this.container.querySelector('.basket__list');
        this._totalPrice = this.container.querySelector('.basket__price');
        this.orderButton = this.container.querySelector('.basket__button');

        this.orderButton.addEventListener('click', () => {
			this.events.emit('orderForm:open')})
	}

	set items(items: HTMLElement[]) {
        this.basketList.replaceChildren(...items);
        const indexes = this.basketList.querySelectorAll('.basket__item-index');
        for (let i = 0; i < indexes.length; i++) {
           indexes[i].textContent = (i+1).toString()
        }
    }

	set totalPrice(price: number) {
		this._totalPrice.textContent = `${price.toString()} синапсов`
	}

    set valid(isValid: boolean) {
		this.orderButton.disabled = !isValid;
	}

}