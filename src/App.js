import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addTodo, toggleTodo, deleteTodo, setFilter } from "./redux/todosSlice";
import "./App.css";
import deletebtn from './deletebtn.jpg';

function App() {
  const dispatch = useDispatch();
  const todos = useSelector(state => state.todosState.todos);
  const filter = useSelector(state => state.todosState.filter);

  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const now = new Date();
  const [date, setDate] = useState(now.toISOString().split("T")[0]);
  const [time, setTime] = useState(
    String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes() + 2).padStart(2, "0")
  );

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  function newTOdo() {
    if (input.trim() === "") {
      setError(true);
      return;
    }
    dispatch(addTodo({
      id: Date.now(),
      text: input,
      completed: false,
      date,
      time
    }));
    setInput("");
    setError(false);
  }

  function inputHandler(event) {
    setInput(event.target.value);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      newTOdo();
    }
  }

  function getDeadlineStatus(date, time) {
    if (!date || !time) return "";
    const deadline = new Date(`${date}T${time}`);
    const now = new Date();
    const diffMs = deadline - now;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (diffMs < 0) {
      return `Deadline expired ${Math.abs(diffDays)} days and ${Math.abs(diffHours)} hours ago`;
    } else if (diffDays === 0) {
      return `Due today, ${diffHours} hours left`;
    }
    return `Due in ${diffDays} days and ${diffHours} hours`;
  }

  function dateHandler(event) {
    setDate(event.target.value);
  }
  function timeHandler(event) {
    setTime(event.target.value);
  }

  const filteredTodos = todos.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  return (
    <div className="App">
      <div className="header">
        <div className="heading">
          <input
            placeholder="What need to be done?"
            className={error ? "input error" : "input"}
            type="text"
            onChange={inputHandler}
            value={input}
            onKeyDown={handleKeyDown}
          />
          <input
            className={error ? "date" : "date-input"}
            type="date"
            onChange={dateHandler}
            value={date}
            onKeyDown={handleKeyDown}
          />
          <input
            className={error ? "time" : "time-input"}
            type="time"
            onChange={timeHandler}
            value={time}
            onKeyDown={handleKeyDown}
          />
          <button className="button" onClick={newTOdo}>Add task</button>
        </div>
      </div>
      <ul className="main-msg">
        {filteredTodos.map(item => (
          <li key={item.id}>
            <div className="message">
              <div className="two-msg">
                <input
                  className="checkbox"
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => dispatch(toggleTodo(item.id))}
                />
                <span className={`item-text ${item.completed ? "completed" : ""}`}>
                  {item.text}
                </span>
              </div>
              <div className="deadline-expired">
                {getDeadlineStatus(item.date, item.time)}
              </div>
              <div className="dlt-btn">
                <button className="delete-button" onClick={() => dispatch(deleteTodo(item.id))}>
                  <img
                    className="todo-right"
                    src={deletebtn}
                    alt="deleteicon"
                    width="20"
                    height="25"
                  />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="footer">
        <div className="footer-s">
          <span className="spn-i">{todos.filter((t) => !t.completed).length} : Item Left</span>
          <div className="filters">
            <button className={filter === "all" ? "active-filter" : ""}
              onClick={() => dispatch(setFilter("all"))}
            > All</button>
            <button className={filter === "active" ? "active-filter" : ""}
              onClick={() => dispatch(setFilter("active"))}
            >Active</button>
            <button className={filter === "completed" ? "active-filter" : ""}
              onClick={() => dispatch(setFilter("completed"))}
            > Completed</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;