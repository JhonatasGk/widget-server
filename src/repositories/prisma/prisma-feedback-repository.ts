import { prisma } from "../../prisma";
import { FeedbackCreateData, FeedbackRepository } from "../feedback-repository";



export class PrismaFeedbackRepository implements FeedbackRepository {
    
    async create({ type, comment, screenshot, created_at, user_id}: FeedbackCreateData) {
        await prisma.feedback.create({
            data: {
                type,
                comment,
                screenshot,
                created_at,
                user_id,
            
            },
            include:{
                user: true,
            }

        })
    }
}