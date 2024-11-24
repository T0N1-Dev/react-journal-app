import React, { useEffect, useState } from 'react';
import { BrowserRouter, Switch, Redirect } from 'react-router-dom';
import { JournalScreen } from '../journal/JournalScreen';
import { AuthRouter } from './AuthRouter';
import { auth } from '../../firebase/firebaseConfig';
import { useDispatch } from 'react-redux';
import { login } from '../../actions/auth';
import { PrivateRoute } from './PrivateRoutes';
import { PublicRoute } from './PublicRoutes';
import { startLoadingNotes } from '../../actions/notes';

export const AppRouter = () => {
  const dispatch = useDispatch();
  const [ isLoggedIn, setIsLoggedIn ] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user?.uid) {
        dispatch(login(user.uid, user.displayName));
        setIsLoggedIn(true);

        dispatch(startLoadingNotes(user.uid));
        
      } else {
        setIsLoggedIn(false);
      }
      setChecking(false);
    });
  }, [dispatch, setChecking]);

  if (checking) {
    return <h1>Wait...</h1>;
  }

  return (
      <BrowserRouter>
        <Switch>
          <PublicRoute 
            path="/auth/*" 
            component={AuthRouter}
            isAuthenticated={ isLoggedIn }
          />
          <PrivateRoute 
            exact 
            path="/" 
            component={JournalScreen}
            isAuthenticated={isLoggedIn} 
          />
          <Redirect to="/auth/login" />
        </Switch>
      </BrowserRouter>
  );
};

