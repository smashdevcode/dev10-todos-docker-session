import { useState, useEffect, useContext } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import Errors from '../Errors';
import AuthContext from '../AuthContext';

function EditToDo() {
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState([]);

  const auth = useContext(AuthContext);

  const { id } = useParams();
  const history = useHistory();

  // this side effect allows us to load the requested todo...
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/todos/${id}`)
      .then(response => response.json()) // assume that it's a 200
      .then(data => setDescription(data.description))
      .catch(error => console.log(error));
  }, [id]);

  const handleChange = (event) => {
    setDescription(event.target.value);
  };

  const handleUpdateSubmit = (event) => {
    event.preventDefault();

    // we need the data that we're going to send
    const updatedToDo = {
      id,
      description
    };

    const body = JSON.stringify(updatedToDo);

    // we need to make the fetch
    fetch(`${process.env.REACT_APP_API_URL}/api/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth.user.token}`
      },
      body
    })
      .then(response => {
        if (response.status === 204) {
          return null;
        } else if (response.status === 400) {
          return response.json();
        } else {
          Promise.reject('Shoot! Something unexpected went wrong :(');
        }
      })
      .then(data => {
        // determine if I have a todo or errors...
        if (!data) {
          // send the user back to the list of todos...
          history.push('/todos');
        } else {
          // otherwise display the errors
          setErrors(data);
        }
      })
      .catch(error => console.log(error));
  };

  return (
    <>
      <h3>Edit ToDo</h3>
      <Errors errors={errors} />
      <form onSubmit={handleUpdateSubmit} className="form-inline mx-2 my-4">
          <input id="description" name="description" type="text" 
            className="form-control col-6" 
            placeholder="Please enter a description..."
            onChange={handleChange}
            value={description} />
          <button className="btn btn-success ml-2" type="submit">Update ToDo</button>
          <Link className="btn btn-warning ml-2" to="/todos">Cancel</Link>        
        </form>
    </>
  );
}

export default EditToDo;
