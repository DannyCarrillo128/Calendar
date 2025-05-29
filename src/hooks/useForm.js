import { useEffect, useMemo, useState } from 'react';

export const useForm = (fields = {}, formValidations = {}) => {

  const [formState, setFormState] = useState(fields);
  const [formValidation, setFormValidation] = useState({});

  useEffect(() => {
    createValidators();
  }, [formState]);
  
  useEffect(() => {
    setFormState(fields);
  }, [fields]);

  const isFormValid = useMemo(() => {
    for (const formValue of Object.keys(formValidation)) {
      if (formValidation[formValue] !== null) return false;
    }

    return true;
  }, [formValidation]);

  const onInputChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value
    });
  };

  const onReset = () => {
    setFormState(fields);
  };

  const createValidators = () => {
    const formCheckValues = {};

    for (const field of Object.keys(formValidations)) {
      const [fn, errorMessage] = formValidations[field];

      formCheckValues[`${ field }Valid`] = fn(formState[field]) ? null : errorMessage;

      setFormValidation(formCheckValues);
    }
  };
  
  return { ...formState, formState, ...formValidation, isFormValid, onInputChange, onReset };
};
