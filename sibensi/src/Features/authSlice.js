import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {
  changePasswordAdminApi,
  getAdminByIdApi,
  loginAdminApi,
  loginApi,
} from '../Utils/Apis';

const initialState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
};

export const LoginApp = createAsyncThunk(
  'auth/login',
  async (state, thunkAPI) => {
    try {
      const response = await loginApi({
        username: state.username,
        password: state.password,
      });

      return {status: response?.status, data: response?.data};
    } catch (error) {
      return thunkAPI.rejectWithValue({
        data: error.response.data,
        status: error.response.status,
      });
    }
  },
);

export const LoginAdminApp = createAsyncThunk(
  'auth/login',
  async (state, thunkAPI) => {
    try {
      const response = await loginAdminApi({
        username: state.username,
        password: state.password,
      });

      return {status: response?.status, data: response?.data};
    } catch (error) {
      return thunkAPI.rejectWithValue({
        data: error.response.data,
        status: error.response.status,
      });
    }
  },
);

export const GetAdminLogin = createAsyncThunk(
  'admin/getAdminLogin',
  async (state, thunkAPI) => {
    try {
      const response = await getAdminByIdApi(state.id);

      return {status: response.status, data: response.data};
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  },
);

export const ChangePasswordAdmin = createAsyncThunk(
  'admin/changePassoword',
  async (state, thunkAPI) => {
    try {
      const response = await changePasswordAdminApi(state.id, {
        passwordOld: state.passwordOld,
        password: state.password,
        passwordConfirm: state.passwordConfirm,
      });

      return {status: response?.status, data: response?.data};
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  },
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuth: state => initialState,
  },
  extraReducers: builder => {
    builder.addCase(LoginApp.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(LoginApp.fulfilled, state => {
      state.isLoading = false;
      state.isSuccess = true;
    });
    builder.addCase(LoginApp.rejected, state => {
      state.isLoading = false;
      state.isError = true;
    });
    builder.addCase(GetAdminLogin.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(GetAdminLogin.fulfilled, state => {
      state.isLoading = false;
      state.isSuccess = true;
    });
    builder.addCase(GetAdminLogin.rejected, state => {
      state.isLoading = false;
      state.isError = true;
    });
    builder.addCase(ChangePasswordAdmin.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(ChangePasswordAdmin.fulfilled, state => {
      state.isLoading = false;
      state.isSuccess = true;
    });
    builder.addCase(ChangePasswordAdmin.rejected, state => {
      state.isLoading = false;
      state.isError = true;
    });
  },
});

export const {resetAuth} = authSlice.actions;
export default authSlice.reducer;
