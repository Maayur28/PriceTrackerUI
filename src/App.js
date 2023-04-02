import "./App.css";
import Home from "./Component/Home/home";
import Nav from "./Component/Nav/nav";
import Account from "./Component/Account/account";
import Login from "./Component/Login/login";
import Register from "./Component/Register/register";
import Contact from "./Component/Contact/contact";
import ForgetPassword from "./Component/ForgetPassword/forgetpassword";
import { Route, Routes } from "react-router-dom";
import NotFound from "./Component/NotFound";
import Trackers from "./Component/Trackers/trackers";

function App() {
  return (
    <div className="App">
      <Nav />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/account" element={<Account />}></Route>
        <Route path="/trackers" element={<Trackers />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/contact" element={<Contact />}></Route>
        <Route path="/forgetpassword" element={<ForgetPassword />}></Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </div>
  );
}

export default App;
