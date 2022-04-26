import { useEffect, useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import firebase from "../../firebase/firebaseConfig";

import { useSelector } from "react-redux";
import { userReduxState } from "features/user/user-slice";

const ResetChildPoints = ({ name = "", userName = "", points = 0 }) => {
  const [showMessage, setShowMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [firebaseError, setFirebaseError] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const userInRedux = useSelector(userReduxState);

  // clear messages when user clicks checkbox
  useEffect(() => {
    setShowMessage(false);
    setErrorMessage("");
    return () => {
      setShowMessage({});
      setErrorMessage({});
    };
  }, [confirmReset]);

  // clear messages and confirmation when user changes child
  useEffect(() => {
    setConfirmReset(false);
    setShowConfirmation(false);
    return () => {
      setConfirmReset({});
      setShowConfirmation({});
    };
  }, [userName]);

  // updates the points value in firebase
  // and shows a message that the value is saved
  const saveChanges = (e) => {
    e.preventDefault();

    if (!showConfirmation) {
      setShowConfirmation(true);
      return;
    } else if (!confirmReset) {
      setErrorMessage("Du måste bekräfta att du vill nollställa poäng.");
      setShowMessage(true);
      return;
    }

    try {
      firebase
        .database()
        .ref(`users/${userInRedux.userId}/children/${userName.toLowerCase()}`)
        .update({
          points: 0,
        });
    } catch (e) {
      setFirebaseError(true);
      console.log(e);
    }

    // if save to firebase successfull, show message
    if (!firebaseError) {
      setShowConfirmation(false);
      setConfirmReset(false);
      setTimeout(() => {
        setShowMessage(true);
      }, 100);
    }
  };

  const MyAlert = () => {
    return (
      <Alert
        variant={errorMessage ? "danger" : "success"}
        onClose={() => setShowMessage(false)}
        dismissible
        className="mt-3"
      >
        {errorMessage ? errorMessage : `${name.split("").pop() === "s" ? name : name + "s"} poäng har nollställts.`}
      </Alert>
    );
  };

  return (
    <>
      <div className="p-1 mb-3 border rounded">
        <h5>Nollställ poäng</h5>
        <p className="mb-0">
          {userName} har {points} poäng.
        </p>
        {!points ? (
          ""
        ) : (
          <Form onSubmit={saveChanges}>
            {showConfirmation ? (
              <Form.Group className="p-0 m-1" controlId="formTarget">
                <Form.Check
                  type="checkbox"
                  label="Kryssa i rutan till vänster för att bekräfta"
                  id="confirmResetPoints"
                  onClick={(e) => setConfirmReset(e.target.checked)}
                />
              </Form.Group>
            ) : null}

            <Button
              variant="primary"
              type="submit"
              className="mt-2 mb-2"
              disabled={showConfirmation && !confirmReset ? true : false}
            >
              {showConfirmation ? "Bekräfta" : "Nollställ"}
            </Button>
          </Form>
        )}
        {showMessage ? <MyAlert /> : null}
      </div>
    </>
  );
};

export default ResetChildPoints;
