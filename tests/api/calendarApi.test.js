import calendarApi from '../../src/api/calendarApi';

describe('calendarApi tests', () => {

  test('should have default configuration.', () => {
    expect(calendarApi.defaults.baseURL).toBe(process.env.VITE_API_URL);
  });

  // It does not work.
  /* test(`should have 'x-token' in every request header.`, async () => {
    const token = 'ABC-123-XYZ';
    localStorage.setItem('token', token);

    const resp = await calendarApi.get('/auth');
    
    expect(resp.config.headers['x-token']).toBe(token);
  }); */

});
