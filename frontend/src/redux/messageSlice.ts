import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type MessageLiist = {
  value: string;
  type: "success" | "error" | "warning";
};

export type MessageState = {
  list: MessageLiist[];
};

type RemoveMessage = {
  index: number;
};

const initialState: MessageState = {
  list: [],
};

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    showMessage: (state, action: PayloadAction<MessageLiist>) => {
      const { value, type } = action.payload;
      state.list.push({
        value,
        type,
      });
    },
    removeOldestMessage: (state) => {
      state.list.pop();
    },
    removeMessage: (state, action: PayloadAction<RemoveMessage>) => {
      const { index } = action.payload;
      state.list = state.list.filter((_el, i) => i !== index);
    },
  },
});

export const { showMessage, removeOldestMessage, removeMessage } =
  messageSlice.actions;

export default messageSlice.reducer;
