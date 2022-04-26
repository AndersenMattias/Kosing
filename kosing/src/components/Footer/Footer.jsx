import { useSelector } from 'react-redux';
import { userReduxState } from 'features/user/user-slice';

const Footer = () => {
  const user = useSelector(userReduxState);

  return (
    <div className='bg-light fixed-bottom mb-0 p-0 text-center border-top'>
      {user.userId && (
        <p className='m-0 p-0'>Du är nu inloggad som: {user.email} </p>
      )}
      <code className='text-muted'>
        &copy; Christian, Erik, Martin, Mattias
      </code>
    </div>
  );
};

export default Footer;
