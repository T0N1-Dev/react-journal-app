import { configureStore } from "@reduxjs/toolkit";
import { login, logout, startLoginEmailPassword, startLogout } from "../../actions/auth";
import { authReducer } from "../../reducers/authReducer";
import { notesReducer } from "../../reducers/notesReducer";
import { setNotes } from "../../actions/notes";
import { uiReducer } from "../../reducers/uiReducer";
import Swal from "sweetalert2";

jest.mock('sweetalert2', () => ({
    fire: jest.fn()
}));

jest.setTimeout(10000);

describe('Pruebas con las acciones de Auth', () => {

    let store;

    beforeEach(() => {
        // Estado inicial del store
        store = configureStore({
            reducer: {
                auth: authReducer,
                notes: notesReducer,
                ui: uiReducer
            },
            preloadedState: {
                auth: {},
                notes: { notes: [], active: null},
                ui: {}
            }
        }); 

        jest.clearAllMocks();
    });
    
    test('login y logout deben de crear la accion respectiva', () => { 
        const uid = 'TESTING';
        const displayName = 'test';
        store.dispatch(login(uid, displayName));

        expect(store.getState().auth.uid).toBe(uid);
        expect(store.getState().auth.name).toBe(displayName);

        store.dispatch(logout());
        expect(store.getState().auth).toEqual({});
    });

    test('debe de realizar el startLogout', async () => {
        const noteTest = [{
            id: 'wamlUr7Xdd5aaiPu77Sk',
            date: 1733692933412,
            url: 'https://res.cloudinary.com/dmfs1od9n/image/upload/v1733971452/guzchddpbr2cztyjv8bg.jpg',
            title: 'Testing',
            body: 'Jest\nReact-Testing-Library'
        }];

        const uid = 'TESTING';
        const displayName = 'test';

        store.dispatch(login(uid, displayName));
        store.dispatch(setNotes(noteTest));

        expect(store.getState().auth).toBeTruthy();
        expect(store.getState().notes).toBeTruthy();
        
        await store.dispatch(startLogout());

        expect(store.getState().auth).toEqual({});
        expect(store.getState().notes).toEqual({ notes: [], active: null });
    });

    test('debe de iniciar el startLoginEmailPassword', async () => {
        await store.dispatch(startLoginEmailPassword('test.testing@gmail.com', '123456'));
        
        expect(store.getState().auth.uid).not.toEqual({});
        expect(store.getState().ui.loading).toBeFalsy();
    });

    test('debe de mostrar el error en startLoginEmailPassword', async () => {
        await store.dispatch(startLoginEmailPassword('test.testing@gmail.com', 'aaaaaaa'));

        expect(store.getState().auth.uid).toBeUndefined();
        expect(Swal.fire).toHaveBeenCalledWith('Error', expect.any(String), 'error');
    });
});