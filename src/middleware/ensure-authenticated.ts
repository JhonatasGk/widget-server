import { Response, Request, NextFunction} from 'express';
import { verify } from 'jsonwebtoken';
import 'dotenv/config'
import { prisma } from '../prisma';

interface IPayload{
    sub:string;
}

export function ensureAuthenticated (req: Request, res: Response, next: NextFunction){
    const authToken = req.headers.authorization;


    if(!authToken){
            req.body.user_id = "e84606c2-b161-4786-a1c8-d9182c4c6f7e"
             
             
        return next()
    }
    const [,token] = authToken.split(" ")

    try{
        const {sub} = verify(token, 'a66c9a1ab1fa7145765bd23f47733f654362a8b3') as IPayload

        req.body.user_id = sub
        
        return next()

    }catch(err){
        return res.status(401).json({
            error: 'tokenexpired'
        })
    }
}