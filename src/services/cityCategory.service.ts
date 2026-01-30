import mongoose from "mongoose";
import { CityCategoryModel } from "../models/cityCategory.model";
import { CityModel } from "../models/City.model";

export const CityCategoryService = {
  /* =========================================
     CREATE CATEGORY
  ========================================= */
  async create(cityId: string, payload: any) {
    const city = await CityModel.findById(cityId);
    if (!city) return null;

    return CityCategoryModel.create({
      ...payload,
      cityId: new mongoose.Types.ObjectId(cityId),
    });
  },

  /* =========================================
     GET ALL BY CITY
  ========================================= */
  async getByCityId(cityId: string) {
    return CityCategoryModel.find({
      cityId: new mongoose.Types.ObjectId(cityId),
    })
      .sort({ order: 1 })
      .lean();
  },

  /* =========================================
     GET SINGLE
  ========================================= */
  async getById(cityId: string, categoryId: string) {
    return CityCategoryModel.findOne({
      _id: categoryId,
      cityId: new mongoose.Types.ObjectId(cityId),
    }).lean();
  },

  /* =========================================
     UPDATE
  ========================================= */
  async update(cityId: string, categoryId: string, payload: any) {
    return CityCategoryModel.findOneAndUpdate(
      {
        _id: categoryId,
        cityId: new mongoose.Types.ObjectId(cityId),
      },
      payload,
      { new: true, runValidators: true }
    ).lean();
  },

  /* =========================================
     DELETE
  ========================================= */
  async remove(cityId: string, categoryId: string) {
    return CityCategoryModel.findOneAndDelete({
      _id: categoryId,
      cityId: new mongoose.Types.ObjectId(cityId),
    });
  },
};