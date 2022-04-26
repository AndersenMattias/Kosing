import { Form, Button, FloatingLabel } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import firebase from '../../firebase/firebaseConfig';
import { userReduxState, setSelected } from 'features/user/user-slice';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { weekdays } from './weekdays.js';

const AddTask = ({ child, setShowAddTask }) => {
  const userInRedux = useSelector(userReduxState);

  const dispatch = useDispatch();

  const [taskDescription, setTaskDescription] = useState('');
  const [taskValue, setTaskValue] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [category, setCategory] = useState(null);
  const [checkedState, setCheckedState] = useState(
    new Array(weekdays.length).fill(false)
  );
  const [anyDayCheckedState, setAnyDayCheckedState] = useState(false);
  const successMessage = 'Uppgiften har skapats';

  useEffect(() => {
    if (anyDayCheckedState) {
      setCheckedState([false, false, false, false, false, false, false, true]);
    } else {
      setCheckedState(new Array(weekdays.length).fill(false));
    }
  }, [anyDayCheckedState]);

  useEffect(() => {
    if (infoMessage !== '') {
      setInfoMessage('');
    } // eslint-disable-next-line
  }, [taskDescription, taskValue, checkedState]);

  // Håller reda på state för checkboxarna
  const handleCheckbox = (checkedDay) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === checkedDay ? !item : item
    );
    setCheckedState(updatedCheckedState);
  };

  // Sparar task till firebase
  const createTask = (e) => {
    e.preventDefault();

    if (taskDescription.trim() === '') {
      setInfoMessage('Du måste ange en beskrivning av uppgiften');
      return;
    }
    if (taskValue.trim() === '') {
      setInfoMessage('Du måste ge uppgiften ett värde');
      return;
    }
    if (!checkedState.find((day) => day === true) && !anyDayCheckedState) {
      setInfoMessage('Du måste välja minst en dag eller valfri dag');
      return;
    }

    setInfoMessage(successMessage);

    setTimeout(() => {
      if (anyDayCheckedState) {
        try {
          //skapar task
          firebase
            .database()
            .ref(
              `users/${
                userInRedux.userId
              }/children/${child.userName.toLowerCase()}/tasks/${uuidv4()}`
            )
            .set({
              day: 'anyday',
              task: taskDescription,
              value: taskValue,
              category,
            });
        } catch (e) {
          console.log(e);
        }
      } else {
        for (let day = 0; day < weekdays.length - 1; day++) {
          if (checkedState[day]) {
            try {
              //skapar task
              firebase
                .database()
                .ref(
                  `users/${
                    userInRedux.userId
                  }/children/${child.userName.toLowerCase()}/tasks/${uuidv4()}`
                )
                .set({
                  day: weekdays[day].name,
                  task: taskDescription,
                  value: taskValue,
                  category,
                });
            } catch (e) {
              console.log(e);
            }
          }
        }
      }
      setShowAddTask(false);
      dispatch(setSelected(null));
    }, 1200);
  };

  return (
    <Form className='mb-1' onSubmit={createTask}>
      <Form.Group className='m-2 p-0'>
        <FloatingLabel label='Beskrivning av uppgift' className='mb-3'>
          <Form.Control
            placeholder='Beskrivning av uppgift'
            type='text'
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
          />
        </FloatingLabel>
      </Form.Group>

      <Form.Group className='m-2 p-0'>
        <FloatingLabel label='Värde på uppgiften' className='mb-3'>
          <Form.Control
            placeholder='Värde på uppgiften'
            type='number'
            min='1'
            max='1000'
            value={taskValue}
            onChange={(e) => setTaskValue(e.target.value)}
          />
        </FloatingLabel>
      </Form.Group>
      <Form.Group className='mb-0 d-flex p-2 pt-0'>
        <Form.Select as='select' onChange={(e) => setCategory(e.target.value)}>
          <option value={null} hidden>
            Välj kategori
          </option>
          <option value='cleaning'>Städa</option>
          <option value='dishes'>Diska</option>
          <option value='washing'>Tvätta</option>
          <option value='trash'>Sophantering</option>
          <option value='yardwork'>Utomhusarbete</option>
          <option value='ironing'>Stryka</option>
          <option value='exercise'>Motionera</option>
        </Form.Select>
      </Form.Group>
      <p className=''>Vilka dagar ska uppgiften utföras?</p>
      <Form.Check
        className='p-5 pt-0 pb-0 d-flex'
        inline
        checked={anyDayCheckedState}
        onChange={() => setAnyDayCheckedState(!anyDayCheckedState)}
        label={'Valfri dag'}
        name={'valfri'}
        id={'valfri'}
      />
      <Form.Group className='d-flex justify-content-center'>
        {weekdays.map(
          (day, index) =>
            index < 7 && (
              <Form.Check
                key={index}
                disabled={anyDayCheckedState}
                className='d-flex flex-column align-items-end p-1'
                inline
                checked={checkedState[index]}
                onChange={() => handleCheckbox(index)}
                label={day.label}
                name={day.label}
                id={day.name}
              />
            )
        )}
      </Form.Group>

      <Button type='submit' variant='outline-primary' className='m-1'>
        Lägg till uppgift
      </Button>
      <Button
        onClick={() => {
          setTimeout(() => {
            dispatch(setSelected(null));
            setShowAddTask(false);
          }, 200);
        }}
        variant='outline-primary'
        className='m-1'>
        Ångra
      </Button>
      <p
        className={
          infoMessage === successMessage ? 'text-success' : 'text-danger'
        }>
        {infoMessage}
      </p>
    </Form>
  );
};

export default AddTask;
