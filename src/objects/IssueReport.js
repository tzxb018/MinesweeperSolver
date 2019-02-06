import NodeMailer from 'nodemailer';

export default class IssueReport {
  /* destination credentials */
  static user = 'taylor.demint@gmail.com';
  static pass = 'password';               // password removed for obvious reasons
  static transporter = NodeMailer.createTransport({
    service: 'gmail',
    auth: {
      user: IssueReport.user,
      pass: IssueReport.pass,
    },
  });

  constructor(subject, body, ...attachments) {
    this._message = {
      from: IssueReport.user,
      to: IssueReport.user,
      subject,
      text: body,
      attachments,
    };
  }

  sendReport() {
    IssueReport.transporter.sendMail(this._message, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    });
  }
}
