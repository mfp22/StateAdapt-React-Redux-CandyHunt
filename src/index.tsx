import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AdaptContext, defaultStateAdapt } from "@state-adapt/react";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <AdaptContext.Provider value={defaultStateAdapt}>
    <App />
  </AdaptContext.Provider>
);
