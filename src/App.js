import React , {useState , useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'
import { API } from 'aws-amplify';
import {createTodo as createTodoMutation ,
        deleteTodo as deleteTodoMutation} from './graphql/mutations';
import { listTodos } from './graphql/queries';

function App() {

  const initialFormData = {name : "" , description : ""}

  const [formData , setFormData]=  useState(initialFormData);
  const [todos , setTodos] = useState([]);

  useEffect(()=>{
    fetchTodos();
  } , [])

  //crud functions

  async function fetchTodos(){
    
  const apiData = await API.graphql({query:listTodos});
  console.log(apiData)
  setTodos(apiData.data.listTodos.items)
  }

  async function createTodo(){
    //form fields are empty
    if(!formData.name || formData.description) return;
    //if fields are not empty
    await API.graphql({query:createTodoMutation , variables :{input : formData}});
    setTodos([...todos , formData]);
    setFormData(initialFormData)
    

   
     
   
  }

  async function deleteTodo({id}){
    const newTodosArray = todos.filter((todo)=> todo.id !== id)
    setTodos(newTodosArray)
    await API.graphql({query:deleteTodoMutation , variables :{input : {id} }})
  }
  return (
    <div className="App">
      <h1>My Notes App</h1>
      {/* 1-create from */}
      <input onChange = {(e)=>{setFormData({...formData , name : e.target.value})}}
              type="text" placeholder = "todo name " 
              name = {formData.name}/>
      <input onChange = {(e)=>{setFormData({...formData , description : e.target.value})}}
               type="text" placeholder = "todo description" 
               name = {formData.description} />
      <button onClick = {createTodo}>Create Todo</button>


      <div style={{marginBottom: 30}}>
        {
          todos.map(todo => (
            <div key={todo.id || todo.name}>
              <h2>{todo.name}</h2>
              <p>{todo.description}</p>
              <button onClick={() => deleteTodo(todo)}>Delete Todo</button>
            </div>
          ))
        }
      </div>
    
      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);