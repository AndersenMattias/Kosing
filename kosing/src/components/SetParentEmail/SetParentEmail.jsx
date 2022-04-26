import { useState, useEffect } from 'react';
import { Form, Button, Alert, FloatingLabel } from 'react-bootstrap';

// firebase
import firebase from 'firebase/app';
import { auth } from '../../firebase/firebaseConfig';

const SetParentEmail = () => {
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updateDone, setUpdateDone] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const parentUser = firebase.auth().currentUser;

  // clear alert when user edits input fields
  useEffect(() => {
    if (!updateDone) {
      setShowMessage(false);
      setErrorMessage('');
    } // eslint-disable-next-line
  }, [email, confirmPassword]);

  const onSaveHandler = (e) => {
    e.preventDefault();

    if (email === parentUser.email) {
      setErrorMessage('Det är din nuvarande e-postadress.');
      setShowMessage(true);
      return;
    } else if (email.trim() === '') {
      setErrorMessage('Du måste fylla i en ny e-postadress.');
      setShowMessage(true);
      return;
    } else if (confirmPassword.trim() === '') {
      setErrorMessage('Du måste fylla i ditt lösenord.');
      setShowMessage(true);
      return;
    }

    auth
      .signInWithEmailAndPassword(parentUser.email, confirmPassword)
      .then((response) => {})
      .then(() => {
        parentUser
          .updateEmail(email)
          .then((resolve) => {
            setUpdateDone(true);
            setShowMessage(true);
            setEmail('');
            setConfirmPassword('');
            setTimeout(() => {
              setUpdateDone(false);
            }, 200);
          })
          .catch((e) => {
            setShowMessage(true);
            setErrorMessage(
              'Din e-postadress kunde inte uppdateras. Är du säker på att du skrivit en giltig e-postadress?'
            );
            // console.log(e);
            return;
          });
      })
      .catch((e) => {
        setShowMessage(true);
        setErrorMessage(
          'Din e-postadress kunde inte uppdateras. Är du säker på att du skrev rätt lösenord?'
        );
        // console.log(e);
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
        {errorMessage ? errorMessage : 'Den nya e-postadressen har sparats.'}
      </Alert>
    );
  };

  return (
    <div className='p-1 mb-3 border rounded'>
      <h5>Ändra E-post</h5>
      <Alert variant='secondary' className='m-2 p-0 mb-3'>
        <p className='m-0 p-1'>
          Fyll i en ny e-postadress och bekräfta genom att fylla i ditt
          nuvarande lösenord.
        </p>
      </Alert>

      <>
        <Form.Group className='m-2 p-0'>
          <FloatingLabel label='Din nuvarande e-postadress' className='mb-3'>
            <Form.Control
              disabled
              placeholder='Din nuvarande e-postadress'
              autoComplete='off'
              type='text'
              value={parentUser?.email}
            />
          </FloatingLabel>

          <FloatingLabel label='Ny e-postadress' className='mb-3'>
            <Form.Control
              placeholder='Ny e-postadress'
              autoComplete='off'
              type='text'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FloatingLabel>

          <FloatingLabel label='Nuvarande lösenord' className='mb-3'>
            <Form.Control
              placeholder='Nuvarande lösenord'
              type='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </FloatingLabel>
        </Form.Group>

        <Button
          variant='primary'
          type='submit'
          className='mt-2 mb-2'
          onClick={onSaveHandler}>
          Spara ändringar
        </Button>

        {showMessage ? <AlertMessage /> : null}
      </>
    </div>
  );
};

export default SetParentEmail;
