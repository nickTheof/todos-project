import { client } from "./auth";

export const createUserTodo = async (data, token, onAdd, fnError) => {
  try {
    const response = await client.post(
      "/todos/current-user/create-todo",
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    onAdd((prevData) => {
      return [...prevData, response.data];
    });
  } catch (error) {
    fnError(error.response.data.detail || 'Failed to create new todo...');
  }
};


export const fetchCurrentUser = async (token, tokenFn) => {
    try {
      const response = await client.get("/users/current-user", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": 'Bearer '+token,
        },
      });
      localStorage.setItem("token", token);
    } catch (error) {
      tokenFn("");
    }
  };


export const deleteUser =  async (token, setToken, setError) => {
    try{
      const response = await client.delete(`users/current-user/delete`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      });
      setToken("");
      localStorage.removeItem('token');
      window.alert(response.data.message)
    }catch (error) {
      setError(error.response.data.detail || 'Failed to delete user');
    }
}


export const handleUpdateTodo = async (title, id, token, setError) => {
  try {
    const response = await client.put(
      `/todos/current-user/update-todo/${id}`,
      null,
      {
        params: {
          new_todo_title: title,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    return response.data;
  } catch (error) {
    setError(error.response.data.detail || "Failed to update todo title.");
  }
}

export const deleteTodo = async (id, token, setError) => {
  try {
    const response = await client.delete(
      `/todos/current-user/delete-todo/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    return response.data;
  } catch (error) {
    setError(error.response.data.detail|| 'Failed to delete todo...')
  }
}

export const postToken = async (data, setToken, setError) => {
  try {
    const response = await client.post("/token", data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    setToken(response.data.access_token);
  } catch (error) {
    setToken("");
    setError(
      error.response.data.detail || "Failed to login. Please try again..."
    );
  }
};


export const fetchingTodos = async (setLoading, token, setTodos, setError) =>{
  setLoading(true);
  try{
      const response = await client.get('/users/current-user',{
          headers:{
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token
          }
      });
      setTodos(response.data.todos)
  }catch (error){
      setError(error.response.data.detail || "Error with data fetching!");
  }
  setLoading(false);
};


export const createUser = async (data, setIsLoading, setToken, setSendingError, setUsername, setPassword, setPasswordConfirm) => {
  setIsLoading(true);
  try{
  const response = await client.post("/users/create-user",data,{
    headers: {
      'Content-Type': 'application/json',
    }
  });
  localStorage.setItem('token', response.data.access_token);
  setToken(localStorage.getItem('token'));
}catch (error) {
  setToken("");
  localStorage.setItem("token", "");
  setSendingError(error.response.data.detail[0].msg || "Failed to send data.");
  setUsername("");
  setPassword("");
  setPasswordConfirm("");
};
setIsLoading(false);
};