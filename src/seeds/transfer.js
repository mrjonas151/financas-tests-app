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
      { id: 9998, name: 'User #1', mail: 'user1@mail.com', passwd: '$2a$10$EgSoymvPMXSw7dkQQuTODORJi4.NsYvrWd7HrYN8T8tIFdAAi0ukC' },
      { id: 9999, name: 'User #2', mail: 'user2@mail.com', passwd: '$2a$10$EgSoymvPMXSw7dkQQuTODORJi4.NsYvrWd7HrYN8T8tIFdAAi0ukC' }
    ])).then(() => knex('accounts').insert([
      { id: 9998, name: 'AccO #1', user_id: 9998 },
      { id: 9999, name: 'AccD #1', user_id: 9998 },
      { id: 9997, name: 'AccO #2', user_id: 9999 },
      { id: 9996, name: 'AccD #2', user_id: 9999 }
    ])).then(() => knex('transfers').insert([
      { id: 9998, description: 'Transfer #1', user_id: 9998, acc_ori_id: 9998, acc_dest_id: 9999, amount: 100, date: new Date() },
      { id: 9999, description: 'Transfer #2', user_id: 9999, acc_ori_id: 9997, acc_dest_id: 9996, amount: 100, date: new Date() }
    ])).then(() => knex('transactions').insert([
      { description: 'Transfer From AccO #1', date: new Date(), ammount: 100, type: 'I', acc_id: 9999, transfer_id: 9998 },
      { description: 'Transfer to AccD #1', date: new Date(), ammount: -100, type: 'O', acc_id: 9998, transfer_id: 9998 },
      { description: 'Transfer From AccO #2', date: new Date(), ammount: 100, type: 'I', acc_id: 9996, transfer_id: 9999 },
      { description: 'Transfer to AccD #2', date: new Date(), ammount: -100, type: 'O', acc_id: 9997, transfer_id: 9999 }
    ]));
};
