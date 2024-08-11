module.exports = (app) => {
    const find = (filter = {}) => {
        return app.db('transfers')
            .where(filter)
            .select();
    };

    const save = async (transfer) => {
        const result =  await app.db('transfers').insert(transfer, '*');
        const transferId = transfer[0].id;
        const transactions = [
            { description: `Transfer to acc #${transfer.acc_dest_id}`, date: transfer.date, ammount: transfer.ammount * -1, type: 'O', acc_id: transfer.acc_ori_id },
            { description: `Transfer from acc #${transfer.acc_ori_id}`, date: transfer.date, ammount: transfer.ammount, type: 'I', acc_id: transfer.acc_dest_id }
        ];

        await app.db('transactions').insert(transactions.map(t => ({ ...t, transfer_id: transferId })));
        return result;
    }

    return { find, save };
}