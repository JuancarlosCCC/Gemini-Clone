import React from "react";
import Main from "./components/main/Main";
import { Sidebar } from "./components/Sidebar/Sidebar";

export const App = () => {
  return (
    <>
      <Sidebar />
      <Main />
    </>
  );
};

export default App;
