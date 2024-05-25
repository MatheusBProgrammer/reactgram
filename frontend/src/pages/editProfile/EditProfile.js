import "./EditProfile.css"; // Importa o arquivo CSS para estilizar o componente
import { useEffect, useState } from "react"; // Importa hooks do React para efeitos colaterais e gerenciamento de estado
import { useSelector, useDispatch } from "react-redux"; // Importa hooks do Redux para acessar e modificar o estado global
import { profile, resetMessage, updateProfile } from "../../slices/userSlice"; // Importa ações do slice de usuário do Redux
import Message from "../../components/Message"; // Importa o componente Message para exibir mensagens de feedback

function EditProfile() {
  const dispatch = useDispatch(); // Obtém a função dispatch para enviar ações ao Redux
  const { user, message, error, loading } = useSelector((state) => state.user); // Seleciona partes específicas do estado global do Redux

  // Define estados locais para armazenar os valores dos campos do formulário
  const [name, setName] = useState(""); // Estado para armazenar o nome do usuário
  const [email, setEmail] = useState(""); // Estado para armazenar o email do usuário
  const [password, setPassword] = useState(""); // Estado para armazenar a nova senha do usuário
  const [profileImage, setProfileImage] = useState(""); // Estado para armazenar o arquivo de imagem do perfil
  const [bio, setBio] = useState(""); // Estado para armazenar a bio do usuário
  const [previewImage, setPreviewImage] = useState(""); // Estado para armazenar a URL da pré-visualização da imagem do perfil

  // useEffect para carregar o perfil do usuário quando o componente for montado
  useEffect(() => {
    dispatch(profile()); // Despacha a ação para carregar o perfil do usuário
  }, [dispatch]); // A dependência é o dispatch, garantindo que a ação seja despachada apenas uma vez

  // useEffect para atualizar os campos do formulário com os dados do usuário quando o perfil for carregado
  useEffect(() => {
    if (user) {
      setName(user.name); // Atualiza o estado do nome
      setEmail(user.email); // Atualiza o estado do email
      setBio(user.bio); // Atualiza o estado da bio
      setPreviewImage(user.profileImage); // Atualiza a URL de pré-visualização da imagem do perfil
    }
  }, [user]); // A dependência é o objeto user, garantindo que os campos sejam atualizados quando os dados do usuário forem carregados

  // Função para lidar com a mudança de imagem de perfil
  const handleImageChange = (e) => {
    const image = e.target.files[0]; // Obtém o arquivo de imagem selecionado pelo usuário
    setProfileImage(image);
    setPreviewImage(URL.createObjectURL(image));
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = (event) => {
    event.preventDefault(); // Previne o comportamento padrão do formulário de recarregar a página
    // Cria um objeto com os dados do formulário
    const userData = new FormData();
    userData.append("name", name);
    userData.append("email", email);
    userData.append("password", password);
    userData.append("bio", bio);
    if (profileImage) {
      userData.append("profileImage", profileImage);
    }

    // Despacha a ação para atualizar o perfil do usuário com os dados do formulário
    dispatch(updateProfile(userData));
  };

  return (
    <div id="edit-profile-container">
      <h2>Edite seus dados</h2> {/* Título da seção de edição de perfil */}
      <p>Adicione uma imagem de perfil e conte mais sobre você...</p>
      {/* Imagem de pré-vizualização */}
      {previewImage && <img src={previewImage} alt="Preview" />}
      {/* Descrição da seção */}
      {message && <Message type="success" msg={message} />}{" "}
      {/* Exibe mensagem de erro se houver */}
      {error && <Message type="error" msg={error} />}{" "}
      {/* Exibe mensagem de erro se houver */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome"
          onChange={(e) => setName(e.target.value)} // Atualiza o estado do nome quando o usuário digita
          value={name || ""} // Define o valor do campo com o estado atual do nome
        />
        <input
          type="email"
          placeholder="E-mail"
          onChange={(e) => setEmail(e.target.value)} // Atualiza o estado do email quando o usuário digita
          value={email || ""} // Define o valor do campo com o estado atual do email
        />
        <label>
          <span>Imagem do perfil</span> {/* Texto explicativo */}
          <input type="file" onChange={handleImageChange} />
          {/* Define a função handleImageChange para lidar com a seleção de arquivos */}
        </label>
        <label>
          <span>Bio:</span> {/* Texto explicativo */}
          <input
            type="text"
            placeholder="Descrição do perfil"
            onChange={(e) => setBio(e.target.value)} // Atualiza o estado da bio quando o usuário digita
            value={bio || ""} // Define o valor do campo com o estado atual da bio
          />
        </label>
        <label>
          <span>Quer alterar sua senha?</span> {/* Texto explicativo */}
          <input
            type="password"
            placeholder="Digite sua nova senha"
            onChange={(e) => setPassword(e.target.value)} // Atualiza o estado da senha quando o usuário digita
            value={password || ""} // Define o valor do campo com o estado atual da senha
          />
        </label>
        {!loading ? (
          <input type="submit" value="Atualizar" />
        ) : (
          <input type="submit" value="Aguarde..." disabled />
        )}
        {error && <p style={{ color: "red" }}>{error.msg}</p>}{" "}
        {/* Botão de submit, desativado se estiver carregando */}
      </form>
    </div>
  );
}

export default EditProfile; // Exporta o componente EditProfile como padrão
