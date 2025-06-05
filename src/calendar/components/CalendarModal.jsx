import { useEffect, useMemo, useState } from 'react';

import { addHours, differenceInSeconds } from 'date-fns';
import es from 'date-fns/locale/es';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Modal from 'react-modal';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import { getEnvVariables } from '../../helpers';
import { useCalendarStore, useUiStore } from '../../hooks';

registerLocale('es', es);

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

if (getEnvVariables().VITE_MODE !== 'test') {
  Modal.setAppElement('#root');
}

export const CalendarModal = () => {

  const { isDateModalOpen, closeDateModal } = useUiStore();
  const { events, activeEvent, startSavingEvent } = useCalendarStore();

  const [formValue, setFormValue] = useState({
    title: '',
    notes: '',
    start: new Date(),
    end: addHours(new Date(), 1)
  });

  const [formSubmitted, setFormSubmitted] = useState(false);

  const titleClass = useMemo(() => {
    if (!formSubmitted) return '';

    return (formValue.title.length > 0) ? '' : 'is-invalid'
  }, [formValue.title, formSubmitted]);

  useEffect(() => {
    if (activeEvent !== null) {
      setFormValue({ ...activeEvent });
    }
  }, [activeEvent]);

  const onInputChange = ({ target }) => {
    setFormValue({
      ...formValue,
      [target.name]: target.value
    });
  };

  const onDateChange = (event, changing) => {
    setFormValue({
      ...formValue,
      [changing]: event
    });
  };

  const onCloseModal = () => {
    closeDateModal();
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    setFormSubmitted(true);

    const difference = differenceInSeconds(formValue.end, formValue.start);
    
    if (isNaN(difference) || difference <= 0) {
      Swal.fire('Invalid dates.', 'End date can not be previous to start date. Dates can not be the same.', 'error');
      return;
    }

    if (formValue.title.length <= 0) return;
    
    await startSavingEvent(formValue);
    closeDateModal();
    setFormSubmitted(false);
  };

  return (
    <Modal
      className="modal"
      overlayClassName="modal-fondo"
      isOpen={ isDateModalOpen }
      onRequestClose={ onCloseModal }
      closeTimeoutMS={ 200 }
      style={ customStyles }
    >
      <h1>New event</h1>
      <hr />
      <form onSubmit={ onSubmit } className="container">
        <div className="form-group mb-2">
          <label>Start</label>
          <DatePicker
            className="form-control"
            selected={ formValue.start }
            dateFormat="Pp"
            onChange={ (event) => onDateChange(event, 'start') }
            showTimeSelect
            locale="es"
            timeCaption="Hora"
          />
        </div>
        <div className="form-group mb-2">
          <label>End</label>
          <DatePicker
            className="form-control"
            minDate={ formValue.start }
            selected={ formValue.end }
            dateFormat="Pp"
            onChange={ (event) => onDateChange(event, 'end') }
            showTimeSelect
            locale="es"
            timeCaption="Hora"
          />
        </div>
        <hr />
        <div className="form-group mb-2">
          <label>Title and notes</label>
          <input
            type="text"
            className={ `form-control ${ titleClass }` }
            placeholder="Event title"
            name="title"
            autoComplete="off"
            value={ formValue.title }
            onChange={ onInputChange }
          />
          <small id="emailHelp" className="form-text text-muted">Add a short description</small>
        </div>
        <div className="form-group mb-2">
          <textarea
            type="text"
            className="form-control"
            placeholder="Notes"
            rows="5"
            name="notes"
            value={ formValue.notes }
            onChange={ onInputChange }
          ></textarea>
          <small id="emailHelp" className="form-text text-muted">Additional information</small>
        </div>
        <button
          type="submit"
          className="btn btn-outline-primary btn-block"
        >
          <i className="far fa-save"></i> <span>Save</span>
        </button>
      </form>
    </Modal>
  );

};
