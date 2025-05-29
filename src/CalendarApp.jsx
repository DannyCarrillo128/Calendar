import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';

import { AppRouter } from './router';
import { store } from './store';

export const CalendarApp = () => {

  return (
    <Provider store={ store }>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </Provider>
  );

};
