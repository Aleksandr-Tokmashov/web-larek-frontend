import { IOrder, IOrderData, TPayment, TContacts, IProduct, IInputs } from "../../types";
import { IEvents } from "../base/events";


export class OrderData implements IOrderData {
    protected payment: string = 'Онлайн';
    protected address: string = '';
    protected email: string = '';
    protected phone: string = '';
    total: number = 0;
    items: string[] = [];
    events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    clearData() {
        this.payment = '';
        this.address = '';
        this.email = '';
        this.phone = '';
        this.total = 0;
        this.items = [];
        this.events.emit('order:changed')
    }

    getData() {
        return {
            payment: this.payment, 
            address: this.address,
            email: this.email,
            phone: this.phone,
            total: this.total,
            items: this.items,
        }
    }

    setItems(products: IProduct[]) {
        products.forEach(item => {
            if (item.price !== null ) {
                this.items.push(item.id)
            }
        });
    }


    setField(field: keyof IInputs, value: string) {
        this[field] = value;
        this.events.emit('order:changed')
      }

    getField(field: keyof IInputs) {
        return this[field]
    }

    validateOrder() {
        return this.checkValidation({payment: this.payment, address: this.address})
    }

    validateContacts() {
        return this.checkValidation({email: this.email, phone: this.phone})
    }
    
    checkValidation(data: TPayment | TContacts) {
        for (let field in data) {
            if (!this.checkField(data[field as keyof (TPayment | TContacts)])) {
                return false
            }
        }
        return true
    }

	checkField(value: string) {
        return value.length > 0
	}

}
