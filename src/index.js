import React from "react";
import ReactDOM from "react-dom/client";
import {SignIn, Keyword, SignUp} from './pages';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SignIn/>,
  },
  {
    path: "/signIn",
    element: <SignIn/>,
  },
  {
    path: "/keywords",
    element: <Keyword/>,
  },
  {
    path: "/signUp",
    element: <SignUp/>,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);