import './scss/styles.scss';
import { CardsData } from './components/Model/CardsData';
import { OrderData } from './components/Model/OrderData';
import { BasketData } from './components/Model/BasketData';
import { EventEmitter } from './components/base/events';
import { AppApi } from './components/Model/AppApi';
import { API_URL } from './utils/constants';
import { Card, CardInCatalog, CardInBasket, CardPreview } from './components/View/Card';
import { Page } from './components/View/Page';
import { cloneTemplate } from './utils/utils';
import { Modal } from './components/common/Modal';
import { Basket } from './components/View/Basket';
import { Form, OrderForm, ContactsForm } from './components/View/Form';
import { IInputs } from './types';
import { Success } from './components/View/Success';

const events = new EventEmitter();

const api = new AppApi(API_URL)

const cardsData = new CardsData(events);
const orderData = new OrderData(events);
const basketData = new BasketData(events);

const cardInCatalogTemplate: HTMLTemplateElement = document.querySelector('#card-catalog');
const cardPreviewTemplate: HTMLTemplateElement = document.querySelector('#card-preview');
const cardInBasketTemplate: HTMLTemplateElement = document.querySelector('#card-basket');
const basketTemplate: HTMLTemplateElement = document.querySelector('#basket');
const orderTemplate: HTMLTemplateElement = document.querySelector('#order');
const contactsTemplate: HTMLTemplateElement = document.querySelector('#contacts');
const successTemplate: HTMLTemplateElement = document.querySelector('#success');

const page = new Page(document.querySelector('.gallery'), events);

const modalContainer: HTMLElement = document.querySelector('#modal-container');
const previewModal = new Modal(modalContainer, events);

const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), events);
const basketPreview = new Basket(cloneTemplate(basketTemplate), events);
const orderForm = new OrderForm(cloneTemplate(orderTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), events);
const successPreview = new Success(cloneTemplate(successTemplate), events);

const enum Events {
    dataLoaded = 'data:loaded',
    cardSelect = 'card:select',
    productSelect = 'product:select',
    removeProductSubmit = 'remove-product:submit',
    productsChanged = 'products:changed',
    basketOpen = 'basket:open',
    orderFormOpen = 'orderForm:open',
    orderSubmit = 'order:submit',
    contactsSubmit = 'contacts:submit',
    succesClose = 'success:сlose',
    orderInput = 'order:input',
    contactsInput = 'contacts:input',
}

api.getProductList()
    .then(data => {
        cardsData.items = data.items;
        events.emit(Events.dataLoaded)
    })
    .catch(err => {
        console.log(err);
})

events.on(Events.dataLoaded, () => {
    const cardArray = cardsData.items.map((card) => {
        const cardInstant = new CardInCatalog(cloneTemplate(cardInCatalogTemplate), events);
        return cardInstant.render(card)
    });
    page.render({ catalog: cardArray});
})

events.on(Events.cardSelect, (data: { id: string }) => {
    previewModal.content = cardPreview.render(cardsData.getCard(data.id))
    previewModal.open()
})

events.on(Events.productSelect, (data: { id: string }) => {
    basketData.addProduct(cardsData.getCard(data.id))
    previewModal.close()
})

events.on(Events.removeProductSubmit, (data: { id: string }) => {
    basketData.deleteProduct(data.id)
})


events.on(Events.productsChanged, () => {
    basketData.сalculateTotalPrice()
    const cardArray = basketData.items.map((card) => {
        const cardInstant = new CardInBasket(cloneTemplate(cardInBasketTemplate), events);
        return cardInstant.render(card)
    });
    
    page.render({counter: basketData.count});
    basketPreview.render({ items: cardArray } )
    basketPreview.totalPrice = basketData.totalPrice
    basketPreview.valid = basketData.checkProductsPrice();
})

events.on(Events.basketOpen, () => {
    previewModal.content = basketPreview.render();
    basketPreview.valid = basketData.checkProductsPrice();
    previewModal.open()
})

events.on(Events.orderFormOpen, () => {
    previewModal.content = orderForm.render();
    previewModal.open()
})

events.on(Events.orderSubmit, () => {
    previewModal.content = contactsForm.render();
    previewModal.open()
})

events.on(Events.contactsSubmit, () => {
    const itemsToOrder = basketData.items.filter((item) => {return item.price !== null});
    orderData.items = itemsToOrder.map((item) => {return item.id});
    orderData.total = basketData.totalPrice;
    successPreview.successDescription = orderData.total;
    api.orderProducts(orderData.getData())
        .then((res) => {
            previewModal.content = successPreview.render();
            previewModal.open();

            basketData.clearBasket();
            orderData.clearData();
        })
        .catch((err) =>{
            console.log(err)
        });
    
})

events.on(Events.succesClose, () => {
    previewModal.close()
})


function handleInputEvent(eventType: Events.orderInput | Events.contactsInput, data: { field: keyof IInputs, value: string }) {
    orderData.setField(data.field, data.value);

    let isValid: boolean;
    let form: OrderForm | ContactsForm;

    if (eventType === Events.orderInput) {
        isValid = orderData.validateOrder();
        form = orderForm;
    } else if (eventType === Events.contactsInput) {
        isValid = orderData.validateContacts();
        form = contactsForm;
    } 

    if (!isValid) {
        form.error = 'Необходимо заполнить все поля';
        form.valid = false;
    } else {
        form.error = '';
        form.valid = true;
    }
}

events.on(Events.orderInput, (data: { field: keyof IInputs, value: string }) => {
    handleInputEvent(Events.orderInput, data);
});

events.on(Events.contactsInput, (data: { field: keyof IInputs, value: string }) => {
    handleInputEvent(Events.contactsInput, data);
});