import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface State {
  theme: 'light' | 'dark';
}

const initialState: State = {
  theme: 'light',
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setGlobalState(state, action: PayloadAction<Partial<State>>) {
      Object.assign(state, action.payload);
    },
  },
});

export const { setGlobalState } = globalSlice.actions;

export default globalSlice.reducer;
