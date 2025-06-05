import { configureStore } from '@reduxjs/toolkit';
import { act, renderHook, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';

import { initialState, notAuthenticatedState } from '../fixtures/authStates';
import { testUserCredentials } from '../fixtures/testUser';
import { calendarApi } from '../../src/api';
import { useAuthStore } from '../../src/hooks/useAuthStore';
import { authSlice } from '../../src/store/auth/authSlice';

const getMockStore = (initialState) => {

  return configureStore({
    reducer: {
      auth: authSlice.reducer
    },
    preloadedState: {
      auth: { ...initialState }
    }
  });

};

describe('useAuthStore tests', () => {

  beforeEach(() => localStorage.clear());

  test('should return initial values.', () => {
    const mockedStore = getMockStore({ ...initialState });

    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => <Provider store={ mockedStore }>{ children }</Provider>
    });

    expect(result.current).toEqual({
      status: 'checking',
      user: {},
      errorMessage: undefined,
      startLogin: expect.any(Function),
      startRegister: expect.any(Function),
      checkAuthToken: expect.any(Function),
      startLogout: expect.any(Function)
    });
  });

  test('should sign in correctly.', async () => {
    const mockedStore = getMockStore({ ...notAuthenticatedState });

    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => <Provider store={ mockedStore }>{ children }</Provider>
    });

    await act(async () => {
      await result.current.startLogin(testUserCredentials)
    });

    const { status, errorMessage, user } = result.current;

    expect({ status, errorMessage, user }).toEqual({
      status: 'authenticated',
      errorMessage: undefined,
      user: { name: 'Test', uid: '682e692e6d16de24089e4e2b' }
    });

    expect(localStorage.getItem('token')).toEqual(expect.any(String));
    expect(localStorage.getItem('token-init-date')).toEqual(expect.any(String));
  });

  test('should fail to sign in.', async () => {
    const mockedStore = getMockStore({ ...notAuthenticatedState });

    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => <Provider store={ mockedStore }>{ children }</Provider>
    });

    await act(async () => {
      await result.current.startLogin({ email: 'error@email.com', password: '555555' });
    });

    const { status, errorMessage, user } = result.current;

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('token-init-date')).toBeNull();
    expect({ status, errorMessage, user }).toEqual({
      status: 'not-authenticated',
      errorMessage: expect.any(String),
      user: {}
    });

    await waitFor(() => expect(result.current.errorMessage).toBeUndefined());
  });

  test('should register a new user.', async () => {
    const newUser = {
      name: 'New User',
      email: 'newuser@email.com',
      password: '123456789'
    };

    const mockedStore = getMockStore({ ...notAuthenticatedState });

    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => <Provider store={ mockedStore }>{ children }</Provider>
    });

    const spy = jest.spyOn(calendarApi, 'post').mockReturnValue({
      data: {
        ok: true,
        uid: 'abc123',
        name: 'New User',
        token: 'some-token'
      }
    });

    await act(async () => {
      await result.current.startRegister(newUser);
    });

    const { status, errorMessage, user } = result.current;

    expect({ status, errorMessage, user }).toEqual({
      status: 'authenticated',
      errorMessage: undefined,
      user: { name: 'New User', uid: 'abc123' }
    });

    spy.mockRestore();
  });

  test('should fail to register a new user.', async () => {
    const mockedStore = getMockStore({ ...notAuthenticatedState });

    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => <Provider store={ mockedStore }>{ children }</Provider>
    });

    await act(async () => {
      await result.current.startRegister(testUserCredentials);
    });

    const { status, errorMessage, user } = result.current;

    expect({ status, errorMessage, user }).toEqual({
      status: 'not-authenticated',
      errorMessage: expect.any(String),
      user: {}
    });
  });

  test('should authenticate the user.', async () => {
    const { data } = await calendarApi.post('/auth', testUserCredentials);
    localStorage.setItem('token', data.token);

    const mockedStore = getMockStore({ ...initialState });

    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => <Provider store={ mockedStore }>{ children }</Provider>
    });

    await act(async () => {
      await result.current.checkAuthToken();
    });

    const { status, errorMessage, user } = result.current;

    expect({ status, errorMessage, user }).toEqual({
      status: 'authenticated',
      errorMessage: undefined,
      user: { name: 'Test', uid: '682e692e6d16de24089e4e2b' }
    });
  });

  test('should fail if there is no token.', async () => {
    const mockedStore = getMockStore({ ...initialState });

    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => <Provider store={ mockedStore }>{ children }</Provider>
    });

    await act(async () => {
      await result.current.checkAuthToken();
    });

    const { status, errorMessage, user } = result.current;

    expect({ status, errorMessage, user }).toEqual({
      status: 'not-authenticated',
      errorMessage: undefined,
      user: {}
    });
  });

});
