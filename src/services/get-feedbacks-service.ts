
import { prisma } from './../prisma';


export class GetFeedbacksService {
    async execute(user_id: string){
        

        const  feedbacks = await prisma.feedback.findMany({ 
            where:{
                user_id: user_id
            },
            orderBy: {
                created_at: 'desc'

            },
            include: {
                user: true,
            }
        })
        return feedbacks
    }
}