import { useEffect } from 'react';

import Swal from 'sweetalert2';

import { useAuthStore, useForm } from '../../hooks';
import './LoginPage.css';

const loginForm = {
  loginEmail: '',
  loginPassword: ''
};

const registerForm = {
  registerName: '',
  registerEmail: '',
  registerPassword: '',
  registerPassword2: ''
};

export const LoginPage = () => {

  const { errorMessage, startLogin, startRegister } = useAuthStore();

  useEffect(() => {
    if (errorMessage !== undefined) {
      Swal.fire('Authentication failed.', errorMessage, 'error');
    }
  }, [errorMessage]);

  const { loginEmail, loginPassword, onInputChange: onLoginInputChange } = useForm(loginForm);
  const { registerName, registerEmail, registerPassword, registerPassword2, onInputChange: onRegisterInputChange } = useForm(registerForm);

  const loginSubmit = (event) => {
    event.preventDefault();
    startLogin({ email: loginEmail, password: loginPassword });
  };

  const registerSubmit = (event) => {
    event.preventDefault();
    
    if (registerPassword !== registerPassword2) {
      Swal.fire('Registration failed.', 'Passwords do not match.', 'error');
      return;
    }

    startRegister({ name: registerName, email: registerEmail, password: registerPassword });
  };

  return (
    <div className="container login-container">
      <div className="row">
        <div className="col-md-6 login-form-1">
          <h3>Sign In</h3>
          <form onSubmit={ loginSubmit }>
            <div className="form-group mb-2">
              <input
                type="text"
                className="form-control"
                name="loginEmail"
                placeholder="Email"
                value={ loginEmail }
                onChange={ onLoginInputChange }
              />
            </div>
            <div className="form-group mb-2">
              <input
                type="password"
                className="form-control"
                name="loginPassword"
                placeholder="Password"
                value={ loginPassword }
                onChange={ onLoginInputChange }
              />
            </div>
            <div className="d-grid gap-2">
              <input
                type="submit"
                className="btnSubmit"
                value="Login"
              />
            </div>
          </form>
        </div>

        <div className="col-md-6 login-form-2">
          <h3>Register</h3>
          <form onSubmit={ registerSubmit }>
            <div className="form-group mb-2">
              <input
                type="text"
                className="form-control"
                name="registerName"
                placeholder="Name"
                value={ registerName }
                onChange={ onRegisterInputChange }
              />
            </div>
            <div className="form-group mb-2">
              <input
                type="email"
                className="form-control"
                name="registerEmail"
                placeholder="Email"
                value={ registerEmail }
                onChange={ onRegisterInputChange }
              />
            </div>
            <div className="form-group mb-2">
              <input
                type="password"
                className="form-control"
                name="registerPassword"
                placeholder="Password"
                value={ registerPassword }
                onChange={ onRegisterInputChange }
              />
            </div>

            <div className="form-group mb-2">
              <input
                type="password"
                className="form-control"
                name="registerPassword2"
                placeholder="Confirm password"
                value={ registerPassword2 }
                onChange={ onRegisterInputChange }
              />
            </div>

            <div className="d-grid gap-2">
              <input
                type="submit"
                className="btnSubmit"
                value="Sign up" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );

};
