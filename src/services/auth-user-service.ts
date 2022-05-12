import axios from 'axios';
import 'dotenv/config';
import {prisma} from '../prisma'
import {sign} from 'jsonwebtoken';


interface AsAccessTokenResponse {

    access_token: string;
}
interface AsUserResponse {

    avatar_url: string,
    login: string,
    id: number,
    name: string
}

export class AuthUserService {
    async execute(code: string) {
        const url="https://github.com/login/oauth/access_token";

        const { data: accessTokenResponse }=await axios.post<AsAccessTokenResponse>(url, null, {
            params: {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code
            },  
            headers: {
                "Accept": "application/json"
            }
        })

        const response=await axios.get<AsUserResponse>("https://api.github.com/user", {
            headers: {
                authorization: `Bearer ${accessTokenResponse.access_token}`
            }
        })

        const { login, id, avatar_url, name,}=response.data

        let user = await prisma.user.findFirst({ 
            where: {
                github_id: id
            }
        })

        if(!user) {
            user = await prisma.user.create({
                data: {
                    github_id: id,
                    login,
                    avatar_url,
                    name
                }
            })
        }

        const token = sign({
            user:{
                name: user.name,
                avatar_url: user.avatar_url,
                id: user.id
            }
        },
            `${process.env.JTW_SECRET}`,
        {
            subject: user.id,
            expiresIn: "1d"
        }

        )
        console.log(token)
        return {token, user}
    }

}