import NodeMailer from 'nodemailer';

export default class IssueReport {
  /* destination credentials */
  static user = 'minesweeper.solver.unl@gmail.com';
  static pass = '?dW5s$C+WGW5^?$9';
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
