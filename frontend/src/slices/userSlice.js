// Importando as funções necessárias do Redux Toolkit
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// Importando o serviço de usuário que contém a função de perfil
import userService from "../services/userService";

// Estado inicial do slice de usuário
const initialState = {
  user: {}, // Objeto para armazenar os dados do usuário
  error: false, // Flag para indicar se houve um erro
  success: false, // Flag para indicar se a operação foi bem-sucedida
  loading: false, // Flag para indicar se uma operação está em andamento
  message: null, // Mensagem de feedback para o usuário
};

// Função assíncrona para buscar o perfil do usuário
// createAsyncThunk cria uma função que despacha ações automaticamente antes e depois de uma operação assíncrona
export const profile = createAsyncThunk(
  "user/profile", // Tipo da ação gerada por esse thunk
  async (user, thunkApi) => {
    // thunkApi oferece métodos para acessar o estado global e despachar outras ações
    const token = thunkApi.getState().auth.user.token; // Obtendo o token do usuário do estado global

    // Chamando a função de perfil do serviço de usuário, passando os dados do usuário e o token
    const data = await userService.profile(user, token);
    return data; // Retornando os dados obtidos
  }
);
export const updateProfile = createAsyncThunk(
  "user/updateprofile",
  async (user, thunkApi) => {
    const token = thunkApi.getState().auth.user.token;

    const data = await userService.updateProfile(user, token);
    if (data.errors) {
      return thunkApi.rejectWithValue(data.errors[0]);
    }
    return data;
  }
);
export const getUserDetails = createAsyncThunk(
  "user/getuserdetails",
  async (id, thunkApi) => {
    const data = await userService.updateProfile(id);
    if (data.errors) {
      return thunkApi.rejectWithValue(data.errors[0]);
    }
  }
);

// Criando o slice de usuário
export const userSlice = createSlice({
  name: "user", // Nome do slice
  initialState, // Estado inicial do slice
  reducers: {
    // Definindo um redutor para resetar a mensagem de feedback
    resetMessage: (state) => {
      state.message = null; // Resetando a mensagem para null
    },
  },
  // Definindo redutores adicionais que respondem a ações externas, como os thunks
  extraReducers: (builder) => {
    builder
      // Caso a ação de perfil esteja pendente (aguardando resposta)
      .addCase(profile.pending, (state) => {
        state.loading = true; // Indicando que a operação está em andamento
        state.error = false; // Resetando a flag de erro
      })
      // Caso a ação de perfil tenha sido concluída com sucesso
      .addCase(profile.fulfilled, (state, action) => {
        state.loading = false; // Indicando que a operação foi concluída
        state.success = true; // Indicando que a operação foi bem-sucedida
        state.error = null; // Resetando a flag de erro
        state.user = action.payload; // Armazenando os dados do usuário obtidos
      })
      // Caso a ação de perfil tenha falhado (opcional, se quiser lidar com erros)
      .addCase(profile.rejected, (state, action) => {
        state.loading = false; // Indicando que a operação foi concluída
        state.error = true; // Indicando que houve um erro
        state.message = action.error.message; // Armazenando a mensagem de erro
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.user = action.payload;
        state.message = "Usuário atualizado com sucesso";
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
      })
      .addCase(getUserDetails.pending, (state) => {
        state.loading = true; // Indicando que a operação está em andamento
        state.error = false; // Resetando a flag de erro
      })
      // Caso a ação de perfil tenha sido concluída com sucesso
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.loading = false; // Indicando que a operação foi concluída
        state.success = true; // Indicando que a operação foi bem-sucedida
        state.error = null; // Resetando a flag de erro
        state.user = action.payload; // Armazenando os dados do usuário obtidos
      });
  },
});

// Exportando a ação resetMessage para que possa ser usada em componentes
export const { resetMessage } = userSlice.actions;
// Exportando o redutor do slice para ser incluído no store
export default userSlice.reducer;
