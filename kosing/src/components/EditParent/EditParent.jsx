import SetParentPassword from 'components/SetParentPassword/SetParentPassword';
import SetParentEmail from '../SetParentEmail/SetParentEmail';
import DeleteParent from 'components/DeleteParent/DeleteParent';

const EditParent = () => {
  return (
    <>
      <h3>Kontoinställningar</h3>
      <>
        <SetParentPassword />
        <SetParentEmail />
        <DeleteParent />
      </>
    </>
  );
};

export default EditParent;
