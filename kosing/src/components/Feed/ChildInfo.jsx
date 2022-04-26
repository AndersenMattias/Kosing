import { useState, useEffect } from 'react';
import { Alert, Button } from 'react-bootstrap';
import firebase from '../../firebase/firebaseConfig';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { userReduxState, setSelected } from 'features/user/user-slice';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import IndividualProgressComponent from './IndividualProgressComponent';
import EditTask from './EditTask';
import { weekdays } from './weekdays.js';
import HistoryComponent from './HistoryComponent';

const ChildInfo = () => {
  const userInRedux = useSelector(userReduxState);
  const [child, setChild] = useState(false);
  const { childId } = useParams();
  const dispatch = useDispatch();

  // Om barnet finns i state, läs in barnet till objektet child.
  useEffect(() => {
    if (userInRedux.children.find((child) => child.userName === childId)) {
      setChild(
        userInRedux.children.find((child) => child.userName === childId)
      );
    }
  }, [userInRedux, childId]);

  const deleteTask = (task) => {
    //Ta bort en task
    try {
      firebase
        .database()
        .ref(
          `users/${
            userInRedux.userId
          }/children/${child.userName.toLowerCase()}/tasks/${task[0]}`
        )
        .remove();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    child && (
      <>
        <div>
          <h5 className='mt-2'>
            {child.name}
            {child.name.split('').pop() === 's' ? '' : 's'} sida
          </h5>
        </div>
        <IndividualProgressComponent
          target={child}
          seLectedChild={child.userName}
        />
        <div className='bg-light rounded border'>
          <h5 className='pt-1 mb-1 text-secondary'>Veckoschema</h5>
          {/* Mappar ut veckodagar */}
          {weekdays.map((day, index) => {
            let taskExists =
              child.tasks &&
              Object.values(child.tasks).find(
                (tasksToday) => tasksToday.day === day.name
              );
            return (
              <div key={day.name}>
                <div
                  style={{
                    backgroundImage:
                      taskExists && taskExists !== 'undefined'
                        ? 'linear-gradient(to right, rgb(237, 237, 237), rgb(250, 250, 250))'
                        : 'linear-gradient(to right, rgb(222, 222, 222), rgb(250, 250, 250))',
                    marginBottom: '-.7rem',
                  }}>
                  <h6
                    align='left'
                    className={`display-${
                      taskExists && taskExists !== 'undefined' ? '6' : '7'
                    } text-secondary mb-0`}>
                    <em>
                      <ul>
                        {day.full}{' '}
                        {taskExists && taskExists !== 'undefined'
                          ? ''
                          : '- inga uppgifter'}
                      </ul>
                    </em>
                  </h6>
                </div>
                {/* Mappar ut tasks på rätt dag */}
                {child.tasks &&
                  Object.entries(child.tasks)
                    .filter((tasksToday) => tasksToday[1].day === day.name)
                    .map((task) => (
                      <Alert
                        key={uuidv4()}
                        variant='success'
                        className='p-1 mb-1 shadow-sm d-flex flex-column justify-content-between align-items-center'>
                        <div
                          className='d-flex justify-content-between align-items-center'
                          style={{ width: '100%' }}>
                          <span align='left'>{task[1].task}</span>
                          <div className='d-flex'>
                            <Button
                              variant='outline-secondary'
                              size='sm'
                              disabled={userInRedux.selected}
                              className='p-1'
                              onClick={() => {
                                // eslint-disable-next-line
                                setTimeout(() => {
                                  deleteTask(task);
                                }, 400);
                              }}>
                              <span
                                className='d-inline-block'
                                style={{ width: '2.9rem' }}>
                                Ta bort
                              </span>
                            </Button>
                            <Button
                              variant='outline-success'
                              size='sm'
                              disabled={userInRedux.selected}
                              className=''
                              onClick={() => {
                                dispatch(setSelected(task[0]));
                                setTimeout(() => {
                                  window.scrollTo({
                                    top:
                                      index === 0
                                        ? 100
                                        : index < 3
                                        ? 160 * index
                                        : index < 6
                                        ? 120 * index
                                        : 105 * index,
                                    left: 0,
                                    behavior: 'smooth',
                                  });
                                }, 10);
                              }}>
                              Redigera
                            </Button>
                          </div>
                        </div>
                        {userInRedux.selected &&
                          userInRedux.selected === task[0] && (
                            <EditTask
                              child={child}
                              taskId={task[0]}
                              task={task[1]}
                            />
                          )}
                      </Alert>
                    ))}
              </div>
            );
          })}
        </div>
        <HistoryComponent childId={childId} />
      </>
    )
  );
};

export default ChildInfo;
