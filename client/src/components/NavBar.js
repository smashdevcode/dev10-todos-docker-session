import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from './AuthContext';

function NavBar() {
  const auth = useContext(AuthContext);
 return (
  <div>
    {auth.user && (
    <div>
      <p>Hello {auth.user.username}!</p>
      <button onClick={auth.logout}>Logout</button>
    </div>
  )}

  <ul>
    <li>
      <Link to="/">Home</Link>
    </li>
    <li>
      <Link to="/about">About</Link>
    </li>
    <li>
      <Link to="/contact">Contact</Link>
    </li>
    <li>
      <Link to="/todos">ToDos</Link>
    </li>
    {!auth.user && (
      <>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/register">Register</Link>
        </li>
      </>
    )}
    
  </ul>
  </div>
  
 );
}

export default NavBar;