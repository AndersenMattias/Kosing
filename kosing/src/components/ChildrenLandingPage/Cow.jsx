import { useState, useEffect } from 'react';
import ChildrenProgress from './ChildrenProgress';
import './Cow.css';
import logoCloud1 from './images/cloud1.png';
import logoCloud2 from './images/cloud2.png';
import logoCloud3 from './images/cloud3.png';
import logoCloud4 from './images/cloud4.png';
import mole from './images/mole.png';
import dog from './images/dog.png';
import { Alert, Image } from 'react-bootstrap';

const Cow = ({ setRainy, child, image }) => {
  const [makeItRain, setMakeItRain] = useState('');
  const [pupil, setPupil] = useState('pupil');
  const [tongue, setTongue] = useState('tongue');
  const [pupils, setPupils] = useState([]);
  const [moleCSS, setMoleCSS] = useState('mole');
  const [dogCSS, setDogCSS] = useState('dog');

  useEffect(() => {
    function handleMoove(e) {
      if (e.target.className.includes('sun')) {
        setPupils([185, 480]);
        return;
      }
      setPupils([e.clientX, e.clientY]);
    }
    window.addEventListener('mousemove', handleMoove);

    return () => {
      window.removeEventListener('mousemove', handleMoove);
    };
  }, []);

  function reachOutTongue() {
    if (tongue === 'tongue') {
      setTongue('tongue out');
    } else {
      setTongue('tongue');
    }
  }

  return (
    <div>
      <div>
        {!makeItRain ? (
          <>
            <div
              onClick={() => {
                setMakeItRain(!makeItRain);
                setRainy('p-1 cow-background rainy');
                setPupil('pupil startled');
              }}
              className='weather-element sun'>
              {child.targetName && !image && <p> {child.targetName}</p>}
              <div className='sun-overlay'></div>
              {image && (
                <Image className='weather-element goal-picture' src={image} />
              )}
            </div>
          </>
        ) : (
          <div
            className='weather-element'
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              marginBottom: '1em',
            }}
            onClick={() => {
              setMakeItRain(!makeItRain);
              setRainy('p-1 cow-background');
              setPupil('pupil');
            }}>
            <img src={logoCloud1} alt='litet moln' />
            <img src={logoCloud2} alt='litet moln' />
            <img src={logoCloud3} alt='litet moln' />
            <img src={logoCloud4} alt='litet moln' />
          </div>
        )}
      </div>

      <div className='grass'> {<ChildrenProgress child={child} />}</div>
      <div id='cow' className='cow' onClick={() => reachOutTongue()}>
        {/* //Voff when dog barks */}
        {dogCSS === 'dog2' && (
          <Alert
            variant='info'
            style={{ width: '50%', borderRadius: '2em', zIndex: '1' }}>
            VOFF
          </Alert>
        )}
        <div className='cow-wrapper'>
          <div className='face'>
            <div className='ears'>
              <div className='ear left' />
              <div className='ear right' />
            </div>
            <div className='eyes'>
              <div className='eye eye-left'>
                <div
                  className={pupil}
                  style={{
                    top: `${pupils[1] / 90}px `,
                    left: `${pupils[0] / 90}px`,
                  }}
                />
              </div>
              <div className='eye eye-right'>
                <div
                  className={pupil}
                  style={{
                    top: `${pupils[1] / 90}px `,
                    left: `${pupils[0] / 90}px`,
                  }}
                />
              </div>
            </div>
            <div id='tongue' className={tongue}></div>
            <div className='snout'>
              <div className='nostril nostril-left'></div>
              <div className='nostril nostril-right'></div>
            </div>
          </div>
          <div className='body'>
            <div className='spot spot-1'></div>
            <div className='spot spot-3'></div>
          </div>
          <div className='legs'>
            <div className='leg leg-bl'>
              <div className='hoof'></div>
            </div>
            <div className='leg leg-fl'>
              <div className='hoof'></div>
            </div>
            <div className='leg leg-br'>
              <div className='hoof'></div>
            </div>
            <div className='leg leg-fr'>
              <div className='hoof'></div>
            </div>
          </div>
        </div>
        <img
          className={moleCSS}
          onClick={() =>
            moleCSS === 'mole' ? setMoleCSS('mole2') : setMoleCSS('mole')
          }
          src={mole}
          alt='söt mullvad'
        />
        <img
          className={dogCSS}
          onClick={() =>
            dogCSS === 'dog' ? setDogCSS('dog2') : setDogCSS('dog')
          }
          src={dog}
          alt='söt vovve'
        />
      </div>
    </div>
  );
};

export default Cow;
