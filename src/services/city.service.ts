import { CityModel } from "../models/City.model";

export const CityService = {
    async createCity(payload: any) {
        return CityModel.create(payload);
    },

    // async getCities(query: any) {
    //     const filter: any = {};

    //     if (query?.isActive !== undefined) {
    //         filter.isActive = query.isActive === "true";
    //     }

    //     return CityModel.find(filter).sort({ order: 1, createdAt: -1 });
    // },
      async getPublicCities() {
    return CityModel.find({ isActive: true })
      .sort({ order: 1 })
      .lean();
  },

  async getAllCities() {
    return CityModel.find()
      .sort({ order: 1 })
      .lean();
  },

    async getCityBySlug(citySlug: string) {
        return CityModel.findOne({ citySlug });
    },


    async getCityById(id: string) {
        return CityModel.findById(id);
    },


    async updateCity(id: string, payload: any) {
        return CityModel.findByIdAndUpdate(id, payload, { new: true });
    },

    async deleteCity(id: string) {
        return CityModel.findByIdAndDelete(id);
    },



};