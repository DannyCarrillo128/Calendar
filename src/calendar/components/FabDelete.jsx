import { useCalendarStore } from '../../hooks';

export const FabDelete = () => {

  const { hasEventSelected, startDeletingEvent } = useCalendarStore();

  const handleClickDelete = () => {
    startDeletingEvent();
  };

  return (
    <button onClick={ handleClickDelete } className="btn btn-danger fab-danger" style={{ display: hasEventSelected ? '' : 'none' }}>
      <i className="fas fa-trash-alt"></i>
    </button>
  );

};
