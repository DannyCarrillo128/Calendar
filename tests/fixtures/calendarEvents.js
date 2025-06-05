export const events = [
  {
    id: '1',
    title: 'Wash clothes.',
    start: new Date('2025-05-30 12:00:00'),
    end: new Date('2025-05-30 14:00:00'),
    notes: 'Do not mix colored clothes with white clothes.'
  },
  {
    id: '2',
    title: 'Go to the store.',
    start: new Date('2025-05-31 09:00:00'),
    end: new Date('2025-05-31 10:00:00'),
    notes: 'Buy milk, butter and cheese.'
  }
];

export const initialState = {
  isLoadingEvents: true,
  events: [],
  activeEvent: null
};

export const calendarWithEventsState = {
  isLoadingEvents: false,
  events: [...events],
  activeEvent: null
};

export const calendarWithActiveEventState = {
  isLoadingEvents: false,
  events: [...events],
  activeEvent: { ...events[0] }
};
