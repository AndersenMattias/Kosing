import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { auth } from 'firebase/firebaseConfig';
import { useDispatch, useSelector } from 'react-redux';
import { clearUserState, userReduxState } from 'features/user/user-slice';
import { useHistory } from 'react-router';
import { useLocation } from 'react-router-dom';

import logo from '../../images/cow.svg';

const Header = () => {
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector(userReduxState);
  return (
    <>
      <Navbar
        bg='light'
        expand='lg'
        sticky='top'
        collapseOnSelect='true'
        className='border-bottom'
        style={{ zIndex: 1 }}>
        <Container>
          <LinkContainer
            to={
              location.pathname === '/min-sida-barn'
                ? '/min-sida-barn'
                : user.userId
                ? '/min-sida'
                : '/'
            }>
            <Nav.Link className='p-0'>
              <Navbar.Brand>
                <img
                  src={logo}
                  width='34'
                  height='34'
                  className='d-inline-block align-top'
                  alt='Kosing logo'
                />
                <h3 className='d-inline-block m-1'>Kosing</h3>
              </Navbar.Brand>
            </Nav.Link>
          </LinkContainer>
          {location.pathname === '/min-sida-barn' ? (
            <Button
              style={{ float: 'right' }}
              onClick={() => {
                dispatch(clearUserState());
                sessionStorage.removeItem('child');
                history.push('/');
              }}>
              Logga ut
            </Button>
          ) : (
            user.userId && (
              <>
                <Navbar.Toggle aria-controls='basic-navbar-nav' />
                <Navbar.Collapse id='basic-navbar-nav'>
                  <Nav className='me-auto'>
                    <LinkContainer
                      to='/min-sida'
                      active={location.pathname === '/min-sida'}>
                      <Nav.Link>Min sida</Nav.Link>
                    </LinkContainer>
                    <LinkContainer
                      to='/registrera-barn'
                      active={location.pathname === '/registrera-barn'}>
                      <Nav.Link>Lägg till barn</Nav.Link>
                    </LinkContainer>
                    <LinkContainer
                      to='/redigera-barnkonto'
                      active={location.pathname === '/redigera-barnkonto'}>
                      <Nav.Link>Inställningar för barnkonton</Nav.Link>
                    </LinkContainer>
                    <LinkContainer
                      to='/konto-inställningar'
                      active={location.pathname === '/konto-inställningar'}>
                      <Nav.Link>Kontoinställningar</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to='#'>
                      <Nav.Link
                        onClick={() => {
                          auth.signOut();
                          dispatch(clearUserState());
                          history.push('/');
                        }}>
                        Logga ut
                      </Nav.Link>
                    </LinkContainer>
                  </Nav>
                </Navbar.Collapse>
              </>
            )
          )}
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
