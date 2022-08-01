import Cookie from 'js-cookie';
import { FC, useEffect, useReducer } from 'react';
import { ICartProduct } from '../../interfaces';
import { CartContext, cartReducer } from './';

export interface CartState {
   isCartLoaded: boolean;
   cart: ICartProduct[];
   numberOfProducts: number;
   subTotal: number;
   tax: number;
   total: number;
   shippingAddress?: ShipingAddress;
}

export interface ShipingAddress {
   firstName: string;
   lastName: string;
   address: string;
   address2?: string;
   zip: string;
   city: string;
   country: string;
   phone: string;
}

const CART_INITIAL_STATE: CartState = {
   isCartLoaded: false,
   cart: [],
   numberOfProducts: 0,
   subTotal: 0,
   tax: 0,
   total: 0,
   shippingAddress: undefined,
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
      const addressFromCookies = Cookie.get('addressFormData')
         ? JSON.parse(Cookie.get('addressFormData')!)
         : {
              firstName: '',
              lastName: '',
              address: '',
              address2: '',
              zip: '',
              city: '',
              country: '',
              phone: '',
           };
      dispatch({ type: '[Cart] - Load address from cookies', payload: addressFromCookies });
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
   const updateShippingAddress = (address: ShipingAddress) => {
      const addressFormData = {
         firstName: address.firstName,
         lastName: address.lastName,
         address: address.address,
         address2: address.address2,
         zip: address.zip,
         city: address.city,
         country: address.country,
         phone: address.phone,
      };

      Cookie.set('addressFormData', JSON.stringify(addressFormData));
      dispatch({ type: '[Cart] - Update shipping address', payload: address });
   };

   return (
      <CartContext.Provider
         value={{
            ...state,

            // Methods
            addProductToCart,
            updateCartQuantity,
            removeCartProduct,
            updateShippingAddress,
         }}
      >
         {children}
      </CartContext.Provider>
   );
};
