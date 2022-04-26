import emailjs from 'emailjs-com';

// If we want to use this form for logged in users to really be able to see who is writing to us
// import { auth } from 'firebase/firebaseConfig';

import { useState } from 'react';
import { Container, Form, Button, FloatingLabel } from 'react-bootstrap';

const { REACT_APP_EMAIL_USER_ID, REACT_APP_EMAIL_SERVICE_ID } = process.env;

const ContactUs = () => {
  const [name, setName] = useState('');
  // If we want to use this form for logged in users to really be able to see who is writing to us
  //   const [email, setEmail] = useState(auth.currentUser.email);
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [inactiveButton, setInactiveButton] = useState(false);
  const [inactiveButton2, setInactiveButton2] = useState(false);
  const [inactiveButton3, setInactiveButton3] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    sendQuestion(name, email, subject, message);
  }

  function sendQuestion(name, email, subject, message) {
    const templateParams = {
      name,
      email,
      subject,
      message,
    };
    setInactiveButton2(true);
    setInactiveButton(true);

    emailjs
      .send(
        REACT_APP_EMAIL_SERVICE_ID,
        'template_qbpdxgp',
        templateParams,
        REACT_APP_EMAIL_USER_ID
      )
      .then(
        (response) => {
          // This happens while the message is sent, but not finished (green button turns yellow)
          setInactiveButton2(false);
          // This happens when the message is succesfully sent (yellow button turns green again)
          setInactiveButton(true);
        },
        (err) => {
          // This happens if the message cannot be sent, for example due to no internet, the button turns red with an error message
          setInactiveButton3(true);
          setInactiveButton2(false);
        }
      );
  }

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <FloatingLabel label='Namn' className='mb-3'>
          <Form.Control
            required
            placeholder='Namn'
            autoComplete='off'
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </FloatingLabel>

        <FloatingLabel label='E-postadress' className='mb-3'>
          <Form.Control
            required
            placeholder='E-postadress'
            autoComplete='off'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FloatingLabel>

          <Form.Select
            required
            autoComplete='off'
            type='email'
            className='mb-3'
            value={subject}
            onChange={(e) => setSubject(e.target.value)}>
            <option value='' hidden>
              Tryck här för att välja ärende
            </option>
            <option value='question'>Fråga</option>
            <option value='improvement'>Förbättringsförslag</option>
            <option value='praise'>Beröm</option>
            <option value='other'>Övrigt</option>
          </Form.Select>
      

        <FloatingLabel label='Meddelande' className='mb-3'>
          <Form.Control
            required
            as='textarea'
            placeholder='Meddelande'
            style={{ height: '8rem' }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </FloatingLabel>

        {!inactiveButton && (
          <Button type='submit' variant='success'>
            Skicka meddelande
          </Button>
        )}

        {inactiveButton && !inactiveButton2 && !inactiveButton3 && (
          <Button variant='success' disabled>
            Ditt meddelande har skickats
          </Button>
        )}

        {inactiveButton2 && (
          <Button variant='warning' disabled>
            skickar...
          </Button>
        )}
        {inactiveButton3 && (
          <Button variant='danger' disabled>
            Något gick fel, din fråga har INTE skickats!
          </Button>
        )}
      </Form>
    </Container>
  );
};

export default ContactUs;
