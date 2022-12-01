const Validator = require("fastest-validator");
const models = require("../models");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signUp = (req, res) => {
  const user = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    userId: 1,
  };

  const schema = {
    name: {
      type: "string",
      optional: false,
      max: "100",
    },
    email: {
      type: "string",
      optional: false,
      max: "500",
    },
    password: {
      type: "string",
      optional: false,
    },
  };

  const v = new Validator();
  const validationResponse = v.validate(user, schema);

  if (validationResponse !== true) {
    return res.status(400).json({
      message: "validation failed",
      errors: validationResponse,
    });
  }

  models.User.findOne({ where: { email: req.body.email } })
    .then((result) => {
      if (result) {
        res.status(409).json({
          message: "Email Already Exist",
        });
      } else {
        bcryptjs.genSalt(10, (err, salt) => {
          bcryptjs.hash(req.body.password, salt, (err, hash) => {
            const user =  {
              name: req.body.name,
              email: req.body.email,
              password: hash,
              };
            models.User.create(user)
              .then((result) => {
                res.status(201).json({
                  message: "User Created Successfully",
                });
              })
              .catch((error) => {
                res.status(500).json({
                  message: "Something went wrong",
                });
              });
            
          });
        
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Something went wrong",
      });
    });
    
};

const login = (req, res) => {
  models.User.findOne({ where: { email: req.body.email } })
    .then((user) => {
      if (user === null) {
        res.status(401).json({
          message: "Invaild Credentials",
        });
      } else {
        bcryptjs.compare(req.body.password, user.password, (err, result) => {
          if (result) {
            const token = jwt.sign(
              {
                email: user.email,
                userId: user.id,
              },
              "secret",
              (err, token) => {
                res.status(200).json({
                  message: "authentication successfull",
                  token: token,
                });
                console.log(token)
              }
             
            );
           
          } else {
            res.status(401).json({
              message: "Invaild Credentials",
            });
          }
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "something went wrong",
      });
    });
};

module.exports = {
  signUp: signUp,
  login: login,
};
