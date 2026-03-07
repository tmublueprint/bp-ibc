import { Router } from "express";
import {
    postContent,
    getContent,
    getAllContent,
} from "../controllers/contentController";

const router = Router();

router.post("/", postContent);
router.get("/:id", getContent);
router.get("/", getAllContent);

export default router;