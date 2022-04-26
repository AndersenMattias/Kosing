import Table from 'react-bootstrap/Table';
import firebase from '../../firebase/firebaseConfig';
import { useState, useEffect } from 'react';
import { weekdays } from './weekdays.js';

const formatDate = (time) => {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const rawDate = new Date(Number(time)).toString();
  const day = weekdays.find(
    (day) => day.dateday === rawDate.substring(0, 3)
  ).label;
  const dateDay = rawDate.substring(8, 10);
  const month = months.indexOf(rawDate.substring(4, 7)) + 1;
  const year = rawDate.substring(11, 15);
  return `${day} ${dateDay}/${month}-${year}`;
};

const HistoryComponent = ({ childId }) => {
  const [taskHistory, setTaskHistory] = useState(false);
  const [showHistory, setShowHistory] = useState(true);

  useEffect(() => {
    const dbRef = firebase.database().ref();
    dbRef
      .child('history')
      .child(childId.toLowerCase())
      .get()
      .then((snapshot) => {
        if (snapshot.exists()) {
          setTaskHistory(snapshot.val());
        } else {
          setShowHistory(false);
        }
      })
      .catch((error) => {
        console.error(error);
      });
    // eslint-disable-next-line
  }, []);

  return (
    showHistory && (
      <div className='mt-4 bg-light rounded border'>
        <h5 className='pt-1 mb-1 text-secondary'>
          Historik - Utförda uppgifter
        </h5>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Datum</th>
              <th colSpan='2'>Uppgift</th>
            </tr>
          </thead>
          <tbody>
            {/*TDOD - Sätt rader i en pagination*/}
            {taskHistory &&
              Object.values(taskHistory).map((task) => (
                <tr key={task.taskId}>
                  <td style={{ width: '8.3rem' }}>{formatDate(task.time)}</td>
                  <td colSpan='2'>{task.task}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
    )
  );
};

export default HistoryComponent;
