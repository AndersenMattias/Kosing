import { useState, useEffect } from 'react';
import { Form, Button, Alert, FloatingLabel } from 'react-bootstrap';

// firebase
import firebase from 'firebase/app';
import { auth } from '../../firebase/firebaseConfig';

const SetParentPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [updateDone, setUpdateDone] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  // clear alert when user edits input fields
  useEffect(() => {
    if (!updateDone) {
      setShowMessage(false);
      setErrorMessage('');
    } // eslint-disable-next-line
  }, [newPassword, confirmNewPassword, currentPassword]);

  const onSaveHandler = (e) => {
    e.preventDefault();

    const parentUser = firebase.auth().currentUser;

    if (!newPassword || !confirmNewPassword || !currentPassword) {
      setErrorMessage('Du måste fylla i alla fält.');
      setShowMessage(true);
      return;
    } else if (newPassword !== confirmNewPassword) {
      setErrorMessage('Du måste fylla samma nya lösenord två gånger.');
      setShowMessage(true);
      return;
    } else if (newPassword.length < 6) {
      setErrorMessage('Ditt nya lösenord måste vara minst 6 tecken långt.');
      setShowMessage(true);
      return;
    }

    auth
      .signInWithEmailAndPassword(parentUser.email, currentPassword)
      .then((response) => {})
      .then(() => {
        parentUser
          .updatePassword(newPassword)
          .then(() => {
            setUpdateDone(true);
            setShowMessage(true);
            setNewPassword('');
            setConfirmNewPassword('');
            setCurrentPassword('');
            setTimeout(() => {
              setUpdateDone(false);
            }, 200);
          })
          .catch((e) => {
            // new password not accepted
            setShowMessage(true);
            setErrorMessage(
              'Ditt lösenord gick inte att ändra. Troligen uppfyllde du inte kraven för lösenordet. Testa igen.'
            );
            console.log(e);
            return;
          });
      })
      .catch((e) => {
        // login failed, current password probably wrong
        setShowMessage(true);
        setErrorMessage(
          'Ditt lösenord kunde inte uppdateras. Är du säker på att du skrev rätt nuvarande lösenord?'
        );
        console.log(e);
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
        {errorMessage ? errorMessage : 'Det nya lösenordet har sparats.'}
      </Alert>
    );
  };

  return (
    <div className='p-1 mb-3 border rounded'>
      <h5>Ändra Lösenord</h5>
      <Alert variant='secondary' className='m-2 p-0 mb-3'>
        <p className='m-0 p-1'>
          Fyll i ett nytt lösenord två gånger och bekräfta genom att fylla i
          ditt nuvarande lösenord.
        </p>
      </Alert>
      <>
        <Form.Group className='m-2 p-0'>
          <FloatingLabel label='Nytt lösenord' className='mb-3'>
            <Form.Control
              placeholder='Nytt lösenord'
              type={ showNewPassword ? 'text' : 'password' }
              autoComplete='new-password'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <i className={`${showNewPassword ? 'far fa-eye' : 'far fa-eye-slash'}`} 
              style={{position: 'absolute', marginTop: '-37px', marginLeft: 'calc(50% - 35px)', zIndex: 100}} 
              onClick={() => setShowNewPassword(!showNewPassword)}>
            </i>
          </FloatingLabel>

          <FloatingLabel label='Bekräfta nytt lösenord' className='mb-3'>
            <Form.Control
              placeholder='Bekräfta nytt lösenord'
              type={ showConfirmNewPassword ? 'text' : 'password' }
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
            <i className={`${showConfirmNewPassword ? 'far fa-eye' : 'far fa-eye-slash'}`} 
              style={{position: 'absolute', marginTop: '-37px', marginLeft: 'calc(50% - 35px)', zIndex: 100}} 
              onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}>
            </i>
          </FloatingLabel>

          <FloatingLabel label='Nuvarande lösenord' className='mb-3'>
            <Form.Control
              placeholder='Nuvarande lösenord'
              type={ showPassword ? 'text' : 'password' }
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <i className={`${showPassword ? 'far fa-eye' : 'far fa-eye-slash'}`} 
              style={{position: 'absolute', marginTop: '-37px', marginLeft: 'calc(50% - 35px)', zIndex: 100}} 
              onClick={() => setShowPassword(!showPassword)}>
            </i>
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

export default SetParentPassword;
