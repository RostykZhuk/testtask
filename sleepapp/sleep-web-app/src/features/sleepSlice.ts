import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface SleepState {
  bed_time_start: string;
  bed_time_end: string;
  feeling: number | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: SleepState = {
  bed_time_start: "",
  bed_time_end: "",
  feeling: null,
  status: "idle",
  error: null
};

export const fetchSleepData = createAsyncThunk(
  "sleep/fetchSleepData",
  async (_, { rejectWithValue }) => {
    try {
      const date = new Date().toISOString().split("T")[0];
      const response = await fetch(
        `http://localhost:8000/api/sleep-log?date=${date}`,
        {
          method: "GET",
          headers: {
            Authorization: "Token b58b602c1912e9432cbd0be58b9761040775bc3a"
          }
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const sleepSlice = createSlice({
  name: "sleep",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSleepData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSleepData.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload) {
          state.bed_time_start = action.payload.bed_time_start;
          state.bed_time_end = action.payload.bed_time_end;
          state.feeling = action.payload.feeling;
        }
      })
      .addCase(fetchSleepData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  }
});

export default sleepSlice.reducer;
