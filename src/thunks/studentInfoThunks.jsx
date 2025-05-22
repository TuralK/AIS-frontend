// store/thunks/studentInfoThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getStudentInformation, updateStudentInformation, createStudentInformation } from '../api/StudentApi/studentInformationAPIs'; 
export const fetchStudentInfo = createAsyncThunk(
  'studentInfo/fetchStudentInfo',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getStudentInformation();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateStudentInfo = createAsyncThunk(
  'studentInfo/updateStudentInfo',
  async (formData, { rejectWithValue, dispatch }) => {
    try {
      const response = await updateStudentInformation(formData);
      // After successful update, you might want to re-fetch the latest data
      dispatch(fetchStudentInfo());
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createStudentInfo = createAsyncThunk(
  'studentInfo/createStudentInfo',
  async (formData, { rejectWithValue, dispatch }) => {
    try {
      const response = await createStudentInformation(formData);
      // After successful creation, you might want to re-fetch the latest data
      dispatch(fetchStudentInfo());
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);