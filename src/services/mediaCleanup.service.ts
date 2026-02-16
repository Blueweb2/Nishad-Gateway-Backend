import cloudinary from "../config/cloudinary";
import { CityBlogModel } from "../models/cityBlog.model";

export const MediaCleanupService = {

  async cleanUnusedImages() {

    /* ===============================
       1️⃣ Get all images from Cloudinary
    =============================== */

    const cloudinaryImages = await cloudinary.api.resources({
      type: "upload",
      prefix: "nishad-gateway",
      max_results: 500,
    });

    const allPublicIds = cloudinaryImages.resources.map(
      (img: any) => img.public_id
    );

    /* ===============================
       2️⃣ Get all used images from DB
    =============================== */

    const blogs = await CityBlogModel.find().lean();

    const usedPublicIds = new Set<string>();

    const extractFromUrl = (url: string) => {
      if (!url || !url.includes("res.cloudinary.com")) return;

      const parts = url.split("/upload/")[1];
      if (!parts) return;

      const publicId = parts.split(".")[0].replace(/f_auto,q_auto\//, "");
      usedPublicIds.add(publicId);
    };

    blogs.forEach((blog: any) => {
      blog.sections?.forEach((section: any) => {
        const content = section.content;

        // HERO
        if (content?.backgroundImage) {
          extractFromUrl(content.backgroundImage);
        }

        // VISION
        if (content?.imageUrl) {
          extractFromUrl(content.imageUrl);
        }

        // INVESTMENT CARDS
        content?.cards?.forEach((card: any) => {
          extractFromUrl(card.mainImage);
          extractFromUrl(card.subImage);
        });
      });
    });

    /* ===============================
       3️⃣ Find unused images
    =============================== */

    const unusedImages = allPublicIds.filter(
      (publicId: string) => !usedPublicIds.has(publicId)

    );

    /* ===============================
       4️⃣ Delete unused
    =============================== */

    for (const publicId of unusedImages) {
      await cloudinary.uploader.destroy(publicId);
    }

    return {
      totalCloudinaryImages: allPublicIds.length,
      usedImages: usedPublicIds.size,
      deleted: unusedImages.length,
    };
  },
};
