// Importa a função configureStore do Redux Toolkit. Esta função facilita a criação da store.
import { configureStore } from "@reduxjs/toolkit";

// Importa o authReducer do arquivo authSlice. Este reducer irá gerenciar o estado de autenticação.
import authReducer from "./slices/authSlice";

// Cria a store do Redux usando configureStore e exporta-a para que possa ser usada em toda a aplicação.
export const store = configureStore({
  // Define os reducers que irão gerenciar diferentes partes do estado da aplicação.
  reducer: {
    // Associa o authReducer à chave 'auth' no estado global.
    auth: authReducer,
  },
});

// Agora, a store está configurada para usar o authReducer para gerenciar o estado de autenticação.
// Podemos usar esta store em toda a aplicação React para acessar e modificar o estado.
