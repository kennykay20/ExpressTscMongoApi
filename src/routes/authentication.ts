import "reflect-metadata";
import express from 'express';
import { container } from "tsyringe";
import AuthenticationController from '../Authentication/auth.controller';

const authCont = container.resolve(AuthenticationController);

export default (router: express.Router) => {
    console.log('call the authentication for routes');
    router.post('/api/v1/auth/register', authCont.RegisterUser);
    router.post('/api/v1/auth/login', authCont.LoginUser);
    return router;
} 


