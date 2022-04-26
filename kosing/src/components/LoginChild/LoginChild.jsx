import { useEffect, useState } from 'react';
import { Button, Form, Alert, FloatingLabel } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';

import { loadChildId } from 'features/user/user-slice';
import firebase, { auth } from 'firebase/firebaseConfig';

//decrypt
import { decrypt } from 'react-crypt-gsm';

const LoginChild = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [childLoginData, setChildLoginData] = useState();
  const [errorMessage, setErrorMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const history = useHistory();

  const allowedChars = /^[A-Za-zÅÄÖåäö0-9_]*$/;
  const wrongNamerOrPassword =
    'Det verkar inte som att du skrivit rätt användarnamn och lösenord. Prova igen!';

  // checks if the password matches, else displays error
  // fetches parent data and loads to store
  // sends user to child landing page
  useEffect(() => {
    if (childLoginData && password === decrypt(childLoginData.password)) {
      auth.signOut();
      //dispatch(clearUserState()); // this breaks childrenLandingPage
      let childObject = {
        userName: userName.trim().toLowerCase(),
        parent: childLoginData.parent,
      };
      dispatch(loadChildId(childObject));
      sessionStorage.setItem('child', JSON.stringify(childObject));
      history.push('/min-sida-barn');
    } else if (childLoginData && password !== childLoginData.password) {
      setShowMessage(true);
      setErrorMessage(wrongNamerOrPassword);
    } // eslint-disable-next-line
  }, [childLoginData]);

  // clear error messagen when user edits form input
  useEffect(() => {
    if ((userName.trim() || password) && errorMessage) {
      setShowMessage(false);
    } // eslint-disable-next-line
  }, [userName, password]);

  const onSubmitLogin = (e) => {
    e.preventDefault();
    //this should never happen but better safe then sorry
    if (!userName || !password) return;

    if (!allowedChars.test(userName.trim()) || !allowedChars.test(password)) {
      setShowMessage(true);
      setErrorMessage(wrongNamerOrPassword);
      return;
    }

    //try to find user in firebase
    try {
      firebase
        .database()
        .ref('children')
        .child(userName.toLowerCase())
        .get()
        .then((snapshot) => {
          if (snapshot.exists()) {
            setChildLoginData(snapshot.val());
          } else {
            // no child found in firebase
            setShowMessage(true);
            setErrorMessage(wrongNamerOrPassword);
          }
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Form onSubmit={onSubmitLogin}>
        <h1>Logga in som barn</h1>
        <Form.Group className='m-2 p-0'>
          <FloatingLabel label='Användarnamn' className='mb-3'>
            <Form.Control
              required
              placeholder='Användarnamn'
              type='text'
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </FloatingLabel>
        </Form.Group>

        <Form.Group className='m-2 p-0'>
          <FloatingLabel label='Lösenord' className='mb-3'>
            <Form.Control
              required
              placeholder='Lösenord'
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

        <Button variant='primary' type='submit'>
          Logga in
        </Button>

        <Link to='/'>
          <Button variant='warning' type='button'>
            Gå tillbaka
          </Button>
        </Link>
      </Form>

      {showMessage && (
        <Alert
          variant='danger'
          onClose={() => setShowMessage(false)}
          dismissible
          className='mt-3'>
          <Alert.Heading>Något gick fel!</Alert.Heading>
          <p>{errorMessage}</p>
        </Alert>
      )}
    </>
  );
};

export default LoginChild;
