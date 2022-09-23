import { createContext, useReducer } from "react";
import Cookies from "js-cookie";

export const Store = createContext();

const initialState = {
  // Cookies stores String, not objects. So if it exists, convert it into an Object for usage
  cart: Cookies.get("cart")
    ? JSON.parse(Cookies.get("cart"))
    : { cartItems: [] },
};

function reducer(state, action) {
  switch (action.type) {
    case "CART_ADD_ITEM": {
      const newItem = action.payload;
      const existingItem = state.cart.cartItems.find(
        (item) => item.slug === newItem.slug
      );
      const cartItems = existingItem
        ? state.cart.cartItems.map((item) =>
            item.name === existingItem.name ? newItem : item
          )
        : [...state.cart.cartItems, newItem];

      // Set the updated state in the Cookies for storage under 'cart' key
      Cookies.set("cart", JSON.stringify({ ...state.cart, cartItems }));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case "CART_REMOVE_ITEM": {
      const itemToRemove = action.payload;
      const cartItems = state.cart.cartItems.filter(
        (item) => item.slug !== itemToRemove.slug
      );
      // Set the updated state in the Cookies for storage under 'cart' key
      Cookies.set("cart", JSON.stringify({ ...state.cart, cartItems }));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case "CART_EMPTY": {
      return { ...state, cart: { ...state.cart, cartItems: [] } };
    }
    default:
      return state;
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };

  return <Store.Provider value={value}>{children}</Store.Provider>;
}
