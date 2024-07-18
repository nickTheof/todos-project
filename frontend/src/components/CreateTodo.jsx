import { useState, useContext, useEffect } from "react";
import { createUserTodo } from "../utils/api";
import { LogContext } from "../store/LogContext";
import Error from "./Error";
import Button from "../ui/Button";

export default function CreateTodo({ onAdd }) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState();
  const { token } = useContext(LogContext);

  async function handleSubmit(event) {
    event.preventDefault();
    const data = {
      title,
    };
    await createUserTodo(data, token, onAdd, setError);
    setTitle("");
  }

  function handleChange(event) {
    setTitle(event.target.value);
  }

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 2000);

      // Cleanup function to clear the timer if the component unmounts or error changes before 2 seconds
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <>
      {error && <Error title="Failed to create new Todo!" message={error} />}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-1 w-72 mx-auto mt-1 mb-4 text-center items-center justify-center "
      >
        <input
          className="h-8 w-72 border-slate-900 border-solid border-2 rounded-md"
          placeholder="title..."
          value={title}
          onChange={handleChange}
          required
        />
        <Button type='submit'>Add</Button>
      </form>
    </>
  );
}
