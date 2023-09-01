const initialState = {
    loading: false,
    totalQuantity: 0,
    cartItems: []
}

export const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SHOW_LOADING":
            return {
                ...state,
                loading: true,
            };
        case "HIDE_LOADING":
            return {
                ...state,
                loading: false,
            };
        case "ADD_TO_CART":
            const item = state.cartItems.find(product => product._id === action.payload._id)
            if (item) {
                return {
                    ...state,
                    cartItems: state.cartItems.map(product => product._id === action.payload._id ? { ...product, quantity: product.quantity + 1 } : product),
                    totalQuantity: state.totalQuantity + 1,
                };
            }
            return {
                ...state,
                cartItems: [...state.cartItems, action.payload],
                totalQuantity: state.totalQuantity + 1,
            };
        case "INCREASE_QTY":
            return {
                ...state,
                cartItems: state.cartItems.map(product => product._id === action.payload._id ? { ...product, quantity: product.quantity + 1 } : product),
                totalQuantity: state.totalQuantity + 1,
            };
        case "DECREASE_QTY":
            return {
                ...state,
                cartItems: state.cartItems.map(product => product._id === action.payload._id ? { ...product, quantity: product.quantity - 1 } : product),
                totalQuantity: state.totalQuantity - 1,
            };
        case "DELETE_FROM_CART":
            const toDeductQuantity = state.cartItems.find(product => product._id === action.payload._id).quantity
            return {
                ...state,
                cartItems: state.cartItems.filter((product) => product._id !== action.payload._id),
                totalQuantity: state.totalQuantity - toDeductQuantity
            };
        case "RESET_CART":
            return {
                ...state,
                cartItems: [],
                totalQuantity: 0
            }
        default: return state;
    }
}