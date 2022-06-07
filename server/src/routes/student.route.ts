import { Router } from 'express';
import {getHandler, addHandler, initHandler} from '../controllers/student.controller';

const router = Router();

router.get('/', getHandler);
router.post('/add', addHandler);
router.get('/init', initHandler);

export default router;
