import { Request, Response } from "express"
import { GetFeedbacksService } from "../services/get-feedbacks-service"



export class GetFeedbacksController {
    async handler(req: Request, res: Response) {
        const {user_id} = req.body
        
        
        const service = new GetFeedbacksService()

        const result = await service.execute(user_id)

        return res.json(result)

    }

}