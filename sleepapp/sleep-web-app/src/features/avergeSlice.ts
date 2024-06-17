import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface Feeling {
  feeling: number;
  count: number;
}

interface Range {
  start_date: string;
  end_date: string;
}

interface AvergeState {
  range: Range;
  average_bed_time_start: string;
  average_bed_time_end: string;
  average_total_time_in_bed: string;
  feeling_frequencies: Feeling[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string;
}

const initialState: AvergeState = {
  range: {
    start_date: "",
    end_date: ""
  },
  average_bed_time_start: "",
  average_bed_time_end: "",
  average_total_time_in_bed: "",
  feeling_frequencies: [],
  status: "idle",
  error: ""
};

export const fetchMonthlySleepLogs = createAsyncThunk(
  "sleep/fetchMonthlySleepLogs",
  async () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);

    const response = await fetch(
      `http://localhost:8000/api/sleep-log-range?&start_date=${
        startDate.toISOString().split("T")[0]
      }&end_date=${endDate.toISOString().split("T")[0]}`,
      {
        method: "GET",
        headers: {
          Authorization: `Token b58b602c1912e9432cbd0be58b9761040775bc3a`
        }
      }
    );
    const data = await response.json();
    return data;
  }
);

const avergeSlice = createSlice({
  name: "averge",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMonthlySleepLogs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMonthlySleepLogs.fulfilled, (state, action) => {
        state.range = action.payload.range;
        state.status = "succeeded";
        state.average_bed_time_start = action.payload.average_bed_time_start;
        state.average_bed_time_end = action.payload.average_bed_time_end;
        state.average_total_time_in_bed =
          action.payload.average_total_time_in_bed;
        state.feeling_frequencies = action.payload.feeling_frequencies;
      })
      .addCase(fetchMonthlySleepLogs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch sleep logs";
      });
  }
});

export default avergeSlice.reducer;
