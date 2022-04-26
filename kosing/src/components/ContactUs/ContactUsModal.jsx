import { Button } from 'react-bootstrap';
import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import ContactUs from './ContactUs';

const UploadImageModal = ({ image, setImage }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);
  return (
    <>
      <Button className='mt-3' onClick={handleShow} variant='outline-secondary'>
        Kontakta oss
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Kontakta oss</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {' '}
          <ContactUs />{' '}
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
};

export default UploadImageModal;
