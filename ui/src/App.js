import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AddTaskForm } from "./components/AddTaskForm";
import { Task } from "./components/Task";
import axios from "axios";
import { API_URL } from "./utils";

// Updated dark theme with a custom accent color
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#1c1c1e",
    },
    primary: {
      main: "#6c63ff",
    },
    secondary: {
      main: "#ff6f61",
    },
  },
});

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [showCompleted, setShowCompleted] = useState(false);

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      const { data } = await axios.get(API_URL);
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const toggleCompletedTasks = () => {
    setShowCompleted((prev) => !prev);
  };

  // Separate tasks into pending and completed
  const completedTasks = tasks.filter((task) => task.completed);
  const pendingTasks = tasks.filter((task) => !task.completed);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="appContainer">
        <h1 className="appTitle">Task Manager</h1>
        <AddTaskForm fetchTasks={fetchTasks} />
        <div className="taskSection">
          <h2>Pending Tasks</h2>
          {pendingTasks.map((task) => (
            <Task task={task} key={task.id} fetchTasks={fetchTasks} />
          ))}
        </div>
        <div className="taskSection">
          <button className="toggleButton" onClick={toggleCompletedTasks}>
            {showCompleted ? "Hide Completed Tasks" : "Show Completed Tasks"}
          </button>
          {showCompleted && (
            <>
              <h2>Completed Tasks</h2>
              {completedTasks.map((task) => (
                <Task task={task} key={task.id} fetchTasks={fetchTasks} />
              ))}
            </>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
}
