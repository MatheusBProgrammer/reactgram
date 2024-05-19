// Define a URL base da API
export const api = "http://localhost:5555/api";

// Define a URL base para uploads
export const upload = "http://localhost:5555/uploads";

/**
 * Configura a requisição HTTP para a API.
 *
 * @param {string} method - O método HTTP (GET, POST, PUT, DELETE, etc.).
 * @param {Object} data - Os dados a serem enviados no corpo da requisição (opcional).
 * @param {string} [token=null] - O token de autenticação JWT (opcional).
 * @param {Object} [image=null] - Os dados da imagem a serem enviados (opcional).
 * @returns {Object} - A configuração da requisição.
 */
export const requestConfig = (method, data, token = null, image = null) => {
  let config;

  // Configuração para upload de imagem
  if (image) {
    config = {
      method, // Método HTTP (e.g., POST)
      body: data, // O corpo da requisição contém os dados da imagem
      headers: {}, // Sem cabeçalhos específicos para imagem
    };
  }
  // Configuração para métodos DELETE ou requisições sem dados (e.g., GET)
  else if (method === "DELETE" || data === null) {
    config = {
      method, // Método HTTP (e.g., DELETE ou GET)
      headers: {}, // Cabeçalhos vazios
    };
  }
  // Configuração para requisições com dados JSON (e.g., POST, PUT)
  else {
    config = {
      method, // Método HTTP (e.g., POST, PUT)
      body: JSON.stringify(data), // Converte os dados para uma string JSON
      headers: { "Content-Type": "application/json" }, // Define o cabeçalho Content-Type
    };
  }

  // Se um token de autenticação é fornecido, adiciona o cabeçalho Authorization
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Retorna a configuração completa da requisição
  return config;
};
