import { useState, useContext } from "react";
import { client } from "../utils/auth";
import { LogContext } from "../store/LogContext";
import Error from "./Error";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { createUser } from "../utils/api";



export default function Signup({handleChangeToLogin}) {
  const {setToken} = useContext(LogContext);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sendingError, setSendingError] = useState();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");


  function handleValidatePassword(){
    if (passwordConfirm !== password){
      setError('Passwords must be the same')
    }
  }

  function handleRegainFocus(){
    setError("");
  }

  async function handleSignup(event){
    event.preventDefault();
    const data = {
      username,
      password,
    }
    await createUser(data, setIsLoading, setToken, setSendingError, setUsername, setPassword, setPasswordConfirm);
  }

  return (
    <>
      {isLoading && <h1 className="text-center text-lg text-stone-950">Sending sign up data...</h1>}
      {sendingError && <Error title='Failed to send sign up data' message={sendingError}/>}
      <div className="flex flex-col align-middle justify-center items-center my-8 mx-auto w-72 gap-1 bg-orange-100 text-stone-800 rounded-md border-slate-700 border-2 ">
        <form onSubmit={handleSignup}>
          <Input label='username' value={username} type='text' onChange={setUsername} autoComplete="username" autoFocus />
          <Input label='password' value={password} type='password' onChange={setPassword} autoComplete="new-password" />
          <Input label='confirm password' value={passwordConfirm} type='password' onChange={setPasswordConfirm} onBlur={handleValidatePassword} onFocus={handleRegainFocus} autoComplete="new-password" />
          {error && <p className="text-red-600">{error}</p>}
          <div className="flex items-center justify-center px-6 mb-2 gap-4 bg-orange-100">
                <Button
                  type='submit'
                  classes="px-1 py-1 w-16 bg-slate-500 hover:bg-slate-400"
                  disabled={error}
                >
                  Sign up
                </Button>
                <Button type="button" classes="px-1 py-1 w-16" onClick={()=>handleChangeToLogin('login')}>
                  Login
                </Button>
          </div>
        </form>
      </div>
    </>
  );
}
