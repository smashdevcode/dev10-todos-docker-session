import { useState, useEffect } from 'react';
import Errors from './Errors';

function ToDos() {
  const [toDos, setToDos] = useState([]);
  const [description, setDescription] = useState('');
  const [editToDoId, setEditToDoId] = useState(0);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/todos`)
      .then(response => response.json()) // assume that it's a 200
      .then(data => setToDos(data))
      .catch(error => console.log(error));
  }, []);

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
        "Content-Type": "application/json"
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
          // if I have a todo, then add it to my list of todos
          setToDos([...toDos, data]);

          // reset the form
          setDescription('');
          setErrors([]);
        } else {
          // otherwise display the errors
          setErrors(data);
        }
      })
      .catch(error => console.log(error));
  };

  const handleDelete = (toDoId) => {
    fetch(`${process.env.REACT_APP_API_URL}/api/todos/${toDoId}`, {
      method: "DELETE"      
    })
      .then(response => {
        if (response.status === 204) {
          const newToDos = toDos.filter(toDo => toDo.id !== toDoId);
          setToDos(newToDos);      
        } else if (response.status === 404) {
          Promise.reject(`ToDo ID #${toDoId} not found.`);
        } else {
          Promise.reject('Shoot! Something unexpected went wrong :(');
        }
      })
      .catch(error => console.log(error));
  };

  const handleEdit = (toDoId) => {
    // get the todo that the user wants to edit
    const toDoToEdit = toDos.find(toDo => toDo.id === toDoId);

    // update the state with that todo's information
    setDescription(toDoToEdit.description);    
    setEditToDoId(toDoToEdit.id);
  };

  const handleUpdateSubmit = (event) => {
    event.preventDefault();

    // we need the data that we're going to send
    const updatedToDo = {
      id: editToDoId,
      description
    };

    const body = JSON.stringify(updatedToDo);

    // we need to make the fetch
    fetch(`${process.env.REACT_APP_API_URL}/api/todos/${editToDoId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
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
          // create a copy of the array of TODOs
          const newToDos = [...toDos];

          // get the todo that the user wants to edit
          const toDoIndexToEdit = toDos.findIndex(toDo => toDo.id === editToDoId);

          // update the todo
          newToDos[toDoIndexToEdit] = {
            id: editToDoId,
            description
          };

          // update the TODOs state
          setToDos(newToDos);

          // reset the form
          setDescription('');
          setEditToDoId(0);
          setErrors([]);
        } else {
          // otherwise display the errors
          setErrors(data);
        }
      })
      .catch(error => console.log(error));
  };

  const handleCancel = () => {
    // reset the form
    setDescription('');
    setEditToDoId(0);
    setErrors([]);
  };

  return (
    <>
      <Errors errors={errors} />

      {editToDoId === 0 ? (
        <form onSubmit={handleAddSubmit} className="form-inline mx-2 my-4">
          <input id="description" name="description" type="text"
            className="form-control col-6" 
            placeholder="Please enter a description..."
            onChange={handleChange}
            value={description} />
          <button className="btn btn-success ml-2" type="submit">Add ToDo</button>
          {description || errors.length > 0 ? (
            <button className="btn btn-warning ml-2" type="button" 
              onClick={handleCancel}>Cancel</button>
          ) : null}
        </form>
      ) : (
        <form onSubmit={handleUpdateSubmit} className="form-inline mx-2 my-4">
          <input id="description" name="description" type="text" 
            className="form-control col-6" 
            placeholder="Please enter a description..."
            onChange={handleChange}
            value={description} />
          <button className="btn btn-success ml-2" type="submit">Update ToDo</button>
          <button className="btn btn-warning ml-2" type="button" onClick={handleCancel}>Cancel</button>
        </form>
      )}

      <table className="table table-striped table-dark table-hover">
        <thead>
          <tr>
            <th scope="col">Description</th>
            <th scope="col">&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {toDos.map(todo => (
            <tr key={todo.id}>
              <td>{todo.description}</td>
              <td>
                <div className="float-right">
                  <button className="btn btn-primary btn-sm" 
                    onClick={() => handleEdit(todo.id)}>Edit</button>
                  <button className="btn btn-danger btn-sm ml-2" 
                    onClick={() => handleDelete(todo.id)}>Delete</button>
                </div>
              </td>              
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default ToDos;
