import { ProgressBar } from 'react-bootstrap';
const ChildrenProgress = ({ child }) => {
  let progress = Math.floor((100 / child.target) * child.points);

  return (
    <ProgressBar
      variant='success'
      label={`${!progress ? '0' : progress > 100 ? '100' : progress}%`}
      now={progress < 5 ? '5' : progress}
      style={{
        position: 'fixed',
        left: '50%',
        bottom: '1.8em',
        transform: 'translate(-50%, -50%)',
        margin: '0 auto',
        width: '75%',
        backgroundColor: 'rgb(180, 214, 242)',
      }}
    />
  );
};

export default ChildrenProgress;
