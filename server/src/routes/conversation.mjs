import { Router } from "express";
import conversationController from "../controllers/conversation.mjs";
import { authorize } from "../middlewares/auth.mjs";

const router = Router();

router.get('/', authorize(), conversationController.getAll);

router.get('/:receiverId', authorize(), conversationController.getUserConversation);

export default router;