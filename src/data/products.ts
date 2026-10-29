import type { Product } from '../types';

// Keep product visuals real and recognizable while allowing the catalog to stay data-only.
const createSvgDataUrl = (title: string, category: string, _color1: string, _color2: string) => {
  const imageSets: Record<string, string[]> = {
    Phones: [
      'photo-1592899677977-9c10ca588bbd', 'photo-1511707171634-5f897ff02aa9',
      'photo-1556656793-08538906a9f8', 'photo-1598327105666-5b89351aff97',
      'photo-1565849904461-04a58ad377e0', 'photo-1533228100845-08145b01de14',
      'photo-1601784551446-20c9e07cdbdb', 'photo-1523206489230-c012c64b2b48'
    ],
    Laptops: [
      'photo-1517336714739-489689fd1ca8', 'photo-1496181133206-80ce9b88a853',
      'photo-1531297484001-80022131f5a1', 'photo-1541807084-5c52b6b3adef',
      'photo-1484788984921-03950022c9ef', 'photo-1593642702821-c8da6771f0c6',
      'photo-1511385348-a52b4a160dc2', 'photo-1496181133206-80ce9b88a853'
    ],
    Accessories: [
      'photo-1606220945770-b5b6c2c55bf1', 'photo-1523275335684-37898b6baf30',
      'photo-1505740420928-5e560c06d30e', 'photo-1609592424522-6db3f7f7f8bd',
      'photo-1587033411391-5d9e51cce126', 'photo-1572569511254-d8f925fe2cbb',
      'photo-1546435770-a3e426bf472b', 'photo-1494438639946-1ebd1d20bf85'
    ]
  };
  const images = imageSets[category] || imageSets.Accessories;
  const imageIndex = Math.abs(title.length + category.length) % images.length;
  return `https://images.unsplash.com/${images[imageIndex]}?auto=format&fit=crop&w=900&q=85`;
};

