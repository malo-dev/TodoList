import React, {
  useState,
  useEffect,
  useContext,
  useReducer,
  useRef,
  useCallback,
  useMemo,
  useLayoutEffect,
  useDebugValue,
  useImperativeHandle,
  forwardRef
} from 'react';

// 1. Création d'un contexte pour partager l'état des tâches
const TaskContext = React.createContext();

const taskReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TASK':
      return [...state, { id: Date.now(), text: action.payload }];
    case 'REMOVE_TASK':
      return state.filter(task => task.id !== action.payload);
    default:
      return state;
  }
};

// 2. Fournisseur de contexte avec useReducer
const TaskProvider = ({ children }) => {
  const [tasks, dispatch] = useReducer(taskReducer, []);
  return (
    <TaskContext.Provider value={{ tasks, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
};

// 3. Composant de saisie de tâche avec useRef et useImperativeHandle
const InputField = forwardRef((_, ref) => {
  const inputRef = useRef();

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus(),
  }));

  return <input ref={inputRef} placeholder="Ajouter une tâche" />;
});

// 4. Composant principal de gestion des tâches
const TaskApp = () => {
  const [input, setInput] = useState('');
  const { tasks, dispatch } = useContext(TaskContext);
  const inputRef = useRef();

  useDebugValue(tasks.length > 0 ? "Tasks present" : "No tasks");

  const handleAddTask = () => {
    if (input.trim()) {
      dispatch({ type: 'ADD_TASK', payload: input });
      setInput('');
    }
  };

  // 5. useCallback pour optimiser les fonctions de suppression
  const handleDeleteTask = useCallback((id) => {
    dispatch({ type: 'REMOVE_TASK', payload: id });
  }, [dispatch]);

  // 6. useMemo pour compter les tâches
  const taskCount = useMemo(() => tasks.length, [tasks]);

  // 7. useLayoutEffect pour une action synchrone post-mutation DOM
  useLayoutEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // 8. useEffect pour des effets asynchrones, comme le stockage local
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (savedTasks) {
      savedTasks.forEach(task => dispatch({ type: 'ADD_TASK', payload: task.text }));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  return (
    <div>
      <h1>Tâches ({taskCount})</h1>
      <InputField ref={inputRef} />
      <button onClick={handleAddTask}>Ajouter</button>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {task.text} 
            <button onClick={() => handleDeleteTask(task.id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Composant racine avec le fournisseur de contexte
const App = () => (
  <TaskProvider>
    <TaskApp />
  </TaskProvider>
);

export default App;
