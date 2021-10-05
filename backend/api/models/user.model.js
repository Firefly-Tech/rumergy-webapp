import { DataTypes, Sequelize } from "sequelize/types";
import sequelize from "../../index.js";
import bcrypt from "bcrypt";

function cryptPassword(password) {
  return new Promise(function (resolve, reject) {
    bcrypt.genSalt(10, function (err, salt) {
      // Encrypt password using bycrpt module
      if (err) return reject(err);

      bcrypt.hash(password, salt, null, function (err, hash) {
        if (err) return reject(err);
        return resolve(hash);
      });
    });
  });
}

class User extends Model {}

User.init(
  {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM,
      values: ["admin", "advanced", "inactive"],
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  sequelize
);

User.beforeCreate(function (user, options) {
  return cryptPassword(user.password)
    .then((success) => {
      user.password = success;
    })
    .catch((err) => {
      if (err) console.log(err);
    });
});

User.sync();

export default User;
