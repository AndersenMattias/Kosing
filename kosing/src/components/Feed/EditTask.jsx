import { Form, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import firebase from '../../firebase/firebaseConfig';
import { userReduxState, setSelected } from 'features/user/user-slice';
import { weekdays } from './weekdays.js';

import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

const EditTask = ({ child, taskId, task }) => {
  const userInRedux = useSelector(userReduxState);

  const dispatch = useDispatch();

  const [taskDescription, setTaskDescription] = useState(task.task);
  const [taskValue, setTaskValue] = useState(task.value);
  const [infoMessage, setInfoMessage] = useState('');
  const [tasksInState, setTasksInState] = useState([]);
  const [category, setCategory] = useState(null);
  const [sortedCategories, setSortedCategories] = useState([]);
  const [checkedState, setCheckedState] = useState(
    new Array(weekdays.length).fill(false)
  );
  const [anyDayCheckedState, setAnyDayCheckedState] = useState(false);
  const successMessage = 'Uppgiften har uppdaterats';

  // Use effect för att kunna mappa nuvarande kategori till select inputen
  useEffect(() => {
    const categories = [
      { value: null, label: 'Ingen kategori' },
      { value: 'cleaning', label: 'Städa' },
      { value: 'dishes', label: 'Diska' },
      { value: 'washing', label: 'Tvätta' },
      { value: 'trash', label: 'Sophantering' },
      { value: 'yardwork', label: 'Trädgårdsarbete' },
      { value: 'ironing', label: 'Stryka' },
      { value: 'exercise', label: 'Motionera' },
    ];
    if (task.category) {
      const current = categories.find((cat) => task.category === cat.value); // Hittar task.category
      const sorted = categories.filter((cat) => cat.value !== current.value); // Och tar bort den ur arrayen
      let backend = sorted.shift(); // och tar bort första värdet i arrayen
      sorted.push(backend); // och lägger det sist
      sorted.unshift(current); // Och lägger task.category först
      setSortedCategories(sorted);
      setCategory(current.value);
    } else {
      setSortedCategories(categories);
    } // eslint-disable-next-line
  }, []);

  //Tömmer "övrigga" checkboxar när anyday markeras
  useEffect(() => {
    if (anyDayCheckedState) {
      setCheckedState([false, false, false, false, false, false, false, true]);
    } else {
      setCheckedState(new Array(weekdays.length).fill(false));
    }
  }, [anyDayCheckedState]);

  //Hittar de tasks som är markerade, markerar checkboxar och lägger tasks i state
  useEffect(() => {
    let tasksOfType = Object.entries(child.tasks).filter(
      (taskInChild) => taskInChild[1].task === task.task
    );
    if (tasksOfType[0][1].day === 'anyday') {
      setAnyDayCheckedState(true);
      let tasksInWeek = new Array(weekdays.length - 1).fill(false);
      tasksInWeek.push(
        tasksOfType.find((taskOfDay) => taskOfDay[1].day === weekdays[7].name)
      );
      setTasksInState(tasksInWeek);
    } else {
      let daysSelected = []; // skapar en array med true/false beroende på om dag finns, sätter initstate på checkoboxar
      let tasksInWeek = []; // sätter ut objekten i en array baserat på veckodag, false om inget objekt finns
      for (let i = 0; i < weekdays.length - 1; i++) {
        if (
          tasksOfType.find((taskOfDay) => taskOfDay[1].day === weekdays[i].name)
        ) {
          daysSelected.push(true);
          tasksInWeek.push(
            tasksOfType.find(
              (taskOfDay) => taskOfDay[1].day === weekdays[i].name
            )
          );
        } else {
          tasksInWeek.push(false);
          daysSelected.push(false);
        }
      }
      setCheckedState(daysSelected);
      setTasksInState(tasksInWeek);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (infoMessage !== '') {
      setInfoMessage('');
    } // eslint-disable-next-line
  }, [taskDescription, taskValue, checkedState]);

  // Håller reda på state för checkboxarna och uppgifter som ligger i state
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

    setInfoMessage(successMessage);

    setTimeout(() => {
      for (let day = 0; day < weekdays.length; day++) {
        if (checkedState[day]) {
          if (tasksInState[day]) {
            //Här uppdaterar vi
            try {
              firebase
                .database()
                .ref(
                  `users/${
                    userInRedux.userId
                  }/children/${child.userName.toLowerCase()}/tasks/${
                    tasksInState[day][0]
                  }`
                )
                .update({
                  day: weekdays[day].name,
                  task: taskDescription,
                  value: taskValue,
                  category,
                });
            } catch (e) {
              console.log(e);
            }
          } else {
            //Här skriver vi nytt
            try {
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
        } else if (tasksInState[day]) {
          //Här raderar vi
          try {
            firebase
              .database()
              .ref(
                `users/${
                  userInRedux.userId
                }/children/${child.userName.toLowerCase()}/tasks/${
                  tasksInState[day][0]
                }`
              )
              .remove();
          } catch (e) {
            console.log(e);
          }
        }
      }
      dispatch(setSelected(null));
    }, 500);
  };

  return (
    <Form className='mb-3' onSubmit={createTask}>
      <Form.Group className='mb-1'>
        <Form.Label className='m-1'>
          <span>Ändra beskrivningen av uppgiften</span>
        </Form.Label>
        <Form.Control
          type='text'
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          placeholder={`Beskriv uppgiften som ${child.name} ska utföra`}
        />
      </Form.Group>

      <Form.Group className='mb-3'>
        <Form.Label className='m-1'>
          <span>Ändra värde på uppgiften</span>
        </Form.Label>
        <Form.Control
          type='number'
          min='1'
          max='1000'
          value={taskValue}
          onChange={(e) => setTaskValue(e.target.value)}
          placeholder='Ange ett värde'
        />
      </Form.Group>
      <Form.Group className='mb-0 d-flex p-2 pt-0'>
        <Form.Control as='select' onChange={(e) => setCategory(e.target.value)}>
          {sortedCategories.map((cat) => (
            <option key={cat.label} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </Form.Control>
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
                className='d-flex flex-column align-items-end p-1'
                inline
                disabled={anyDayCheckedState}
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
        Uppdatera uppgift
      </Button>
      <Button
        onClick={() => {
          setTimeout(() => {
            dispatch(setSelected(null));
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

export default EditTask;
