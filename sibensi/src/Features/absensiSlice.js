import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getAbsensiByIdApi} from '../Utils';

const initialState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
};

export const GetAbsensiById = createAsyncThunk(
  'absensi/getAbsensiById',
  async (state, thunkAPI) => {
    try {
      const response = await getAbsensiByIdApi(state.id);
      return {status: response?.status, data: response?.data};
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  },
);

export const absensiSlice = createSlice({
  name: 'absensi',
  initialState,
  reducers: {
    resetAbsensi: state => initialState,
  },
  extraReducers: builder => {
    builder.addCase(GetAbsensiById.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(GetAbsensiById.fulfilled, state => {
      state.isLoading = false;
      state.isSuccess = true;
    });
    builder.addCase(GetAbsensiById.rejected, state => {
      state.isLoading = false;
      state.isError = true;
    });
  },
});

export const {resetAbsensi} = absensiSlice.actions;
export default absensiSlice.reducer;
