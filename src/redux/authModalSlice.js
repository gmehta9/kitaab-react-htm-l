// authModalSlice.js
import { createSlice } from '@reduxjs/toolkit';
import Auth from '../auth/Auth';

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
    tokenGet: state => {
      state.loggedToken = Auth.token() || false
    },
  },
});

export const { openLoginModal, closeLoginModal, openSignupModal, closeSignupModal, tokenGet } = authModalSlice.actions;
export default authModalSlice.reducer;
