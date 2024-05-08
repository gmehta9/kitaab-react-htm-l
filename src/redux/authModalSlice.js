// authModalSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loginModalOpen: false,
  signupModalOpen: false,
};

const authModalSlice = createSlice({
  name: 'authModal',
  initialState,
  reducers: {
    openLoginModal: state => {
      state.loginModalOpen = true;
    },
    closeLoginModal: state => {
      state.loginModalOpen = false;
    },
    openSignupModal: state => {
      state.signupModalOpen = true;
    },
    closeSignupModal: state => {
      state.signupModalOpen = false;
    },
  },
});

export const { openLoginModal, closeLoginModal, openSignupModal, closeSignupModal } = authModalSlice.actions;
export default authModalSlice.reducer;
