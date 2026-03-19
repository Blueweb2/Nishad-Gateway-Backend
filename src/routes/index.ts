import { FastifyInstance } from "fastify";

import adminRoutes from "./admin.routes";
import blogRoutes from "./blog.routes";
import serviceRoutes from "./service.routes";
import subserviceRoutes from "./subservice.routes";
import contentRoutes from "./content.routes";
import uploadRoutes from "./upload.routes";
import leadRoutes from "./lead.routes";
import cityRoutes from "./city.routes";
import cityBlogRoutes from "./cityBlog.routes";
import cityCategoryRoutes from "./cityCategory.routes";
import cityBlogPostRoutes from "./cityBlogPost.routes";
 import mediaCleanupRoutes from "./mediaCleanup.routes";
import { sectorRoutes } from "./sector.routes";
import ministryRoutes from "./ministry.routes";
import calculatorRoutes from "./calculator.routes";
import contactRoutes from "./contact.routes";
import cityContentRoutes from "./cityContent.routes";
import cloudinaryRoutes from "./cloudinary.routes";




export default async function routes(app: FastifyInstance) {

  /* ===== ADMIN ===== */
  app.register(adminRoutes);

  /* ===== BLOG ===== */
  app.register(blogRoutes, { prefix: "/blogs" });

  /* ===== CORE MODULES ===== */
  app.register(serviceRoutes);
  app.register(subserviceRoutes);
  app.register(contentRoutes);

  /* ===== CITY SYSTEM ===== */
  app.register(cityRoutes);
  app.register(cityBlogRoutes);
  app.register(cityCategoryRoutes);
  app.register(cityBlogPostRoutes);
  app.register(cityContentRoutes);

  /* ===== OTHER ===== */
  app.register(sectorRoutes, { prefix: "/sectors" });
  app.register(ministryRoutes);
  app.register(calculatorRoutes);
  app.register(contactRoutes);

  /* ===== MEDIA ===== */
  app.register(uploadRoutes, { prefix: "/upload" });
  await app.register(mediaCleanupRoutes);
app.register(cloudinaryRoutes, { prefix: "/cloudinary" });
  /* ===== LEADS ===== */
  app.register(leadRoutes);
}
