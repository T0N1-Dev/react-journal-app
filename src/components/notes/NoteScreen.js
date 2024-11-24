import React, { useEffect, useRef } from 'react'
import { NotesAppBar } from './NotesAppBar'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from '../../hooks/useForm';
import { activeNote, startDeleting } from '../../actions/notes';

export const NoteScreen = () => {

  const dispatch = useDispatch();

  const { active: noteActive } = useSelector( state => state.notes );
  const [ formValues, handleInputChange, reset ] = useForm( noteActive );
  const { body, title } = formValues;

  const activeId = useRef( noteActive.id );

  useEffect(() => {
    if ( noteActive.id !== activeId.current ) {
      reset( noteActive );
      activeId.current = noteActive.id;
    }
  }, [noteActive, reset]);

  const handleDelete = () => {
    dispatch( startDeleting(activeId.current) );
  }

  useEffect(() => {
    dispatch( activeNote(formValues.id, {...formValues}));
    
  }, [formValues, dispatch]);
  

  return (
    <div 
      className='notes__main-content animate__animated animate__fadeIn animate__faster'
    >
        <NotesAppBar />

        <div className='notes__content'>

          <input 
            type='text'
            placeholder='Some awesome title'
            className='notes__title-input'
            name='title'
            value={ title }
            onChange={handleInputChange}
          />

          <textarea
            placeholder='What appened today'
            className='notes__textarea'
            name='body'
            value={ body }
            onChange={handleInputChange}
          ></textarea>

          {
            (noteActive.url)
            &&
            (<div className='notes__image'>
              <img src={ noteActive.url } alt={ noteActive.title } />
            </div>)
          }
        </div>

        <button
          className='btn btn-danger'
          onClick={ handleDelete }
        > 
        Delete
        </button>
    </div>
  )
}
