import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';

import AuthContext from '../AuthContext';

function ToDoList() {
  const [toDos, setToDos] = useState([]);

  const auth = useContext(AuthContext);
  /*

  Not Maintaining Global State

  Pros
    Avoids stale data
    Easier

  Cons
    Extra overhead/resources
    Harder

  */

  const fetchToDos = () => {
    fetch(`${process.env.REACT_APP_API_URL}/api/todos`)
      .then(response => response.json()) // assume that it's a 200
      .then(data => setToDos(data))
      .catch(error => console.log(error));
  };

  useEffect(() => {
    fetchToDos();
  }, []); // this will happen only once when the component is loaded

  const handleDelete = (toDoId) => {
    fetch(`${process.env.REACT_APP_API_URL}/api/todos/${toDoId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${auth.user.token}`
      },  
    })
      .then(response => {
        if (response.status === 204) {
           fetchToDos();
        } else if (response.status === 404) {
          Promise.reject(`ToDo ID #${toDoId} not found.`);
        } else {
          Promise.reject('Shoot! Something unexpected went wrong :(');
        }
      })
      .catch(error => console.log(error));
  };

  return (
    <>
      <h3>ToDo List</h3>
      <div>
        <Link className="btn btn-primary my-3" to="/todos/add">Add ToDo</Link>
      </div>
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
                  {/* /todos/edit/1 */}
                  <Link className="btn btn-primary btn-sm" to={`/todos/edit/${todo.id}`}>Edit</Link>
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

export default ToDoList;
