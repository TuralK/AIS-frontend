// store/slices/studentInfoSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchStudentInfo, updateStudentInfo, createStudentInfo } from '../thunks/studentInfoThunks'; // Adjust path if needed

const initialState = {
  studentData: null,
  loading: false,
  error: null,
  success: false,
};

const studentInfoSlice = createSlice({
  name: 'studentInfo',
  initialState,
  reducers: {
    resetStudentInfoState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchStudentInfo
      .addCase(fetchStudentInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.studentData = action.payload;
      })
      .addCase(fetchStudentInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle updateStudentInfo
      .addCase(updateStudentInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateStudentInfo.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(updateStudentInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Handle createStudentInfo
      .addCase(createStudentInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createStudentInfo.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createStudentInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { resetStudentInfoState } = studentInfoSlice.actions;
export default studentInfoSlice.reducer;