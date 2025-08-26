import { createSlice } from '@reduxjs/toolkit';

const initialState = (() => {
  const saved = localStorage.getItem("todos");
  return saved ? JSON.parse(saved) : [
    { id: 0, text: "abc", completed: false, date: "2025-08-19", time: "19:36" },
    { id: 1, text: "xyz", completed: false, date: "2025-08-19", time: "19:36" },
  ];
})();

const todosSlice = createSlice({
  name: 'todos',
  initialState: {
    todos: initialState,
    filter: 'all'
  },
  reducers: {
    addTodo: (state, action) => {
      state.todos.push(action.payload);
    },
    toggleTodo: (state, action) => {
      const todo = state.todos.find(t => t.id === action.payload);
      if (todo) todo.completed = !todo.completed;
    },
    deleteTodo: (state, action) => {
      state.todos = state.todos.filter(t => t.id !== action.payload);
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setTodos: (state, action) => {
      state.todos = action.payload;
    }
  }
});

export const { addTodo, toggleTodo, deleteTodo, setFilter, setTodos } = todosSlice.actions;
export default todosSlice.reducer;