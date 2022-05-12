import { Request, Response } from "express"
import { GuestUserService } from "../services/guest-user-service"




export class GuestUserController {
    async handler(req: Request, res: Response) {

        const service = new GuestUserService()

        const result = await service.execute()

        return res.json(result)

    }

}