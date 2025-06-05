import { configureStore } from '@reduxjs/toolkit';
import { act, renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';

import { useUiStore } from '../../src/hooks/useUiStore';
import { uiSlice } from '../../src/store/ui/uiSlice';

const getMockStore = (initialState) => {
  
  return configureStore({
    reducer: {
      ui: uiSlice.reducer
    },
    preloadedState: {
      ui: { ...initialState }
    }
  });

};

describe('useUiStore tests', () => {

  test('should return default values.', () => {
    const mockedStore = getMockStore({ isDateModalOpen: false });

    const { result } = renderHook(() => useUiStore(), {
      wrapper: ({ children }) => <Provider store={ mockedStore }>{ children }</Provider>
    });
    
    expect(result.current).toEqual({
      isDateModalOpen: false,
      openDateModal: expect.any(Function),   
      closeDateModal: expect.any(Function), 
      toggleDateModal: expect.any(Function)
    });
  });

  test(`should set 'isDateModalOpen' on true.`, () => {
    const mockedStore = getMockStore({ isDateModalOpen: false });

    const { result } = renderHook(() => useUiStore(), {
      wrapper: ({ children }) => <Provider store={ mockedStore }>{ children }</Provider>
    });

    const { openDateModal } = result.current;

    act(() => { openDateModal() });

    expect(result.current.isDateModalOpen).toBeTruthy();
  });

  test(`should set 'isDateModalOpen' back to false.`, () => {
    const mockedStore = getMockStore({ isDateModalOpen: true });

    const { result } = renderHook(() => useUiStore(), {
      wrapper: ({ children }) => <Provider store={ mockedStore }>{ children }</Provider>
    });

    const { closeDateModal } = result.current;

    act(() => { closeDateModal() });

    expect(result.current.isDateModalOpen).toBeFalsy();
  });

  test(`should change 'isDateModalOpen' value.`, () => {
    const mockedStore = getMockStore({ isDateModalOpen: true });

    const { result } = renderHook(() => useUiStore(), {
      wrapper: ({ children }) => <Provider store={ mockedStore }>{ children }</Provider>
    });

    act(() => { result.current.toggleDateModal() });
    expect(result.current.isDateModalOpen).toBeFalsy();

    act(() => { result.current.toggleDateModal() });
    expect(result.current.isDateModalOpen).toBeTruthy();
  });

});
