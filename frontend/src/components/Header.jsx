import { useContext, useState } from "react";
import { LogContext } from "../store/LogContext";
import Modal from "./Modal";
import { deleteUser } from "../utils/api";
import Error from "./Error";
import Button from "../ui/Button";

export default function Header() {
  const { token, setToken } = useContext(LogContext);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState();


  
  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
  };

  const handleSumbitModal = (event) => {
    event.preventDefault();
    deleteUser(token, setToken, setError);
    setShowDeleteModal(false);
  }

  return (
    <>
    <Modal open={showDeleteModal} onClose={setShowDeleteModal}> 
      <h1 className="text-stone-950 text-lg">You are going to delete your account. Are you sure?</h1>
      <form onSubmit={handleSumbitModal} className="flex flex-row gap-2 mt-4 mb-2">
        <Button type='submit'>Yes</Button>
        <Button type='button' onClick={()=>setShowDeleteModal(false)}>No</Button>
      </form>
    </Modal>
    <header>
      <nav className="flex justify-between text-slate-800 w-full p-1">
        <p className="text-lg rounded-md px-2 pd-1">React Forms</p>
        {token !== "" && (
          <>
          <div>
          <Button type='button' onClick={()=>{setShowDeleteModal(true)}} classes="mr-3 px-2">Delete Account</Button>
          <Button type='button' onClick={handleLogout}>Logout</Button>
          </div>
          </>
        )}
      </nav>
    </header>
    {error && <Error title='Failed to delete user' message={error}/>}
    </>
  );
}
