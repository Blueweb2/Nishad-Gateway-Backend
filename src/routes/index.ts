import { FastifyInstance } from "fastify";

import adminRoutes from "./admin.routes";
import blogRoutes from "./blog.routes";
import serviceRoutes from "./service.routes";
import subserviceRoutes from "./subservice.routes";
import contentRoutes from "./content.routes";
import uploadRoutes from "./upload.routes";
import leadRoutes from "./lead.routes";

export default async function routes(app: FastifyInstance) {
  // Auth/Admin
  app.register(adminRoutes);
  

  // Blog
  app.register(blogRoutes);

  // Services module
  app.register(serviceRoutes);
  app.register(subserviceRoutes);
  app.register(contentRoutes);


 app.register(uploadRoutes, { prefix: "/upload" });
  app.register(leadRoutes);

}
