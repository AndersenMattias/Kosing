import { useState } from 'react';
import { useSelector } from 'react-redux';
import { userReduxState } from '../../features/user/user-slice';

import { Form } from 'react-bootstrap';
import SetChildPassword from 'components/SetChildPassword/SetChildPassword';
import DeleteChild from 'components/DeleteChild/DeleteChild';
import SetChildTarget from 'components/SetChildTarget/SetChildTarget';
import ResetChildPoints from 'components/ResetChildPoints/ResetChildPoints';

const EditChild = () => {
  const [selectedChild, setSelectedChild] = useState(null);
  const userObject = useSelector(userReduxState);
  let childrenInStore = [...userObject.children];

  // sort children by name, sort handles spaces just fine
  childrenInStore.sort((childA, childB) => {
    let nameA = childA.name.toLowerCase();
    let nameB = childB.name.toLowerCase();
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });

  const onChangeChild = (e) => {
    setSelectedChild(e.target.value);
  };

  const children = childrenInStore.map((child, index) => {
    return (
      <option key={child.userName} value={index}>
        {child.name}
      </option>
    );
  });

  return (
    <div className='p-1'>
      <h3>Inställningar för barnkonto</h3>
      <Form>
        <Form.Group className='m-2 p-0' controlId='selectChildForm'>
          <Form.Control
            as='select'
            onChange={(e) => {
              onChangeChild(e);
            }}>
            <option value=''>Välj barn</option>
            {children}
          </Form.Control>
        </Form.Group>
      </Form>
      {selectedChild ? (
        <div className='p-1'>
          <h5>Inställningar för {childrenInStore[selectedChild].name} </h5>
          <SetChildTarget {...childrenInStore[selectedChild]} />
          <ResetChildPoints {...childrenInStore[selectedChild]} />
          <SetChildPassword {...childrenInStore[selectedChild]} />
          <DeleteChild {...childrenInStore[selectedChild]} />
        </div>
      ) : null}
    </div>
  );
};

export default EditChild;
