import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Adicionado useHistory para redirecionamento
import { register, reset } from "../slices/authSlice"; // Importa as ações 'register' e 'reset' do slice de autenticação
import { useSelector, useDispatch } from "react-redux"; // Importa os hooks 'useSelector' e 'useDispatch' do Redux

function Register() {
  // Estado local para gerenciar os dados do formulário
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // useDispatch é um hook do Redux usado para disparar ações definidas no slice
  // Ele retorna uma referência para a função 'dispatch' do Redux store.
  const dispatch = useDispatch();

  // useSelector é um hook do Redux que permite acessar o estado global da aplicação
  // Aqui, ele está sendo usado para acessar a parte do estado que lida com autenticação (definido em authSlice)
  // 'loading' e 'error' são propriedades do estado que indicam se uma operação está em andamento e se ocorreu um erro, respectivamente.
  const { loading, error } = useSelector((state) => state.auth);

  // Estado local para manejar mensagens de erro
  const [errors, setError] = useState("");

  // useAuth é um hook personalizado para verificar a autenticação do usuário

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
    if (!formData.name || !formData.email || !formData.password) {
      setError("Todos os campos são obrigatórios");
      return;
    }
    // Limpa mensagens de erro anteriores
    setError("");
    // Dispara a ação de registro utilizando o hook useDispatch
    dispatch(register(formData));
  };

  // useEffect é um hook do React que executa efeitos colaterais em componentes funcionais
  // Aqui, é usado para resetar o estado de autenticação quando há uma mudança no estado de 'errors'
  // Especificamente, ele dispara a ação 'reset' quando o componente é montado ou o valor de 'errors' muda
  useEffect(() => {
    dispatch(reset());
  }, [errors, dispatch]);

  // Redireciona para a página principal se o usuário estiver autenticado

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
        {!loading ? (
          <input type="submit" value="Cadastrar" />
        ) : (
          <input type="submit" value="Aguarde..." disabled />
        )}
        {error && <p style={{ color: "red" }}>{error.msg}</p>}
      </form>
      <p>
        Já possui conta? <Link to="/login">Clique aqui</Link>
      </p>
    </div>
  );
}

export default Register;
