const { Schema, model, objectId } = require("mongoose");

const photoSchema = new Schema(
  {
    image: String,
    title: String,
    likes: Array,
    comments: Array,
    userId: objectId,
    userName: String,
  },
  {
    timestamps: true,
  }
);

module.exports = model("Photo", photoSchema);
