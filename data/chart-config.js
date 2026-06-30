// Maps each CANADA_DATA key to a category and chart-rendering config.
// type: 'line' | 'bar' | 'horizontalBar'
const CHART_CONFIG = {
  economy: {
    label: "Economy & Productivity",
    desc: "Output, sectoral composition, and productivity relative to peers.",
    charts: [
      { key: "living_standards", type: "line" },
      { key: "gdp_by_sector", type: "line" },
      { key: "capital_allocation", type: "line" },
      { key: "sector_snapshot", type: "horizontalBar" },
      { key: "productivity_g7", type: "line" }
    ]
  },
  debt_fiscal: {
    label: "Debt & Fiscal",
    desc: "Household and sovereign debt, housing costs, monetary policy, federal spending.",
    charts: [
      { key: "household_debt", type: "line" },
      { key: "fed_debt_deficit", type: "line" },
      { key: "housing", type: "line" },
      { key: "inflation_boc", type: "line" },
      { key: "dept_funding", type: "horizontalBar" },
      { key: "dept_spending_hist", type: "line" }
    ]
  },
  demographics: {
    label: "Demographics",
    desc: "Population growth, fertility, and provincial divergence.",
    charts: [
      { key: "population", type: "line" },
      { key: "fertility", type: "line" },
      { key: "provincial", type: "horizontalBar" }
    ]
  },
  labour_inequality: {
    label: "Labour & Inequality",
    desc: "Employment, wages, wealth distribution, and corporate concentration.",
    charts: [
      { key: "labour_market", type: "line" },
      { key: "wealth_inequality", type: "line" },
      { key: "corporate_concentration", type: "line" }
    ]
  },
  social_fabric: {
    label: "Social Fabric",
    desc: "Trust, education outcomes, energy architecture, and government efficiency.",
    charts: [
      { key: "social_cohesion", type: "line" },
      { key: "education", type: "line" },
      { key: "energy", type: "line" },
      { key: "govt_efficiency", type: "line" }
    ]
  }
};

const PALETTE = ["#c9a44c","#8ba888","#a87c7c","#7c8ba8","#b89a6e","#6e9ab8","#a8a36e"];
