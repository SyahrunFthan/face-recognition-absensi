import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { changePasswordApi, deleteUserApi, getUserByIdApi } from '../Utils';

const initialState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
};

export const GetUserLogin = createAsyncThunk(
  'user/getUserLogin',
  async (state, thunkAPI) => {
    try {
      const response = await getUserByIdApi(state.id);
      return { status: response?.status, data: response?.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  },
);

export const ChangePassword = createAsyncThunk(
  'user/changePassoword',
  async (state, thunkAPI) => {
    try {
      const response = await changePasswordApi(state.id, {
        passwordOld: state.passwordOld,
        password: state.password,
        passwordConfirm: state.passwordConfirm,
      });

      return { status: response?.status, data: response?.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  },
);

export const DeleteUser = createAsyncThunk('user/deleteUser', async (state, thunkAPI) => {
  try {
    const response = await deleteUserApi(state.id)
    return { status: response.status, data: response.data.message }
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response)
  }
})

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUser: state => initialState,
  },
  extraReducers: builder => {
    builder.addCase(GetUserLogin.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(GetUserLogin.fulfilled, state => {
      state.isLoading = false;
      state.isSuccess = true;
    });
    builder.addCase(GetUserLogin.rejected, state => {
      state.isLoading = false;
      state.isError = true;
    });
    builder.addCase(ChangePassword.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(ChangePassword.fulfilled, state => {
      state.isLoading = false;
      state.isSuccess = true;
    });
    builder.addCase(ChangePassword.rejected, state => {
      state.isLoading = false;
      state.isError = true;
    });
    builder.addCase(DeleteUser.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(DeleteUser.fulfilled, state => {
      state.isLoading = false;
      state.isSuccess = true;
    });
    builder.addCase(DeleteUser.rejected, state => {
      state.isLoading = false;
      state.isError = true;
    });
  },
});

export const { resetUser } = userSlice.actions;
export default userSlice.reducer;
