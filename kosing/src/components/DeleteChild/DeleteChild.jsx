import { useEffect, useState, useRef } from 'react';
import { Form, Button, Alert, FloatingLabel } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { userReduxState, removeChild } from 'features/user/user-slice';
import firebase from '../../firebase/firebaseConfig';

const DeleteChild = ({ userName, name }) => {
  const userInRedux = useSelector(userReduxState);
  const dispatch = useDispatch();
  const history = useHistory();
  const confirmRef = useRef(null);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmAccount, setConfirmAccount] = useState('');
  const [firebaseError, setFirebaseError] = useState(false);
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    setShowMessage(false);
    return () => {
      setShowMessage({});
    };
  }, [confirmAccount]);

  const goScroll = () => {
    setTimeout(() => {
      confirmRef.current.scrollIntoView();
    }, 100);
  };

  // deletes the childs data
  const deleteChild = (e) => {
    e.preventDefault();

    if (!showConfirmation) {
      setShowConfirmation(true);
      goScroll();
      return;
    } else if (confirmAccount === '') {
      setMessage('Du måste fylla i namnet på kontot du vill radera.');
      setShowMessage(true);
      goScroll();
      return;
    } else if (confirmAccount.trim() !== name.trim()) {
      setMessage(
        'Namnet du fyllde i matchar inte namnet på kontot du försöker radera.'
      );
      setShowMessage(true);
      goScroll();
      return;
    }

    // delete child from parent object
    try {
      firebase
        .database()
        .ref(`users/${userInRedux.userId}/children/${userName.toLowerCase()}`)
        .remove();
    } catch (e) {
      setFirebaseError(true);
      console.log(e);
    }

    if (!firebaseError) {
      // delete child login data
      try {
        firebase.database().ref(`children/${userName.toLowerCase()}`).remove();
      } catch (e) {
        setFirebaseError(true);
        console.log(e);
      }
    }

    // delete child from  history (Mouahaha!)
    if (!firebaseError) {
      try {
        firebase.database().ref(`history/${userName.toLowerCase()}`).remove();
      } catch (e) {
        setFirebaseError(true);
        console.log(e);
      }
    }

    if (firebaseError) {
      setMessage('Barnets konto kunde inte raderas.');
      setShowMessage(true);
    } else {
      //remove child from store
      dispatch(removeChild(userName));
      history.push({
        pathname: '/radering-lyckades',
        state: { name },
      });
    }
  };

  const MyAlert = () => {
    return (
      <Alert
        variant='warning'
        onClose={() => setShowMessage(false)}
        dismissible
        className='mt-3'>
        {message}
      </Alert>
    );
  };

  return (
    <div className='p-1 mb-2 border rounded'>
      <h5 ref={confirmRef}>Radera konto</h5>
      <Form onSubmit={deleteChild}>
        {showConfirmation ? (
          <>
            <Alert
              variant='secondary'
              className='m-2 p-0 mb-3'
           
              >
              <p className='m-0 p-1'>
                När du raderar ett konto försvinner all data och historik för
                det kontot. Bekräfta genom att skriva in namnet på det konto du
                vill radera.
              </p>
            </Alert>

            <Form.Group className='m-2 p-0'>
              <FloatingLabel label='Namn' className='mb-3'>
                <Form.Control
                  placeholder='Namn'
                  autoComplete='off'
                  type='text'
                  value={confirmAccount}
                  onChange={(e) => setConfirmAccount(e.target.value)}
                />
              </FloatingLabel>
            </Form.Group>
          </>
        ) : null}

        <Button variant='primary' type='submit' className='mt-2 mb-2'>
          Radera konto
        </Button>

        {showMessage ? <MyAlert /> : null}
      </Form>
    </div>
  );
};

export default DeleteChild;
