import { configureStore } from "@reduxjs/toolkit";
import { login } from "../../actions/auth";
import { authReducer } from "../../reducers/authReducer";
import { notesReducer } from "../../reducers/notesReducer";
import { uiReducer } from "../../reducers/uiReducer";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom/cjs/react-router-dom.min";
import { AppRouter } from "../../components/routers/AppRouter";
import { act } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";

jest.mock('../../actions/auth', () => ({
    login: jest.fn()
}));

describe('Pruebas en <AppRouter />', () => {

    let store;
    let contenedor;

    beforeEach(() => {
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

        store.dispatch = jest.fn();

        const { container } = render(
            <Provider store={store}>
                <MemoryRouter>
                    <AppRouter />
                </MemoryRouter>
            </Provider>
        );

        contenedor = container;

        jest.clearAllMocks();
    });
    
    test('should match with snapshot', () => { 
        expect(contenedor).toMatchSnapshot();
    })

    test('should trigger the login action', async () => {
        
        let user;

        await act( async () => {
            const userCred = await signInWithEmailAndPassword(auth, 'test.testing@gmail.com', '123456');
            user = userCred.user;   
        });

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <AppRouter />
                </MemoryRouter>
            </Provider>
        );

        expect(login).toHaveBeenCalledWith(user.uid, user.displayName);
    });
});