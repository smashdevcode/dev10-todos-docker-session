import { useContext, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Errors from '../Errors';
import AuthContext from '../AuthContext';

function AddToDo() {
  const auth = useContext(AuthContext);
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState([]);

  const history = useHistory();

  const handleChange = (event) => {
    setDescription(event.target.value);
  };

  const handleAddSubmit = (event) => {
    event.preventDefault();

    // we need the data that we're going to send
    const newToDo = {
      description
    };

    const body = JSON.stringify(newToDo);

    // we need to make the fetch
    fetch(`${process.env.REACT_APP_API_URL}/api/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth.user.token}`
      },
      body
    })
      .then(response => {
        if (response.status === 201 || response.status === 400) {
          return response.json();
        } else {
          Promise.reject('Shoot! Something unexpected went wrong :(');
        }
      })
      .then(data => {
        // determine if I have a todo or errors...
        if (data.id) {
          // send the user back to the todo list...
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
      <h3>Add ToDo</h3>
        <Errors errors={errors} />
        <form onSubmit={handleAddSubmit} className="form-inline mx-2 my-4">
          <input id="description" name="description" type="text"
            className="form-control col-6" 
            placeholder="Please enter a description..."
            onChange={handleChange}
            value={description} />
          <button className="btn btn-success ml-2" type="submit">Add ToDo</button>
          <Link className="btn btn-warning ml-2" to="/todos">Cancel</Link>        
        </form>
    </>
  );
}

export default AddToDo;
