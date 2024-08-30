import { Product } from './product.model';

export interface Cart {
    userName: string;          // Id dell'utente proprietario del carrello
    products: Product[];    // Elenco di articoli nel carrello
    totalPrice: number;
    date: Date      // Prezzo totale del carrello
}
