/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = function(knex) {
  return knex('users').insert([
     { id: 10100, name: 'User #3', mail: 'user3@mail.com', passwd: '$2a$10$EgSoymvPMXSw7dkQQuTODORJi4.NsYvrWd7HrYN8T8tIFdAAi0ukC' },
      { id: 10101, name: 'User #4', mail: 'user4@mail.com', passwd: '$2a$10$EgSoymvPMXSw7dkQQuTODORJi4.NsYvrWd7HrYN8T8tIFdAAi0ukC' }
  ])
    .then(() => knex('accounts').insert([
      { id: 10100, name: 'Acc Saldo Principal', user_id: 10100 },
      { id: 10101, name: 'Acc Saldo Secundário', user_id: 10100 },
      { id: 10102, name: 'Acc Alternativa 1', user_id: 10101 },
      { id: 10103, name: 'Acc Alternativa 2', user_id: 10101 }
    ]));
};
