import { MailAdapter } from "../adapters/mail-adapter";
import { prisma } from "../prisma";
import { FeedbackRepository } from "../repositories/feedback-repository";
import {img64} from '../assets/img'

type User ={
    name: string,
    id: string,
    login: string,
    avatar_url: string,

}


export interface SubmitFeedbackUseCaseRequest{
    type: string,
    comment: string,
    screenshot?: string,
    created_at: Date,
    user_id:string
    user:User | null
}

export class SubmitFeedbackUseCase{
constructor(
    private feedbacksRepository: FeedbackRepository,
    private mailAdapter: MailAdapter,
    
    ){  
    }
    async execute(request: SubmitFeedbackUseCaseRequest){
        const {type, comment, screenshot, created_at, user_id} = request;
        
        
        if(!type){
            throw new Error('Type is required')
        }
        if(!comment){
            throw new Error('Comment is required')
        }
        if (screenshot && !screenshot.startsWith('data:image/png;base64')){
            throw new Error('Invalid screenshot format');
        }

        
        await this.feedbacksRepository.create({
            type,
            comment,
            screenshot,
            created_at,
            user_id,
            
            
        })
        request.user = await prisma.user.findFirst({
            where: {
                id: user_id
            }
        })
        

        

        await this.mailAdapter.sendMail({
            subject: 'Novo feedback',
            body: [
                `<div style="background-color:1b1b1b; padding:20px;">`,
                `<div style="font-family: sans-serif; font-size: 16px">`,
                
                `<div width='100%'style="display: flex; justify-content: center; background: rgb(163,124,255);
                background: linear-gradient(127deg, rgba(163,124,255,1) 0%, rgba(120,68,244,1) 51%, rgba(130,87,230,1) 100%); border-radius:10px; padding:30px; margin:0; flex-direction: column;
                align-items:center">
                <img  width="115" height="115" src="${img64}"/>
                <p style="font-size: 120%; font-weight: bold;text-align: center;color:#FFFFFF;letter-spacing: 1px;">NOVO FEEDBACK</p>
                </div>`,
                
                `<div style="display: flex; flex-direction: row; align-items:center; padding: 20px;">

                <p style="color:#FFFFFF;font-weight: bold; font-size:12px;letter-spacing:2px; margin  10px">FEEDBACK ENVIADO POR : </p>
                
                <a href="https://github.com/${request.user?.login}" style="display:flex;align-items:center;text-decoration:none; color:white; font-size:20px;padding-left:10px;padding-right:10px ;border:2px solid #8257e6;border-radius:4px;margin-left:10px "><p>${request.user?.login}</p> <img width="25" height="25" style="border-radius:30px; margin-left:10px; border:2px solid #8257e6; padding:2px;"  src="${request.user?.avatar_url}"/></a>
                
                
                </div>`,
                `<div style="background-color:#27272A; padding: 20px; color:#FFFF;border-radius: 10px 10px 0px 0px;">`,
                `<p style="font-weight: bold; font-size:12px;letter-spacing:2px; margin: 5px;">TIPO DO FEEDBACK: ${type}</p>`,
                `<p style="font-weight:bold; font-size:12px;letter-spacing:2px; margin: 5px;margin-top:15px;">COMENTARIO: </p>`,
                `<p style="font-size:12px;letter-spacing:2px; margin: 5px; background-color:#1b1b1b;padding: 20px;"> ${comment}</p>`,
                `</div>`,
                `<p style="font-weight:bold; font-size:12px;letter-spacing:2px; margin: 5px;margin-top:15px;">SCREENSHOT: </p>`,
                `<img alt="Screenshot do app" width="100%" src="${screenshot}"/>`,
                `</div>`,
                `</div>`
            ].join('\n')
        })

    }
}