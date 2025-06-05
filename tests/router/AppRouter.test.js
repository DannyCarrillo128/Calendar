import { MemoryRouter } from 'react-router';
import { render, screen } from '@testing-library/react';

import { useAuthStore } from '../../src/hooks/useAuthStore';
import { AppRouter } from '../../src/router/AppRouter';

jest.mock('../../src/hooks/useAuthStore');
jest.mock('../../src/calendar/pages/CalendarPage', () => ({
  CalendarPage: () => <h1>CalendarPage works!</h1>
}));

describe('AppRouter tests', () => {

  const mockCheckAuthToken = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  test(`should show the loading page and call 'checkAuthToken'.`, () => {
    useAuthStore.mockReturnValue({
      status: 'checking',
      checkAuthToken: mockCheckAuthToken
    });

    render(<AppRouter />);
    
    expect(screen.getByText('Loading...')).toBeTruthy();
    expect(mockCheckAuthToken).toHaveBeenCalled();
  });

  test('should show the login page if user is not authenticated.', () => {
    useAuthStore.mockReturnValue({
      status: 'not-authenticated',
      checkAuthToken: mockCheckAuthToken
    });

    const { container } = render(
      <MemoryRouter>
        <AppRouter />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Sign In')).toBeTruthy();
    expect(container).toMatchSnapshot();
  });

  test('should show the calendar if the user is authenticated.', () => {
    useAuthStore.mockReturnValue({
      status: 'authenticated',
      checkAuthToken: mockCheckAuthToken
    });

    render(
      <MemoryRouter>
        <AppRouter />
      </MemoryRouter>
    );
    
    expect(screen.getByText('CalendarPage works!')).toBeTruthy();
  });

});
