import { fireEvent, render } from "@testing-library/react";
import { JournalEntry } from "../../../components/journal/JournalEntry";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { activeNote } from "../../../actions/notes";

jest.mock('../../../actions/notes', () => ({
    activeNote: jest.fn()
}));

describe('Tests in <JournalEntry />', () => {

    let store;
    let testContainer;
    const note = {
        id: 10,
        date: 0,
        title: 'Hello',
        body: 'World',
        url: 'https://someurl.com'
    }

    beforeEach(() => {
        store = configureStore({
            reducer: {
            },
            preloadedState: {
            }
        })

        store.dispatch = jest.fn();

        const {container} = render(
            <Provider store={store}>
                <JournalEntry {...note} />
            </Provider>
        );

        testContainer = container;
    });

    test('should match snapshot', () => {
        expect(testContainer).toMatchSnapshot();
    })

    test('should call activeNote', () => {
        const noteActiveDiv = testContainer.querySelector('.journal__entry');
        fireEvent.click(noteActiveDiv);
        const { id, ...noteWithoutId } = note;

        expect(activeNote).toHaveBeenCalled();
        expect(activeNote).toHaveBeenCalledWith(id, noteWithoutId);
    })
});