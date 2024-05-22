import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Adicionado useNavigate para redirecionamento
import { reset } from "../slices/authSlice"; // Importa as ações 'login' e 'reset' do slice de autenticação
import { useSelector, useDispatch } from "react-redux"; // Importa os hooks 'useSelector' e 'useDispatch' do Redux

function Login() {
  // Estado local para gerenciar os dados do formulário
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // useDispatch é um hook do Redux usado para disparar ações definidas no slice
  const dispatch = useDispatch();

  // useSelector é um hook do Redux que permite acessar o estado global da aplicação
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  // Estado local para manejar mensagens de erro
  const [errors, setError] = useState("");

  const navigate = useNavigate();

  // Função para lidar com mudanças nos inputs do formulário
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Limpa mensagens de erro anteriores quando o usuário começa a digitar novamente
    if (errors) {
      setError("");
    }
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    // Verifica se todos os campos estão preenchidos
    if (!formData.email || !formData.password) {
      setError("Todos os campos são obrigatórios");
      return;
    }
    // Limpa mensagens de erro anteriores
    setError("");
    // Dispara a ação de login utilizando o hook useDispatch
    /*     dispatch(login(formData));
     */
  };

  // useEffect é um hook do React que executa efeitos colaterais em componentes funcionais
  // Aqui, é usado para resetar o estado de autenticação quando há uma mudança no estado de 'errors'
  useEffect(() => {
    dispatch(reset());
  }, [errors, dispatch]);

  // Redireciona para a página principal se o usuário estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div>
      <h2>ReactGram</h2>
      <p className="subtitle">Faça login para ver as fotos dos seus amigos</p>
      <form onSubmit={handleSubmit}>
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
        {!loading ? (
          <input type="submit" value="Entrar" />
        ) : (
          <input type="submit" value="Aguarde..." disabled />
        )}
        {error && <p style={{ color: "red" }}>{error.msg}</p>}
      </form>
      <p>
        Não possui conta? <Link to="/register">Clique aqui</Link>
      </p>
    </div>
  );
}

export default Login;
