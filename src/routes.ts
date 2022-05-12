import express from 'express';
import 'dotenv/config'
import { SubmitFeedbackUseCase } from './use-cases/submit-feedback-use-case';
import { PrismaFeedbackRepository } from './repositories/prisma/prisma-feedback-repository';
import { NodemailerMailAdapter } from './adapters/nodemailer/nodemailer-mail-adapter';
import {AuthUserController} from './controllers/auth-user-controller'
import {ensureAuthenticated} from './middleware/ensure-authenticated'
import { GetFeedbacksController } from './controllers/get-feedbaks-controller';
import { ProfileUserController } from './controllers/profile-user-controller';
import { GuestUserController } from './controllers/guest-user-controller';
import { prisma } from './prisma';

export const routes = express.Router();




routes.post('/feedbacks', ensureAuthenticated, async (req, res) => {

   

    const {type, comment, screenshot, created_at,user_id, user} = req.body

    
    const prismaFeedbackRepository = new PrismaFeedbackRepository()
    const nodemailerMailAdapter = new NodemailerMailAdapter()

    const submitFeedbackUseCase = new SubmitFeedbackUseCase(
        prismaFeedbackRepository,
        nodemailerMailAdapter
        )

    
    await submitFeedbackUseCase.execute({
        type,
        comment,
        screenshot,
        created_at,
        user_id,
        user
    })

    
    return res.status(201).send()
})

routes.get('/github',(req, res) => {
    
    res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`)
})
routes.get('/signin/callback', (req, res) => {

    const {code} = req.query;

    return res.json(code);
})
routes.post('/authenticate', new AuthUserController().handler)

routes.post('/getfeedbacks', new GetFeedbacksController().handler)

routes.get('/profile', ensureAuthenticated, new ProfileUserController().handler)

routes.get('/guest', new GuestUserController().handler)