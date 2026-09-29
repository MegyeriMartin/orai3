import { useEffect, useRef, useState } from "react";
import { nanoid } from "nanoid";
import Todo from "./components/Todo";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function App(props) {
  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem("todo-react-tasks");
      const parsedTasks = savedTasks ? JSON.parse(savedTasks) : props.tasks || [];

      return Array.isArray(parsedTasks)
        ? parsedTasks.map((task) => ({
            ...task,
            priority: Number(task.priority) || 0,
          }))
        : [];
    } catch {
      const fallbackTasks = props.tasks || [];
      return fallbackTasks.map((task) => ({
        ...task,
        priority: Number(task.priority) || 0,
      }));
    }
  });
  const [filter, setFilter] = useState("all");
  const listHeadingRef = useRef(null);
  const prevTaskLength = usePrevious(tasks.length);

  useEffect(() => {
    try {
      localStorage.setItem("todo-react-tasks", JSON.stringify(tasks));
    } catch {
    }
  }, [tasks]);

  useEffect(() => {
    if (tasks.length < prevTaskLength) {
      listHeadingRef.current.focus();
    }
  }, [tasks.length, prevTaskLength]);

  function addTask(name) {
    const newTask = {
      id: `todo-${nanoid()}`,
      name,
      completed: false,
      priority: 0,
    };
    setTasks([...tasks, newTask]);
  }

  function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  function deleteTask(id) {
    const remainingTasks = tasks.filter((task) => id !== task.id);
    setTasks(remainingTasks);
  }

  function editTask(id, name, priority = 0) {
    setTasks(
      tasks.map((task) =>
        id === task.id
          ? { ...task, name, priority: Number(priority) || 0 }
          : task,
      ),
    );
  }

  function updateTaskPriority(id, priority) {
    setTasks(
      tasks.map((task) =>
        id === task.id ? { ...task, priority: Number(priority) || 0 } : task,
      ),
    );
  }

  const sortedTasks = [...tasks].sort(
    (a, b) => Number(a.priority || 0) - Number(b.priority || 0),
  );

  const filteredTasks = sortedTasks.filter((task) => {
    if (filter === "active") {
      return !task.completed;
    }
    if (filter === "completed") {
      return task.completed;
    }
    return true;
  });

  const taskList = filteredTasks.map((task) => (
    <Todo
      id={task.id}
      name={task.name}
      completed={task.completed}
      priority={task.priority}
      key={task.id}
      toggleTaskCompleted={toggleTaskCompleted}
      deleteTask={deleteTask}
      editTask={editTask}
      updateTaskPriority={updateTaskPriority}
    />
  ));

  const tasksNoun = taskList.length !== 1 ? "tasks" : "task";
  const headingText = `${taskList.length} ${tasksNoun} remaining`;

  return (
    <div className="todoapp stack-large">
      <h1>TodoMatic</h1>
      <Form addTask={addTask} />
      <div className="filters btn-group stack-exception">
        <FilterButton
          name="All"
          isPressed={filter === "all"}
          setFilter={() => setFilter("all")}
        />
        <FilterButton
          name="Active"
          isPressed={filter === "active"}
          setFilter={() => setFilter("active")}
        />
        <FilterButton
          name="Completed"
          isPressed={filter === "completed"}
          setFilter={() => setFilter("completed")}
        />
      </div>
      <h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}>
        {headingText}
      </h2>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
        {taskList}
      </ul>
    </div>
  );
}

export default App;