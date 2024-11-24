import { types } from "../types/types";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { auth, googleAuthProvider } from "../firebase/firebaseConfig";
import { finishLoading, startLoading } from "./ui";
import Swal from 'sweetalert2';
import { noteLogout } from "./notes";

export const startLoginEmailPassword = (email, password) => {

    return async (dispatch) => {
        try {
            dispatch(startLoading());
            const {user} = await signInWithEmailAndPassword(auth, email, password);

            dispatch( login(user.uid, user.displayName));
            dispatch(finishLoading());
        }
        catch (err) {
            dispatch(finishLoading());
            Swal.fire('Error', err.message, 'error');
        } 
    }
}

export const startRegisterWithEmailPassswordName = (email, password, name) => {

    return async (dispatch) => {
        try {
            dispatch(startLoading());
            const { user } = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(user, { displayName: name });
            
            dispatch(
                login(user.uid, user.displayName)
            );
            dispatch(finishLoading());
        }
        catch (err) {
            Swal.fire('Error', err.message, 'error');
            dispatch(finishLoading())
        } 
    }
}

export const startGoogleLogin = () => {
    return async (dispatch) => {
        try {
          const { user } = await signInWithPopup(auth, googleAuthProvider);
          dispatch(
            login( user.uid, user.displayName )
          );
        } catch (error) {
          console.error("Error al iniciar sesión con Google:", error);
        }
    };
}

export const login = (uid, displayName) => ({
        type: types.login,
        payload: {
            uid,
            displayName
        }
    })

export const startLogout = () => {
    return async (dispatch) => {
        try {
            await auth.signOut();
            dispatch( logout() );
            dispatch( noteLogout() );
        } catch (err) {
            console.error("Error al hacer Logout:", err);
        }
    }
}

export const logout = () => ({
    type: types.logout
})