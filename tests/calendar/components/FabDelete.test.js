import { fireEvent, render, screen } from '@testing-library/react';

import { FabDelete } from '../../../src/calendar/components/FabDelete';
import { useCalendarStore } from '../../../src/hooks/useCalendarStore';

jest.mock('../../../src/hooks/useCalendarStore');

describe('FabDelete tests', () => {

  const mockStartDeletingEvent = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  test('should show the component properly.', () => {
    useCalendarStore.mockReturnValue({
      hasEventSelected: false
    });

    render(<FabDelete />);
    
    const button = screen.getByLabelText('btn-delete');

    expect(button.classList).toContain('btn');
    expect(button.classList).toContain('btn-danger');
    expect(button.classList).toContain('fab-danger');
    expect(button.style.display).toBe('none');
  });

  test('should show the button if there is an active event.', () => {
    useCalendarStore.mockReturnValue({
      hasEventSelected: true
    });

    render(<FabDelete />);
    
    const button = screen.getByLabelText('btn-delete');

    expect(button.style.display).toBe('');
  });

  test(`should call 'startDeletingEvent' if the button is clicked.`, () => {
    useCalendarStore.mockReturnValue({
      hasEventSelected: true,
      startDeletingEvent: mockStartDeletingEvent
    });

    render(<FabDelete />);
    
    const button = screen.getByLabelText('btn-delete');

    fireEvent.click(button);

    expect(mockStartDeletingEvent).toHaveBeenCalledWith();
  });

});
