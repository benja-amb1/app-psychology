import User from '../models/users'
import { UserReq } from '../interfaces/UserReq'
import { Response, Request } from 'express'
import v from 'validator';

const cleanInputs = (field: string) => {
  return v.escape(field.trim());
};