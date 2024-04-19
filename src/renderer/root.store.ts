import { combineReducers, configureStore  } from "@reduxjs/toolkit";
export interface StateType {
    isLogedIn: boolean,
    user: {
        id:number|null
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
    config: any
} 
const initialState:StateType= {
    isLogedIn: false,
    user: {
        id: null,
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
    config: {
        id: null,
        shopName: '',
        shopAddress: '',
        lang: 'ENG',
        phone: '',
        phone2: ''
    }
};
export enum Actions{
    LOGIN='LOGIN',
    SET_PRODUCTS='SET_PRODUCTS',
    SET_CATEGORIES='SET_CATEGORIES',
    ADD_TO_CART='ADD_TO_CART',
    EMPTY_CART='EMPTY_CART',
    REMOVE_FROM_CART='REMOVE_FROM_CART',
    UPDATE_CART='UPDATE_CART',
    LOGOUT='LOGOUT',
    SET_CONFIG='SET_CONFIG',
}
export const actions = {
    setConfig:(data)=>{
        return data;
    }
}
const user = localStorage.getItem('user');
if(user){
    initialState.user = JSON.parse(user);
    initialState.isLoading = false;
    initialState.isLogedIn = true;
}
const rootState = (state = initialState, action) => {
    switch (action.type) {
        case Actions.LOGIN:
            localStorage.setItem('user', JSON.stringify(action.payload.user))
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
        case Actions.SET_CONFIG:
        return {
            ...state,
            config: action.payload.config
        };
        case Actions.LOGOUT:
            localStorage.removeItem('user')
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