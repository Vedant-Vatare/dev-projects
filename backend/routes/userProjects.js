import { Router } from 'express';
import {
  startProject,
  getStartedProjects,
  updateStartedProject,
  deleteProject,
} from '../controllers/userProjectsController.js';
import { authenticateUser } from '../middleware/userValidation.js';
import { validateUpdateProject } from '../middleware/userProjectValidation.js';
const router = Router();

router.use(authenticateUser);
router.post('/create', startProject);
router.get('/', getStartedProjects);
router.patch('/', validateUpdateProject, updateStartedProject);
router.delete('/', deleteProject);
export default router;
