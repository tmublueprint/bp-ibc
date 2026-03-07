import { Request, Response } from "express";
import {
    createContent,
    getContentById,
    getContents,
} from "../services/contentService";
import { ContentPostModel } from "../models/contentModel";

// Post /content
export async function postContent(req: Request, res: Response) {
    try {
        const contentData = req.body as ContentPostModel;
        const newContent = await createContent(contentData);
        res.status(201).json(newContent);
    } catch (error) {
        res.status(500).json({ message: "Error creating content", error });
    }
}

// Get /content/:id
export async function getContent(req: Request, res: Response) {
    try {
        const contentId = req.params.id;
        const content = await getContentById(contentId);
        if (content) {
            return res.status(200).json(content);
        } else {
            return res.status(404).json({ message: "Content not found" });
        }
    } catch (error) {
        console.error("Error fetching content:", error);
        return res.status(500).json({ error: "Failed to fetch content" });
    }
}

// Get /content
export async function getAllContent(req: Request, res: Response) {
    try {
        const contents = await getContents();
        return res.status(200).json(contents);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching content", error });
    }
}