
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

class InvalidUserPermissions extends Error {
  constructor(message) {
    super(message)
    this.name = 'InvalidUserPermissions'
  }
}

module.exports = {ValidationError, InvalidTokenError, InvalidUsernameOrPassword, InvalidUserPermissions }