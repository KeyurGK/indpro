import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../axiosInstance";

const initialState = {
  loading: false,
  error: null,
  taskList: [],
  isAuthenticated: sessionStorage.getItem("isAuthenticated") === "true",
  token: null,
  successMessage: null,
  AdminprofileModalOpen: false,
};

// Fetch Category List
// export const GetTaskList = createAsyncThunk(
//     "task/GetTaskList",
//     async (token, { rejectWithValue }) => {
//       try {
//         const response = await axiosInstance.get("tasks/all", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
  
//         if (response.data.success) {
//           return response.data.data;
//         }
//       } catch (error) {
//         return rejectWithValue(error.response?.data || error.message || "An unknown error occurred");
//       }
//     }
//   );
export const GetTaskList = createAsyncThunk(
  "task/GetTaskList",
  async ({ token, search = "", completed = "" }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("tasks/all", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          search: search || undefined, // Appends `?search=task`
          completed: completed !== "" ? completed : undefined, // Appends `?completed=true`
        },
      });

      if (response.data.success) {
        return response.data.tasks;
      } else {
        return rejectWithValue("Failed to fetch tasks");
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message || "An unknown error occurred");
    }
  }
);
  
// Add Task
export const AddTask = createAsyncThunk(
    "task/AddTask",
    async (payload, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.post("tasks/add", payload);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message || "An unknown error occurred");
      }
    }
  );

// Update Task
export const UpdateTask = createAsyncThunk(
  "tasks/UpdateTask",
  async ({ taskId, title, description, completed }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put("/tasks/update", {
        taskId,
        title,
        description,
        completed,
      });

      return response.data; // Returning updated task data
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message || "An unknown error occurred"
      );
    }
  }
);


//delate
export const DeleteTask = createAsyncThunk(
  "tasks/DeleteTask",
  async ({ taskId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/tasks/delete/${taskId}`);

      return response.data; // Returning success message
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message || "An unknown error occurred"
      );
    }
  }
);


const TaskSlice = createSlice({
  name: "Task",
  initialState,
  reducers: {
    toggleProfileModal: (state) => {
      state.AdminprofileModalOpen = !state.AdminprofileModalOpen;
    },
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
      .addCase(GetTaskList.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetTaskList.fulfilled, (state, action) => {
        state.loading = false;
        state.taskList = action.payload;
      })
      .addCase(GetTaskList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Category
      .addCase(AddTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(AddTask.fulfilled, (state, action) => {
        state.loading = false;
        state.taskList.push(action.payload);
        state.successMessage = "Task added successfully!";
      })
      .addCase(AddTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Category
      .addCase(UpdateTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(UpdateTask.fulfilled, (state, action) => {
        state.loading = false;
        state.taskList = state.categoryList.map((category) =>
          category.id === action.payload.id ? action.payload : category
        );
        state.successMessage = "Category updated successfully!";
      })
      .addCase(UpdateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Task
      .addCase(DeleteTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(DeleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.taskList = state.categoryList.map((category) =>
          category.id === action.payload.id ? action.payload : category
        );
        state.successMessage = "Category updated successfully!";
      })
      .addCase(DeleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { toggleProfileModal, logout } = TaskSlice.actions;
export default TaskSlice.reducer;
