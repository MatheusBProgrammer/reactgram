import { api, requestConfig } from "../utils/config";

/**
 * Registra um usuário na aplicação.
 *
 * @param {Object} data - Os dados do usuário a serem registrados.
 * @param {string} data.username - O nome de usuário.
 * @param {string} data.email - O e-mail do usuário.
 * @param {string} data.password - A senha do usuário.
 * @returns {Object} - Os dados do usuário registrado ou um erro.
 */
const register = async (data) => {
  const config = requestConfig("POST", data);

  try {
    const res = await fetch(api + "/users/register", config)
      .then((res) => res.json())
      .catch((e) => alert(e));

    if (res) {
      localStorage.setItem("user", JSON.stringify(res));
    }
    return res;
  } catch (error) {
    alert(error);
  }
};

/**
 * Faz login na aplicação.
 *
 * @param {Object} data - Os dados do usuário para login.
 * @param {string} data.email - O e-mail do usuário.
 * @param {string} data.password - A senha do usuário.
 * @returns {Object} - Os dados do usuário autenticado ou um erro.
 */
const login = async (data) => {
  const config = requestConfig("POST", data);

  try {
    const res = await fetch(api + "/users/login", config)
      .then((res) => res.json())
      .catch((e) => alert(e));

    if (res) {
      localStorage.setItem("user", JSON.stringify(res));
    }
    return res;
  } catch (error) {
    alert(error);
  }
};

/**
 * Faz logout da aplicação.
 */
const logout = () => {
  localStorage.removeItem("user");
};

const authService = {
  register,
  login,
  logout,
};

export default authService;
