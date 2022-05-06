
export interface SandMailData {
    subject: string;
    body: string;
}


export interface MailAdapter{
    sendMail: (data: SandMailData) => Promise<void>
}