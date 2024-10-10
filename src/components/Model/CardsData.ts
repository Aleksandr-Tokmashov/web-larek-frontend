import { IProduct, ICardsData } from "../../types";
import { IEvents } from "../base/events";

export class CardsData implements ICardsData {
    protected _items: IProduct[] = [];
    protected _preview: string | null;
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }
    
    set items(items: IProduct[]) {
        this._items = items;
        this.events.emit('cards:changed')
    }

    get items() {
        return this._items
    }

    getCard(cardId: string) {
        return this._items.find((item) => item.id === cardId)
    }

    set preview(cardId: string | null) {
        if (!cardId) {
            this._preview = null;
            return;
        }
        const selectedCard = this.getCard(cardId);
        if (selectedCard) {
            this._preview = cardId;
            this.events.emit('card:selected')
        }
    }

    get preview() {
        return this._preview;
    }
}