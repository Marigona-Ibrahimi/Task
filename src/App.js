import Header from './Header';
import Footer from './Footer';
import About from './About';
import Tasks from './Tasks';
import AddTask from './AddTask';
import './App.css';
import React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';



const App = () => {
  const [showAddTask, setShowAddTask] = useState(true)
  const [tasks, setTasks] = useState([
    {
      id: 1,
      text: 'Doctors Appointment',
      day: 'Feb 5th at 2:30',
      reminder: true
    },
    {
      id: 2,
      text: 'Meeting at School',
      day: 'Feb 6th at 1:30pm',
      reminder: true
    },
    {
        id: 3,
        text: 'Food Shopping',
        day: 'Feb 5th at 2:30pm',
        reminder: false
    }
  ])

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }

    getTasks()
  }, [])

  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await res.json()

    return data
  }

  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks')
    const data = await res.json()

    return data
  }

  const addTask = (task) => {
    const id = Math.floor(Math.random()*
    10000) + 1
    const newTask = { id, ...task }
    setTasks([...tasks, newTask])
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  //Toggle Reminder
  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id)
    const updTask = {...taskToToggle, 
    reminder: !taskToToggle.reminder}

    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type' : 'application/json'
      },
      body: JSON.stringify(updTask)
    })

    const data = await res.json()

    setTasks(tasks.map((task) => task.id === id ? { ...task, 
    reminder: !data.reminder} : task))
  }

  return (
    <Router>
      <div className="container">
        <Header onAdd={() => setShowAddTask(!showAddTask)} 
        showAdd={showAddTask}/>
        {/* {showAddTask &&<AddTask onAdd={addTask}/>}
        {tasks.length > 0 ? (<Tasks tasks={ tasks } onDelete={deleteTask} 
        onToggle={ toggleReminder }/> ) : 
        ( 'No Tasks To Show')} */}
        <Route path='/' 
        exact 
        render={(props) => (
          <>
            {showAddTask &&<AddTask onAdd={addTask}/>}
            {tasks.length > 0 ? (<Tasks tasks={ tasks } onDelete={deleteTask} 
            onToggle={ toggleReminder }/> ) : 
            ( 'No Tasks To Show')}
          </>
        )} />
        <Route path='/about' component={About}/>
        <Footer />
      </div>
    </Router>
  );
}


export default App;
