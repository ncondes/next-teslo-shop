import { ICartProduct, ShippingAddress } from '../../interfaces';
import { CartState } from './';

type CartActionType =
   | { type: '[Cart] - Load Cart from cookies | storage'; payload: ICartProduct[] }
   | { type: '[Cart] - Load address from cookies'; payload: ShippingAddress }
   | { type: '[Cart] - Update shipping address'; payload: ShippingAddress }
   | { type: '[Cart] - Update Cart'; payload: ICartProduct[] }
   | { type: '[Cart] - Modify Cart quantity'; payload: ICartProduct }
   | { type: '[Cart] - Remove product'; payload: ICartProduct }
   | {
        type: '[Cart] - Update order summary';
        payload: {
           numberOfProducts: number;
           subTotal: number;
           tax: number;
           total: number;
        };
     }
   | { type: '[Cart] - Order Complete' };

export const cartReducer = (state: CartState, action: CartActionType): CartState => {
   switch (action.type) {
      case '[Cart] - Load Cart from cookies | storage':
         return {
            ...state,
            isCartLoaded: true,
            cart: [...action.payload],
         };
      case '[Cart] - Update shipping address':
      case '[Cart] - Load address from cookies':
         return {
            ...state,
            shippingAddress: action.payload,
         };
      case '[Cart] - Update Cart':
         return {
            ...state,
            cart: [...action.payload],
         };
      case '[Cart] - Modify Cart quantity':
         return {
            ...state,
            cart: state.cart.map((product) => {
               if (product._id !== action.payload._id) return product;
               if (product.size !== action.payload.size) return product;

               // return updated product
               return action.payload;
            }),
         };
      case '[Cart] - Remove product':
         return {
            ...state,
            cart: state.cart.filter(
               (product) => !(product._id === action.payload._id && product.size === action.payload.size)
            ),
         };
      case '[Cart] - Update order summary':
         return {
            ...state,
            ...action.payload,
         };
      case '[Cart] - Order Complete':
         return {
            ...state,
            cart: [],
            numberOfProducts: 0,
            subTotal: 0,
            tax: 0,
            total: 0,
         };

      default:
         return state;
   }
};
