export const completeTaskFunction = (
  firebase,
  child,
  task,
  parent,
  taskKey
) => {
  // Adds a task to completed catalog
  if (firebase && child && task && parent) {
    firebase
      .database()
      .ref(
        `users/${parent}/children/${child.userName.toLowerCase()}/completed/${taskKey}`
      )
      .set({
        approved: false,
        task: task.task,
        taskId: taskKey,
        value: task.value,
        time: Date.now(),
      });
  }
};

export const dateToShorter = (date) => {
  let dateString = new Date(Number(date)).toString();
  const tmpArr = dateString.split(' ');

  // Convert Veckodag from English to Swedish
  switch (tmpArr[0]) {
    case 'Mon':
      tmpArr[0] = 'Mån';
      break;
    case 'Tue':
      tmpArr[0] = 'Tis';
      break;
    case 'Wed':
      tmpArr[0] = 'Ons';
      break;
    case 'Thu':
      tmpArr[0] = 'Tors';
      break;
    case 'Fri':
      tmpArr[0] = 'Fre';
      break;
    case 'Sat':
      tmpArr[0] = 'Lör';
      break;
    case 'Sun':
      tmpArr[0] = 'Sön';
      break;
    default:
      return;
  }

  // Convert Month to numbers
  switch (tmpArr[1]) {
    case 'Jan':
      tmpArr[1] = '1';
      break;
    case 'Feb':
      tmpArr[1] = '2';
      break;
    case 'Mar':
      tmpArr[1] = '3';
      break;
    case 'Apr':
      tmpArr[1] = '4';
      break;
    case 'May':
      tmpArr[1] = '5';
      break;
    case 'Jun':
      tmpArr[1] = '6';
      break;
    case 'Jul':
      tmpArr[1] = '7';
      break;
    case 'Aug':
      tmpArr[1] = '8';
      break;
    case 'Sep':
      tmpArr[1] = '9';
      break;
    case 'Oct':
      tmpArr[1] = '10';
      break;
    case 'Nov':
      tmpArr[1] = '11';
      break;
    case 'Dec':
      tmpArr[1] = '12';
      break;
    default:
      return;
  }

  // Return in format (Sön 19/9, 10:29)
  return `(${tmpArr[0]} ${tmpArr[2]}/${tmpArr[1]}, ${tmpArr[4].slice(0, -3)})`;
};

export const regretTaskFunction = (firebase, child, taskKey, parent) => {
  //   Removes task from completed
  if (firebase && child && taskKey && parent) {
    firebase
      .database()
      .ref(
        `users/${parent}/children/${child.userName.toLowerCase()}/completed/${taskKey}`
      )
      .remove();
  }
};

export function showRelevantTasksForCompletedTasklist(task) {
  // Convert time(Number) to time(String) for the task and split into arrays
  let taskDay = new Date(Number(task.time)).toString().split(' ');
  // Make time(String) more specific for the control later on
  let taskDaySpecific = taskDay[0] + taskDay[1] + taskDay[2];

  // Convert time(Number) to time(String) for the current exact time and split into arrays
  let todayDay = new Date(Number(Date.now())).toString().split(' ');
  // Make time (string) more specific for the control later on
  let todayDaySpecific = todayDay[0] + todayDay[1] + todayDay[2];

  if (taskDaySpecific === todayDaySpecific) return true;
}

//Function that gets back a value for the day
function switchDay(day) {
  switch (day) {
    case 'monday':
      return 1;
    case 'tuesday':
      return 2;
    case 'wednesday':
      return 3;
    case 'thursday':
      return 4;
    case 'friday':
      return 5;
    case 'saturday':
      return 6;
    case 'sunday':
      return 7;
    case 'anyday':
      return 100;
    case 'Mon':
      return 1;
    case 'Tue':
      return 2;
    case 'Wed':
      return 3;
    case 'Thu':
      return 4;
    case 'Fri':
      return 5;
    case 'Sat':
      return 6;
    case 'Sun':
      return 7;
    default:
      return;
  }
}

export function showRelevantTasksForCurrentTasklist(task) {
  let todayDay = new Date(Number(Date.now())).toString().split(' ')[0];
  let newChildrenArray = [];

  // Loops through all the information and then returns it to the right place
  for (let i = 0; i < task.length; i++) {
    // Sundays gets this value on a Monday
    if (switchDay(todayDay) - switchDay(task[i].day) === -6) {
      task[i].day = 'Igår';
      task[i].valueday = 0;
      newChildrenArray.push(task[i]);
    }
    // Mondays gets this value on a Sunday
    else if (switchDay(todayDay) - switchDay(task[i].day) === 6) {
      task[i].day = 'Imorgon';
      task[i].valueday = 10;
      newChildrenArray.push(task[i]);
    }
    // The same day gives this value
    else if (switchDay(todayDay) - switchDay(task[i].day) === 0) {
      task[i].day = 'Idag';
      newChildrenArray.push(task[i]);
    }
    // Yesterday this gives value
    else if (switchDay(todayDay) - switchDay(task[i].day) === 1) {
      task[i].day = 'Igår';
      newChildrenArray.push(task[i]);
    }
    // Tomorrow gives this value
    else if (switchDay(todayDay) - switchDay(task[i].day) === -1) {
      task[i].day = 'Imorgon';
      newChildrenArray.push(task[i]);
    }
    // Any day gives this value
    else if (task[i].day === 'anyday') {
      task[i].day = 'Valfri dag';
      newChildrenArray.push(task[i]);
    }
  }

  return newChildrenArray;
}
