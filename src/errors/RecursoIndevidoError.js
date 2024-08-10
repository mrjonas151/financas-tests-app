module.exports = function RecursoIndevidoError(message) {
    this.name = 'RecursoIndevidoError';
    this.message = message || 'Este recurso não pertence ao usuário';
    this.stack = (new Error()).stack;
};