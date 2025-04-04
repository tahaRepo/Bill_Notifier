import { createSlice } from "@reduxjs/toolkit";

const BillSlice = createSlice({
  name: "BillSlice",
  initialState: {
    billScanned: [],
  },
  reducers: {
    setBillScanned(state, action) {
      state.billScanned = [...state.billScanned, action.payload];
    },
    removeBillScanned(state, action) {
        state.billScanned = state.billScanned.filter((_, index) => index !== action.payload);
    },
  },
});

export const { setBillScanned, removeBillScanned } = BillSlice.actions;
export default BillSlice.reducer;
