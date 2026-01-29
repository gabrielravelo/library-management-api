
export default () => ({
    environment: process.env.ENV || 'dev',
    port: parseInt(process.env.PORT!, 10) || 7000,
    database: {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT!, 10) || 5432,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        name: process.env.DB_NAME
    },
    jwt: {
        key: process.env.JWT_KEY,
        expiresIn: process.env.JWT_EXPIRES_IN
    }
});

