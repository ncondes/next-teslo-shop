import { createContext } from 'react';
import { ICartProduct } from '../../interfaces';
import { ShipingAddress } from './';

interface ContextProps {
   isCartLoaded: boolean;
   cart: ICartProduct[];
   numberOfProducts: number;
   subTotal: number;
   tax: number;
   total: number;

   shippingAddress?: ShipingAddress;

   // Methods
   addProductToCart: (product: ICartProduct) => void;
   updateCartQuantity: (product: ICartProduct) => void;
   removeCartProduct: (product: ICartProduct) => void;
   updateShippingAddress: (address: ShipingAddress) => void;
}

export const CartContext = createContext({} as ContextProps);
