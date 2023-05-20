const bcrypt = require("bcrypt");

const Model = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Firstname can't be empty",
          },
        },
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Lastname can't be empty",
          },
        },
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Username can't be empty.",
          },
          isUnique: async (value, validateObjRes) => {
            try {
              if (value != "") {
                const user = await User.findAll({
                  where: { username: value },
                });
                if (user.length != 0) {
                  validateObjRes(new Error("username already in use!"));
                }
              }
              validateObjRes();
            } catch (onError) {
              console.log(onError);
            }
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Email can't be empty.",
          },
          isEmail: {
            args: true,
            msg: "Please enter Valid Email",
          },
          isUnique: async (value, validateObjRes) => {
            try {
              if (value != "") {
                const user = await User.findAll({
                  where: { email: value },
                });
                if (user.length != 0) {
                  validateObjRes(
                    new Error(
                      "User with this Email has already been registered!"
                    )
                  );
                }
              }
              validateObjRes();
            } catch (onError) {
              console.log(onError);
            }
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Password can't be empty.",
          },
        },
      },
    },
    {
      hooks: {
        beforeCreate: async function (user) {
          const salt = await bcrypt.genSalt();
          user.password = await bcrypt.hash(user.password, salt);
        },
      },
    }
  );

  User.isAuthorised = async function (mail, pass) {
    if(mail && pass) {
      const requestedUserData = await User.findOne({
        where: { email: mail },
      });
      if (requestedUserData) {
        const validPass = await bcrypt.compare(pass, requestedUserData.password);
        if (validPass) {
          return requestedUserData;
        } else {
          throw Error("Unauthorized");
        }
      } else {
        throw Error("Not registered");
      }
    } else {
      if(mail) {
        throw Error("Password null");
      }
      if(pass) {
        throw Error("Email null");
      }
      throw Error("Log Credential null")
    }
  };
  return User;
};

module.exports = Model;
