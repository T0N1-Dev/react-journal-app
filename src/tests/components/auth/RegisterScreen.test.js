import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "../../../reducers/authReducer";
import { uiReducer } from "../../../reducers/uiReducer";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { RegisterScreen } from "../../../components/auth/RegisterScreen";
import { fireEvent, render } from "@testing-library/react";
import { types } from "../../../types/types";
import '@testing-library/jest-dom';

describe('Tests in <RegisterScreen/>', () => {
    let store;
    let testContainer;
    
    beforeEach(() => {
        store = configureStore({
            reducer: {
                auth: authReducer,
                ui: uiReducer
            },
            preloadedState: {
                auth: {},
                ui: {}
            }
        });

        const { container } = render(
            <Provider store={store}>
                <MemoryRouter>
                    <RegisterScreen />
                </MemoryRouter>
            </Provider>
        );

        store.dispatch = jest.fn();

        testContainer = container;
    });

    test('should match the snapshot', () => { 
        expect(testContainer).toMatchSnapshot();
    });

    test('should trigger setError with invalid email', () => {
        const input = testContainer.querySelector('input[name="email"]');
        fireEvent.change(input, { target: { value: 'test' } });

        const form = testContainer.querySelector('form');
        fireEvent.submit(form);

        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith({
            type: types.uiSetError,
            payload: 'Invalid email: test'
        });
    });

    test('should show the error message', () => {
        store = configureStore({
            reducer: {
                auth: authReducer,
                ui: uiReducer
            },
            preloadedState: {
                auth: {},
                ui: {
                    loading: false,
                    mgError: 'Invalid email:'
                }
            }
        });

        const { container } = render(
            <Provider store={store}>
                <MemoryRouter>
                    <RegisterScreen />
                </MemoryRouter>
            </Provider>
        );

        const errorMessage = container.querySelector('.auth__alert-error');
        expect(errorMessage).toBeInTheDocument();
        expect(errorMessage.textContent).toBe('Invalid email:');
    });
});