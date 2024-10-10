import { Api, ApiListResponse } from "../base/api";
import { IProduct, IOrder, IOrderResult } from "../../types";

export class AppApi extends Api {
    constructor(baseUrl: string, options?: RequestInit) {
      super(baseUrl, options)
    }
    getProductList() {
      return this.get('/product')
        .then((data: ApiListResponse<IProduct>) => data)
    }
    orderProducts(order: IOrder): Promise<IOrderResult> {
      return this.post('/order', order).then(
          (data: IOrderResult) => data
      );
    }
  }