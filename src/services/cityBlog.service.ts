import mongoose from "mongoose";
import { CityBlogModel } from "../models/cityBlog.model";
import { CityModel } from "../models/City.model";
import { CityCategoryModel } from "../models/cityCategory.model";
import { CityBlogPostModel } from "../models/cityBlogPost.model";
import { deleteCloudinaryImageService } from "./cloudinary.service";

type BlogStatus = "DRAFT" | "PUBLISHED";

export const CityBlogService = {

  /* ======================================================
     ADMIN – GET BLOG
  ====================================================== */
  async getByCityId(cityId: string) {
    if (!mongoose.Types.ObjectId.isValid(cityId)) return null;

    return CityBlogModel.findOne({
      cityId: new mongoose.Types.ObjectId(cityId),
    }).lean();
  },

  /* ======================================================
     INTERNAL – VALIDATE SECTIONS
  ====================================================== */
  validateSections(sections: any[], status?: BlogStatus) {
    if (!Array.isArray(sections) || sections.length === 0) {
      throw new Error("At least one section is required");
    }

    const orders = sections.map((s) => s.order);
    if (orders.length !== new Set(orders).size) {
      throw new Error("Section order values must be unique");
    }

    const heroSections = sections.filter((s) => s.type === "HERO");
    if (heroSections.length !== 1) {
      throw new Error("Exactly one HERO section is required");
    }

    if (status === "PUBLISHED") {
      const activeSections = sections.filter((s) => s.isActive);

      if (activeSections.length === 0) {
        throw new Error("At least one active section is required to publish");
      }

      const activeHero = activeSections.filter(
        (s) => s.type === "HERO"
      );

      if (activeHero.length !== 1) {
        throw new Error(
          "Exactly one active HERO section is required to publish"
        );
      }
    }
  },

  /* ======================================================
     INTERNAL – EXTRACT MEDIA PUBLIC IDS
  ====================================================== */
extractPublicIds(sections: any[] = []) {
  const publicIds: string[] = [];

  for (const section of sections) {
    if (!section?.content) continue;

    const content = section.content;

    switch (section.type) {
      case "HERO":
        if (content.backgroundImagePublicId) {
          publicIds.push(content.backgroundImagePublicId);
        }
        break;

      case "VISION":
        if (content.imagePublicId) {
          publicIds.push(content.imagePublicId);
        }
        break;

      case "INVESTMENT_HIGHLIGHTS":
        content.cards?.forEach((card: any) => {
          if (card.mainImagePublicId) {
            publicIds.push(card.mainImagePublicId);
          }
          if (card.subImagePublicId) {
            publicIds.push(card.subImagePublicId);
          }
        });
        break;

      case "INFRASTRUCTURE":
        content.slides?.forEach((slide: any) => {
          if (slide.imagePublicId) {
            publicIds.push(slide.imagePublicId);
          }
        });
        break;

      case "FOOD_GUIDE":
        content.filters?.forEach((filter: any) => {
          filter.items?.forEach((item: any) => {
            if (item.imagePublicId) {
              publicIds.push(item.imagePublicId);
            }
          });
        });
        break;

      case "TRANSPORTATION_GUIDE":
        // Adjust property name if needed (routes/options/items etc.)
        content.items?.forEach((item: any) => {
          if (item.imagePublicId) {
            publicIds.push(item.imagePublicId);
          }
        });

     

        break;

         case "EXPANDABLE_SNAPSHOT":
        content.cards?.forEach((card: any) => {
          if (card.imagePublicId) {
            publicIds.push(card.imagePublicId);
          }
        });
        break;

            case "FUTURE_OUTLOOK":
        content.slides?.forEach((slide: any) => {
          if (slide.imagePublicId) {
            publicIds.push(slide.imagePublicId);
          }
        });
        break;

      default:
        break;
    }
  }

  return publicIds;
},


  /* ======================================================
     ADMIN – UPSERT (SAFE + CLEANUP)
  ====================================================== */
  async upsert(
    cityId: string,
    sections?: any[],
    status?: BlogStatus
  ) {
    if (!mongoose.Types.ObjectId.isValid(cityId)) {
      throw new Error("Invalid cityId");
    }

    const objectCityId = new mongoose.Types.ObjectId(cityId);

    // 🔥 Get existing blog BEFORE update
    const existingBlog = await CityBlogModel.findOne({
      cityId: objectCityId,
    }).lean();

    const oldPublicIds = this.extractPublicIds(existingBlog?.sections || []);

    const updateData: any = {};

    /* ===== Validate & Normalize Sections ===== */
    if (sections !== undefined) {
      this.validateSections(sections, status);

      const normalizedSections = [...sections]
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((section, index) => ({
          ...section,
          order: index + 1,
        }));

      updateData.sections = normalizedSections;
    }

    /* ===== Publish Without Sections Update ===== */
    if (status === "PUBLISHED" && sections === undefined) {
      if (!existingBlog?.sections?.length) {
        throw new Error("Cannot publish blog without sections");
      }

      this.validateSections(existingBlog.sections, "PUBLISHED");
    }

    if (status !== undefined) {
      updateData.status = status;
    }

    const updatedBlog = await CityBlogModel.findOneAndUpdate(
      { cityId: objectCityId },
      { $set: updateData },
      {
        upsert: true,
        new: true,
        runValidators: true,
      }
    ).lean();

    /* ===== CLEANUP UNUSED IMAGES ===== */
    if (sections !== undefined) {
      const newPublicIds = this.extractPublicIds(updatedBlog?.sections || []);

      const removedPublicIds = oldPublicIds.filter(
        (id) => !newPublicIds.includes(id)
      );

      for (const publicId of removedPublicIds) {
        try {
          await deleteCloudinaryImageService(publicId);
        } catch (err) {
          console.error("Cloudinary cleanup failed:", publicId);
        }
      }
    }

    return updatedBlog;
  },

  /* ======================================================
     PUBLIC – CITY PAGE
  ====================================================== */
  async getByCitySlug(citySlug: string) {
    const city = await CityModel.findOne({
      citySlug,
      isActive: true,
    }).lean();

    if (!city) return null;

    const blog = await CityBlogModel.findOne({
      cityId: city._id,
      status: "PUBLISHED",
    }).lean();

    if (!blog) return null;

    const categories = await CityCategoryModel.find({
      cityId: city._id,
      isActive: true,
    })
      .sort({ order: 1 })
      .select("name slug")
      .lean();

    return {
      city: {
        _id: city._id,
        cityName: city.cityName,
        citySlug: city.citySlug,
      },
      sections: blog.sections.filter((s: any) => s.isActive),
      categories,
      status: blog.status,
    };
  },

  /* ======================================================
     PUBLIC – BLOG DETAIL
  ====================================================== */
  async getPublicBlogDetail(
    citySlug: string,
    categorySlug: string,
    blogSlug: string
  ) {
    const city = await CityModel.findOne({
      citySlug,
      isActive: true,
    }).lean();

    if (!city) return null;

    const category = await CityCategoryModel.findOne({
      cityId: city._id,
      slug: categorySlug,
      isActive: true,
    }).lean();

    if (!category) return null;

    const blog = await CityBlogPostModel.findOne({
      cityId: city._id,
      categoryId: category._id,
      slug: blogSlug,
      isPublished: true,
    }).lean();

    if (!blog) return null;

    return {
      city: {
        cityName: city.cityName,
        citySlug: city.citySlug,
      },
      category: {
        name: category.name,
        slug: category.slug,
      },
      blog,
    };
  },
};
