import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { userReduxState } from 'features/user/user-slice';
import { Alert } from 'react-bootstrap';
import firebase from 'firebase/firebaseConfig';

import { loadChildId, loadChild } from 'features/user/user-slice';

import ChildrenTasks from './ChildrenTasks';
import Cow from './Cow';
import './Cow.css';
import Celebrate from './Celebrate';

const ChildrenLandingPage = () => {
  const [rainy, setRainy] = useState('p-1 cow-background');
  const [sessionChild, setSessionChild] = useState();
  const [alreadyLoaded, setAlreadyLoaded] = useState(false);
  const userInRedux = useSelector(userReduxState);

  const history = useHistory();
  const dispatch = useDispatch();

  const loggedInChild = userInRedux.loggedInChild;
  const loggedInChildsParent = userInRedux.loggedInChildsParent;

  useEffect(() => {
    let session = sessionStorage.getItem('child');
    session && setSessionChild(JSON.parse(session));
  }, []);

  //  checks if a child is logged in by looking
  //  first in store, else in session storage
  useEffect(() => {
    if (loggedInChild && loggedInChildsParent) {
      setSessionChild({
        userName: loggedInChild,
        parent: loggedInChildsParent,
      });
    }
    // eslint-disable-next-line
  }, [userInRedux.loggedInChild]);

  // gets child object from parent i firebase
  useEffect(() => {
    if (sessionChild && !alreadyLoaded) {
      setAlreadyLoaded(true);
      firebase
        .database()
        .ref('users/' + sessionChild.parent)
        .child('children')
        .child(sessionChild.userName)
        .on('value', (snapshot) => {
          let data = snapshot.val();
          dispatch(loadChild(data));
          let childObject = {
            userName: sessionChild.userName.toLowerCase(),
            parent: sessionChild.parent,
          };
          dispatch(loadChildId(childObject));
        });
    }
    // eslint-disable-next-line
  }, [sessionChild]);

  useEffect(() => {
    if (!userInRedux?.loggedInChild && !sessionStorage.getItem('child'))
      history.push('/');
    // eslint-disable-next-line
  }, []);

  // A function to adjust height responsively to different heights
  function minHeightFunc() {
    let height = window.innerHeight;
    if (height < 600) return '78vh';
    else if (height < 700) return '79vh';
    else if (height < 800) return '81vh';
    else if (height < 900) return '83vh';
    else if (height < 1000) return '85vh';
    else if (height < 1200) return '88vh';
    else if (height < 1400) return '90vh';
    else if (height < 1600) return '91vh';
    else if (height < 1800) return '92vh';
    else if (height < 2000) return '93vh';
  }

  return (
    <>
      {userInRedux.child && userInRedux.child.celebrate && (
        <Celebrate child={userInRedux.child} parent={loggedInChildsParent} />
      )}
      <div className={rainy} style={{ minHeight: minHeightFunc() }}>
        {userInRedux && userInRedux.child && (
          <Cow
            image={userInRedux.child.targetImage}
            setRainy={setRainy}
            child={userInRedux.child}
          />
        )}

        {/* Sends the child's first name here: */}
        {userInRedux.child && <h3>{userInRedux.child.name}</h3>}

        {/* Submit the correct child to the child's landing page: */}
        {userInRedux.child && userInRedux.child.tasks ? (
          <ChildrenTasks
            child={userInRedux.child}
            parent={loggedInChildsParent}
          />
        ) : (
          //When the child has nothing to do
          <Alert variant='warning' className='p-1'>
            <div className='d-flex flex-column align-items-start'>
              <span align='left'>Du har inga sysslor att utföra</span>
            </div>
          </Alert>
        )}
        <div className='bitofpadding'></div>
      </div>
    </>
  );
};

export default ChildrenLandingPage;
