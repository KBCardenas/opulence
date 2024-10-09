import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // Asegúrate de que App.jsx exista
import "./App.css"; // Verifica la existencia de este archivo

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
