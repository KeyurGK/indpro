import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../axiosInstance";

const initialState = {
  loading: false,
  error: null,
  categoryList: [],
  isAuthenticated: sessionStorage.getItem("isAuthenticated") === "true",
  token: null,
  successMessage: null,
 
};

// Fetch Category List
export const GetCategoryList = createAsyncThunk(
    "category/GetCategoryList",
    async (token, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.get("master/category/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.data.success) {
          return response.data.data;
        }
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message || "An unknown error occurred");
      }
    }
  );

// Add Category
export const AddCategory = createAsyncThunk(
    "category/AddCategory",
    async (payload, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.post("master/category/add", payload);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message || "An unknown error occurred");
      }
    }
  );

// Update Category
export const UpdateCategory = createAsyncThunk(
  "category/UpdateCategory",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put("/category/update", updatedData);
      return response.data.response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message || "An unknown error occurred");
    }
  }
);

const CategorySlice = createSlice({
  name: "Category",
  initialState,
  reducers: {
   
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      sessionStorage.removeItem("isAuthenticated");
      sessionStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Category List
      .addCase(GetCategoryList.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetCategoryList.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryList = action.payload;
      })
      .addCase(GetCategoryList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Category
      .addCase(AddCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(AddCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryList.push(action.payload);
        state.successMessage = "Category added successfully!";
      })
      .addCase(AddCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Category
      .addCase(UpdateCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(UpdateCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryList = state.categoryList.map((category) =>
          category.id === action.payload.id ? action.payload : category
        );
        state.successMessage = "Category updated successfully!";
      })
      .addCase(UpdateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { toggleProfileModal, logout } = CategorySlice.actions;
export default CategorySlice.reducer;
