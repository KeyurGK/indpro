import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_KEY } from "../ApiKey/api";

const initialState = {
  loading: false,
  error: null,
  // isAuthenticated: false,
  isAuthenticated:
    sessionStorage.getItem("isAuthenticated") === "true" ? true : false,
  token: null,
  loggedInfo: [],
  tokenmessage: null,
  successMessage: null, // Add this
  AdminprofileModalOpen:false
};


export const accountLogin = createAsyncThunk(
    "account/login",
    async ({ emailId, password }, { rejectWithValue }) => {
      try {
        const response = await axios.post(`${API_KEY}/auth/login`, {
          emailId, password
        }, {
          headers: { "Content-Type": "application/json" },
        });
//   console.log(response,'inside slice');
//   if(response.data.success){
//     await Cookies.set("accessToken", response.data.accessToken, { 
//         expires: 1, // 1 day expiry
//         secure: true, // Prevent XSS attacks
//         sameSite: "Strict",
//       });
//   }
        
       
  
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );
//account signup
export const accountSignUp = createAsyncThunk(
    "account/signUp",
    async ({ firstName, lastName, emailId, password }, { rejectWithValue }) => {
      try {
        const response = await axios.post(
          `${API_KEY}/auth/signUp`,
          {
            firstName,
            lastName,
            emailId,
            password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        return response.data; // API response
      } catch (error) {
        return rejectWithValue(
          error.response ? error.response.data : error.message
        );
      }
    }
  );



const AccountAuthSlice = createSlice({
  name: "Account",
  initialState,
  reducers: {
    toggleProfileModal: (state) => {
      state.AdminprofileModalOpen = !state.AdminprofileModalOpen; // Toggle modal state
    },
    toggleActive(state) {
      state.Active = !state.Active;
    },
    setActive(state, action) {
      state.Active = action.payload;
    },
    logoutAndNavigate(state) {
      state.isAuthenticated = false;
      state.token = null;
      state.loggedInfo = [];
      state.successMessage = "Logged out successfully!";
      state.error = null;
      sessionStorage.setItem("isAuthenticated", "false");
      sessionStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder


      //  Amdin Login
      .addCase(accountLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(accountLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        sessionStorage.setItem("isAuthenticated", "true");
      })
      .addCase(accountLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //  admin logout
      .addCase(accountSignUp.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.token = null;
        state.loggedInfo = [];
        state.successMessage = "Logged out successfully!"; // Only handle this once
      })
      .addCase(accountSignUp.rejected, (state, action) => {
        state.error = action.payload;
        state.successMessage = null;
        // Clear sessionStorage on logout
        sessionStorage.removeItem("isAuthenticated");
      })
      //  get logged info for user logged in
      .addCase(accountSignUp.pending, (state) => {
        state.loading = true;
      })
      
      
  },
});

export const { toggleActive, setActive, logoutAndNavigate,toggleProfileModal } =
  AccountAuthSlice.actions;

export default AccountAuthSlice.reducer;