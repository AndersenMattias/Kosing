import { userReduxState } from 'features/user/user-slice';
import { useSelector } from 'react-redux';
import IndividualProgressComponent from './IndividualProgressComponent';

const ProgressComponent = () => {
  const userInRedux = useSelector(userReduxState);

  return (
    <div className='bg-light shadow p-1 mt-3 border rounded'>
      <h6 className='text-start m-1'>Dina barn</h6>
      {userInRedux.children.length > 0 ? (
        Object.values(userInRedux.children).map((target, index) => (
          <IndividualProgressComponent
            key={target.userName}
            target={target}
            index={index}
            showEvents={true}
          />
        ))
      ) : (
        <p>Inga barn ännu, lägg till ett barn</p>
      )}
    </div>
  );
};

export default ProgressComponent;
