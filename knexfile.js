module.exports = {
    test: {
        client: 'pg',
        connection: {
            host: 'localhost',
            user: 'postgres',
            password: 'password',
            database: 'financas'
        },
        migrations: {
            directory: 'src/migrations',
        },
    },
};