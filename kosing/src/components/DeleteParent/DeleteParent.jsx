import { useEffect, useState, useRef } from 'react';
import { Form, Button, Alert, FloatingLabel } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { userReduxState, clearUserState } from 'features/user/user-slice';
import firebase from '../../firebase/firebaseConfig';

import { auth } from '../../firebase/firebaseConfig';

const DeleteParent = () => {
  const userObject = useSelector(userReduxState);

  const dispatch = useDispatch();
  const history = useHistory();
  const confirmRef = useRef(null);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmPassword, setConfirPassword] = useState('');

  const [showMessage, setShowMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [firebaseError, setFirebaseError] = useState(false);

  const parent = firebase.auth().currentUser;
  let children = useSelector(userReduxState).children;

  // remove alert if user edits input field
  useEffect(() => {
    setShowMessage(false);
    return () => {
      setShowMessage({});
    };
  }, [confirmPassword]);

  const goScroll = () => {
    setTimeout(() => {
      confirmRef.current.scrollIntoView();
    }, 100);
  };

  // deletes the childs data
  const onDeleteParent = (e) => {
    e.preventDefault();

    if (!showConfirmation) {
      setShowConfirmation(true);
      goScroll();
      return;
    } else if (!confirmPassword) {
      setErrorMessage('Du måste fylla i epostadress för att bekräfta konto.');
      setShowMessage(true);
      goScroll();
      return;
    }

    // try to re-authenticate user before deleting account
    auth
      .signInWithEmailAndPassword(parent.email, confirmPassword)
      .then((response) => {
        // delete children in children and in history
        children.forEach((child) => {
          // detele all children in /children
          try {
            firebase
              .database()
              .ref(`children/${child.userName.toLowerCase()}`)
              .remove();
          } catch (e) {
            setFirebaseError(true);
            console.log('error deleting children in children', e);
          }

          // detele all children in /history
          if (!firebaseError) {
            try {
              firebase
                .database()
                .ref(`history/${child.userName.toLowerCase()}`)
                .remove();
            } catch (e) {
              setFirebaseError(true);
              console.log('error deleting children in history', e);
            }
          }
        });

        // delete user data
        if (!firebaseError) {
          try {
            firebase.database().ref('users/').child(userObject.userId).remove();
          } catch (e) {
            setFirebaseError(true);
            console.log('error deleting user data', e);
          }
        }

        // delete user account
        if (!firebaseError) {
          parent
            .delete()
            .then((resolve) => {})
            .catch((e) => {
              setShowMessage(true);
              setErrorMessage('Ditt konto kunde inte raderas.');
              console.log('error deleting account', e);
              goScroll();
              return;
            });
        }

        if (!firebaseError) {
          dispatch(clearUserState());
          history.push({
            pathname: '/konto-avslutat',
            state: { name: parent.email },
          });
        }
      })
      .catch((e) => {
        setShowMessage(true);
        setErrorMessage(
          'Ditt konto kunde inte raderas. Kontrollera att du skrivit rätt lösenord.'
        );
        goScroll();
        console.log('error re-authenticating user', e);
        return;
      });
  };

  const AlertMessage = () => {
    return (
      <Alert
        variant={errorMessage ? 'danger' : 'success'}
        onClose={() => setShowMessage(false)}
        dismissible
        className='mt-3'>
        {errorMessage ? errorMessage : 'Användaren har raderats.'}
      </Alert>
    );
  };

  return (
    <div className='p-1 mb-2 border rounded'>
      <h5 ref={confirmRef}>Radera konto</h5>
      <Form onSubmit={onDeleteParent}>
        {showConfirmation ? (
          <>
            <Alert variant='secondary' className='m-2 p-0 mb-3'>
              <p className='m-0 p-1'>
                När du raderar ett konto försvinner all data och historik för
                det kontot. Bekräfta genom att skriva in e-postadressen på det
                konto du vill radera
              </p>
            </Alert>

            <Form.Group className='m-2 p-0' controlId='formPassword'>
              <FloatingLabel
                controlId='floatingInput'
                label='Lösenord'
                className='mb-3'>
                <Form.Control
                  placeholder='Lösenord'
                  autoComplete='off'
                  type='password'
                  value={confirmPassword}
                  onChange={(e) => setConfirPassword(e.target.value)}
                />
              </FloatingLabel>
            </Form.Group>
          </>
        ) : null}

        <Button variant='primary' type='submit' className='mt-2 mb-2'>
          Radera konto
        </Button>

        {showMessage ? <AlertMessage /> : null}
      </Form>
    </div>
  );
};

export default DeleteParent;
