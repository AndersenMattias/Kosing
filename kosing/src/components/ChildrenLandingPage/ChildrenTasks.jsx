import { useEffect, useState } from 'react';
import { Alert, Button } from 'react-bootstrap';
import { calcValueDay } from './weekdayFunctions';
import {
  completeTaskFunction,
  dateToShorter,
  regretTaskFunction,
  showRelevantTasksForCompletedTasklist,
  showRelevantTasksForCurrentTasklist,
} from './taskFunctions';
import firebase from '../../firebase/firebaseConfig';

import check from './images/check.png';

const ChildrenTasks = ({ child, parent }) => {
  const [taskToMap, setTaskToMap] = useState(null);

  useEffect(() => {
    if (child.tasks && child.completed) {
      //Takes out keys to later be able to compare whether they are identical or not
      let keysTasks = Object.keys(child.tasks);
      let keysCompleted = Object.keys(child.completed);

      // Extracts unique values ​​(which tasks are not in completed)
      let uniqeValues = keysTasks.filter((obj) => {
        return keysCompleted.indexOf(obj) === -1;
      });

      let childrens = [];
      // Takes out the unique values and creates new tasks, only if they are not among the completed.
      if (uniqeValues && child.tasks) {
        for (let i = 0; i < uniqeValues.length; i++) {
          let key = uniqeValues[i];

          let day = child.tasks[key].day;
          let valueday = calcValueDay(child.tasks[key].day);
          let task = child.tasks[key].task;
          let value = child.tasks[key].value;
          let category = child.tasks[key].category;
          childrens.push({
            day,
            task,
            value,
            valueday,
            category,
            key: key,
          });
        }
      }
      setTaskToMap(showRelevantTasksForCurrentTasklist(childrens));
    } else if (child.tasks) {
      // To view tasks, if there are no completed ones at all
      let childrens = [];
      let allTasks = Object.entries(child.tasks);

      for (let i = 0; i < allTasks.length; i++) {
        let key = allTasks[i][0];

        let day = allTasks[i][1].day;
        let valueday = calcValueDay(allTasks[i][1].day);
        let task = allTasks[i][1].task;
        let value = allTasks[i][1].value;
        let category = allTasks[i][1].category;
        childrens.push({
          day,
          task,
          value,
          valueday,
          category,
          key: key,
        });
      }
      setTaskToMap(showRelevantTasksForCurrentTasklist(childrens));
    }
  }, [child.completed, child.tasks]);

  return (
    <div
      className='shadow p-1 pt-1 pb-0 border rounded'
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
      }}>
      {/* All tasks that is not in completed are mapped here */}
      {taskToMap &&
        taskToMap
          .sort((a, b) => a.valueday - b.valueday)
          .map((task) => (
            <Alert
              key={task.key}
              variant='info'
              className='p-1 mb-3 border-success'>
              {task.category && (
                <div className='task-icon-wrapper'>
                  <img
                    className='task-icon'
                    src={`../images/${task.category}.png`}
                    style={{ height: '3rem', width: '3rem' }}
                    alt='this'
                  />
                </div>
              )}
              <div
                className='d-flex justify-content-between'
                align='left'
                style={task.category && { paddingLeft: '2.7rem' }}>
                <div className='d-flex flex-column align-items-start'>
                  <span>
                    {task.day}: {task.task}{' '}
                  </span>

                  <span style={{ fontSize: '.9rem' }}></span>
                </div>
                <Button
                  variant='outline-success'
                  size='sm'
                  onClick={() =>
                    completeTaskFunction(
                      firebase,
                      child,
                      task,
                      parent,
                      task.key
                    )
                  }>
                  Fixat!
                </Button>
              </div>
            </Alert>
          ))}

      {taskToMap && taskToMap.length === 0 && (
        <Alert variant='warning' className='p-1'>
          <div className='d-flex flex-column align-items-start'>
            <span align='left'>
              Du har inga sysslor att utföra (varken igår, idag eller imorgon)
            </span>
          </div>
        </Alert>
      )}
      {/* All completed tasks are mapped here*/}
      {child.completed &&
        Object.entries(child.completed)
          .sort((a, b) => b[1].time - a[1].time)
          .map(
            (task) =>
              //Only show relevant completed tasks
              showRelevantTasksForCompletedTasklist(task[1]) && (
                <Alert
                  key={task[1].taskId}
                  variant='warning'
                  className='p-1 mb-3'>
                  <div className='d-flex justify-content-between'>
                    <div className='d-flex flex-column align-items-start'>
                      <span style={{ textDecorationLine: 'line-through' }}>
                        {task[1].task}: {dateToShorter(task[1].time)}{' '}
                      </span>
                    </div>
                    {/* When the parent approves the activity */}
                    {task[1].approved ? (
                      <img
                        style={{
                          width: '1.5em',
                          height: '1.5em',
                          borderRadius: '4em',
                          backgroundColor: 'white',
                        }}
                        src={check}
                        alt='uppgiften är godkänd'
                      />
                    ) : (
                      // When the activity has not been approved, the child can still regret it
                      <Button
                        variant='outline-warning'
                        size='sm'
                        onClick={() =>
                          regretTaskFunction(firebase, child, task[0], parent)
                        }>
                        Ångra
                      </Button>
                    )}
                  </div>
                </Alert>
              )
          )}
    </div>
  );
};

export default ChildrenTasks;
