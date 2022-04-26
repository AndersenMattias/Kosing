import { useEffect, useState } from 'react';
import {
  Form,
  Button,
  Alert,
  FloatingLabel,
  Row,
  Col,
  Image,
} from 'react-bootstrap';
import firebase from '../../firebase/firebaseConfig';

import { useSelector } from 'react-redux';
import { userReduxState } from 'features/user/user-slice';
import UploadImageModal from 'components/UploadImage/UploadImageModal';

const SetChildTarget = ({ userName, target, targetName }) => {
  const [newTarget, setNewTarget] = useState(target);
  const [newTargetName, setNewTargetName] = useState(targetName);
  const [showMessage, setShowMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [firebaseError, setFirebaseError] = useState(false);
  const userInRedux = useSelector(userReduxState);

  //bild för målsättning
  let targetImage = userInRedux.children.find(
    (child) => child.userName === userName
  ).targetImage;
  const [newImage, setNewImage] = useState(targetImage);

  // updates input value when user changes child
  useEffect(() => {
    setNewTarget(target);
    setNewTargetName(targetName);
    setNewImage(
      userInRedux.children.find((child) => child.userName === userName)
        .targetImage
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, targetName, userName]);

  // clear messages when user edits input or changes child
  useEffect(() => {
    setShowMessage(false);
    setErrorMessage('');
    return () => {
      setShowMessage({});
    };
  }, [userName, newTarget, newTargetName, newImage]);

  // updates the target and targetName value in firebase
  // and shows an alert that the value is saved
  const saveChanges = (e) => {
    e.preventDefault();

    if (!newTarget || !newTargetName) {
      setErrorMessage('Alla fält måste vara ifyllda.');
      setShowMessage(true);
      return;
    }

    try {
      firebase
        .database()
        .ref(`users/${userInRedux.userId}/children/${userName.toLowerCase()}`)
        .update({
          target: newTarget,
          targetName: newTargetName,
        });
    } catch (e) {
      setFirebaseError(true);
      console.log(e);
    }

    try {
      firebase
        .database()
        .ref(`users/${userInRedux.userId}/children/${userName.toLowerCase()}`)
        .update({
          targetImage: newImage,
        });
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
        className='m-2'>
        {errorMessage ? errorMessage : 'Det nya målet har sparats.'}
      </Alert>
    );
  };

  return (
    <div className='p-1 mb-3 border rounded'>
      <h5>Mål</h5>
      <Form onSubmit={saveChanges}>
        <Form.Group className='m-2 p-0 mb-3' controlId='formTarget'>
          <FloatingLabel label='Målsättning i poäng'>
            <Form.Control
              placeholder='Målsättning i poäng'
              autoComplete='off'
              type='number'
              min='1'
              max='100000'
              value={newTarget}
              onChange={(e) => setNewTarget(e.target.value)}
            />
          </FloatingLabel>
        </Form.Group>

        <Form.Group className='m-2 p-0 mb-3 pb-0' controlId='formTargetName'>
          <Row style={{ alignItems: 'center' }}>
            <Col xs={10}>
              <FloatingLabel label='Beskrivning av målsättning'>
                <Form.Control
                  placeholder='Beskrivning av målsättning'
                  autoComplete='off'
                  type='text'
                  value={newTargetName}
                  onChange={(e) => setNewTargetName(e.target.value)}
                />
              </FloatingLabel>
            </Col>

            <Col className='ps-0'>
              <UploadImageModal image={newImage} setImage={setNewImage} />
            </Col>
          </Row>
        </Form.Group>

        {newImage && (
          <Alert
            variant='secondary'
            className='m-2 p-2'
            style={{
              display: 'flex',
              justifyContent: 'space-evenly',
              alignItems: 'center',
            }}>
            <p className='m-0 p-0'>Bild på målsättning </p>

            <Image
              src={newImage}
              style={{ height: '4em', borderRadius: '0.4em' }}
            />
          </Alert>
        )}

        <Button variant='primary' type='submit' className='mt-2 mb-2'>
          Spara mål
        </Button>

        {showMessage ? <MyAlert /> : null}
      </Form>
    </div>
  );
};

export default SetChildTarget;
