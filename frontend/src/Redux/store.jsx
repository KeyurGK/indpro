import { configureStore } from "@reduxjs/toolkit";

import AccountAuthReducer from "./AuthReducer/AuthSlice"
import CategoryReducer from "./CategoryReducer/CategorySlice"
import TaskReducer from "./TaskReducer/TaskSlice"

export const store = configureStore({
    reducer:{
        Account: AccountAuthReducer,
        Category:CategoryReducer,
        Task:TaskReducer
    }
})