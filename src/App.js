import './App.css';
import { useState } from 'react';

function App() {
  const [state,setState] = useState({
    stateArray : ['None'],
    isFilledString : '',
    incrementedValue : 0
  })
  let arrayOfTasks = ['yufytct']
  let arrayTasks = [''] ;
  
  const handleChange = (e) =>{
    let valueGet = e.target.value
    setState({
      stateArray : [...arrayOfTasks],
    isFilledString : valueGet,
    })
  }
  const handleSubmit = () =>{
      arrayOfTasks.push(state.isFilledString)
      setState({
        stateArray : [...arrayOfTasks],
        incrementedValue : state.incrementedValue +1
      })
      arrayTasks[state.incrementedValue] = arrayOfTasks[arrayOfTasks.length-1]
      
      console.log( arrayTasks)

  }
  return (
    <div className="App">
     
      <div>
      <input placeholder='entrer la tache' onChange={handleChange}/>
      <button onClick={handleSubmit}>Ajouter</button>
      <button>Suprimer</button>
      <button>Modifier</button>
      </div>

      <ul>

    {
      state.stateArray.map((task,index)=>{
          return (
            <li key={index}>
            {task} {index}
          </li>
          )
      })
    }
      </ul>
    </div>
  );
}

export default App;
