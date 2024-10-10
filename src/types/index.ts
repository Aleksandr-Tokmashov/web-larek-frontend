export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number
}

export interface IProductList {
  total: number;
  items: IProduct[]
}

export interface ICardsData {
  items: IProduct[];
  preview: string | null;
} 

export interface IInputs {
  payment: string;
  address: string;
  email: string;
  phone: string;
}

export interface IOrder extends IInputs {
  total: number;
  items: string[];
}

export interface IOrderResult {
  id: string;
  total: number;
}

export interface IOrderData {
  clearData(): void;
  getData(): IOrder;
  setItems(products: IProduct[]): void;
  setField(field: keyof IInputs, value: string): void;
  validateOrder(): boolean;
  validateContacts(): boolean;
  checkValidation(data: TPayment | TContacts): boolean;
  checkField(value: string): boolean;
}

export interface IBasketData {
  items: IProduct[];
  totalPrice: number;
  addProduct(product: IProduct): void;
  deleteProduct(id: string): void;
  clearBasket(): void;
}

export type TCard = Omit<IProduct, '_id'>;

export type TPayment = Pick<IInputs, 'payment' | 'address'>;

export type TContacts = Pick<IInputs, 'email' | 'phone'>;
