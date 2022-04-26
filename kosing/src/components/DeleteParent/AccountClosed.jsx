import { Alert } from "react-bootstrap";
import { useHistory, useLocation, Link } from "react-router-dom";

const AccountClosed = () => {
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
        Kontot för {name} har raderats.
      </Alert>
    );
  };

  return (
    <div>
      <h3>Konto avslutat</h3>
      <MyAlert />
      <div className="mt-5 mb-5">
        Tråkigt att du har avslutat ditt konto. Du kan alltid gå till{" "}
        <Link to="/">förstasidan</Link> och registrera ett nytt konto om du
        ångrar dig.
      </div>
    </div>
  );
};

export default AccountClosed;
