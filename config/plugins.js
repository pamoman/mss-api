// Email Plugin

module.exports = ({ env }) => ({
    email: {
        provider: 'nodemailer',
        providerOptions: {
            host: env('SMTP_HOST'),
            port: env('SMTP_PORT'),
            secure: true,
            auth: {
                type: "OAuth2",
                user: env('EMAIL_USER'),
                serviceClient: env('EMAIL_CLIENT_ID'),
                privateKey: env('EMAIL_PRIVATE_KEY')
            }
        },
        settings: {
            defaultFrom: env('EMAIL_USER'),
            defaultReplyTo: env('EMAIL_USER'),
        }
    }
});