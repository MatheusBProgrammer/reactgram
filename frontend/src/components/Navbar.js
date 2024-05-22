import React from "react";
import "./Navbar.css";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { BsSearch, BsHouseDoorFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { logout, reset } from "../slices/authSlice";
import { useAuth } from "../hooks/useAuth";

function Navbar() {
  const { auth } = useAuth();
  /*   const { user } = useSelector((state) => state.auth);
   */ const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());

    navigate("/login");
  };

  return (
    <nav id="nav">
      <Link to="/">ReactGram</Link>
      <form id="search-form">
        <BsSearch />
        <input type="text" placeholder="Pesquisar" />
      </form>
      <ul id="nav-links">
        <li>
          <NavLink to="/">
            <BsHouseDoorFill />
          </NavLink>
        </li>
        <li>
          <NavLink to="/login">Entrar</NavLink>
        </li>
        <li>
          <NavLink to="/register">Cadastrar</NavLink>
        </li>
        {!auth && <li>UseAuth funcionando</li>}
        <li>
          <button onClick={handleLogout}>logout</button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
