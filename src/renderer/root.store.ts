import { combineReducers, configureStore  } from "@reduxjs/toolkit";

const initialState:{
    isLogedIn: boolean,
    user: {
        firstName: string,
        lastName: string,
        username: string,
        email: string,
        phone: string,
        role: null|string,
    },
    categories: any[],
    products: any[],
    cartItems: any[],
    isLoading: boolean,
} = {
    isLogedIn: false,
    user: {
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        phone: '',
        role: null,
    },
    categories: [],
    products: [],
    cartItems: [],
    isLoading: false,
};
export enum Actions{
    LOGIN,
    SET_PRODUCTS,
    SET_CATEGORIES,
    ADD_TO_CART,
    EMPTY_CART,
    REMOVE_FROM_CART,
    UPDATE_CART,
    LOGOUT
}
const rootState = (state = initialState, action) => {
    switch (action.type) {
        case Actions.LOGIN:
            return {
                ...state,
                isLoading: false,
                isLogedIn: true,
                user: action.payload.user
            };
        case Actions.SET_PRODUCTS:
            return {
                ...state,
                products: action.payload.products
            };
        case Actions.SET_CATEGORIES:
            return {
                ...state,
                categories: action.payload.categories
            };
        case Actions.ADD_TO_CART:
            return {
                ...state,
                cartItems: [...state.cartItems, action.payload.item]
            };
        case Actions.EMPTY_CART:
            return {
                ...state,
                cartItems: []
            };
        case Actions.REMOVE_FROM_CART:
            return {
                ...state,
                cartItems: state.cartItems.filter((_, index) => index !== action.payload.index)
            };
        case Actions.UPDATE_CART:
            return {
                ...state,
                cartItems: state.cartItems.map((item, index) => index === action.payload.index ? action.payload.item : item)
            };
        case Actions.LOGOUT:
            return {
                ...state,
                isLogedIn: false,
                user: {
                    firstName: '',
                    lastName: '',
                    username: '',
                    email: '',
                    phone: '',
                    role: null,
                }
            };
        default:
            return state;
    }
};

// Combine reducers
const rootReducer = combineReducers({
    rootState: rootState
});

const store = configureStore({
    reducer: rootReducer
});

export default store;