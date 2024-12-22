import React from 'react'
import { JournalEntries } from './JournalEntries'
import { useDispatch, useSelector } from 'react-redux'
import { startLogout } from '../../actions/auth';
import { startNewNote } from '../../actions/notes';

export const Sidebar = () => {

    const dispatch = useDispatch();
    const { name } = useSelector(state => state.auth);

    const handleLogout = () => {
        dispatch( startLogout() );
    }

    const handleAddNew = () => {
        dispatch( startNewNote() );
    }

  return (
    <aside className='journal__sidebar'>
        <div className='journal__sidebar-navbar'>
            <h3 className='mt-5'>&nbsp;&nbsp;
                <i className='far fa-moon'></i>&nbsp;&nbsp;
                <span>{ name }</span>
            </h3>

            <button className='btn mt-5' onClick={ handleLogout } data-testid='logout'>
                Logout
            </button>
        </div>

        <div 
        className='journal__new-entry'
        onClick={ handleAddNew }
        data-testid='new-entry'
        >
            <i className='far fa-calendar-plus fa-5x mb-1'></i>
            <p>
                New entry
            </p>
        </div>

        <JournalEntries />
        
    </aside>
  )
}
