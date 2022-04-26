import { Alert } from "react-bootstrap";
import { useHistory, useLocation, Link } from "react-router-dom";

const ShowConfirmation = () => {
  const history = useHistory();
  const location = useLocation();

  let name = location?.state?.name;
  
  // if not sent here with a state "name", send user away
  if (!name) {
    name = ""; 
    history.push("/");
  }
 
  const MyAlert = () => {
    return (
      <Alert variant="success" className="mt-3">
        {name.split("").pop() === "s" ? name : name + "s"} konto har raderats.
      </Alert>
    );
  };

  return (
    <div>
      <h3>Inställningar för barnkonto</h3>
      <MyAlert />
      <div className="mt-3 mb-5">
        <Link to="/min-sida">
          <p>Gå till min sida</p>
        </Link>
      </div>
    </div>
  );
};

export default ShowConfirmation;
