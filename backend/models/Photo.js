const { Schema, model } = require("mongoose");

const photoSchema = new Schema(
  {
    image: String,
    title: String,
    likes: Array,
    comments: Array,
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // Referenciar o modelo de usuário
      required: true, // Tornar o campo obrigatório
    },
    userName: String,
  },
  {
    timestamps: true,
  }
);

module.exports = model("Photo", photoSchema);