export const MOCK_PRODUCTS: Product[] = [
  // --- PHONES (8) ---
  {
    id: 'phone-01',
    name: 'Apple iPhone 15 Pro',
    category: 'phones',
    price: 1099,
    rating: 4.9,
    reviewCount: 428,
    image: createSvgDataUrl('Nimbus Phone 15 Pro', 'Phones', '#6C63FF', '#38B2AC'),
    tagline: 'Titanium chassis with Neural Bionic Chip',
    specs: {
      Display: '6.7-inch OLED 120Hz',
      Processor: 'Neural X3 3nm',
      Camera: '50MP Triple Matrix',
      Battery: '4,850 mAh (45W Fast)',
      Storage: '256GB'
    },
    stock: 45,
    featured: true
  },
  {
    id: 'phone-02',
    name: 'Apple iPhone 15',
    category: 'phones',
    price: 799,
    rating: 4.7,
    reviewCount: 312,
    image: createSvgDataUrl('Nimbus Phone 15', 'Phones', '#48BB78', '#38B2AC'),
    tagline: 'Dynamic tactile display and all-day battery',
    specs: {
      Display: '6.1-inch Super Retina',
      Processor: 'Neural X2',
      Camera: '48MP Dual Lens',
      Battery: '4,200 mAh',
      Storage: '128GB'
    },
    stock: 80,
    featured: true
  },
  {
    id: 'phone-03',
    name: 'Samsung Galaxy Z Fold6',
    category: 'phones',
    price: 1799,
    rating: 4.8,
    reviewCount: 184,
    image: createSvgDataUrl('Nimbus Fold Ultra', 'Phones', '#8B84FF', '#E53E3E'),
    tagline: 'Next-gen dual display foldable flagship',
    specs: {
      Display: '7.8-inch Inner OLED + 6.2-inch Cover',
      Processor: 'Snapdragon 8 Gen 3',
      Camera: '108MP Pro Sensor',
      Battery: '5,000 mAh Dual Cell',
      Storage: '512GB'
    },
    stock: 14,
    featured: true
  },
  {
    id: 'phone-04',
    name: 'Samsung Galaxy A55 5G',
    category: 'phones',
    price: 449,
    rating: 4.5,
    reviewCount: 156,
    image: createSvgDataUrl('Nimbus Phone Lite', 'Phones', '#319795', '#6C63FF'),
    tagline: 'Sleek budget champion with flagship finish',
    specs: {
      Display: '6.5-inch 90Hz LCD',
      Processor: 'MediaTek Dimensity 8200',
      Camera: '64MP Dual',
      Battery: '5,000 mAh',
      Storage: '128GB'
    },
    stock: 120
  },
  {
    id: 'phone-05',
    name: 'Samsung Galaxy S23 FE',
    category: 'phones',
    price: 349,
    rating: 4.4,
    reviewCount: 98,
    image: createSvgDataUrl('Nimbus Phone SE', 'Phones', '#D69E2E', '#ED8936'),
    tagline: 'Compact power in a timeless tactile shell',
    specs: {
      Display: '4.7-inch Retina',
      Processor: 'Neural X1',
      Camera: '12MP Wide',
      Battery: '3,100 mAh',
      Storage: '64GB'
    },
    stock: 65
  },
  {
    id: 'phone-06',
    name: 'Samsung Galaxy S24 Ultra',
    category: 'phones',
    price: 1399,
    rating: 4.95,
    reviewCount: 620,
    image: createSvgDataUrl('Nimbus Pro Max', 'Phones', '#667EEA', '#764BA2'),
    tagline: 'Peak mobile photography with periscope 10x optical zoom',
    specs: {
      Display: '6.9-inch 144Hz LTPO',
      Processor: 'Neural X3 Ultra',
      Camera: '200MP Quad Cam',
      Battery: '5,500 mAh',
      Storage: '1TB'
    },
    stock: 22
  },
  {
    id: 'phone-07',
    name: 'Samsung Galaxy S24',
    category: 'phones',
    price: 999,
    rating: 4.65,
    reviewCount: 88,
    image: createSvgDataUrl('Nimbus Cyber', 'Phones', '#ED64A6', '#9F7AEA'),
    tagline: 'Neon glyph backplane with active cooling',
    specs: {
      Display: '6.67-inch AMOLED 165Hz',
      Processor: 'Gaming Bionic G1',
      Camera: '50MP Sony IMX',
      Battery: '6,000 mAh (120W Hyper)',
      Storage: '256GB'
    },
    stock: 18
  },
  {
    id: 'phone-08',
    name: 'Apple iPhone 13 mini',
    category: 'phones',
    price: 549,
    rating: 4.6,
    reviewCount: 204,
    image: createSvgDataUrl('Nimbus Mini 5G', 'Phones', '#4FD1C5', '#63B3ED'),
    tagline: 'Featherlight 5.4-inch pocket powerhouse',
    specs: {
      Display: '5.4-inch OLED',
      Processor: 'Neural X2',
      Camera: '24MP Dual',
      Battery: '3,800 mAh',
      Storage: '128GB'
    },
    stock: 50
  },

  // --- LAPTOPS (8) ---
  {
    id: 'laptop-01',
    name: 'Lenovo ThinkPad P1 Gen 7',
    category: 'laptops',
    price: 2499,
    rating: 4.9,
    reviewCount: 512,
    image: createSvgDataUrl('Nimbus Book Pro 16', 'Laptops', '#4C51BF', '#6C63FF'),
    tagline: 'Extreme performance for creators and engineers',
    specs: {
      Display: '16.2-inch Liquid XDR 3.2K',
      Processor: 'M3 Max 16-Core',
      RAM: '32GB Unified Memory',
      Storage: '1TB NVMe SSD',
      Battery: '22 Hours'
    },
    stock: 19,
    featured: true
  },
  {
    id: 'laptop-02',
    name: 'HP Spectre x360 14',
    category: 'laptops',
    price: 1199,
    rating: 4.85,
    reviewCount: 840,
    image: createSvgDataUrl('Nimbus Book Air', 'Laptops', '#38B2AC', '#3182CE'),
    tagline: 'Impossibly thin, silent fanless powerhouse',
    specs: {
      Display: '14.2-inch Retina',
      Processor: 'M3 8-Core',
      RAM: '16GB Unified',
      Storage: '512GB SSD',
      Battery: '18 Hours'
    },
    stock: 95,
    featured: true
  },
  {
    id: 'laptop-03',
    name: 'Lenovo Legion Pro 7i',
    category: 'laptops',
    price: 3299,
    rating: 4.92,
    reviewCount: 130,
    image: createSvgDataUrl('Nimbus Blade 18', 'Laptops', '#E53E3E', '#805AD5'),
    tagline: 'RTX 4090 Monster with vapor chamber cooling',
    specs: {
      Display: '18-inch QHD+ 240Hz Mini-LED',
      Processor: 'Intel Core i9-14900HX',
      GPU: 'NVIDIA RTX 4090 16GB',
      RAM: '64GB DDR5',
      Storage: '2TB Gen4 SSD'
    },
    stock: 8
  },
  {
    id: 'laptop-04',
    name: 'HP Envy x360 14',
    category: 'laptops',
    price: 1899,
    rating: 4.75,
    reviewCount: 210,
    image: createSvgDataUrl('Nimbus Canvas', 'Laptops', '#DD6B20', '#D69E2E'),
    tagline: 'Pull-forward touch canvas with pressure stylus',
    specs: {
      Display: '14.4-inch 120Hz Touch 3:2',
      Processor: 'Intel Core i7-13700H',
      GPU: 'RTX 4060 8GB',
      RAM: '32GB DDR5',
      Storage: '1TB SSD'
    },
    stock: 25
  },
  {
    id: 'laptop-05',
    name: 'Lenovo Yoga Slim 7i',
    category: 'laptops',
    price: 899,
    rating: 4.6,
    reviewCount: 340,
    image: createSvgDataUrl('Nimbus Slim 13', 'Laptops', '#319795', '#4299E1'),
    tagline: 'Ultra-portable magnesium alloy everyday ultrabook',
    specs: {
      Display: '13.3-inch FHD IPS',
      Processor: 'AMD Ryzen 7 7840U',
      RAM: '16GB LPDDR5',
      Storage: '512GB SSD',
      Weight: '0.98 kg'
    },
    stock: 60
  },
  {
    id: 'laptop-06',
    name: 'HP ZBook Fury G11',
    category: 'laptops',
    price: 2799,
    rating: 4.88,
    reviewCount: 75,
    image: createSvgDataUrl('Nimbus Workstation', 'Laptops', '#2B6CB0', '#4FD1C5'),
    tagline: 'ISV-certified CAD & AI training station',
    specs: {
      Display: '15.6-inch 4K OLED HDR',
      Processor: 'Intel Xeon W-11955M',
      GPU: 'NVIDIA RTX 5000 Ada',
      RAM: '64GB ECC RAM',
      Storage: '2TB RAID 0'
    },
    stock: 12
  },
  {
    id: 'laptop-07',
    name: 'Lenovo IdeaPad Flex 5i',
    category: 'laptops',
    price: 499,
    rating: 4.35,
    reviewCount: 180,
    image: createSvgDataUrl('Nimbus Chrome', 'Laptops', '#D69E2E', '#38B2AC'),
    tagline: 'Instant-on productivity with cloud acceleration',
    specs: {
      Display: '14-inch FHD Touch',
      Processor: 'Intel Core i3-1215U',
      RAM: '8GB',
      Storage: '256GB NVMe',
      Battery: '13 Hours'
    },
    stock: 110
  },
  {
    id: 'laptop-08',
    name: 'HP EliteBook 840 G11',
    category: 'laptops',
    price: 1999,
    rating: 4.89,
    reviewCount: 390,
    image: createSvgDataUrl('Nimbus Book Pro 14', 'Laptops', '#6C63FF', '#8B84FF'),
    tagline: 'Compact power station for on-the-go professionals',
    specs: {
      Display: '14.2-inch Liquid XDR',
      Processor: 'M3 Pro 12-Core',
      RAM: '18GB Unified',
      Storage: '512GB SSD',
      Battery: '18 Hours'
    },
    stock: 40
  },

  // --- ACCESSORIES (8) ---
  {
    id: 'acc-01',
    name: 'Apple AirPods Pro (2nd Gen)',
    category: 'accessories',
    price: 249,
    rating: 4.85,
    reviewCount: 1250,
    image: createSvgDataUrl('Nimbus Pods Pro', 'Accessories', '#6C63FF', '#B794F4'),
    tagline: 'Spatial audio with active adaptive noise cancelling',
    specs: {
      Driver: '11mm Custom High-Excursion',
      ANC: '48dB Hybrid ANC',
      Battery: '8 Hours (32 Hours with Case)',
      Charging: 'Neumorphic Wireless Dock'
    },
    stock: 200,
    featured: true
  },
  {
    id: 'acc-02',
    name: 'Samsung Galaxy Watch7',
    category: 'accessories',
    price: 399,
    rating: 4.78,
    reviewCount: 680,
    image: createSvgDataUrl('Nimbus Watch 2', 'Accessories', '#38B2AC', '#4FD1C5'),
    tagline: 'Precision ceramic smart watch with ECG & GPS',
    specs: {
      Display: '1.9-inch Sapphire AMOLED',
      Sensors: 'ECG, SpO2, Skin Temp',
      Waterproofing: '100m / 10 ATM',
      Battery: '6 Days'
    },
    stock: 85,
    featured: true
  },
  {
    id: 'acc-03',
    name: 'Samsung Galaxy Buds3 Pro',
    category: 'accessories',
    price: 449,
    rating: 4.9,
    reviewCount: 430,
    image: createSvgDataUrl('Nimbus Sound Studio', 'Accessories', '#4C51BF', '#9F7AEA'),
    tagline: 'Planar magnetic audiophile wireless headset',
    specs: {
      Driver: '50mm Planar Drivers',
      Codec: 'LDAC, aptX Lossless',
      Battery: '50 Hours ANC On',
      Material: 'Cool-grey brushed aluminum'
    },
    stock: 45
  },
  {
    id: 'acc-04',
    name: 'HP USB-C 100W Power Adapter',
    category: 'accessories',
    price: 89,
    rating: 4.7,
    reviewCount: 520,
    image: createSvgDataUrl('Nimbus Power 100W', 'Accessories', '#DD6B20', '#319795'),
    tagline: 'Quad GaN fast charger in a tactile soft casing',
    specs: {
      Outputs: '3x USB-C PD 3.0, 1x USB-A',
      MaxOutput: '100W Total',
      Tech: 'GaN V Fast Cooling',
      Safety: 'ThermalGuard Overheat Check'
    },
    stock: 300
  },
  {
    id: 'acc-05',
    name: 'Lenovo ThinkPad TrackPoint Keyboard II',
    category: 'accessories',
    price: 199,
    rating: 4.82,
    reviewCount: 310,
    image: createSvgDataUrl('Nimbus Mechanical', 'Accessories', '#3182CE', '#6C63FF'),
    tagline: 'Wireless gasket-mounted keyboard with silent tactile switches',
    specs: {
      Layout: '75% Compact Explosive',
      Switches: 'Custom Soft-Tactile Lubed',
      Connectivity: 'Bluetooth 5.3 + 2.4GHz + Type-C',
      Keycaps: 'Double-shot PBT Soft Matte'
    },
    stock: 75
  },
  {
    id: 'acc-06',
    name: 'HP 690 Rechargeable Wireless Mouse',
    category: 'accessories',
    price: 129,
    rating: 4.68,
    reviewCount: 490,
    image: createSvgDataUrl('Nimbus Sculpt Mouse', 'Accessories', '#D69E2E', '#38B2AC'),
    tagline: 'Biometric thumb grip mouse with magnetic scroll wheel',
    specs: {
      Sensor: '26,000 DPI Darkfield Optical',
      Buttons: '7 Programmable Silent Click',
      Battery: '70 Days via USB-C',
      Weight: '105g Ergonomic'
    },
    stock: 140
  },
  {
    id: 'acc-07',
    name: 'Apple MagSafe Battery Pack',
    category: 'accessories',
    price: 69,
    rating: 4.62,
    reviewCount: 890,
    image: createSvgDataUrl('Nimbus PowerBank', 'Accessories', '#E53E3E', '#DD6B20'),
    tagline: '10,000mAh magnetic snap battery with kickstand',
    specs: {
      Capacity: '10,000 mAh',
      Wireless: '15W Fast Qi2',
      Wired: '30W USB-C Dual-Way',
      Kickstand: 'Tactile Neumorphic Ring'
    },
    stock: 250
  },
  {
    id: 'acc-08',
    name: 'Lenovo ThinkPad Universal Thunderbolt 4 Dock',
    category: 'accessories',
    price: 299,
    rating: 4.87,
    reviewCount: 215,
    image: createSvgDataUrl('Nimbus Dock TB4', 'Accessories', '#4A5568', '#6C63FF'),
    tagline: '12-in-1 workstation hub supporting dual 4K 120Hz displays',
    specs: {
      Ports: '4x TB4, 3x USB-A 10Gbps, 2.5G Ethernet, SD Express',
      PowerDelivery: '96W Host Charging',
      Chassis: 'Cool clay thermal sink',
      Bandwidth: '40 Gbps'
    },
    stock: 35
  }
];
