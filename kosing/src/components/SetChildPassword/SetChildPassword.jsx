import { useState, useEffect } from 'react';
import { Form, Button, Alert, FloatingLabel } from 'react-bootstrap';
import firebase from '../../firebase/firebaseConfig';

//decrypt
import { decrypt, encrypt } from 'react-crypt-gsm';

const SetChildPassword = ({ userName, name }) => {
  const [passwordFromDb, setPasswordFromDb] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [firebaseError, setFirebaseError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // fetch password and updates input value when user changes child
  useEffect(() => {
    try {
      firebase
        .database()
        .ref(`children/${userName.toLowerCase()}`)
        .child('password')
        .on('value', (snapshot) => {
          const data = snapshot.val();
          setPasswordFromDb(data);
          setNewPassword(decrypt(data));
        });
    } catch (e) {
      console.log(e);
    }
  }, [userName]);

  // clear messages when user edits input or changes child
  useEffect(() => {
    setShowMessage(false);
    setErrorMessage(null);
    return () => {
      setErrorMessage({});
      setShowMessage({});
    };
  }, [userName, newPassword]);

  // updates the password value in firebase
  // and shows a message if saved successfully
  const saveChanges = (e) => {
    e.preventDefault();
    if (newPassword === decrypt(passwordFromDb)) return;

    const passwordRules = /^[A-Za-zÅÄÖåäö0-9_]*$/;

    if (!passwordRules.test(newPassword)) {
      setShowMessage(true);
      setErrorMessage(
        'Lösenord får endast innhålla svenska bokstäver, siffror och understreck.'
      );
      return;
    } else if (newPassword.length < 3) {
      setShowMessage(true);
      setErrorMessage('Lösenorde måste vara minst 3 tecken.');
      return;
    } else if (newPassword.length > 20) {
      setShowMessage(true);
      setErrorMessage('Lösenordet får inte vara längre än 20 tecken.');
      return;
    }

    try {
      firebase
        .database()
        .ref(`children/${userName.toLowerCase()}`)
        .child('password')
        .set(encrypt(newPassword));
    } catch (e) {
      setFirebaseError(true);
      console.log(e);
    }

    // if save to firebase successfull, show message
    !firebaseError && setShowMessage(true);
  };

  const MyAlert = () => {
    return (
      <Alert
        variant={errorMessage ? 'danger' : 'success'}
        onClose={() => setShowMessage(false)}
        dismissible
        className='mt-3'>
        {errorMessage ? errorMessage : 'Det nya lösenordet har sparats.'}
      </Alert>
    );
  };

  return (
    <div className='p-1 mb-3 border rounded'>
      <h5>Användarnamn och Lösenord</h5>
      <Form onSubmit={saveChanges}>
        <Form.Group className='m-2 p-0' controlId='formUserName'>
          <FloatingLabel label='Användarnamn' className='mb-3'>
            <Form.Control
              disabled
              placeholder='Användarnamn'
              autoComplete='off'
              type='text'
              value={userName}
            />
          </FloatingLabel>
        </Form.Group>

        <Form.Group className='m-2 p-0' controlId='formPassword'>
          <FloatingLabel
            controlId='floatingInput'
            label='Lösenord'
            className='mb-3'>
            <Form.Control
              placeholder='Lösenord'
              autoComplete='off'
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <i
              className={`${showPassword ? 'far fa-eye' : 'far fa-eye-slash'}`}
              style={{
                position: 'absolute',
                marginTop: '-37px',
                marginLeft: 'calc(50% - 35px)',
                zIndex: 100,
              }}
              onClick={() => setShowPassword(!showPassword)}></i>
          </FloatingLabel>
        </Form.Group>

        <Button variant='primary' type='submit' className='mt-2 mb-2'>
          Spara ändringar
        </Button>

        {showMessage ? <MyAlert /> : null}
      </Form>
    </div>
  );
};

export default SetChildPassword;
