import {
  Form,
  Button,
  FloatingLabel,
  Row,
  Col,
  Alert,
  Image,
} from 'react-bootstrap';
import { useState, useRef, useEffect } from 'react';
import firebase from '../../firebase/firebaseConfig';
import { userReduxState, setSelected } from 'features/user/user-slice';
import { useSelector, useDispatch } from 'react-redux';
import UploadImageModal from 'components/UploadImage/UploadImageModal';

const AddGoal = ({ child, setShowUpdateGoal }) => {
  const userInRedux = useSelector(userReduxState);
  const dispatch = useDispatch();
  const [goalDescription, setGoalDescription] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const goalRef = useRef(null);

  //bild för målsättning
  const [newImage, setNewImage] = useState(null);

  useEffect(() => {
    if (child.target > 0) {
      goalRef.current.scrollIntoView();
      const points =
        child.points && Number(child.points) - Number(child.target);
      try {
        firebase
          .database()
          .ref(
            `users/${
              userInRedux.userId
            }/children/${child.userName.toLowerCase()}`
          )
          .update({
            target: 0,
            targetName: '',
            celebrate: true,
            targetImage: null,
            points:
              points && points > 0 && typeof points === 'number' ? points : 0,
          });
      } catch (e) {
        console.log(e);
      }
    } // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (infoMessage !== '') {
      setInfoMessage('');
    } // eslint-disable-next-line
  }, [goalDescription, goalTarget]);

  const createGoal = (e) => {
    e.preventDefault();

    if (goalDescription.trim() === '') {
      setInfoMessage('Du måste ange en beskrivning av målet');
      return;
    }
    if (goalTarget.trim() === '') {
      setInfoMessage('Du måste ge målet ett värde');
      return;
    }

    try {
      firebase
        .database()
        .ref(
          `users/${userInRedux.userId}/children/${child.userName.toLowerCase()}`
        )
        .update({
          target: goalTarget,
          targetName: goalDescription,
          targetImage: newImage,
        });
      setSuccess(true);
    } catch (e) {
      console.log(e);
    }
    dispatch(setSelected(null));
    setShowUpdateGoal(false);
  };

  return (
    <div ref={goalRef} style={{ width: '95%' }}>
      {!success ? (
        <div>
          <h5>Målet har nollställts</h5>
          <p>
            {child.name} har nått målet {userInRedux.selected}!
          </p>
          <p>
            Klicka på <span className='text-success'>skapa nytt mål</span> för
            att lägga till ett nytt mål direkt. Du kan även välja{' '}
            <span className='text-primary'>avbryt</span> nu och ställa in målet
            senare under {child.name}
            {child.name.split('').pop() === 's' ? '' : 's'} inställningar
          </p>
          <Button
            className='m-1 mb-2'
            variant='outline-success'
            onClick={() => setSuccess(true)}>
            Skapa nytt mål
          </Button>
          <Button
            className='m-1 mb-2'
            variant='outline-primary'
            onClick={() => {
              dispatch(setSelected(null));
              setTimeout(() => {
                setShowUpdateGoal(false);
              }, 200);
            }}>
            Avbryt
          </Button>
        </div>
      ) : (
        <Form className='mb-0' onSubmit={createGoal}>
          <h5>Lägg till ett nytt mål</h5>

          <Form.Group className='mb-2'>
            <Row style={{ alignItems: 'center' }}>
              <Col xs={10}>
                <FloatingLabel label={`Beskriv målet som ${child.name} ska nå`}>
                  <Form.Control
                    autoComplete='off'
                    type='text'
                    placeholder={`Beskriv målet som ${child.name} ska nå`}
                    value={goalDescription}
                    onChange={(e) => setGoalDescription(e.target.value)}
                  />
                </FloatingLabel>
              </Col>

              <Col className='ps-0'>
                <UploadImageModal image={newImage} setImage={setNewImage} />
              </Col>
            </Row>
          </Form.Group>

          <Form.Group className='mb-2'>
            <FloatingLabel
              label='Ange det totala poängvärdet för målet'
              className='mb-1'>
              <Form.Control
                type='number'
                autoComplete='off'
                min='1'
                max='10000'
                value={goalTarget}
                onChange={(e) => setGoalTarget(e.target.value)}
                placeholder='Ange det totala poängvärdet för målet'
              />
            </FloatingLabel>
          </Form.Group>

          {newImage && (
            <Alert
              variant='secondary'
              className='m-0 p-2 mb-2'
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
          <Button type='submit' variant='outline-success' className='m-1'>
            Spara mål
          </Button>
          <Button
            variant='outline-danger'
            className='m-1'
            onClick={() => {
              dispatch(setSelected(null));
              setTimeout(() => {
                setShowUpdateGoal(false);
              }, 200);
            }}>
            Avbryt
          </Button>
          <p className='text-danger'>{infoMessage}</p>
        </Form>
      )}
    </div>
  );
};

export default AddGoal;
