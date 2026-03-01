export const SIMPLE_CATEGORIES: Record<string, string[]> = {
  'Pumps': [
    'Centrifugal Pumps',
    'Other Pumps',
    'Hydraulic Pumps',
  ],
  'Valves & Piping': [
    'Valves & Manifolds',
    'Stop Valves',
    'Pipe, Hose & Tubing',
    'Pipe',
    'Air Pressure Gauges',
  ],
  'Motors & Drives': [
    'Electric Motors',
    'General Purpose Motors',
    'Pump Motors',
    'Electric Motor Parts & Accessories',
    'Mechanical Power Transmission',
    'Bearings & Bushings',
    'Mounted Bearings & Housings',
    'Mechanical Couplings & U-Joints',
    'Flexible Couplings',
  ],
  'Controls & PLCs': [
    'PLCs & HMIs',
    'PLC Processors',
    'PLC Peripheral Modules',
    'PLC Input & Output Modules',
    'PLC Ethernet & Communication',
    'HMI & Open Interface Panels',
    'Other Automation Equipment',
  ],
  'Sensors & Instrumentation': [
    'Sensors',
    'Flow Meters',
    'Flow Controllers & Meters',
    'Other Sensors',
    'Proximity Sensors',
    'Level Sensors',
    'Pressure Sensors',
    'Thermometers & Temperature Measurement',
    'Thermocouple Thermometers & Probes',
    'Recorders & Plotters',
    'Data Acquisition & Loggers',
    'Gas & Combustion Analyzers',
    'Analyzers & Data Acquisition',
  ],
  'Electrical': [
    'Circuit Breakers',
    'Circuit Breakers & Disconnectors',
    'Transformers',
    'Industrial Control & General Purpose Transformers',
    'Power Supplies',
    'Switching Mode Power Supplies',
    'Wire, Cable & Conduit',
    'Conduit & Tubing',
    'Conduit',
    'Raceways & Strut Channels',
    'Wire & Cable Management',
    'Terminal Blocks',
    'Wire Connectors & Terminal Blocks',
    'Electrical Boxes & Enclosures',
    'Electrical Boxes, Panels & Boards',
    'Electrical Plugs, Outlets & Covers',
    'Electrical Plugs',
    'Relays',
    'Overload Protection Relays',
    'Other Electrical Equipment & Supplies',
    'Wiring & Wiring Harnesses',
    'Terminals & Wiring',
  ],
  'Heat Transfer & HVAC': [
    'Heat Exchangers',
    'Air Handlers',
    'HVAC & Refrigeration',
    'Fans & Blowers',
    'HVAC & Refrigeration: Fans & Blowers',
    'HVAC & Refrigeration Components',
    'HVAC & Refrigeration: Parts & Accessories',
    'Other HVAC & Refrigeration',
    'Refrigerator & Freezer Parts',
    'Commercial Exhaust Fans',
    'Hood Systems',
  ],
  'Mixers & Homogenizers': [
    'Commercial Mixers',
    'Food Preparation Equipment',
    'Homogenizers',
    'Lab Mixers, Shakers & Stirrers',
  ],
  'Packaging Equipment': [
    'Sealers & Sealing Machines',
    'Packing Machines',
    'Filling & Sealing Machines',
    'Other Packing & Shipping',
    'Packing & Shipping',
  ],
  'Process Equipment': [
    'Process Engineering Equipment',
    'Other Process Engineering Equipment',
    'Soup & Steam Kettles',
    'Cooking Equipment',
    'Commercial Sinks',
    'Cleaning & Warewashing',
    'Other Commercial Kitchen Equipment',
    'Commercial Kitchen Equipment',
    'Autoclaves & Sterilizers',
    'Welding & Soldering',
    'Welders, Cutters & Torches',
    'TIG Welders',
    'Metalworking Equipment',
    'Metalworking Supplies',
    'EDM',
    'Woodworking Equipment',
    'Toolholding',
    'Workholding',
    'Other Medical & Lab Equipment',
    'Healthcare, Lab & Dental',
  ],
  'Robotics': [
    'Industrial Robotic Arms',
    'Industrial Robot Parts',
  ],
  'Material Handling': [
    'Pallet Jacks & Trucks',
    'Warehouse Loading & Unloading',
    'Chain Hoists',
    'Cranes & Hoists',
    'Hoists, Winches & Rigging',
    'Heavy Equipment',
    'Compactors',
    'Commercial Trucks',
    'Dump Trucks',
  ],
  'Test & Measurement': [
    'CMM Machines & Comparators',
    'Metalworking Inspection & Measurement',
    'Other Cameras & Imaging',
    'Cameras & Imaging',
    'Other Test Equipment Parts & Accessories',
    'Test Equipment Parts & Accessories',
    'Test Meters & Detectors',
  ],
  'Other Equipment': [],
};

export function getSimpleCategory(ebayCategory: string): string {
  const lowerCat = ebayCategory.toLowerCase();

  for (const [simpleCategory, keywords] of Object.entries(SIMPLE_CATEGORIES)) {
    if (simpleCategory === 'Other Equipment') continue;
    for (const keyword of keywords) {
      if (lowerCat.includes(keyword.toLowerCase())) {
        return simpleCategory;
      }
    }
  }

  return 'Other Equipment';
}

export function getAllSimpleCategories(): string[] {
  return Object.keys(SIMPLE_CATEGORIES);
}
