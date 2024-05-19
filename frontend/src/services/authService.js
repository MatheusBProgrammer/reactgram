// Importa as configurações e a URL base da API
import { api, requestConfig } from "../utils/config";

/**
 * Registra um usuário na aplicação.
 *
 * @param {Object} data - Os dados do usuário a serem registrados.
 * @param {string} data.username - O nome de usuário.
 * @param {string} data.email - O e-mail do usuário.
 * @param {string} data.password - A senha do usuário.
 * @returns {void}
 */
const register = async (data) => {
  // Cria uma configuração para a requisição HTTP com método POST e os dados do usuário
  const config = requestConfig("POST", data);

  try {
    // Faz a requisição à API para registrar o usuário, concatenando a URL base com o endpoint de registro
    // Utiliza a configuração criada anteriormente
    const res = await fetch(api + "/users/register", config)
      // Converte a resposta para JSON
      .then((res) => res.json())
      // Captura erros na conversão para JSON e exibe um alerta com a mensagem de erro
      .catch((e) => alert(e));

    // Se a resposta existir (não for nula ou indefinida)
    if (res) {
      // Armazena os dados do usuário no localStorage do navegador como uma string JSON
      localStorage.setItem("user", JSON.stringify(res));
    }
  } catch (error) {
    // Captura quaisquer erros na execução da função e exibe um alerta com a mensagem de erro
    alert(error);
  }
};
const authService = {
  register,
};
export default authService;
