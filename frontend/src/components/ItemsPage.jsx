import { useState, useContext, useEffect } from "react";
import { LogContext } from "../store/LogContext";
import Item from "./Item";
import CreateTodo from "./CreateTodo";
import Error from "./Error";
import { fetchingTodos } from "../utils/api";

export default function ItemsPage() {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const { token } = useContext(LogContext);

  useEffect(() => {
    fetchingTodos(setLoading, token, setTodos, setError);
  }, [setLoading, token, setTodos, setError]);

  return (
    <>
      <div className="flex flex-col gap-8 items-center justify-center">
        <h1 className="text-xl">Todos List</h1>
        <CreateTodo onAdd={setTodos} />
        {error && (
          <Error title="Failed to fetch todos data..." message={error} />
        )}
        {loading && <h1>Fetching data...</h1>}
        {todos && (
          <ul>
            {todos.map((todo) => {
              return (
                <li className="float-left mr-2" key={todo.id}>
                  <Item key={todo.id} item={todo} onDelete={setTodos} />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}
