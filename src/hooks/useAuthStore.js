import { useDispatch, useSelector } from 'react-redux';

import { calendarApi } from '../api';
import { clearErrorMessage, onChecking, onLogin, onLogout, onLogoutCalendar } from '../store';

export const useAuthStore = () => {

  const { status, user, errorMessage } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const startLogin = async ({ email, password }) => {

    dispatch(onChecking());
    
    try {
      const { data } = await calendarApi.post('/auth', { email, password });
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('token-init-date', new Date().getTime());

      dispatch(onLogin({ name: data.name, uid: data.uid }));
    } catch (error) {
      dispatch(onLogout('Invalid credentials.'));
      
      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 10);
    }
  };

  const startRegister = async ({ name, email, password }) => {

    dispatch(onChecking());

    try {
      const { data } = await calendarApi.post('/auth/sign-up', { name, email, password });

      localStorage.setItem('token', data.token);
      localStorage.setItem('token-init-date', new Date().getTime());

      dispatch(onLogin({ name, uid: data.uid }));
    } catch (error) {
      const errorData = error.response.data;

      if (Object.hasOwn(errorData, 'message')) {
        dispatch(onLogout(errorData.message));
      } else {
        const fieldsErrors = Object.values(errorData.errors).map(field => field.msg).join('\n');
        dispatch(onLogout(fieldsErrors));
      }

      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 10);
    }

  };

  const checkAuthToken = async () => {

    const token = localStorage.getItem('token');

    if (!token) return dispatch(onLogout());

    try {
      const { data } = await calendarApi.get('/auth/renew');

      localStorage.setItem('token', data.token);
      localStorage.setItem('token-init-date', new Date().getTime());

      dispatch(onLogin({ name: data.name, uid: data.uid }));
    } catch(error) {
      localStorage.clear();
      dispatch(onLogout());
    }

  };

  const startLogout = () => {
    localStorage.clear();
    dispatch(onLogoutCalendar());
    dispatch(onLogout());
  };

  return { status, user, errorMessage, startLogin, startRegister, checkAuthToken, startLogout };

};
