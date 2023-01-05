import './App.css';
import { useState, useEffect } from 'react';
import Loader from './components/Loader';

function App() {
  const [todo, setTodo] = useState("");  /* Todo Title */
  const [todoId, setTodoId] = useState(null);  /* Todo Id */
  const [listTodo, setListTodo] = useState([]); /* Mapp Todo */

  let recordPerPage = 5;
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  let createBox = document.getElementById("create-todo");
  let updateBox = document.getElementById("update-todo");


  // Get all the todos on load
  useEffect(() => {
    getAllTodo();
  }, [])

  // Create new todos
  const createTodo = async () => {
    //Create a new Todo
    let createdTodo = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify({
        title: todo,
        body: 'new todo is created, kindly check the console.'
      }),
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json'
      },
    })
    createdTodo = await createdTodo.json()
    console.log(createdTodo);
  }

  // Set edited todo title in the text field via state
  const editTodo = (todoId) => {
    createBox.classList.remove('flex');
    createBox.classList.add('hidden');
    updateBox.classList.remove('hidden');
    updateBox.classList.add('flex');
    setTodo(listTodo[todoId - 1].title);
    setTodoId(listTodo[todoId - 1].id);
  }

  // Get all the todos
  const getAllTodo = async () => {
    let getTodo = await fetch('https://jsonplaceholder.typicode.com/posts');
    getTodo = await getTodo.json();
    setListTodo(getTodo);
    // console.log(getTodo);
  }

  // Update the todo
  const updateTodo = async () => {
    let updatedTodo = await fetch(`https://jsonplaceholder.typicode.com/posts/${todoId}`, {
      method: 'PUT',
      body: JSON.stringify({
        title: todo,
      }),
      headers: {
        'Content-type': 'application/json',
      },
    })
    updatedTodo = await updatedTodo.json();
    // Rerender List of todo after update
    updatedTodo && getAllTodo();

    console.log(`Data updated for todo ${todoId}, ${todo}`, updatedTodo);
    createBox.classList.remove('hidden');
    createBox.classList.add('flex');
    updateBox.classList.remove('flex');
    updateBox.classList.add('hidden');
  }

  // Delete the todo
  const deleteTodo = async (todoId) => {
    // console.log(todoId);
    console.log(`todo need to delete is : ${todoId}`);
    let deleteTodo = await fetch(`https://jsonplaceholder.typicode.com/posts/${todoId}`, {
      method: 'DELETE'
    });
    deleteTodo = await deleteTodo.json();
    // * Todo List Rerender After Delete
    deleteTodo && getAllTodo();
  }


  const searchTodo = async (key) => {
    let searchItem = await fetch(`https://jsonplaceholder.typicode.com/posts?title=${key}`)
    searchItem = await searchItem.json();
    if (searchItem.length > 0) {
      setListTodo(searchItem);
    }
    else {
      getAllTodo();
    }
  }

  return (
    <div className="App">
      <div className="max-w-lg bg-primary mx-auto py-8">

        {/* Logo */}
        <div className="flex flex-wrap items-center flex-col uppercase m-4 font-bold text-blue">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-blue">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
          </svg>
          <div>todos</div>
          <div className="text-center text-red-500 text-sm mt-10">Kindly check console because 3rd party api does not allow us to all the features like to update data, however APIs all working fine.</div>
        </div>

        {/* Field to create Todo */}
        <div className="flex flex-wrap items-center mb-4" id="create-todo">
          <input onChange={(e) => setTodo(e.target.value)} type="text" name="task" id="task" className="w-3/5" placeholder="Create your task here..." />
          <button className="custom-button w-2/5" onClick={() => createTodo()}>Create Todo</button>
        </div>

        {/* Field to update Todo */}
        <div className="hidden flex-wrap items-center mb-4" id="update-todo">
          <input value={todo} onChange={(e) => setTodo(e.target.value)} type="text" name="task" id="task" className="w-3/5" placeholder="Create your task here..." />
          <button className="custom-button w-2/5" onClick={() => updateTodo()}>Update Todo</button>
        </div>

        {/* Search Todos */}
        <div className="flex flex-wrap items-center mb-4  w-full bg-prirmary">
          <input type="text" name="search" id="search" className="w-full" placeholder="Search todos here..." onChange={(e) => searchTodo(e.target.value)} />
        </div>
        {/* List of Todos */}
        {
          listTodo.length > 0 ?
            <>

              {/* List of Todos */}
              <ul>
                {
                  listTodo.slice(((currentPageIndex * recordPerPage) - recordPerPage), (currentPageIndex * recordPerPage)).map((todo, index) => (
                    <li key={index} className="rounded mb-4 flex flex-wrap items-center bg-blue p-4 text-white relative pr-20">
                      {/* Trash Icon */}
                      <svg onClick={() => deleteTodo(todo.id)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 absolute right-3 cursor-pointer hover:text-black">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>

                      {/* Edit Icon */}
                      <svg onClick={() => editTodo(todo.id)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 absolute right-10 cursor-pointer hover:text-black">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                      <span><span className="mr-2">{todo.id}.</span>{todo.title}</span>
                    </li>
                  ))
                }
              </ul>

              {/* Pagination */}
              <ul className='flex flex-wrap justify-center items-center gap-1'>
                {
                  (() => {
                    const pageItem = [];
                    for (let i = 1; i <= (listTodo.length / 5); i++) {
                      pageItem.push(<li className="p-2 cursor-pointer hover:bg-purple inline-block bg-blue rounded-full w-10 h-10 text-white text-center" key={i} onClick={() => setCurrentPageIndex(i)}>{i}</li>);
                    }
                    return pageItem;
                  })()
                }
              </ul>
            </>
            : <Loader />
        }
    </div>
    </div >
  );
}

export default App;
