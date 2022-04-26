import { useEffect, useState } from 'react';
import { Alert, Container, Image, Spinner } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import logo404 from './404.jpg';

const NotFoundPage = ({ user }) => {
  const history = useHistory();
  const [turnOfSpinner, setTurnOfSpinner] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setTurnOfSpinner(true);
    }, 1000);
  }, []);

  return (
    <Container>
      {!user && !turnOfSpinner && (
        <Spinner className='p-5 m-5' animation='border' role='status'>
          <span className='visually-hidden'>Loading...</span>
        </Spinner>
      )}

      {!user && turnOfSpinner && (
        <div>
          <Alert onClick={() => history.push('/')}>
            Du behöver logga in på <Link to='/'>Startsidan</Link>{' '}
          </Alert>
          {/* <Image src={logo404} style={{ width: '80%' }} /> */}
        </div>
      )}

      {user && <Image src={logo404} style={{ width: '80%' }} />}
    </Container>
  );
};

export default NotFoundPage;
