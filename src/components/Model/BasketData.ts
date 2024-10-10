import { IProduct, IBasketData } from "../../types";
import { IEvents } from "../base/events";

export class BasketData implements IBasketData {
    protected _items: IProduct[] = [];
    protected _totalPrice: number = 0;
    protected events: IEvents;
    
    constructor(events: IEvents) {
        this.events = events;
    }
    
    addProduct(product: IProduct) {
        if (!this._items.find(item => product.id === item.id)) {
            this._items.push(product);
            this.events.emit('products:changed')
        }
        
    }

    deleteProduct(id: string) {
        this._items = this._items.filter(item => item.id !== id);
        this.events.emit('products:changed')
    }

    clearBasket() {
        this._items = [];
        this.events.emit('products:changed')
    }

    сalculateTotalPrice() {
        this._totalPrice = this._items.reduce((total, item) => {
            if (item.price !== null && item.price !== undefined) {
                return total + item.price;
            }
            return total;
        }, 0);
        this.events.emit('price:changed')
    }

    checkProductsPrice() {
        return this.totalPrice > 0
    }

    set items(items: IProduct[]) {
        this._items = items;
        this.events.emit('products:changed')
    }

    get totalPrice() {
        return this._totalPrice
    }

    get items(){
        return this._items
    }

    get count() {
        return this._items.length
    }
}