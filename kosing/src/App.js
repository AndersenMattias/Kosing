import { useEffect, useState } from 'react';
import { Switch, Route } from 'react-router-dom';

import { Container, Row, Col } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { loadUserId, streamData } from 'features/user/user-slice';

// components
import StarterPage from './components/StarterPage/StarterPage';
import Header from 'components/Header/Header';
import MainFeed from 'components/Feed/MainFeed';
import Footer from 'components/Footer/Footer';
import LoginParent from 'components/LoginParent/LoginParent';
import LoginChild from './components/LoginChild/LoginChild';
import RegisterParent from 'components/registration/RegisterParent';
import RegisterChild from 'components/registration/RegisterChild';
import UserSettings from './components/EditParent/EditParent';
import EditChild from 'components/EditChild/EditChild';
import ChildrenLandingPage from 'components/ChildrenLandingPage/ChildrenLandingPage';
import ShowConfirmation from 'components/DeleteChild/ShowConfirmation';
import AccountClosed from 'components/DeleteParent/AccountClosed';

// firebase
import { auth } from './firebase/firebaseConfig';
import firebase from 'firebase/firebaseConfig';
import ChildInfo from 'components/Feed/ChildInfo';
import NotFoundPage from 'components/NotFoundPage/NotFoundPage';

function App() {
  const dispatch = useDispatch();

  // Only route to page, If there is a user
  const [user, setUser] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      //saves user to state for routing
      setUser(user);
      //Lägger till userId i redux state
      user && dispatch(loadUserId({ userId: user.uid, email: user.email }));
      //Lägger till en lyssnare som uppdaterar redux state varje gång userobjektet i databasen ändras
      if (user) {
        const userRef = firebase.database().ref('users/' + user.uid);
        userRef.on('value', (snapshot) => {
          let data = snapshot.val();
          dispatch(streamData(data));
        });
      }
    });
    // eslint-disable-next-line
  }, [dispatch]);

  return (
    <>
      <Header />
      <Container fluid='sm' className='pt-1' style={{ paddingBottom: '4rem',  maxWidth: '550px' }}>
        <Row>
          <Col
            align='center'
            className='d-flex flex-column justify-content-center'>
            <Switch>
              <Route exact path='/'>
                <StarterPage />
              </Route>
              <Route path='/logga-in-vuxen'>
                <LoginParent />
              </Route>
              <Route path='/skapa-ny-användare'>
                <RegisterParent />
              </Route>

              {user && (
                <Route path='/min-sida'>
                  <MainFeed />
                </Route>
              )}

              {user && (
                <Route path='/redigera-barnkonto'>
                  <EditChild />
                </Route>
              )}

              {user && (
                <Route path='/barn/:childId'>
                  <ChildInfo />
                </Route>
              )}

              {user && (
                <Route path='/konto-inställningar'>
                  <UserSettings />
                </Route>
              )}

              {user && (
                <Route path='/registrera-barn'>
                  <RegisterChild />
                </Route>
              )}

              <Route path='/logga-in-barn'>
                <LoginChild />
              </Route>
              <Route path='/radering-lyckades'>
                <ShowConfirmation />
              </Route>
              <Route path='/konto-avslutat'>
                <AccountClosed />
              </Route>

              <Route path='/min-sida-barn'>
                <ChildrenLandingPage />
              </Route>

              <Route path='*'>
                <NotFoundPage user={user} />
              </Route>
            </Switch>
          </Col>
        </Row>
      </Container>

      <Footer />
    </>
  );
}

export default App;
