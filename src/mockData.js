export const DEFAULT_ADMINS = [
  {
    email: "admin@tridevtyre.com",
    password: "admin123",
    name: "Super Admin",
    role: "Administrator"
  },
  {
    email: "manager@tridevtyre.com",
    password: "manager123",
    name: "Tyre Manager",
    role: "Manager"
  }
];

export const INITIAL_PRODUCTS = [
  {
    id: "tyre-001",
    title: "Apollo Altrust High Performance",
    brand: "Apollo",
    model: "Altrust",
    vehicleType: "Car",
    mrp: 6500,
    discountPrice: 5750,
    images: [
      "/images/apollo_altrust.png",
      "/images/apollo_altrust.png",
      "/images/apollo_altrust.png",
      "/images/apollo_altrust.png",
      "/images/apollo_altrust.png"
    ],
    description: "Designed specifically for commercial and passenger vans, the Apollo Altrust offers exceptional durability, superior wet grip, and high fuel efficiency. Built to handle heavy loads while maintaining smooth ride comfort and high-speed stability.",
    specs: {
      width: "205",
      profile: "65",
      rim: "15",
      speedRating: "T",
      loadIndex: "102",
      warranty: "5 Years Manufacturer Warranty",
      runflat: "No",
      treadDepth: "8.5 mm",
      plyRating: "8 PR"
    }
  },
  {
    id: "tyre-002",
    title: "MRF Wanderer All-Terrain SUV",
    brand: "MRF",
    model: "Wanderer A/T",
    vehicleType: "SUV",
    mrp: 8200,
    discountPrice: null, // Test fallback: should show MRP by default
    images: [
      "/images/mrf_wanderer.png",
      "/images/mrf_wanderer.png",
      "/images/mrf_wanderer.png",
      "/images/mrf_wanderer.png",
      "/images/mrf_wanderer.png"
    ],
    description: "The MRF Wanderer A/T is engineered for SUVs that conquer both smooth highways and rugged off-road terrains. Featuring multi-layered reinforced steel belts and a bold, aggressive tread pattern for ultimate grip and casing strength.",
    specs: {
      width: "235",
      profile: "70",
      rim: "16",
      speedRating: "S",
      loadIndex: "106",
      warranty: "6 Years Standard Warranty",
      runflat: "No",
      treadDepth: "10.2 mm",
      plyRating: "6 PR"
    }
  },
  {
    id: "tyre-003",
    title: "CEAT Milaze Super Sporty Bike Tyre",
    brand: "CEAT",
    model: "Milaze",
    vehicleType: "Two-Wheeler",
    mrp: 2400,
    discountPrice: 1999,
    images: [
      "/images/ceat_milaze.png",
      "/images/ceat_milaze.png",
      "/images/ceat_milaze.png",
      "/images/ceat_milaze.png",
      "/images/ceat_milaze.png"
    ],
    description: "CEAT Milaze provides high mileage and reliable dry/wet traction for commuter and sports motorcycles. Its unique continuous center groove and deep shoulder grooves prevent aquaplaning and offer stellar cornering confidence.",
    specs: {
      width: "90",
      profile: "90",
      rim: "17",
      speedRating: "P",
      loadIndex: "49",
      warranty: "3 Years Unconditional Warranty",
      runflat: "No",
      treadDepth: "6.0 mm",
      plyRating: "4 PR"
    }
  }
];
