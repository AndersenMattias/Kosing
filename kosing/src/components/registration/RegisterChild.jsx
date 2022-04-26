import { useEffect, useState } from 'react';
import {
  Button,
  Alert,
  Form,
  FloatingLabel,
  Row,
  Col,
  Image,
} from 'react-bootstrap';

import firebase from '../../firebase/firebaseConfig';

import { useSelector } from 'react-redux';
import { userReduxState } from 'features/user/user-slice';
import UploadImageModal from 'components/UploadImage/UploadImageModal';

//encrypt
import { encrypt } from 'react-crypt-gsm';

export const RegisterChild = () => {
  const userInRedux = useSelector(userReduxState);

  //bild för målsättning
  const [image, setImage] = useState(null);

  // states före registrering
  const [userName, setUserName] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [target, setTarget] = useState('');
  const [targetName, setTargetName] = useState('');

  const [registered, setRegistered] = useState(false);

  //  togglar displaymeddelande vid "error"
  const [displayAuthErr, setDisplayAuthErr] = useState(false);
  const [displayErrorMessage, setDisplayErrorMessage] = useState('');

  const dbRef = firebase.database().ref();

  // tillåtna tecken vid registrering
  const allowedChars = /^[A-Za-zÅÄÖåäö0-9_]*$/;

  // togglar errormeddelande om userName eller password är "sant"
  useEffect(() => {
    if (
      (userName || name || password || target || targetName) &&
      displayAuthErr === true
    ) {
      setDisplayAuthErr(false);
    }
    // eslint-disable-next-line
  }, [userName, name, password, target, targetName]);

  // visar meddelande om lyckad registrering
  const UserCreatedMessage = () => {
    return (
      <Alert variant='success' onClose={() => setRegistered(false)} dismissible>
        <Alert.Heading>Registrerad!</Alert.Heading>
      </Alert>
    );
  };

  async function onRegisterHandler(e) {
    e.preventDefault();

    // kollar om användarnamn innehåller blanksteg/mellanrum
    if (userName.includes(' ')) {
      setDisplayAuthErr(true);
      setDisplayErrorMessage(
        'Blanksteg/mellanslag är inte tillåtet i användarnamn!'
      );
      return;
    } else if (!userName || !name || !password || !target || !targetName) {
      setDisplayAuthErr(true);
      setDisplayErrorMessage('Alla fält måste fyllas i, vänligen försök igen.');
      return;
    } else if (!allowedChars.test(userName)) {
      setDisplayAuthErr(true);
      setDisplayErrorMessage(
        'Användarnamn får endast innehålla svenska bokstäver, siffror och understreck.'
      );
      return;
    }

    const dbCheck = await dbRef
      .child('children')
      .child(userName.toLowerCase())
      .get()
      .then((snapshot) => {
        if (snapshot.exists()) {
          return true;
        } else {
          return false;
        }
      })
      .catch((error) => {
        console.error(error);
      });

    if (dbCheck) {
      setDisplayAuthErr(true);
      setDisplayErrorMessage('Användarnamnet är upptaget');
      return;
    }

    if (password.length < 3) {
      setDisplayAuthErr(true);
      setDisplayErrorMessage('Lösenordet måste vara minst 3 tecken.');
      return;
    } else if (password.length > 20) {
      setDisplayAuthErr(true);
      setDisplayErrorMessage('Lösenordet får inte vara längre än 20 tecken.');
      return;
    } else if (!allowedChars.test(password)) {
      setDisplayAuthErr(true);
      setDisplayErrorMessage(
        'Lösenordet får endast innehålla svenska bokstäver, siffror och understreck.'
      );
      return;
    }

    if (name && userName && password && target && targetName) {
      firebase
        .database()
        .ref(`users/${userInRedux.userId}/children/${userName.toLowerCase()}`)
        .set({
          name: name.trim(),
          userName: userName.trim(),
          password: encrypt(password),
          target,
          targetName: targetName.trim(),
          tasks: null,
          points: null,
          targetImage: image,
        });

      //skapar ett barn på topnivå i usersdatabasen. används endast till inloggning
      firebase
        .database()
        .ref(`children/${userName.toLowerCase()}`)
        .set({
          name,
          userName,
          password: encrypt(password),
          parent: userInRedux.userId,
        });

      setUserName('');
      setName('');
      setPassword('');
      setTarget('');
      setTargetName('');
      setRegistered(true);
      setImage(null);

      setTimeout(() => {
        setRegistered(false);
      }, 3000);
    }
  }

  return (
    <>
      <Form
        style={{ marginBottom: 20 }}
        className='mb-3'
        onSubmit={onRegisterHandler}>
        <h3>Registrera</h3>
        <Form.Group>
          <FloatingLabel label='Användarnamn' className='mb-3'>
            <Form.Control
              placeholder='Användarnamn'
              autoComplete='off'
              type='text'
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </FloatingLabel>
          <FloatingLabel label='Namn' className='mb-3'>
            <Form.Control
              placeholder='Namn'
              autoComplete='off'
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FloatingLabel>
          <FloatingLabel label='Lösenord' className='mb-3'>
            <Form.Control
              placeholder='Lösenord'
              autoComplete='off'
              type='text'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FloatingLabel>

          <FloatingLabel label='Målsättning i antal poäng' className='mb-3'>
            <Form.Control
              placeholder='Målsättning i antal poäng'
              autoComplete='off'
              type='number'
              value={target}
              min='1'
              max='100000'
              onChange={(e) => setTarget(e.target.value)}
            />
          </FloatingLabel>

          <Form.Group className='mb-3'>
            <Row style={{ alignItems: 'center' }}>
              <Col xs={10}>
                <FloatingLabel
                  controlId='floatingInput'
                  label='Beskrivning av målsättning'>
                  <Form.Control
                    placeholder='Beskrivning av målsättning'
                    autoComplete='off'
                    type='text'
                    value={targetName}
                    onChange={(e) => setTargetName(e.target.value)}
                  />
                </FloatingLabel>
              </Col>

              <Col className='ps-0'>
                <UploadImageModal image={image} setImage={setImage} />
              </Col>
            </Row>
          </Form.Group>

          {image && (
            <Alert
              variant='secondary'
              className='m-0 p-2'
              style={{
                display: 'flex',
                justifyContent: 'space-evenly',
                alignItems: 'center',
              }}>
              <p className='m-0 p-0'>Bild på målsättning </p>
              <Image
                src={image}
                style={{ height: '4em', borderRadius: '0.4em' }}
              />
            </Alert>
          )}
        </Form.Group>

        <Button className='mt-3' variant='primary' type='submit'>
          Registrera barn
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

      {registered ? <UserCreatedMessage /> : null}
    </>
  );
};

export default RegisterChild;
