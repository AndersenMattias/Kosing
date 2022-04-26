import { Button, ProgressBar } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { useState, useEffect } from 'react';
import { userReduxState } from 'features/user/user-slice';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setSelected } from 'features/user/user-slice';
import { v4 as uuidv4 } from 'uuid';
import AddTask from './AddTask';
import AddGoal from './AddGoal';

const IndividualProgressComponent = ({
  target,
  index = 0,
  showEvents = false,
}) => {
  const userInRedux = useSelector(userReduxState);
  const dispatch = useDispatch();
  const [showAddTask, setShowAddTask] = useState(false);
  const [showUpdateGoal, setShowUpdateGoal] = useState(false);
  const history = useHistory();
  let progress = Math.floor((100 / target.target) * target.points);
  //   const childbgcolor = '196, 230, 245';
  const childbgcolor = '248 248 248';

  useEffect(() => {
    return () => {
      dispatch(setSelected(null));
    }; // eslint-disable-next-line
  }, []);

  return (
    <div key={uuidv4()} className='mb-3 shadow border border-muted rounded'>
      <div
        className='p-1 pt-2 pb-0 mb-3 rounded'
        style={{ backgroundColor: `rgb(${childbgcolor})` }}>
        <div
          className='d-flex justify-content-between align-items-baseline'
          style={{ backgroundColor: `rgb(${childbgcolor})` }}>
          <p style={{ width: '6rem' }}>{target.name}</p>
          <Button
            variant='outline-primary'
            size='sm'
            disabled={userInRedux.selected}
            onClick={() => {
              setTimeout(() => {
                dispatch(setSelected(target.userName));
                setShowAddTask(!showAddTask);
                showEvents &&
                  setTimeout(() => {
                    window.scrollTo({
                      top: 200 * (index + 1),
                      left: 0,
                      behavior: 'smooth',
                    });
                  }, 10);
              }, 250);
            }}>
            Skapa ny uppgift
          </Button>
          {showEvents && (
            <Button
              variant='outline-primary'
              size='sm'
              onClick={() => {
                setTimeout(() => {
                  history.push(`/barn/${target.userName}`);
                }, 150);
              }}>
              Alla händelser
            </Button>
          )}
        </div>
        {!userInRedux.selected && (
          <div className='p-0 mb-1 mt-0'>
            {target.name}{' '}
            {target.targetName
              ? `jobbar mot målet: ${target.targetName}`
              : 'har inget mål just nu'}
          </div>
        )}
        {userInRedux.selected === target.userName && showAddTask && (
          <AddTask child={target} setShowAddTask={setShowAddTask} />
        )}
        {target.target > 0 && (
          <ProgressBar
            className='mb-1'
            variant='success'
            label={`${
              !progress || !isFinite(progress)
                ? '0'
                : progress > 100
                ? '100'
                : progress
            }%`}
            now={progress < 5 ? '5' : progress}
            style={{
              height: '1rem',
              marginTop: '-.3rem',
              backgroundColor: 'rgb(180, 214, 242)',
            }}
          />
        )}
        <div className='d-flex justify-content-center align-items-center'>
          {!showUpdateGoal && isFinite(progress) && progress >= 100 && (
            <>
              {' '}
              <h6 className='display-7'> Målet är uppnått</h6>
              <Button
                size='sm'
                variant='success'
                className='m-2 mt-0 mb-2'
                onClick={() => {
                  dispatch(setSelected(target.targetName));
                  setShowUpdateGoal(true);
                }}>
                Godkänn
              </Button>{' '}
            </>
          )}
          {showUpdateGoal && (
            <AddGoal child={target} setShowUpdateGoal={setShowUpdateGoal} />
          )}
        </div>
      </div>
    </div>
  );
};

export default IndividualProgressComponent;
