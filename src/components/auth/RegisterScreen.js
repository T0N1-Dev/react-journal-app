import React from 'react'
import { Link } from 'react-router-dom';
import { useForm } from '../../hooks/useForm';
import validator from 'validator';
import { useDispatch, useSelector } from 'react-redux';
import { removeError, setError } from '../../actions/ui';
import { startRegisterWithEmailPassswordName } from '../../actions/auth';

export const RegisterScreen = () => {

  const dispatch = useDispatch();
  const { mgError, loading } = useSelector( state => state.ui );

  const [ { name, email, password, password2 }, handleInputChange, reset ] = useForm({
    name: 'Test', 
    email:'test@gmail.com', 
    password:'123456', 
    password2:'123456'
  });

  const handleRegister = (e) => {
    e.preventDefault();

    if ( isFormValid() ){
      dispatch(startRegisterWithEmailPassswordName(email, password, name));
    }
    reset();
  };

  const isFormValid = () => {

    if ( name.trim().length === 0 || !validator.isAlpha(name) ) {
      dispatch(setError('Invalid name: ' + name));
      return false;
    } else if ( email.trim().length === 0 || !validator.isEmail(email) ) {
      dispatch(setError('Invalid email: ' + email));
      return false;
    } else if ( password !== password2 || password.length < 6) {
      dispatch(setError('Invalid passwords'));
      return false;
    }

    dispatch( removeError() );
    return true;
  }

  return (
    <>
      <h3 className='auth__title'>Register</h3>

      <form 
        onSubmit={ handleRegister }
        className='animate__animated animate__fadeIn animate__faster'
      >

      {
        mgError && 
        (
          <div className='auth__alert-error'>
            { mgError }
          </div>
        )
      }

      <input 
          type='text'
          placeholder='Name'
          name='name'
          className='auth__input'
          autoComplete='off'
          value={name}
          onChange={handleInputChange}
        />  

        <input 
          type='text'
          placeholder='Email'
          name='email'
          className='auth__input'
          autoComplete='off'
          value={email}
          onChange={handleInputChange}
        />  

        <input 
          type='password'
          placeholder='Password'
          name='password'
          className='auth__input'
          value={password}
          onChange={handleInputChange}
        />

        <input 
          type='password'
          placeholder='Confirm Password'
          name='password2'
          className='auth__input'
          value={password2}
          onChange={handleInputChange}
        />

        <button
          type='submit'
          className='btn btn-primary btn-block mb-5'
          disabled={ loading }
        >
          Register
        </button>

        <Link
        to="/auth/login"
        className="link"
        >
          Already registered?
        </Link>
      </form>  
    </>
  )
}
