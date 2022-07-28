import Cookie from 'js-cookie';
import { FC, useEffect, useReducer } from 'react';
import { ICartProduct } from '../../interfaces';
import { CartContext, cartReducer } from './';

export interface CartState {
   cart: ICartProduct[];
   numberOfProducts: number;
   subTotal: number;
   tax: number;
   total: number;
}

const CART_INITIAL_STATE: CartState = {
   cart: [],
   numberOfProducts: 0,
   subTotal: 0,
   tax: 0,
   total: 0,
};

export const CartProvider: FC = ({ children }) => {
   const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

   useEffect(() => {
      try {
         const cartFromCookies = Cookie.get('cart') ? JSON.parse(Cookie.get('cart')!) : [];
         dispatch({ type: '[Cart] - Load Cart from cookies | storage', payload: cartFromCookies });
      } catch (error) {
         dispatch({ type: '[Cart] - Load Cart from cookies | storage', payload: [] });
      }
   }, []);

   useEffect(() => {
      Cookie.set('cart', JSON.stringify(state.cart));
   }, [state.cart]);

   useEffect(() => {
      const subTotal = state.cart.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
      const orderSummary = {
         numberOfProducts: state.cart.reduce((acc, curr) => acc + curr.quantity, 0),
         subTotal,
         tax: subTotal * Number(process.env.NEXT_PUBLIC_TAX_RATE || 0),
         total: subTotal * (Number(process.env.NEXT_PUBLIC_TAX_RATE || 0) + 1),
      };

      dispatch({ type: '[Cart] - Update order summary', payload: orderSummary });
   }, [state.cart]);

   const addProductToCart = (product: ICartProduct) => {
      let cartUpdated = [...state.cart];

      const productWithSameIdAndSizeIndex = state.cart.findIndex(
         ({ _id, size }) => _id === product._id && size === product.size
      );

      // Check if there is a product with same id and size
      productWithSameIdAndSizeIndex >= 0
         ? (cartUpdated[productWithSameIdAndSizeIndex].quantity += product.quantity)
         : (cartUpdated = [...cartUpdated, product]);

      dispatch({ type: '[Cart] - Update Cart', payload: cartUpdated });
   };

   const updateCartQuantity = (product: ICartProduct) => {
      dispatch({ type: '[Cart] - Modify Cart quantity', payload: product });
   };

   const removeCartProduct = (product: ICartProduct) => {
      dispatch({ type: '[Cart] - Remove product', payload: product });
   };

   return (
      <CartContext.Provider
         value={{
            ...state,

            // Methods
            addProductToCart,
            updateCartQuantity,
            removeCartProduct,
         }}
      >
         {children}
      </CartContext.Provider>
   );
};
