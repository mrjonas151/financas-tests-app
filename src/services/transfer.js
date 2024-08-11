const ValidationError = require('../errors/ValidationError');

module.exports = (app) => {
    const find = (filter = {}) => {
        return app.db('transfers')
            .where(filter)
            .select();
    };

    const findOne = (filter = {}) => {
        return app.db('transfers')
            .where(filter)
            .first();
    };

    const validate = async (transfer) => {
        if (!transfer.description) throw new ValidationError('Descrição é um atributo obrigatório');
        if (!transfer.ammount) throw new ValidationError('Valor é um atributo obrigatório');
        if (!transfer.date) throw new ValidationError('Data é um atributo obrigatório');
        if (!transfer.acc_ori_id) throw new ValidationError('Conta de origem é um atributo obrigatório');
        if (!transfer.acc_dest_id) throw new ValidationError('Conta de destino é um atributo obrigatório');
        if (transfer.acc_ori_id === transfer.acc_dest_id) throw new ValidationError('Conta de origem e destino não podem ser a mesma');

        const accounts = await app.db('accounts').whereIn('id', [transfer.acc_ori_id, transfer.acc_dest_id]);
        accounts.forEach(account => {
            if (account.user_id !== parseInt(transfer.user_id, 10)) throw new ValidationError(`Conta #${account.id} não pertence ao usuário`);
        });
    }

    const save = async (transfer) => {
        await validate(transfer);

        const result =  await app.db('transfers').insert(transfer, '*');
        const transferId = transfer[0].id;
        const transactions = [
            { description: `Transfer to acc #${transfer.acc_dest_id}`, date: transfer.date, ammount: transfer.ammount * -1, type: 'O', acc_id: transfer.acc_ori_id },
            { description: `Transfer from acc #${transfer.acc_ori_id}`, date: transfer.date, ammount: transfer.ammount, type: 'I', acc_id: transfer.acc_dest_id }
        ];

        await app.db('transactions').insert(transactions.map(t => ({ ...t, transfer_id: transferId })));
        return result;
    };

    const update = async (id, transfer) => {
        await validate(transfer);

        if (transfer.id) throw new ValidationError('Não é permitido alteração de ID');
        const result =  app.db('transfers')
            .where({ id })
            .update(transfer, '*');

        const transactions = [
            { description: `Transfer to acc #${transfer.acc_dest_id}`, date: transfer.date, ammount: transfer.ammount * -1, type: 'O', acc_id: id },
            { description: `Transfer from acc #${transfer.acc_ori_id}`, date: transfer.date, ammount: transfer.ammount, type: 'I', acc_id: id }
        ];

        await app.db('transactions').where({ transfer_id: id }).del();
        await app.db('transactions').insert(transactions.map(t => ({ ...t, transfer_id: id })));
        return result;
    }

    return { find, save, findOne, update, validate };
}