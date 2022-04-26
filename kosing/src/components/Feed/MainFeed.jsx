import CompletedTasksComponent from './CompletedTasksComponent';
import ProgressComponent from './ProgressComponent';

const MainFeed = () => {
  return (
    <div className='p-1'>
      <h3>Ditt flöde</h3>
      <CompletedTasksComponent />
      <ProgressComponent />
    </div>
  );
};

export default MainFeed;
