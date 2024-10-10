import { IEvents } from '../base/events';
import { IProduct } from '../../types';
import { Component } from '../base/Component';
import { CDN_URL } from '../../utils/constants';

export abstract class Card extends Component<IProduct> {
	protected events: IEvents;
	protected cardTitle: HTMLElement;
	protected cardPrice: HTMLElement;
	protected cardId: string;
	protected cardData: Partial<IProduct>;
	protected _categoryColor = <Record<string, string>> {
		"софт-скил": "soft",
		"хард-скил": "hard",
		"кнопка": "button",
		"дополнительное": "additional",
		"другое": "other",
	  }
	  
	constructor(protected container: HTMLTemplateElement, events: IEvents) {
		super(container);
		this.events = events;

		this.cardTitle = this.container.querySelector('.card__title');
		this.cardPrice = this.container.querySelector('.card__price');
	}

	render(data?: Partial<IProduct>): HTMLElement;
	render(cardData: Partial<IProduct>): HTMLElement;

	render(cardData: Partial<IProduct> | undefined) {
		if (!cardData) return this.container;
		this.cardData = cardData;

		return super.render(cardData)
	};

	deleteCard() {
		this.container.remove();
		this.container = null;
	}

	set price(price: number | null) {
		if (price === null) {
			this.cardPrice.textContent = 'Бесценно'
		} else {
			this.cardPrice.textContent = `${price.toString()} синапсов`
		}
		
	}

	set title(title: string) {
		this.cardTitle.textContent = title
	}

	set id(id) {
		this.cardId = id;
	}

	get id() {
		return this.cardId;
	}
}

export class CardInCatalog extends Card {
	protected cardCategory: HTMLElement;
	protected cardImage: HTMLImageElement;
	protected catalogItemButton: HTMLButtonElement;

	constructor(template: HTMLTemplateElement, events: IEvents) {
		super(template, events)
		this.cardCategory = this.container.querySelector('.card__category');
		this.cardImage = this.container.querySelector('.card__image');

		this.container.addEventListener('click', () => {
			this.events.emit('card:select', { id: this.cardId })})
	}

	set category(category: string) {
		this.cardCategory.textContent = category;
		this.cardCategory.className = `card__category card__category_${this._categoryColor[category]}`
	}

	set image(link: string) {
		this.cardImage.src = `${CDN_URL}${link}`
	}

	set title(title: string) {
		this.cardTitle.textContent = title;
		this.cardImage.alt = title
	}
}

export class CardPreview extends Card {
	protected cardCategory: HTMLElement;
	protected cardImage: HTMLImageElement;
	protected cardDescription: HTMLElement;
	protected addToBasketButton: HTMLButtonElement;

	constructor(template: HTMLTemplateElement, events: IEvents) {
		super(template, events)
		this.cardCategory = this.container.querySelector('.card__category');
		this.cardImage = this.container.querySelector('.card__image');
		this.cardDescription = this.container.querySelector('.card__text');
		this.addToBasketButton = this.container.querySelector('.card__button');

		this.addToBasketButton.addEventListener('click', () => 
			this.events.emit('product:select', { id: this.cardId }))
	}

	set category(category: string) {
		this.cardCategory.textContent = category;
		this.cardCategory.className = `card__category card__category_${this._categoryColor[category]}`
	}

	set image(link: string) {
		this.cardImage.src = `${CDN_URL}${link}`
	}

	set description(text: string) {
		this.cardDescription.textContent = text
	}
}

export class CardInBasket extends Card {
	protected deleteFromBasketButton: HTMLButtonElement;
	protected cardIndex: HTMLElement;

	constructor(template: HTMLTemplateElement, events: IEvents) {
		super(template, events)
		this.deleteFromBasketButton = this.container.querySelector('.card__button');
		this.cardIndex = this.container.querySelector('.basket__item-index');

		this.deleteFromBasketButton.addEventListener('click', () =>
			this.events.emit('remove-product:submit', { id: this.cardId }))
	}

	set index(index: number) {
		this.cardIndex.textContent = index.toString();
	}
}