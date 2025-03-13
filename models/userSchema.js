const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: false,

    },
    email: {
      type: String,
      required: false,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: false,
      
    },
    phone: {
      type: String,
      required: false,

    },
    role: {
      type: String,
      enum: ["admin", "patient", "medecin", "assistant"],
    },
    user_image: { type: String, require: false, default: "user.png" },
    age: { type: Number },
    count: { type: Number, default: '0' },

    dateNaissance: {
      type: Date,
      required: false,

    },
    speciality: {
      type: String,


    },

    commentaires: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Commentaire' }]

  }, { timestamps: true }
);

userSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt();
    const user = this;
    user.password = await bcrypt.hash(user.password, salt);
    //user.etat = false ;
    user.count = user.count + 1;
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.post("save", async function (req,res , next) {
  try {
    console.log(req.body);
    console.log("new user was created & saved successfully");
    next();
  } catch (error) {
    console.log(JSON.stringify(error, null, 2));
    res.status(400).json({ error: error.message });
  }
});

const user = mongoose.model("user", userSchema);
module.exports = user;