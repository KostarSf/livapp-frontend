import React from "react";
import DashPage from "./routes/dashboard/DashPage";
import LoginPage from "./routes/login/LoginPage";
import { Store } from "./storage/Store";

const App = () => {
  const page = Store.IsLogined() ? "dash" : "login";

  if (page === "login") {
    return <LoginPage />;
  }

  if (page === "dash") {
    return <DashPage />;
  }

  return <p>Ошибка</p>;
};

export default App;
