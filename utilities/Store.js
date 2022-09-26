import { createContext, useReducer } from "react";
import Cookies from "js-cookie";

export const Store = createContext();

const initialState = {
  // Cookies stores String, not objects. So if it exists, convert it into an Object for usage
  cart: Cookies.get("cart")
    ? JSON.parse(Cookies.get("cart"))
    : {
        cartItems: [],
        shippingAddress: {
          location: {},
        },
        paymentMethod: "",
      },
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
    case "CART_RESET": {
      return {
        ...state,
        cart: {
          cartItems: [],
          shippingAddress: {
            location: {},
          },
          paymentMethod: "",
        },
      };
    }
    case "CART_EMPTY": {
      return { ...state, cart: { ...state.cart, cartItems: [] } };
    }
    case "SAVE_SHIPPING_ADDRESS": {
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: {
            ...state.cart.shippingAddress,
            location: {
              ...state.cart.shippingAddress.location,
              ...action.payload,
            },
          },
        },
      };
    }
    case "SAVE_PAYMENT_METHOD": {
      return {
        ...state,
        cart: {
          ...state.cart,
          paymentMethod: action.payload,
        },
      };
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
