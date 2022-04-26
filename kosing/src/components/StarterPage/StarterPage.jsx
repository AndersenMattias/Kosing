import { useHistory } from 'react-router';

import { Container, Alert, Image } from 'react-bootstrap';

import childJpg from './images/child.jpg';
import adultJpg from './images/adult.jpg';
import ContactUsModal from 'components/ContactUs/ContactUsModal';

const StarterPage = () => {
  // Makes buttons responsive depending on mobile device
  let windowHeight = window.innerHeight;
  const history = useHistory();

  return (
    <Container>
      <div
        onClick={() => history.push('/logga-in-barn')}
        className='shadow-lg p-3 bg-white rounded'
        style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>
        <Alert variant='info' style={{ padding: '0' }}>
          <h2 style={{ marginTop: '.5rem' }}>Barn</h2>
        </Alert>

        <Image
          width={windowHeight > 700 ? windowHeight * 0.22 : windowHeight * 0.17}
          height={
            windowHeight > 700 ? windowHeight * 0.22 : windowHeight * 0.17
          }
          alt='171x180'
          src={childJpg}
        />
      </div>

      <div
        className='shadow-lg p-3 bg-white rounded'
        onClick={() => history.push('/logga-in-vuxen')}
        style={{ marginBottom: '0.5rem' }}>
        <Alert variant='info' style={{ padding: '0' }}>
          <h2 style={{ marginTop: '.5rem' }}>Vuxen</h2>
        </Alert>

        <Image
          width={windowHeight > 700 ? windowHeight * 0.22 : windowHeight * 0.17}
          height={
            windowHeight > 700 ? windowHeight * 0.22 : windowHeight * 0.17
          }
          alt='171x180'
          src={adultJpg}
        />
      </div>

      <ContactUsModal />
    </Container>
  );
};

export default StarterPage;
