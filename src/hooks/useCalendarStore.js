import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';

import { calendarApi } from '../api';
import { convertEventsDate } from '../helpers';
import {
  onAddNewEvent,
  onDeleteEvent,
  onLoadEvents,
  onSetActiveEvent,
  onUpdateEvent
} from '../store';

export const useCalendarStore = () => {

  const dispatch = useDispatch();

  const { events, activeEvent } = useSelector(state => state.calendar);
  const { user } = useSelector(state => state.auth);

  const setActiveEvent = (calendarEvent) => {
    dispatch(onSetActiveEvent(calendarEvent));
  };

  const startSavingEvent = async (calendarEvent) => {
    try {
      if (calendarEvent.id) {
        /* Update event */
        await calendarApi.put(`/events/${ calendarEvent.id }`, calendarEvent);
        dispatch(onUpdateEvent({ ...calendarEvent, user }));
        // The reason to use spread syntax is to make sure that the given object is a new object,
        // not just a reference. However, is ok if the reference is sent.
        return;
      }
    
      /* Create event */
      const { data } = await calendarApi.post('/events', calendarEvent);
      dispatch(onAddNewEvent({ ...calendarEvent, id: data.event.id, user }));
    } catch (error) {
      console.log(error);
      Swal.fire('Save failed.', error.response.data.message, 'error');
    }
  };

  const startDeletingEvent = async () => {
    try {
      await calendarApi.delete(`/events/${ activeEvent.id }`);
      dispatch(onDeleteEvent());
    } catch (error) {
      console.log(error);
      Swal.fire('Delete failed.', error.response.data.message, 'error');
    }
  };

  const startLoadingEvents = async () => {
    try {
      const { data } = await calendarApi.get('/events');
      const events = convertEventsDate(data.events);
      dispatch(onLoadEvents(events));
    } catch (error) {
      console.log(error);
    }
  };

  return {
    events,
    activeEvent,
    hasEventSelected: !!activeEvent,
    setActiveEvent,
    startSavingEvent,
    startDeletingEvent,
    startLoadingEvents
  };

};
