import { FastifyInstance } from "fastify";
import { getAllMedia, getFolders } from "../controllers/cloudinary.controller";

export default async function cloudinaryRoutes(app: FastifyInstance) {

app.get("/media", getAllMedia);
app.get("/folders", getFolders);

}