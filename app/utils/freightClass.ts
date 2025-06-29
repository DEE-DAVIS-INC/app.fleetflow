// Freight Class (NMFC) utility for cargo classification
export interface FreightClass {
  code: string;
  range: string;
  description: string;
  characteristics: string;
  examples: string;
}

export const FREIGHT_CLASSES: FreightClass[] = [
  {
    code: "50",
    range: "50",
    description: "High-density commodities (50+ lbs/cu ft)",
    characteristics: "Most durable, easiest to handle, clean freight",
    examples: "Steel, iron castings, nuts and bolts"
  },
  {
    code: "55",
    range: "55", 
    description: "High-density commodities (35-50 lbs/cu ft)",
    characteristics: "Very durable, easy to handle, clean freight",
    examples: "Bricks, cement, ceramic tile"
  },
  {
    code: "60",
    range: "60",
    description: "High-density commodities (30-35 lbs/cu ft)",
    characteristics: "Durable, easy to handle, clean freight", 
    examples: "Steel bars, concrete blocks, copper pipe"
  },
  {
    code: "65",
    range: "65",
    description: "High-density commodities (22.5-30 lbs/cu ft)",
    characteristics: "Durable, easy to handle and stow",
    examples: "Car parts, books, bottled beverages"
  },
  {
    code: "70",
    range: "70", 
    description: "High-density commodities (15-22.5 lbs/cu ft)",
    characteristics: "Durable, fairly easy to handle",
    examples: "Food products, auto engines, small appliances"
  },
  {
    code: "77.5",
    range: "77.5",
    description: "Medium-high density commodities (13.5-15 lbs/cu ft)",
    characteristics: "Generally durable, some handling care needed",
    examples: "Tires, batteries, liquids in boxes"
  },
  {
    code: "85",
    range: "85",
    description: "Medium-high density commodities (12-13.5 lbs/cu ft)",
    characteristics: "Moderately durable, some care in handling",
    examples: "Crated machinery, cast iron stoves"
  },
  {
    code: "92.5",
    range: "92.5",
    description: "Medium density commodities (10.5-12 lbs/cu ft)",
    characteristics: "Moderately durable, requires care",
    examples: "Computers, monitors, refrigerators"
  },
  {
    code: "100",
    range: "100",
    description: "Medium density commodities (9-10.5 lbs/cu ft)",
    characteristics: "Moderate durability, some special handling",
    examples: "Wine cases, boat covers, vacuum cleaners"
  },
  {
    code: "110",
    range: "110",
    description: "Medium density commodities (8-9 lbs/cu ft)",
    characteristics: "Moderate durability, special handling required",
    examples: "Cabinets, framed pictures, table saws"
  },
  {
    code: "125",
    range: "125",
    description: "Medium-low density commodities (7-8 lbs/cu ft)",
    characteristics: "Some durability issues, careful handling",
    examples: "Small household appliances, power tools"
  },
  {
    code: "150",
    range: "150",
    description: "Low density commodities (6-7 lbs/cu ft)",
    characteristics: "Less durable, may be oddly shaped",
    examples: "Auto parts, clothing, couches"
  },
  {
    code: "175",
    range: "175",
    description: "Low density commodities (5-6 lbs/cu ft)",
    characteristics: "Fragile or awkward to handle",
    examples: "Clothing, stuffed furniture, office furniture"
  },
  {
    code: "200",
    range: "200",
    description: "Low density commodities (4-5 lbs/cu ft)",
    characteristics: "Fragile, awkward, or high value",
    examples: "Auto sheet metal, aircraft parts, aluminum tables"
  },
  {
    code: "250",
    range: "250",
    description: "Very low density commodities (3-4 lbs/cu ft)",
    characteristics: "Very fragile, awkward, or high value",
    examples: "Bamboo furniture, mattresses, plasma TVs"
  },
  {
    code: "300",
    range: "300",
    description: "Very low density commodities (2-3 lbs/cu ft)",
    characteristics: "Extremely fragile, awkward, or high value",
    examples: "Wood cabinets, assembled machinery, artwork"
  },
  {
    code: "400",
    range: "400",
    description: "Extremely low density commodities (1-2 lbs/cu ft)",
    characteristics: "Extremely fragile, specialty handling required",
    examples: "Assembled chairs, deer antlers, lampshades"
  },
  {
    code: "500",
    range: "500",
    description: "Lowest density commodities (<1 lb/cu ft)",
    characteristics: "Extremely fragile, highest value, specialty handling",
    examples: "Ping-pong balls, gold leaf, kayaks"
  }
];

export const getFreightClassByCode = (code: string): FreightClass | undefined => {
  return FREIGHT_CLASSES.find(fc => fc.code === code);
};

export const getFreightClassOptions = () => {
  return FREIGHT_CLASSES.map(fc => ({
    value: fc.code,
    label: `Class ${fc.code} - ${fc.description}`,
    examples: fc.examples
  }));
};

export const calculateFreightClassFromDensity = (weight: number, length: number, width: number, height: number): string => {
  // Calculate density (pounds per cubic foot)
  const volume = (length * width * height) / 1728; // Convert cubic inches to cubic feet
  const density = weight / volume;

  if (density >= 50) return "50";
  if (density >= 35) return "55";
  if (density >= 30) return "60";
  if (density >= 22.5) return "65";
  if (density >= 15) return "70";
  if (density >= 13.5) return "77.5";
  if (density >= 12) return "85";
  if (density >= 10.5) return "92.5";
  if (density >= 9) return "100";
  if (density >= 8) return "110";
  if (density >= 7) return "125";
  if (density >= 6) return "150";
  if (density >= 5) return "175";
  if (density >= 4) return "200";
  if (density >= 3) return "250";
  if (density >= 2) return "300";
  if (density >= 1) return "400";
  return "500";
};
