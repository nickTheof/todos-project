import Header from "./components/Header";
import { useContext } from "react";
import { LogContext } from "./store/LogContext";
import Logger from "./components/Logger";
import ItemsPage from "./components/ItemsPage";


function App() {
  const { token } = useContext(LogContext);

  return (
    <>
      <Header />
      <main>
        {token === "" && <Logger />}
        {token !== "" && <ItemsPage />}
      </main>
    </>
  );
}

export default App;
