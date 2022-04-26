import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const UserTermsModal = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>
      <Link
        className='d-inline-block m-1'
        variant='outline-secondary'
        onClick={handleShow}
        to='#'>
        villkoren
      </Link>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Användarvillkor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {' '}
          <p>
            När du skapar ett konto på denna webbapplikation blir du kontoägare
            genom din registrerade e-postadress. De uppgifter du registrerar är
            du som kontoägare ansvarig för. Detta innebär exempelvis att du har
            ansvar för de personuppgifter som du skriver in i appen.
          </p>
          <h2>GDPR</h2>
          <p>
            Kontoägare kan i vissa fall registrera personuppgifter som tillhör andra
            personer. Dessa kontouppgifter sparas i appens databas men det är du
            som kontoägare som är ansvarig för uppgifterna. Kontoägare är
            således personuppgiftsansvarig för lämnande personuppgifter och är
            skyldig att följa gällande lagstiftning i form av bland annat GDPR.
            Om exempelvis ett barn vill ta bort sitt konto med tillhörande
            uppgifter, har du som kontoägare skyldighet att ta bort kontot.
            Detta kan du enkelt göra som inloggad under sidan "Inställningar för
            barnkonto".
          </p>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
};

export default UserTermsModal;
