import { startLogout } from '../../../actions/auth';
import { startNewNote } from '../../../actions/notes';
import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { Sidebar } from '../../../components/journal/Sidebar';
import { authReducer } from '../../../reducers/authReducer';
import { notesReducer } from '../../../reducers/notesReducer';
import { act } from 'react';

jest.mock('../../../actions/auth', () => ({
    startLogout: jest.fn()
}));

jest.mock('../../../actions/notes', () => ({
    startNewNote: jest.fn()
}));

describe('Tests in <Sidebar />', () => {

    let store;
    let testcontainer;

    beforeEach(() => {
        store = configureStore({
            reducer: {
                auth: authReducer,
                notes: notesReducer
            },
            preloadState: {
                auth: {},
                notes: {}
            }
        });

        store.dispatch = jest.fn();

        act(() => {
            const { container } = render(
                <Provider store={store}>
                    <Sidebar />
                </Provider>
            );
            
            testcontainer = container;
        });

        jest.clearAllMocks();
    });
    
    test('should show correctly', () => {
        expect(testcontainer).toMatchSnapshot();
    });

    test('should call startLogout', () => {
        const logoutButton = testcontainer.querySelector('[data-testid="logout"]');

        fireEvent.click(logoutButton);

        expect(startLogout).toHaveBeenCalled();
    });

    test('should call startNewNote', () => {
        const addButton = testcontainer.querySelector('[data-testid="new-entry"]');

        fireEvent.click(addButton);

        expect(startNewNote).toHaveBeenCalled();
    });
});