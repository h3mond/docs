import { Router } from 'express';
import {getHandler} from '../controllers/student.controller';

const router = Router();

router.get('/', getHandler);

export default router;
