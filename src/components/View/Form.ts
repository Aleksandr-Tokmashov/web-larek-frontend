import { Component } from '../base/Component';
import { IEvents } from '../base/events';

interface IModalForm {
	valid: boolean;
	inputValues: Record<string, string>;
	error: Record<string, string>;
}

export class Form extends Component<IModalForm> {
	protected inputs: NodeListOf<HTMLInputElement>;
	protected _form: HTMLFormElement;
	protected errors: HTMLElement;
	protected formName: string;
	protected submitButton: HTMLButtonElement;
    protected events: IEvents;

    constructor (container: HTMLElement, events: IEvents) {
        super(container)
        this.events = events;
		this.inputs = this.container.querySelectorAll<HTMLInputElement>('.form__input');
		this._form = this.container as HTMLFormElement;
		this.formName = this._form.getAttribute('name');
		this.submitButton = this._form.querySelector('.modal__actions .button');
		this.errors = this._form.querySelector(`.form__errors`);

		this._form.addEventListener('submit', (evt) => {
			evt.preventDefault();
			this.events.emit(`${this.formName}:submit`, this.getInputValues());
		});
		this._form.addEventListener('input', (event: InputEvent) => {
			const target = event.target as HTMLInputElement;
			const field = target.name;
			const value = target.value;
			this.events.emit(`${this.formName}:input`, { field, value });
		});
	}

	protected getInputValues() {
		const valuesObject: Record<string, string> = {};
		this.inputs.forEach((element) => {
			valuesObject[element.name] = element.value;
		});
		return valuesObject;
	}

	set inputValues(data: Record<string, string>) {
		this.inputs.forEach((element) => {
			element.value = data[element.name];
		});
	} 

	set error(validInformation: string) {
		if (validInformation) {
			this.showInputError(validInformation);
		} else {
			this.hideInputError();
		}
	}

	protected showInputError(errorMessage: string) {
		this.errors.textContent = errorMessage;
	}

	protected hideInputError() {
		this.errors.textContent = '';
	}

	set valid(isValid: boolean) {
		this.submitButton.disabled = !isValid;
	}

	get form() {
		return this._form;
	}
}

export class OrderForm extends Form {
    protected orderButtons: NodeListOf<HTMLButtonElement>;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        this.orderButtons = this.container.querySelectorAll<HTMLButtonElement>('.button_alt');

        this.orderButtons.forEach((button) => {
            button.addEventListener('click', (event) => {
                this.changePayment()
                const target = event.target as HTMLButtonElement;
                const field = 'payment';
                const value = target.textContent;
                this.events.emit(`${this.formName}:input`, { field, value });}
                
            )
        })
        this.orderButtons[0].classList.toggle('button_alt-active');
        this.submitButton.addEventListener('click', (evt) => {
            evt.preventDefault();
            this.events.emit('contactsForm:open')
        })
    }

    changePayment() {
        this.orderButtons.forEach((button) => {
            button.classList.toggle('button_alt-active');
        })
    }
   
}

export class ContactsForm extends Form {
    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        
        this.submitButton.addEventListener('click', (evt) => {
            evt.preventDefault();
            this.events.emit('success:open')
        })
    }
}