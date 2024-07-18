import { useContext, useState } from "react";
import { LogContext } from "../store/LogContext";
import { client } from "../utils/auth";
import Signup from "./Signup";
import Error from "./Error";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { postToken } from "../utils/api";

export default function Logger() {
  const [stage, setStage] = useState("login");
  const [error, setError] = useState();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setToken } = useContext(LogContext);


  function handleSubmit(event) {
    event.preventDefault();
    const data = {
      username,
      password,
    };
    postToken(data, setToken, setError);
  }

  function handleToSignupForm() {
    setStage("signup");
  }

  return (
    <>
      {stage === "login" && (
        <>
          {error && <Error title="Failed to login." message={error} />}
          <div className="flex flex-col align-middle justify-center items-center my-8 mx-auto w-72 gap-1 bg-orange-100 text-stone-800 rounded-md border-slate-700 border-2 ">
            <form onSubmit={handleSubmit}>
              <Input
                label="username"
                type="text"
                value={username}
                onChange={setUsername}
                autoComplete="username"
                autoFocus
              />
              <Input
                label="password"
                type="password"
                value={password}
                onChange={setPassword}
                autoComplete="current-password"
              />
              <div className="flex items-center justify-center px-6 mb-2 gap-4 bg-orange-100">
                <Button
                  type="button"
                  onClick={handleToSignupForm}
                  classes="px-1 py-1 w-16"
                >
                  Sign up
                </Button>
                <Button type="submit" classes="px-1 py-1 w-16 bg-slate-500 hover:bg-slate-400">
                  Login
                </Button>
              </div>
            </form>
          </div>
        </>
      )}
      {stage === "signup" && <Signup handleChangeToLogin={setStage}/>}
    </>
  );
}
