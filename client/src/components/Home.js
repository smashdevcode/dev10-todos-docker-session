import { 
  BrowserRouter as Router, 
  Switch, 
  Route, 
  Link } from 'react-router-dom';

function ChildOne() {
  return (
    <h4>Child One</h4>
  );
}

function ChildTwo() {
  return (
    <h4>Child Two</h4>
  );
}

function Home() {
  return (
    <>
      <h3>Home</h3>
      
      <p>asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf</p>

      <p>asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf</p>

      <p>asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf</p>

      <ul>
        <li>
          <Link to="/home/child1">Child One</Link>
        </li>
        <li>
          <Link to="/home/child2">Child Two</Link>
        </li>
      </ul>
      
      <Switch>
        <Route path="/home/child1">
          <ChildOne />
        </Route>
        <Route path="/home/child2">
          <ChildTwo />
        </Route>
      </Switch>
    </>
  );
}

export default Home;
