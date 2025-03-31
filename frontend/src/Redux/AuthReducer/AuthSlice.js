
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_KEY } from "../ApiKey/api";
import Cookies from "js-cookie";
const initialState = {
  loading: false,
  error: null,
  isAuthenticated:
    sessionStorage.getItem("isAuthenticated") === "true" ? true : false,
  token: null,
  loggedInfo: null,
  tokenmessage: null,
  successMessage: null,
  AdminprofileModalOpen: false,
};

export const accountLogin = createAsyncThunk(
  "account/login",
  async ({ emailId, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_KEY}/auth/login`,
        { emailId, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      // console.log(response, 'login resss');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

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
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const refreshAccessToken = createAsyncThunk(
  "account/refreshAccessToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_KEY}/auth/refresh-token`,
        {},
        {
          withCredentials: true,
        }
      );
      Cookies.set("access", response?.data?.accessToken, {
              //expires: 1, // 1 day expiry
              // path: "/",
              path: "/",
                      secure: true,
                      sameSite: "Strict",
                      domain: "localhost",
            });
      // console.log(response?.data?.accessToken, 'token responseee');
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Unable to refresh token");
    }
  }
);

const AccountAuthSlice = createSlice({
  name: "Account",
  initialState,
  reducers: {
    toggleProfileModal: (state) => {
      state.AdminprofileModalOpen = !state.AdminprofileModalOpen;
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
      state.loggedInfo = null;
      state.successMessage = "Logged out successfully!";
      state.error = null;
      sessionStorage.setItem("isAuthenticated", "false");
      sessionStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(accountLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(accountLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.loggedInfo = action.payload;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        sessionStorage.setItem("isAuthenticated", "true");
      })
      .addCase(accountLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(accountSignUp.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.token = null;
        state.loggedInfo = null;
        state.successMessage = "Logged out successfully!";
      })
      .addCase(accountSignUp.rejected, (state, action) => {
        state.error = action.payload;
        state.successMessage = null;
        sessionStorage.removeItem("isAuthenticated");
      })
      .addCase(accountSignUp.pending, (state) => {
        state.loading = true;
      });
  },
});

export const { toggleActive, setActive, logoutAndNavigate, toggleProfileModal } =
  AccountAuthSlice.actions;

export default AccountAuthSlice.reducer;
