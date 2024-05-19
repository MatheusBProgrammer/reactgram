// Importa as funções createSlice e createAsyncThunk do Redux Toolkit.
// createSlice facilita a criação de reducers e ações, enquanto createAsyncThunk lida com ações assíncronas.
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Importa o serviço de autenticação, que contém a lógica para registrar e autenticar usuários.
import authService from "../services/authService";

// Obtém o usuário armazenado no localStorage, se existir.
const user = localStorage.getItem("user");

// Define o estado inicial do slice de autenticação.
const initialState = {
  user: user ? user : null, // Se um usuário estiver no localStorage, inicializa com esse valor, caso contrário, inicializa como null.
  error: false, // Indica se há um erro.
  success: false, // Indica se a ação foi bem-sucedida.
  loading: false, // Indica se uma ação está em andamento.
};

// Ação assíncrona para registrar um usuário. A função createAsyncThunk cria uma função thunk que lida com operações assíncronas.
export const register = createAsyncThunk(
  "auth/register", // Tipo da ação: 'entidade/ação'.
  async (user, thunkAPI) => {
    // Chama a função de registro do serviço de autenticação.
    const data = await authService.register(user);

    // Verifica se houve erros na resposta.
    if (data.errors) {
      // Se houver erros, rejeita a ação com o primeiro erro encontrado.
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    // Retorna os dados recebidos, que serão passados para a ação fulfilled.
    return data;
  }
);

// Cria um slice de autenticação usando createSlice. Um slice combina reducers e ações em uma única unidade.
export const authSlice = createSlice({
  name: "auth", // Nome do slice.
  initialState, // Estado inicial definido anteriormente.
  reducers: {
    // Define reducers sincronos que podem ser chamados diretamente.
    reset: (state) => {
      // Reseta o estado de carregamento, erro e sucesso.
      state.loading = false;
      state.error = false;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    // Adiciona casos adicionais para ações assíncronas criadas com createAsyncThunk.
    builder
      .addCase(register.pending, (state) => {
        // Quando a ação de registro está pendente, define loading como true e error como false.
        state.loading = true;
        state.error = false;
      })
      .addCase(register.fulfilled, (state, action) => {
        // Quando a ação de registro é bem-sucedida, atualiza o estado com os dados do usuário e define sucesso como true.
        state.loading = false;
        state.success = true;
        state.error = null;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        // Quando a ação de registro falha, define loading como false, armazena o erro e define user como null.
        state.loading = false;
        state.error = action.payload; // Corrige para action.payload
        state.user = null;
      });
  },
});

// Exporta a ação reset para que possa ser usada em componentes.
export const { reset } = authSlice.actions;

// Exporta o reducer do slice de autenticação para ser usado na store do Redux.
export default authSlice.reducer;
