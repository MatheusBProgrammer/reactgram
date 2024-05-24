// Importa as funções api e requestConfig do módulo de configuração
import { api, requestConfig } from "../utils/config";

// Define a função assíncrona profile, que recebe os dados (data) e o token como parâmetros
const profile = async (data, token) => {
  // Chama a função requestConfig para criar a configuração da requisição
  const config = requestConfig("GET", data, token);

  try {
    // Tenta fazer uma requisição fetch para a URL do perfil do usuário com a configuração definida
    const res = await fetch(api + "users/profile", config)
      .then((res) => res.json()) // Converte a resposta para JSON
      .catch((e) => e); // Caso ocorra um erro na conversão, captura o erro e o retorna
    return res; // Retorna a resposta (ou erro capturado) da requisição
  } catch (error) {
    // Se ocorrer um erro na execução da requisição fetch, captura o erro e o imprime no console
    console.log(error);
  }
};

// Define um objeto userService que contém a função profile
const userService = {
  profile,
};

// Exporta o objeto userService como padrão do módulo
export default userService;
