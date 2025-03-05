import { App } from "./components/App";
import "bootstrap/dist/css/bootstrap.css";
import React from "react";
import { createRoot } from "react-dom/client";

// This is the entry point of your application, but it just renders the Dapp
// react component. All of the logic is contained in it.
const domNode = document.getElementById('root');
const root = createRoot(domNode);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
