export interface IProduct {
  title: string;
  description: string;
  price: number | null;
  category: string;
  image: string;
  id: string;
}

export interface IOrder {
  payment: string;
  email: string;
  phone: string;
  address: string;
}

export interface IProductList {
  total: number;
  items: IProduct[];
  preview: string | null;
  addProductToCart(ProductId: string): void;
}

export interface ICartData {
	items: IProduct[];
	price: number;
  add(id:string): void;
  delete(id: string): void;
  setTotalSum(): number
}

export interface IOrderErrors {
  paymentAndAddresstValidation(data: Record<keyof TPaymentAndAddressInfo, string>): string;
  contactsValidation(data: Record<keyof TContactsInfo, string>): string;
}

export type TPaymentAndAddressInfo = Pick<IOrder, 'payment' | 'address'>;

export type TContactsInfo = Pick<IOrder, 'email' | 'phone'>



