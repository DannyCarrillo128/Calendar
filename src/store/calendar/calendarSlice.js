import { createSlice } from '@reduxjs/toolkit';
// import { addHours } from 'date-fns';

/* const tempEvent = {
  id: new Date().getTime(),
  title: 'Birthday',
  notes: 'Buy a cake.',
  start: new Date(),
  end: addHours(new Date(), 2),
  bgColor: '#fafafa',
  user: {
    id: '123',
    name: 'John'
  }
}; */

export const calendarSlice = createSlice({
  name: 'calendar',
  initialState: {
    isLoadingEvents: true,
    events: [],
    activeEvent: null
  },
  reducers: {
    onSetActiveEvent: (state, action) => {
      state.activeEvent = action.payload;
    },
    onAddNewEvent: (state, action) => {
      state.events.push(action.payload);
      state.activeEvent = null;
    },
    onUpdateEvent: (state, action) => {
      state.events = state.events.map(event => {
        if (event.id === action.payload.id) {
          return action.payload;
        }

        return event;
      })
    },
    onDeleteEvent: (state) => {
      if (state.activeEvent) {
        state.events = state.events.filter(event => event.id !== state.activeEvent.id);
        state.activeEvent = null;
      }
    },
    onLoadEvents: (state, action) => {
      state.isLoadingEvents = false;
      action.payload.forEach(event => {
        const exists = state.events.some(dbEvent => dbEvent.id === event.id);

        if (!exists) {
          state.events.push(event);
        }
      });
    },
    onLogoutCalendar: (state) => {
      state.isLoadingEvents = true;
      state.events = [];
      state.activeEvent = null;
    }
  }
});

export const {
  onSetActiveEvent,
  onAddNewEvent,
  onUpdateEvent,
  onDeleteEvent,
  onLoadEvents,
  onLogoutCalendar
} = calendarSlice.actions;
