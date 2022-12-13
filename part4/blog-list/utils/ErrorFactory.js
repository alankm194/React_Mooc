
class ValidationError extends Error {
    constructor(message) {
      super(message)
      this.name = 'ValidationError';
    }
  }

class InvalidTokenError extends Error {
  constructor(message) {
    super(message)
    this.name = 'InvalidTokenError'
  }
}

class InvalidUsernameOrPassword extends Error {
  constructor(message) {
    super(message)
    this.name = 'InvalidUsernameOrPassword'
  }
}

module.exports = {ValidationError, InvalidTokenError, InvalidUsernameOrPassword }