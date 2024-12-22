import { authReducer } from "../../reducers/authReducer";
import { types } from "../../types/types";

describe("Probando en authReducer.js", () => {

    test('debe de retornar el estado por defecto', () => {
        const state = authReducer(undefined, {type: ''});
        expect(state).toEqual({});
    });

    test('debe retornar un arreglo vacio', () => {
        const state = authReducer({logged: true}, {type: types.logout});
        expect(state).toEqual({});
    });

    test('debe retornar id y username', () => {
        const state = authReducer(undefined, {
            type: types.login, 
            payload: {
                uid: '12345', 
                displayName: 'Toni'
            }
        });
        expect(state).toEqual({
            uid: '12345', 
            name: 'Toni'
        });
    });

});