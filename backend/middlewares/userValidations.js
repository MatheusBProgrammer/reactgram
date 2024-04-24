const { body } = require("express-validator");

const userCreateValidation = () => {
  return [
    body("name")
      .notEmpty()
      .withMessage("O nome é obrigatório")
      .isString()
      .withMessage("O nome deve ser uma string")
      .isLength({ min: 3 })
      .withMessage("O nome precisa ter no mínimo 3 caracteres"),
    body("email")
      .notEmpty()
      .withMessage("O email é obrigatório")
      .isEmail()
      .withMessage("O email deve ser válido"),
    body("password")
      .notEmpty()
      .withMessage("A senha é obrigatória")
      .isString()
      .withMessage("A senha deve ser uma string")
      // Adicionando validação personalizada para a senha
      .custom((value, { req }) => {
        // Verifica se a senha contém pelo menos um caractere maiúsculo, um minúsculo e um número
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          throw new Error(
            "A senha deve conter pelo menos um caractere maiúsculo, um minúsculo e um número"
          );
        }
        // Retorna true se a senha atender aos critérios
        return true;
      }),
  ];
};

module.exports = {
  userCreateValidation,
};
