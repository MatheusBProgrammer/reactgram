import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
//Redux
import { register, reset } from "../slices/authSlice";
import { useSelector, useDispatch } from "react-redux";

function Register() {
  // Estado único para todos os campos do formulário
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [errors, setError] = useState("");

  // Manipulador genérico de mudanças
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors) {
      setError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validação básica
    if (!formData.name || !formData.email || !formData.password) {
      setError("Todos os campos são obrigatórios");
      return;
    }

    // Aqui você pode adicionar a lógica para enviar os dados do formulário
    console.log(formData);
    setError("");
    dispatch(register(formData));
  };
  useEffect(() => {
    dispatch(reset());
  }, [errors, dispatch]);

  return (
    <div>
      <h2>ReactGram</h2>
      <p className="subtitle">Cadastre-se para ver as fotos dos seus amigos</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome"
          name="name"
          value={formData.name}
          onChange={handleOnChange}
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleOnChange}
        />
        <input
          type="password"
          placeholder="Senha"
          name="password"
          value={formData.password}
          onChange={handleOnChange}
        />
        <input type="submit" value="Cadastrar" />
        {errors && <p style={{ color: "red" }}>{errors}</p>}
      </form>
      <p>
        Já possui conta? <Link to="/login">Clique aqui</Link>
      </p>
    </div>
  );
}

export default Register;
