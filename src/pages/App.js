import { Button } from "@mui/material";
import Navbar from '../components/Navbar'
import {SignIn, Keyword, SignUp} from '../pages';
import WithNavbar from './WithNavbar';
import WithOutSignInNavbar from './WithOutNavbar' 
import {
  Route,
  Routes,
} from "react-router-dom";
import React from "react";

function App() {
  return (
    <>
        <Routes>
        <Route element={<WithOutSignInNavbar />}>
          <Route path='/' element={<SignIn/>}/>
          <Route path='/signIn' element={<SignIn/>}/>
          <Route path='/signUp' element={<SignUp/>}/>
        </Route>
          <Route element={<WithNavbar />}>
            <Route path='/keywords' element={<Keyword/>}/>
          </Route>
        </Routes>
    </>
  );
}

export default App;
