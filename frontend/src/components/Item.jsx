import { useContext, useState } from "react";
import { LogContext } from "../store/LogContext";
import Modal from "./Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Error from "./Error";
import { handleUpdateTodo, deleteTodo } from "../utils/api";

export default function Item({ item, onDelete }) {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const { token } = useContext(LogContext);
  const [updatedTitle, setUpdatedTitle] = useState(item.title);
  const [error, setError] = useState();


  async function handleClick(id) {
    const resData = await deleteTodo(id, token, setError);
    if (resData){
    onDelete((prevData) => {
      const cData = [...prevData];
      const filteredData = cData.filter((todo) => {
        return todo.id !== id;
      });
      return filteredData;
    });
    }
  }

  async function handleSubmitUpdateTodo(event) {
    event.preventDefault();
    const resData = await handleUpdateTodo(updatedTitle, item.id, token, setError);
    onDelete((prevData) => {
      const filteredData = [...prevData].filter((todo) => {
        return todo.id !== item.id;
      });
      const newData = [...filteredData, resData];
      let sortedData = newData.sort((p1, p2) => (p1.id < p2.id ? -1 : 1));
      return sortedData;
    });
    setShowUpdateModal(false);
  }

  return (
    <>
      <Modal open={showUpdateModal} onClose={setShowUpdateModal}>
        {error && <Error title='Failed to update todo.' message={error} />}
        <h1 className="text-stone-950 text-lg">Update your Todo</h1>
        <form
          onSubmit={handleSubmitUpdateTodo}
          className="flex flex-col gap-2 mt-4 mb-2"
        >
          <Input
            type="text"
            label='title'
            value={updatedTitle}
            onChange={setUpdatedTitle}
          />
          <Button type="submit" classes="px-3 py-1 w-24 mx-auto">
            Edit Title
          </Button>
          <Button
            type="button"
            classes="px-3 py-1 w-24 mx-auto"
            onClick={() => setShowUpdateModal(false)}
          >
            Close
          </Button>
        </form>
      </Modal>
      {error && <Error classes="w-full" title='Failed to delete todo.' message={error} />}
      <div className="flex flex-col text-center border-solid rounded-md shadow-md shadow-slate-800 border-2 border-stone-950 mb-4">
        <h1 className="text-lg">{item.title}</h1>
        <div className="flex flex-row text-center items-center justify-center gap-2 mb-4 mt-2 ml-2 mr-2">
          <Button type="button" onClick={() => setShowUpdateModal(true)}>
            Update
          </Button>
          <Button type="button" onClick={() => handleClick(item.id)}>
            Delete
          </Button>
        </div>
      </div>
    </>
  );
}
