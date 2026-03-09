export async function predictExpansionCost(data: any) {

  // DEVELOPMENT MODE (MOCK)
  if (process.env.NODE_ENV === "development") {

    const visas = Number(data.visas || 0);

    return {
      estimated_min_cost: 35000 + visas * 3500,
      estimated_max_cost: 50000 + visas * 5500,
      timeline: "2–4 weeks",
      recommended_setup: "Limited Liability Company (LLC)",
      cost_breakdown: [
        { item: "Commercial License", min: 12000, max: 18000 },
        { item: "Documentation & Legal", min: 5000, max: 8000 },
        { item: "Visa Processing", min: visas * 3500, max: visas * 5500 },
      ],
      analysis:
        "Estimated costs are based on typical foreign investor setups in Saudi Arabia.",
    };

  }

  // PRODUCTION (Gemini later)
  return {
    estimated_min_cost: 0,
    estimated_max_cost: 0,
    timeline: "",
    recommended_setup: "",
    cost_breakdown: [],
    analysis: "",
  };
}