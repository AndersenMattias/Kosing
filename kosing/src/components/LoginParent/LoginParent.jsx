import { useEffect, useState } from 'react';
import { Button, Form, Alert, FloatingLabel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { auth } from '../../firebase/firebaseConfig';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import { clearUserState } from 'features/user/user-slice';

import ForgotPasswordModal from 'components/ForgotPasswordModal/ForgotPasswordModal';

const LoginUser = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayAuthErr, setDisplayAuthErr] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      user && history.push('/min-sida');
    });
  }, [history]);

  useEffect(() => {
    if ((email || password) && displayAuthErr === true) {
      setDisplayAuthErr(false);
    }
    // eslint-disable-next-line
  }, [email, password]);

  //function to login user
  function handleSumbit(e) {
    e.preventDefault();

    auth
      .signInWithEmailAndPassword(email.toLowerCase(), password)
      .then((response) => {
        dispatch(clearUserState());
        sessionStorage.removeItem('child');
      })
      .catch((e) => {
        setDisplayAuthErr(true);
      });
  }

  return (
    <>
      <Form style={{ marginBottom: '2em' }} onSubmit={handleSumbit}>
        <h1>Logga in som vuxen</h1>
        <Form.Group className='m-2 p-0'>
          <FloatingLabel label='Användarnamn' className='mb-3'>
            <Form.Control
              required
              placeholder='Användarnamn'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FloatingLabel>
        </Form.Group>

        <Form.Group className='m-2 p-0'>
          <FloatingLabel label='Lösenord' className='mb-3'>
            <Form.Control
              required
              placeholder='Lösenord'
              type={ showPassword ? 'text' : 'password' }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <i className={`${showPassword ? 'far fa-eye' : 'far fa-eye-slash'}`} 
              style={{position: 'absolute', marginTop: '-37px', marginLeft: 'calc(50% - 35px)', zIndex: 100}} 
              onClick={() => setShowPassword(!showPassword)}>
            </i>
          </FloatingLabel>
        </Form.Group>

        <Form.Group>
          <Form.Label>
            <Link to='/skapa-ny-användare'>
              <p>Skapa konto</p>
            </Link>
          </Form.Label>
        </Form.Group>

        <Form.Group>
          <Form.Label>
            <ForgotPasswordModal />
          </Form.Label>
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

      {displayAuthErr && (
        <Alert
          variant='danger'
          onClose={() => setDisplayAuthErr(false)}
          dismissible>
          <p>
            Ingen användare med den kombinationen användarnamn / lösenord finns
            registrerad, försök igen
          </p>
        </Alert>
      )}
    </>
  );
};

export default LoginUser;
