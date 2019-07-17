'use strict'

import { Router } from 'express';
import bodyParser from 'body-parser';

import basicAuth from '../lib/basic-auth-middleware.js'
import Credential from '../model/credentials';

const authRouter = module.exports = new Router();

authRouter.post('/api/signup', jsonParser, (req, res, next) => {
  console.log('hit /api/signup')

  Credential.create(req.body)
  .then(token => res.send(token))
  .catch(next)
})

authRouter.get('/api/login', basicAuth, (req, res, next) => {
  console.log('hit /api/login')

  req.user.tokenCreate()
  .then(token => res.send(token))
  .catch(next)
})