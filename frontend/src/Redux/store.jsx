import { configureStore } from "@reduxjs/toolkit";

import AccountAuthReducer from "./AuthReducer/AuthSlice"

export const store = configureStore({
    reducer:{
        Account: AccountAuthReducer,
    }
})