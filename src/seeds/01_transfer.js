/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  return knex('transactions').del()
    .then(() => knex('transfers').del())
    .then(() => knex('accounts').del())
    .then(() => knex('users').del())
    .then(() => knex('users').insert([
      { id: 10000, name: 'User #1', mail: 'user1@mail.com', passwd: '$2a$10$EgSoymvPMXSw7dkQQuTODORJi4.NsYvrWd7HrYN8T8tIFdAAi0ukC' },
      { id: 10001, name: 'User #2', mail: 'user2@mail.com', passwd: '$2a$10$EgSoymvPMXSw7dkQQuTODORJi4.NsYvrWd7HrYN8T8tIFdAAi0ukC' }
    ])).then(() => knex('accounts').insert([
      { id: 10000, name: 'AccO #1', user_id: 10000 },
      { id: 10001, name: 'AccD #1', user_id: 10000 },
      { id: 9997, name: 'AccO #2', user_id: 10001 },
      { id: 9996, name: 'AccD #2', user_id: 10001 }
    ])).then(() => knex('transfers').insert([
      { id: 10000, description: 'Transfer #1', user_id: 10000, acc_ori_id: 10000, acc_dest_id: 10001, amount: 100, date: new Date() },
      { id: 10001, description: 'Transfer #2', user_id: 10001, acc_ori_id: 9997, acc_dest_id: 9996, amount: 100, date: new Date() }
    ])).then(() => knex('transactions').insert([
      { description: 'Transfer From AccO #1', date: new Date(), ammount: 100, type: 'I', acc_id: 10001, transfer_id: 10000 },
      { description: 'Transfer to AccD #1', date: new Date(), ammount: -100, type: 'O', acc_id: 10000, transfer_id: 10000 },
      { description: 'Transfer From AccO #2', date: new Date(), ammount: 100, type: 'I', acc_id: 9996, transfer_id: 10001 },
      { description: 'Transfer to AccD #2', date: new Date(), ammount: -100, type: 'O', acc_id: 9997, transfer_id: 10001 }
    ]));
};
