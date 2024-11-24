import moment from 'moment'
import React from 'react'
import { activeNote } from '../../actions/notes';
import { useDispatch } from 'react-redux';

export const JournalEntry = ({id, date, title, body, url}) => {

    const noteDate = moment(date);
    const dispatch = useDispatch();

    const handleEntryClick = () => {
        dispatch(activeNote(id, {title, body, date, url}));
    }

  return (
    <div 
        className='journal__entry pointer animate__animated animate__backInLeft animate__faster'
        onClick={handleEntryClick}
    >

        {
            url &&
            <div 
                className='journal_entry-picture'
                style={{
                    backgroundSize: 'cover',
                    backgroundImage: `url(${url})`
                }}
            ></div>
        }

        <div className='journal_entry-body'>
            <p className='journal__entry-title'>
                {title}
            </p>
            <p className='journal__entry-content'>
                {body}
            </p>
        </div>

        <div className='journal__entry-date-box'>
            <span>{noteDate.format('dddd')}</span>
            <h4>{noteDate.format('Do')}</h4>
        </div>
    </div>
  )
}
