import { Request, Response } from "express"
import { ProfileUserService } from "../services/profile-user-service"





export class ProfileUserController {
    async handler(req: Request, res: Response) {
        const {user_id} = req
        
        const service = new ProfileUserService()

        const result = await service.execute(user_id)

        return res.json(result)

    }
}
