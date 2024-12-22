import { fireEvent, render } from "@testing-library/react";
import { LoginScreen } from "../../../components/auth/LoginScreen";
import { configureStore } from "@reduxjs/toolkit";
import { uiReducer } from "../../../reducers/uiReducer";
import { notesReducer } from "../../../reducers/notesReducer";
import { authReducer } from "../../../reducers/authReducer";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom/cjs/react-router-dom.min";
import { startGoogleLogin } from "../../../actions/auth";
import '@testing-library/jest-dom';

jest.mock('../../../actions/auth', () => ({
    startGoogleLogin: jest.fn()
}));

describe('Pruebas en <LoginScreen />', () => {
    
    let store;
    let contenedor;

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
                notes: [],
                ui: {}
            }
        });

        store.dispatch = jest.fn();

        const { container } = render(
            <Provider store={store}>
                <MemoryRouter>
                    <LoginScreen />
                </MemoryRouter>
            </Provider>
        );

        contenedor = container;

        jest.clearAllMocks();
    });

    test('should match the snapshot', () => {
        expect(contenedor).toMatchSnapshot();
    });

    test('should trigger the startGoogleLogin action', () => {
        const button = contenedor.querySelector('.google-btn');

        fireEvent.click(button);

        expect(startGoogleLogin).toHaveBeenCalled();
        jest.restoreAllMocks();
    });


    // test there is the word 'Create' in the component LoginScreen.js
    test('should contain the word "Create"', () => {
        const title = contenedor.querySelector('[data-testid="create-link"]');
        
        expect(title).toBeInTheDocument();
        expect(title.textContent).toContain('Create');
    });
    
});