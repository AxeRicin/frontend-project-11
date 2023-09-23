class ValidationRSSError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationRSSError';
  }
}

export default ValidationRSSError;
