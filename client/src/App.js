import { 
  BrowserRouter as Router, 
  Switch, 
  Route, 
  Link, 
  Redirect} from 'react-router-dom';
import jwt_decode from 'jwt-decode';

import ToDoList from './components/todos/ToDoList';
import AddToDo from './components/todos/AddToDo';
import EditToDo from './components/todos/EditToDo';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import NavBar from './components/NavBar';
import AuthContext from './components/AuthContext';
import { useState } from 'react';

function About() {
  return (
    <h3>About</h3>
  );
}

function Contact() {
  return (
    <h3>Contact</h3>
  );
}

function NotFound() {
  return (
    <h3>Not Found</h3>
  );
}

function App() {
  const [user, setUser] = useState(null);

    const login = (token) => {
      // {
  //   "iss": "todos",
  //   "sub": "smashdev",
  //   "appUserId": 1,
  //   "authorities": "ROLE_USER",
  //   "exp": 1605235902
  // }
    const { appUserId, sub: username, authorities } = jwt_decode(token);
    const roles = authorities.split(',');

    const user = {
      appUserId,
      username,
      roles,
      token,
      hasRole(role) {
        return this.roles.includes(role);
      }
    }

      setUser(user);
    }

    const authenticate = async (username, password) => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/authenticate`, {
        method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username,
            password
          })
      });

      if (response.status === 200) {
        const { jwt_token } = await response.json();
        login(jwt_token);
      } else if (response.status === 403) {
        throw new Error('Bad username or password');
      } else {
        throw new Error('There was a problem logging in...');
      }
    }

    const logout = () => {
      setUser(null);
    }
  
    const auth = {
      user,
      login,
      authenticate,
      logout
    }

  

  return (
  <AuthContext.Provider value={auth}>    
    <Router>
      <h2 className="my-4">TODOs</h2>
      
      <NavBar />

      <Switch>
        <Route path="/about">
          {user ? (
            <About />
          ) : (
            <Redirect to="/login" />
          )}          
        </Route>
        <Route path="/contact">
          <Contact />
        </Route>
        <Route path="/todos/add">
          <AddToDo user={user}/>
        </Route>
        <Route path="/todos/edit/:id">
          <EditToDo />
        </Route>
        <Route path="/todos">
          <ToDoList />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/home">
          <Home />
        </Route>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>

    </Router>
  </AuthContext.Provider>
  );
}

export default App;
