const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../config/logger');

const transport = nodemailer.createTransport(config.email.smtp);

if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text) => {
  const msg = { from: config.email.from, to, subject, text };
  await transport.sendMail(msg);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, token) => {
  const subject = 'Passwort zurücksetzen';
  const resetPasswordUrl = `https://witorbit-stage.netlify.app/reset-password?token=${token}`;
  const text = `Liebe/r Nutzer/in,

  Wir haben eine Anfrage erhalten, Ihr Passwort zurückzusetzen. Falls Sie diese Anfrage nicht gestellt haben, können Sie diese E-Mail ignorieren. Der unten stehende Link zum Zurücksetzen des Passworts wird in 10 Minuten ablaufen.
  
  Um Ihr Passwort zurückzusetzen, klicken Sie einfach auf folgenden Link:
  ${resetPasswordUrl}
  
  Vielen Dank, dass Sie unsere Dienste nutzen.
  
  Freundliche Grüße,
  support@redspace.com`;
  await sendEmail(to, subject, text);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmail = async (to, token) => {
  const subject = 'E-Mail Verifikation';
  const verificationEmailUrl = `https://witorbit-stage.netlify.app/verify-email?token=${token}`;

  const text = `
    Lieber Nutzer,

    Vielen Dank, dass Sie sich für unseren Service angemeldet haben. Um den Registrierungsprozess abzuschließen, verifizieren Sie bitte Ihre E-Mail-Adresse, indem Sie auf den unten stehenden Link klicken:

    ${verificationEmailUrl}

    Wenn Sie diese Registrierung nicht gestartet haben oder glauben, dass es sich um einen Fehler handelt, beachten Sie diese E-Mail bitte nicht.

    Bitte beachten Sie, dass der Verifikationslink nur 10 Minuten lang gültig ist.

    Mit freundlichen Grüßen,
    support@redspace.com
  `;
  await sendEmail(to, subject, text);
};

/**
 * Send Greeting email to CompanyOwner
 * @param {string} to
 * @returns {Promise}
 */
const sendAdminGreetingEmail = async (to) => {
  const subject = 'Willkommen auf unserer Plattform!';
  const platformUrl = 'https://witorbit-stage.netlify.app';
  const text = `Liebe/-r Administrator/-in,

    Herzlichen Dank, dass Sie unserer Plattform beigetreten sind! Wir freuen uns sehr, Sie als Teil unserer Gemeinschaft willkommen zu heißen.
    
    Ihr Konto wurde auf eine Administrator-Rolle hochgestuft, was Ihnen zusätzliche Privilegien und Verantwortlichkeiten verleiht. Als Administrator spielen Sie eine wichtige Rolle bei der Gestaltung und Verwaltung des Erfolgs unserer Plattform.
    
    Bitte stellen Sie sicher, dass Sie Ihre Anmeldeinformationen sicher und vertraulich aufbewahren. Um auf Ihr Administrator-Dashboard zuzugreifen und Ihre neuen Möglichkeiten zu erkunden, besuchen Sie bitte: ${platformUrl}
    
    Wenn Sie Fragen, Bedenken oder Vorschläge haben, zögern Sie nicht, sich an unser Support-Team zu wenden.
    
    Nochmals herzlich willkommen und vielen Dank, dass Sie Teil unserer Reise zur Exzellenz sind!
    
    Beste Grüße,
    support@redspace.com
  `;
  await sendEmail(to, subject, text);
};

/**
 * Send Greeting email to CompanyOwner
 * @param {string} to
 * @returns {Promise}
 */
const sendCompanyOwnerGreetingEmail = async (to) => {
  const subject = 'Herzlich willkommen auf unserer Plattform!';
  const emailUrl = `https://witorbit-stage.netlify.app`;
  const text = `Liebe/r Unternehmensinhaber/in,

  Wir heißen Sie herzlich willkommen auf unserer Plattform! Wir freuen uns sehr, Sie an Bord zu haben.
  
  Ab sofort haben Sie Zugriff auf unsere Plattform, auf der Sie sich einloggen und unsere Dienstleistungen nutzen können. Folgen Sie einfach diesem Link: ${emailUrl}
  
  Sollten Sie Fragen haben oder Unterstützung benötigen, zögern Sie nicht, uns zu kontaktieren. Wir sind hier, um zu helfen.
  
  Nochmals herzlich willkommen und vielen Dank, dass Sie sich für unsere Plattform entschieden haben!
  
  Mit freundlichen Grüßen,
  support@redspace.com`;
  await sendEmail(to, subject, text);
};

/**
 * Send Greeting email to BookKeeper
 * @param {string} to
 * @returns {Promise}
 */
const sendBookKeeperGreetingEmail = async (to) => {
  const subject = 'Herzlich willkommen auf unserer Plattform!';
  const text = `Liebe Buchhalterin, lieber Buchhalter,

  Wir heißen Sie herzlich willkommen auf unserer Plattform! Ihre Entscheidung, Teil unserer Gemeinschaft zu werden, erfreut uns sehr.
  
  Bitte beachten Sie, dass Ihr Profil derzeit einem Überprüfungsprozess unterzogen wird. Unser Team wird sich in Kürze bei Ihnen melden, um Sie über den Status Ihres Profils zu informieren.
  
  Sollten Sie Fragen haben oder Unterstützung benötigen, zögern Sie bitte nicht, uns zu kontaktieren. Wir stehen Ihnen zur Seite.
  
  Nochmals herzlich willkommen!
  
  Beste Grüße,
  support@redspace.com`;
  await sendEmail(to, subject, text);
};

/**
 * Send Greeting email to Worker
 * @param {string} to
 * @returns {Promise}
 */
const sendWorkerGreetingEmail = async (to) => {
  const subject = 'Willkommen auf unserer Plattform!';
  const emailUrl = `https://witorbit-stage.netlify.app`;
  const text = `Lieber Mitarbeiter,

  Vielen Dank, dass Sie sich unserer Plattform angeschlossen haben! Wir freuen uns, Sie an Bord zu haben.
  Sie können sich in die Plattform einloggen und mit der Erfassung Ihrer Zeit beginnen. Klicken Sie auf den folgenden Link: ${emailUrl}
  
  Wenn Sie Fragen haben oder Unterstützung benötigen, zögern Sie nicht, sich an uns zu wenden.
  Herzlich willkommen an Bord!
  
  Beste Grüße,
  support@redspace.com`;
  await sendEmail(to, subject, text);
};

/**
 * Send Hire Request email
 * @param {string} to
 * @param {string} companyName
 * @param {string} companyEmail
 * @returns {Promise}
 */
const sendHireRequestEmail = async (to, companyName, companyEmail) => {
  const subject = 'Einstellungsanfrage';
  const emailUrl = `https://witorbit-stage.netlify.app/home/hire-request`;
  const text = `Sehr geehrter Buchhalter,
    
    Wir möchten Sie darüber informieren, dass "${companyName}" daran interessiert ist, Ihre Dienste in Anspruch zu nehmen. Sie haben eine Einstellungsanfrage an Sie gesendet.
    
    Wenn Sie daran interessiert sind, mit diesem Unternehmen zusammenzuarbeiten, nehmen Sie sich bitte die Zeit, die Anfrage zu überprüfen und die Gelegenheit in Betracht zu ziehen. Sie können die Details der Anfrage anzeigen, indem Sie den folgenden Link besuchen:
    ${emailUrl}
    
    Wir schätzen Ihre prompte Aufmerksamkeit in dieser Angelegenheit. Wenn Sie Fragen haben oder weitere Informationen benötigen, kontaktieren Sie uns bitte unter ${companyEmail}.
    
    Mit freundlichen Grüßen,
    Von ${companyEmail}`;

  await sendEmail(to, subject, text);
};

/**
 * Send Confirmation email
 * @param {string} to
 * @param {string} bookKeeperEmail
 * @param {string} companyName
 * @returns {Promise}
 */
const sendConfirmationEmail = async (to, bookKeeperEmail, companyName) => {
  const subject = 'Bestätigungsanfrage';
  const text = `Sehr geehrter Unternehmensinhaber,

  Wir schreiben Ihnen, um Sie darüber zu informieren, dass der Buchhalter mit der E-Mail-Adresse "${bookKeeperEmail}" Ihre Einstellungsanfrage für das Unternehmen "${companyName}" akzeptiert hat. Wir freuen uns, diese Vereinbarung zu bestätigen.
  
  Sollten Sie Fragen haben oder weitere Unterstützung benötigen, zögern Sie bitte nicht, uns zu kontaktieren. Wir stehen Ihnen zur Verfügung.
  
  Beste Grüße,
  Von ${bookKeeperEmail}`;
  await sendEmail(to, subject, text);
};

/**
 * Send Rejection email
 * @param {string} to
 * @param {string} bookKeeperEmail
 * @param {string} companyName
 * @returns {Promise}
 */
const sendRejectionEmail = async (to, bookKeeperEmail, companyName) => {
  const subject = 'E-Mail zur Ablehnung der Einstellungsanfrage';
  const text = `Sehr geehrter Unternehmensinhaber,

  Es tut uns leid Ihnen mitteilen zu müssen, dass der Buchhalter "${bookKeeperEmail}" Ihre Einstellungsanfrage für das Unternehmen "${companyName}" abgelehnt hat.

  Wenn Sie Fragen haben oder weitere Unterstützung benötigen, stehen wir Ihnen gerne zur Verfügung.

  Beste Grüße,
  Von ${bookKeeperEmail}`;
  await sendEmail(to, subject, text);
};

/**
 * Send Resign email
 * @param {string} to
 * @param {string} bookKeeperEmail
 * @param {string} companyName
 * @returns {Promise}
 */
const sendResignationEmail = async (to, bookKeeperEmail, companyName) => {
  const subject = 'Rücktritts-E-Mail';
  const text = `Sehr geehrter Unternehmensinhaber,

  Wir möchten Sie darüber informieren, dass der Buchhalter "${bookKeeperEmail}" von Ihrem Unternehmen "${companyName}" zurückgetreten ist. Wenn Sie Fragen haben oder Unterstützung benötigen, zögern Sie bitte nicht, uns zu kontaktieren.

  Mit freundlichen Grüßen,
  Von ${bookKeeperEmail}`;
  await sendEmail(to, subject, text);
};

/**
 * Send Hire Request email
 * @param {string} to
 * @param {string} companyName
 * @param {string} companyEmail
 * @returns {Promise}
 */
const sendTerminationEmail = async (to, companyName, companyEmail) => {
  const subject = 'Kündigung';
  const text = `Sehr geehrte/r Buchhalter/in,

  Es tut uns leid, Ihnen mitteilen zu müssen, dass Ihre Zusammenarbeit mit "${companyName}" aufgrund eines Verstoßes gegen unsere Nutzungsbedingungen beendet wurde. Als Folge wurden Ihre Zugriffsrechte entzogen.

  Wenn Sie Klarstellungen oder Unterstützung benötigen, zögern Sie bitte nicht, uns zu kontaktieren.

  Mit freundlichen Grüßen,
  Von ${companyEmail}`;
  await sendEmail(to, subject, text);
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendAdminGreetingEmail,
  sendCompanyOwnerGreetingEmail,
  sendBookKeeperGreetingEmail,
  sendWorkerGreetingEmail,
  sendHireRequestEmail,
  sendTerminationEmail,
  sendConfirmationEmail,
  sendRejectionEmail,
  sendResignationEmail,
};
