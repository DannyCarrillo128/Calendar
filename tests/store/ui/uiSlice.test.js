import { onCloseDateModal, onOpenDateModal, uiSlice } from '../../../src/store/ui/uiSlice';

describe('uiSlice tests', () => {

  test('should return the initial state.', () => {
    expect(uiSlice.getInitialState()).toEqual({ isDateModalOpen: false });
  });

  test(`should change the 'isDateModalOpen' value.`, () => {
    let state = uiSlice.getInitialState();
    state = uiSlice.reducer(state, onOpenDateModal());

    expect(state.isDateModalOpen).toBeTruthy();

    state = uiSlice.reducer(state, onCloseDateModal());

    expect(state.isDateModalOpen).toBeFalsy();
  });

});
