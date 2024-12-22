import { configureStore } from "@reduxjs/toolkit";
import { notesReducer } from "../../../reducers/notesReducer";
import { fireEvent, render } from "@testing-library/react";
import { Provider } from "react-redux";
import { NoteScreen } from "../../../components/notes/NoteScreen";
import { activeNote } from "../../../actions/notes";

jest.mock('../../../actions/notes', () => ({
    activeNote: jest.fn()
}));

describe('Tests in <NoteScreen />', () => {

    let store;
    let testContainer;

    beforeEach(() => {
        store = configureStore({
            reducer: {
                notes: notesReducer
            },
            preloadedState: {
                notes: {
                    active: {
                        id: '123',
                        title: 'Test',
                        body: 'Testing with Jest and Testing-Library',
                        url: 'https://someurl.com'
                    }
                }
            }
        });

        store.dispatch = jest.fn();

        const { container } = render(
            <Provider store={store}>
                <NoteScreen />
            </Provider>
        );

        testContainer = container;

        jest.clearAllMocks();
    });

    test('should match the snapshot', () => {
        expect(testContainer).toMatchSnapshot(); 
    })

    test('should call activeNote', () => {
        const titleInput = testContainer.querySelector('input[name="title"]');
        fireEvent.change(titleInput, { target: { value: 'Hello' } });

        const { id, body, url } = store.getState().notes.active;
        
        expect(activeNote).toHaveBeenCalledTimes(1);
        expect(activeNote).toHaveBeenCalledWith(id, { title: 'Hello', body: body, id: id, url: url });
    })
});