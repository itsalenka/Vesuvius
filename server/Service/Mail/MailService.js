const { google } = require('googleapis');
const MailComposer = require('nodemailer/lib/mail-composer');
const credentials = require('./credentials.json');
const tokens = require('./token.json');
class MailService{

    getGmailService = () => {
        const { client_secret, client_id, redirect_uris } = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
        oAuth2Client.setCredentials(tokens);
        const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
        return gmail;
    };

    encodeMessage = (message) => {
        return Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    };

    createMail = async (options) => {
        const mailComposer = new MailComposer(options);
        const message = await mailComposer.compile().build();
        return this.encodeMessage(message);
    };

    sendMail = async (options) => {
        const gmail = this.getGmailService();
        const rawMessage = await this.createMail(options);
        const { data: { id } = {} } = await gmail.users.messages.send({
            userId: 'me',
            resource: {
                raw: rawMessage,
            },
        });
        return id;
    };

    async sendActivationMail(emailTo, link) {
        const options = {
            to: emailTo,
            subject: 'Activation on Vesuvius',
            html: `<div>
                    <h1>To activate, follow the link</h1>
                    <a href="${link}">${link}</a>
                </div>`,
            textEncoding: 'base64',
        };
        const messageId = await this.sendMail(options);
    }

    async sendInformationMail(emailTo, company, driver, user, id){
        const options = {
            from: 'Vesuvius',
            to: emailTo,
            subject: `Request № ${id} accepted`,
            text: '',
            html:
                `<div>
                    <h1>Information about carrier:</h1>
                    <h4>Comapany name: ${company.name}</h4>
                    <h4>Director: ${company.director}</h4>
                    <h4>Email: ${user.email}</h4>
                    <h4>Phone number: ${user.phoneNumber}</h4>
                    <h4>Bank information: ${company.bankInfo}</h4>
                    <h4>Address: ${company.address}</h4>
                    <h1>Information about driver:</h1>
                    <h4>Name: ${driver.name}</h4>
                    <h4>Phone number: ${driver.phoneNumber}</h4>
                    <h4>Email: ${driver.email}</h4>
                </div>`,
            textEncoding: 'base64',
        };

        const messageId = await this.sendMail(options);
    }
}

module.exports = new MailService()