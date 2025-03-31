import { configureStore } from "@reduxjs/toolkit";

import AccountAuthReducer from "./AuthReducer/AuthSlice"
import CategoryReducer from "./CategoryReducer/CategorySlice"

export const store = configureStore({
    reducer:{
        Account: AccountAuthReducer,
        Category:CategoryReducer
    }
})