import Joi from 'joi';

const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
  email: Joi.string().email().optional()
});

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

const fileSchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  content: Joi.string().allow('').optional()
});

function validateRegister(data) {
  return registerSchema.validate(data);
}

function validateLogin(data) {
  return loginSchema.validate(data);
}

function validateFile(data) {
  return fileSchema.validate(data);
}

export { validateRegister, validateLogin, validateFile };