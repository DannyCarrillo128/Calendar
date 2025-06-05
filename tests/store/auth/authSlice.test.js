import { authSlice, onChecking, onClearErrorMessage, onLogin, onLogout } from '../../../src/store/auth/authSlice';
import { authenticatedState, initialState } from '../../fixtures/authStates';
import { testUserCredentials } from '../../fixtures/testUser';

describe('authSlice tests', () => {

  test('should return the initial state.', () => {
    expect(authSlice.getInitialState()).toEqual(initialState);
  });

  test('should change the status value.', () => {
    const state = authSlice.reducer(initialState, onLogin(testUserCredentials));
    const newState = authSlice.reducer(state, onChecking());
    
    expect(newState).toEqual({
      status: 'checking',
      user: {},
      errorMessage: undefined
    });
  });

  test('should sign in.', () => {
    const state = authSlice.reducer(initialState, onLogin(testUserCredentials));
    
    expect(state).toEqual({
      status: 'authenticated',
      user: testUserCredentials,
      errorMessage: undefined
    });
  });

  test('should sign out.', () => {
    const state = authSlice.reducer(authenticatedState, onLogout());

    expect(state).toEqual({
      status: 'not-authenticated',
      user: {},
      errorMessage: undefined
    });
  });

  test('should sign out (with an error).', () => {
    const errorMessage = 'Something went wrong.';
    const state = authSlice.reducer(authenticatedState, onLogout(errorMessage));

    expect(state).toEqual({
      status: 'not-authenticated',
      user: {},
      errorMessage
    });
  });

  test('should clear the error message.', () => {
    const errorMessage = 'Something went wrong.';
    const state = authSlice.reducer(authenticatedState, onLogout(errorMessage));
    const newState = authSlice.reducer(state, onClearErrorMessage());

    expect(newState.errorMessage).toBe(undefined);
  });

});
