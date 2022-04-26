import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import firebase from '../../firebase/firebaseConfig';
import './Celebrate.css';

const Celebrate = ({ child, parent }) => {
  const [dark, setDark] = useState(false);
  const [giftClicked, setGiftClicked] = useState(false);

  useEffect(() => {
    setDark(true);
  }, []);

  const endCelebration = () => {
    setDark(false);
    setTimeout(() => {
      try {
        firebase
          .database()
          .ref(`users/${parent}/children/${child.userName.toLowerCase()}`)
          .update({
            celebrate: false,
          });
      } catch (e) {
        console.log(e);
      }
    }, 1000);
  };

  return (
    <div className={`party ${dark && 'party-darken'}`}>
      <div
        className={` p-2 rounded giftcard ${giftClicked && 'expandgiftcard'} ${
          dark && 'showgift'
        }`}>
        <h5>Du klarade målet!</h5>
        <p>Grattis {child.name}! Där satt den &#128523;</p>
        <p>
          Som du har kämpat och kämpat och jobbat och kämpat och slitit och
          kämpat!
        </p>
        <p>
          Inte mycket kvar att göra nu annat än att kvittera ut din belöning av
          din förälder eller vårdnadshavare och kämpa vidare mot nästa mål...
          Lycka till!
        </p>
        <Button onClick={endCelebration}>Stäng</Button>
      </div>
      <div
        onClick={() => setGiftClicked(true)}
        className={`box bounce ${giftClicked && 'pullbox'} ${
          dark && 'showgift'
        }`}>
        <div className='ribbon'></div>
        <div className='crossribbon'></div>
        <div
          className={`lidgroup lidbounce ${giftClicked && 'liftlid'} ${
            dark && 'showgift'
          }`}>
          <div className='bow'></div>
          <div className='lid'></div>
        </div>
      </div>
    </div>
  );
};

export default Celebrate;
