module.exports = (app) => {
    const getSaldo = (userId) => {
        return app.db('transactions as t')
            .where({ user_id: userId })
            .sum('ammount')
            .join('accounts as a', 'a.id', 't.acc_id')
            .where({ 'a.user_id': userId })
            .where('t.date', '<=',new Date())
            .select('a.id')
            .groupBy('a.id')
            .orderBy('a.id');
    };

    return { getSaldo };
}