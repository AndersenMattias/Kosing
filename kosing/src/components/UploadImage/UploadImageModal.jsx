import { Button, Image } from 'react-bootstrap';
import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import UploadImage from './UploadImage';
import iconimage from './iconimage.png';

const UploadImageModal = ({ image, setImage }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);
  return (
    <>
      <Image style={{ width: '100%' }} src={iconimage} onClick={handleShow} />

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Ladda upp en bild på barnets målsättning</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UploadImage image={image} setImage={setImage} />
        </Modal.Body>
        <Modal.Footer style={{ justifyContent: 'space-evenly' }}>
          <Button
            variant='danger'
            onClick={() => {
              setImage(null);
              setShow(false);
            }}>
            Ta bort bild
          </Button>
          <Button variant='success' onClick={handleClose}>
            Välj bild
          </Button>
          <i>Kom ihåg att "spara mål" i nästa steg</i>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UploadImageModal;
