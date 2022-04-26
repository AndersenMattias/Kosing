import { useState } from 'react';
import { Modal, FloatingLabel, Form, Button, Alert } from 'react-bootstrap';

import firebase from 'firebase/app';

const ForgotPasswordModal = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');

  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function sendPasswordReset() {
    try {
      firebase
        .auth()
        .sendPasswordResetEmail(email)
        .then(() => {
          setShowMessage(true);
          setMessage(`Instruktioner har skickats till ${email}`);
        });
    } catch (e) {
      console.log(e);
    }
    setTimeout(() => {
      setShowMessage(false);
    }, 3000);
  }

  return (
    <>
      <p
        variant='outline-secondary'
        style={{ color: '#0d6efd', textDecoration: 'underline' }}
        onClick={handleShow}
      >
        Glömt lösenord
      </p>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Glömt lösenord</Modal.Title>
        </Modal.Header>

        <Modal.Body className='mb-3'>
          <h5>Återställ lösenord</h5>
          <p>
            Har du glömt ditt lösenord? Fyll i den e-postadress som är kopplad
            till ditt konto och klicka på "BEKRÄFTA".
          </p>
          <>
            <FloatingLabel
              controlId='floatingInput'
              label='E-postadress'
              className='mb-3'
            >
              <Form.Control
                type='email'
                placeholder='namn@example.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FloatingLabel>
            <Button variant='success' type='submit' onClick={sendPasswordReset}>
              Bekräfta
            </Button>
          </>
        </Modal.Body>
        {showMessage && (
          <Alert
            variant='success'
            onClose={() => setShowMessage(false)}
            dismissible
          >
            <p>{message}</p>
          </Alert>
        )}
      </Modal>
    </>
  );
};

export default ForgotPasswordModal;
