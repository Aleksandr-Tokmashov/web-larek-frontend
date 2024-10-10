import './scss/styles.scss';
import { CardsData } from './components/Model/CardsData';
import { OrderData } from './components/Model/OrderData';
import { BasketData } from './components/Model/BasketData';
import { EventEmitter } from './components/base/events';
import { AppApi } from './components/Model/AppApi';
import { API_URL } from './utils/constants';
import { Card, CardInCatalog, CardInBasket, CardPreview } from './components/View/Card';
import { testProductList } from './utils/tempConstants';
import { Page } from './components/View/Page';
import { cloneTemplate } from './utils/utils';
import { Modal } from './components/common/Modal';
import { Basket } from './components/View/Basket';
import { Form, OrderForm, ContactsForm } from './components/View/Form';
import { IInputs } from './types';
import { Component } from './components/base/Component';
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

api.getProductList()
    .then(data => {
        cardsData.items = data.items;
        events.emit('data:loaded')
    })
    .catch(err => {
        console.log(err);
})

events.on('data:loaded', () => {
    const cardArray = cardsData.items.map((card) => {
        const cardInstant = new CardInCatalog(cloneTemplate(cardInCatalogTemplate), events);
        return cardInstant.render(card)
    });
    page.render({ catalog: cardArray});
})

events.on('card:select', (data: { id: string }) => {
    previewModal.content = cardPreview.render(cardsData.getCard(data.id))
    previewModal.open()
})

events.on('product:select', (data: { id: string }) => {
    basketData.addProduct(cardsData.getCard(data.id))
    previewModal.close()
})

events.on('remove-product:submit', (data: { id: string }) => {
    basketData.deleteProduct(data.id)
})


events.on('products:changed', () => {
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

events.on('basket:open', () => {
    previewModal.content = basketPreview.render();
    basketPreview.valid = basketData.checkProductsPrice();
    previewModal.open()
})

events.on('orderForm:open', () => {
    previewModal.content = orderForm.render();
    previewModal.open()
})

events.on('contactsForm:open', () => {
    previewModal.content = contactsForm.render();
    previewModal.open()
})

events.on('success:open', () => {
    const itemsToOrder = basketData.items.filter((item) => {return item.price !== null});
    orderData.items = itemsToOrder.map((item) => {return item.id});
    orderData.total = basketData.totalPrice;
    successPreview.successDescription = orderData.total;
    api.orderProducts(orderData.getData());
    previewModal.content = successPreview.render();
    previewModal.open();

    basketData.clearBasket();
    orderData.clearData();
})

events.on('success:сlose', () => {
    previewModal.close()
})


function handleInputEvent(eventType: 'order:input' | 'contacts:input', data: { field: keyof IInputs, value: string }) {
    orderData.setField(data.field, data.value);

    let isValid: boolean;
    let form: OrderForm | ContactsForm;

    if (eventType === 'order:input') {
        isValid = orderData.validateOrder();
        form = orderForm;
    } else if (eventType === 'contacts:input') {
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

events.on('order:input', (data: { field: keyof IInputs, value: string }) => {
    handleInputEvent('order:input', data);
});

events.on('contacts:input', (data: { field: keyof IInputs, value: string }) => {
    handleInputEvent('contacts:input', data);
});