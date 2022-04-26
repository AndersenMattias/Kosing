import { Alert, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { userReduxState } from 'features/user/user-slice';
import { useSelector } from 'react-redux';
import firebase from '../../firebase/firebaseConfig';
import { v4 as uuidv4 } from 'uuid';

const getTime = (time) => {
  const currentTimestamp = new Date().getTime();
  const minutesSinceLastReload = Math.floor((currentTimestamp - time) / 60000);
  if (Math.floor(minutesSinceLastReload / 1440) > 0) {
    return `${Math.floor(minutesSinceLastReload / 1440)} dagar sedan`;
  } else if (Math.floor(minutesSinceLastReload / 1440) === 1) {
    return '1 dag sedan';
  } else if (Math.floor(minutesSinceLastReload / 60) > 0) {
    return `${Math.floor(minutesSinceLastReload / 60)} timmar sedan`;
  } else {
    return `${minutesSinceLastReload} minuter sedan`;
  }
};

const CompletedTasksComponent = () => {
  const userInRedux = useSelector(userReduxState);
  const [sortedTasks, setSortedTasks] = useState([]);

  //sorterar tasks efter när de utförts
  useEffect(() => {
    const kids = Object.values(userInRedux.children);
    const sorted = [];
    const kidsWithoutTasks = [];

    for (let kid = 0; kid < kids.length; kid++) {
      // Om ett barn inte har några uppgifter i "completed": lägg barnet till kidsWithoutTasks
      if (!kids[kid].completed) {
        kidsWithoutTasks.push({ name: kids[kid].name });
      } else {
        const tasks = Object.entries(kids[kid].completed);
        // Om vi hittar minst en task i ett barns "completed" som inte är approved: loopa igenom
        // alla tasks som är !approved och pusha till sorted[]
        if (
          tasks.find((completedTask) => completedTask[1].approved === false)
        ) {
          for (let task = 0; task < tasks.length; task++) {
            if (tasks[task][1].approved === false) {
              sorted.push({
                taskId: tasks[task][0],
                task: tasks[task][1].task,
                time: tasks[task][1].time,
                value: tasks[task][1].value,
                approved: tasks[task][1].approved,
                userName: kids[kid].userName,
                name: kids[kid].name,
                points: kids[kid].points,
              });
            }
          }
          // Om alla tasks i "completed" är approved, lägga till en post där vi sedan endast
          // plockar ut barnets namn för att visa "Ingen aktivitet att visa just nu"
        } else {
          sorted.push({ name: kids[kid].name, task: 'done', approved: true });
        }
      }
    }

    sorted.sort((a, b) => b.time - a.time);
    sorted.push(...kidsWithoutTasks);
    setSortedTasks(sorted); // eslint-disable-next-line
  }, [userInRedux]);

  const approveTask = (child) => {
    // Lägger till en task i history
    firebase
      .database()
      .ref(`history/${child.userName.toLowerCase()}/${child.taskId}`)
      .set({
        task: child.task,
        taskId: child.taskId,
        time: child.time,
      });
    // Tar bort en task ut completed-katalogen
    firebase
      .database()
      .ref(
        `users/${
          userInRedux.userId
        }/children/${child.userName.toLowerCase()}/completed/${child.taskId}`
      )
      .update({ approved: true });

    firebase
      .database()
      .ref(
        `users/${userInRedux.userId}/children/${child.userName.toLowerCase()}`
      )
      .update({
        points: !child.points
          ? Number(child.value)
          : Number(child.points) + Number(child.value),
      });
  };

  const rejectTask = (child) => {
    // Tar bort en task ut completed-katalogen
    firebase
      .database()
      .ref(
        `users/${
          userInRedux.userId
        }/children/${child.userName.toLowerCase()}/completed/${child.taskId}`
      )
      .remove();
  };

  return (
    <div className='bg-light shadow p-1 pt-0 border rounded'>
      <h6 className='text-start m-1'>Senaste aktiviteter</h6>
      {userInRedux.children.length > 0 ? (
        sortedTasks.map((child) => {
          return child.task ? (
            !child.approved ? (
              <Alert
                key={uuidv4()}
                variant='success'
                className='p-0 mb-2 shadow-sm'>
                <div className='d-flex justify-content-between'>
                  <div className='d-flex flex-column align-items-start'>
                    <span align='left'>
                      {child.name}: {child.task}
                    </span>
                    <span style={{ fontSize: '.9rem' }}>
                      {getTime(child.time).toString()}
                    </span>
                  </div>
                  <div className='d-flex m-0 p-0'>
                    <Button
                      variant='outline-success'
                      size='sm'
                      className='p-1 m-1'
                      onClick={() => {
                        setTimeout(() => {
                          approveTask(child);
                        }, 200);
                      }}>
                      Godkänn
                    </Button>
                    <Button
                      variant='outline-danger'
                      size='sm'
                      className='p-1 m-0 mt-1 mb-1'
                      onClick={() => {
                        setTimeout(() => {
                          rejectTask(child);
                        }, 200);
                      }}>
                      Avvisa
                    </Button>
                  </div>
                </div>
              </Alert>
            ) : (
              <Alert key={uuidv4()} variant='success' className='p-1 shadow-sm'>
                <div className='d-flex flex-column align-items-start'>
                  <span align='left'>
                    {child.name} har ingen aktivitet att visa just nu
                  </span>
                </div>
              </Alert>
            )
          ) : (
            <Alert key={uuidv4()} variant='warning' className='p-1 shadow-sm'>
              <div className='d-flex flex-column align-items-start'>
                <span align='left'>
                  {child.name} har inte utfört några sysslor denna vecka
                </span>
              </div>
            </Alert>
          );
        })
      ) : (
        <p>Inga barn ännu, lägg till ett barn</p>
      )}
    </div>
  );
};

export default CompletedTasksComponent;
