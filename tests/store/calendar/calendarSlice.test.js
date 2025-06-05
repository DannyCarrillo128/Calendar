import {
  calendarSlice,
  onAddNewEvent,
  onDeleteEvent,
  onLoadEvents,
  onLogoutCalendar,
  onSetActiveEvent,
  onUpdateEvent
} from '../../../src/store/calendar/calendarSlice';
import {
  calendarWithActiveEventState,
  calendarWithEventsState,
  events,
  initialState
} from '../../fixtures/calendarEvents';

describe('calendarSlice tests', () => {

  test('should return the initial state', () => {
    expect(calendarSlice.getInitialState()).toEqual(initialState);
  });

  test('should set the active event.', () => {
    const state = calendarSlice.reducer(calendarWithEventsState, onSetActiveEvent(events[0]));

    expect(state.activeEvent).toEqual(events[0]);
  });

  test('should add a new event.', () => {
    const newEvent = {
      id: '3',
      title: 'Take out the trash.',
      start: new Date('2025-06-01 07:00:00'),
      end: new Date('2025-06-01 07:30:00'),
      notes: 'Do not forget to separate paper from plastic.'
    };

    const state = calendarSlice.reducer(calendarWithEventsState, onAddNewEvent(newEvent));

    expect(state.events).toEqual([ ...events, newEvent ]);
  });

  test('should update the event.', () => {
    const eventToUpdate = {
      id: '1',
      title: 'Wash clothes.',
      start: new Date('2025-05-30 12:00:00'),
      end: new Date('2025-05-30 14:00:00'),
      notes: 'Do mix colored clothes with white clothes!!! =D'
    };

    const state = calendarSlice.reducer(calendarWithEventsState, onUpdateEvent(eventToUpdate));

    expect(state.events).toContain(eventToUpdate);
  });

  test('should delete the active event.', () => {
    const state = calendarSlice.reducer(calendarWithActiveEventState, onDeleteEvent());

    expect(state.events).not.toContain(events[0]);
    expect(state.activeEvent).toBeNull();
  });

  test('should set the new events.', () => {
    const state = calendarSlice.reducer(initialState, onLoadEvents(events));
    
    expect(state.isLoadingEvents).toBeFalsy();
    expect(state.events).toEqual(events);

    const newState = calendarSlice.reducer(state, onLoadEvents(events));
    expect(newState.events.length).toBe(events.length);
  });

  test('should clear the state.', () => {
    const state = calendarSlice.reducer(calendarWithActiveEventState, onLogoutCalendar());
    
    expect(state).toEqual(initialState);
  });
  
});
