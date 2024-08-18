import { Product } from "./product.model";

export interface SpecialOffer {
    offerId: number | null;
    offerName: string;
    offerDescription: string;
    creationDate: Date;
    product: Product;
  }