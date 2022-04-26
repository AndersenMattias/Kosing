import { useEffect, useState } from 'react';
import {
  Form,
  Alert,
  Button,
  FloatingLabel,
  InputGroup,
} from 'react-bootstrap';

import { auth } from '../../firebase/firebaseConfig';

import { useDispatch } from 'react-redux';
import { loadUserId } from 'features/user/user-slice';
import { useHistory } from 'react-router';
import UserTermsModal from '../UserTermsModal/UserTermsModal';

const RegisterParent = () => {
  const history = useHistory();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  // eslint-disable-next-line
  const [parentInState, setParentInState] = useState('');

  const [displayAuthErr, setDisplayAuthErr] = useState(false);
  const [displayErrorMessage, setDisplayErrorMessage] = useState('');
  const [checkTerms, setCheckTerms] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (password.length > 5 && password2.length > 5 && email) {
      setDisplayAuthErr(false);
      setDisplayErrorMessage('');
    }
  }, [email, password, password2]);

  // Om inloggad skicka till "min-sida"
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      user && history.push('/min-sida');
    });
  }, [history]);

  // Skickar tillbaka användaren till "första sidan"
  function handleGoBack() {
    history.push('/');
  }

  // create a new user
  function createNewUser(e) {
    e.preventDefault();
    if (!email || !password || !password2) {
      setDisplayAuthErr(true);

      setDisplayErrorMessage('Alla fält måste fyllas i, vänligen försök igen.');
    } else if (password.length < 6 && password2.length < 6) {
      setDisplayErrorMessage('Lösenordet är för kort, försök igen');
      setDisplayAuthErr(true);
    } else if (password !== password2) {
      setDisplayErrorMessage('Lösenorden behöver vara likadana');
      setDisplayAuthErr(true);
    }

    // uses auth to create usersuses auth to create users
    else if (email && password && password2 && !displayAuthErr) {
      auth
        .createUserWithEmailAndPassword(email.toLowerCase(), password)
        .then((user) => {
          dispatch(loadUserId(user.user.uid));
          setEmail('');
          setPassword('');
          setPassword2('');
        })
        .catch((e) => {
          setDisplayAuthErr(true);
          console.log(e.code);
          e.code === 'auth/email-already-in-use' &&
            setDisplayErrorMessage('E-postadressen är redan registrerad');
        });
    }
  }

  return (
    <>
      <Form style={{ marginBottom: '2em' }} onSubmit={createNewUser}>
        <h3>Registrera</h3>
        <Form.Group className='m-2 p-0'>
          <FloatingLabel label='E-postadress' className='mb-3'>
            <Form.Control
              placeholder='E-postadress'
              onChange={(e) => setEmail(e.target.value)}
              type='email'
            />
          </FloatingLabel>
        </Form.Group>

        <Form.Group className='m-2 p-0'>
          <FloatingLabel label='Lösenord' className='mb-3'>
            <Form.Control
              placeholder='Lösenord'
              autoComplete='new-password'
              onChange={(e) => setPassword(e.target.value)}
              type='password'
            />
          </FloatingLabel>

          <FloatingLabel label='Upprepa lösenord' className='mb-3'>
            <Form.Control
              placeholder='Upprepa lösenord'
              autoComplete='new-password'
              onChange={(e) => setPassword2(e.target.value)}
              type='password'
            />
          </FloatingLabel>
        </Form.Group>

        <InputGroup
          className='m-2 p-0 mb-5'
          style={{ justifyContent: 'center' }}>
          <InputGroup.Checkbox
            required
            type='checkbox'
            checked={checkTerms}
            onChange={(e) => setCheckTerms(e.target.checked)}
          />

          <InputGroup.Text style={{ backgroundColor: 'white' }}>
            Jag accepterar
            <UserTermsModal />
          </InputGroup.Text>
        </InputGroup>

        <Button variant='primary' type='submit'>
          Registrera
        </Button>
        <Button variant='warning' type='button' onClick={handleGoBack}>
          Gå tillbaka
        </Button>
      </Form>

      {displayAuthErr && (
        <Alert
          variant='danger'
          onClose={() => setDisplayAuthErr(false)}
          dismissible>
          <p>{displayErrorMessage}</p>
        </Alert>
      )}
    </>
  );
};

export default RegisterParent;
