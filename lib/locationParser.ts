import { LocationParsed } from '@/types/inventory';

// US State to Region mapping
const US_STATE_REGIONS: Record<string, string> = {
  // Northeast
  'Maine': 'Northeast',
  'New Hampshire': 'Northeast',
  'Vermont': 'Northeast',
  'Massachusetts': 'Northeast',
  'Rhode Island': 'Northeast',
  'Connecticut': 'Northeast',
  'New York': 'Northeast',
  'New Jersey': 'Northeast',
  'Pennsylvania': 'Northeast',
  
  // Southeast
  'Delaware': 'Southeast',
  'Maryland': 'Southeast',
  'Virginia': 'Southeast',
  'West Virginia': 'Southeast',
  'Kentucky': 'Southeast',
  'Tennessee': 'Southeast',
  'North Carolina': 'Southeast',
  'South Carolina': 'Southeast',
  'Georgia': 'Southeast',
  'Florida': 'Southeast',
  'Alabama': 'Southeast',
  'Mississippi': 'Southeast',
  'Arkansas': 'Southeast',
  'Louisiana': 'Southeast',
  
  // Midwest
  'Ohio': 'Midwest',
  'Indiana': 'Midwest',
  'Illinois': 'Midwest',
  'Michigan': 'Midwest',
  'Wisconsin': 'Midwest',
  'Minnesota': 'Midwest',
  'Iowa': 'Midwest',
  'Missouri': 'Midwest',
  'North Dakota': 'Midwest',
  'South Dakota': 'Midwest',
  'Nebraska': 'Midwest',
  'Kansas': 'Midwest',
  
  // Southwest
  'Texas': 'Southwest',
  'Oklahoma': 'Southwest',
  'New Mexico': 'Southwest',
  'Arizona': 'Southwest',
  
  // West
  'Colorado': 'West',
  'Wyoming': 'West',
  'Montana': 'West',
  'Idaho': 'West',
  'Utah': 'West',
  'Nevada': 'West',
  'California': 'West',
  'Oregon': 'West',
  'Washington': 'West',
  'Alaska': 'West',
  'Hawaii': 'West',
};

export function parseLocation(location: string): LocationParsed {
  const parsed: LocationParsed = {
    country: 'USA',
  };

  if (!location) {
    return parsed;
  }

  // Try to extract city and state
  const parts = location.split(',').map(p => p.trim());
  
  if (parts.length >= 2) {
    parsed.city = parts[0];
    const statePart = parts[1];
    
    // Check if it's a US state
    if (US_STATE_REGIONS[statePart]) {
      parsed.state = statePart;
      parsed.region = US_STATE_REGIONS[statePart];
      parsed.country = 'USA';
    } else {
      // Might be a country or other location format
      parsed.state = statePart;
      if (statePart !== 'USA' && statePart !== 'United States') {
        parsed.country = statePart;
      }
    }
  } else if (parts.length === 1) {
    // Single part - could be state or city
    if (US_STATE_REGIONS[parts[0]]) {
      parsed.state = parts[0];
      parsed.region = US_STATE_REGIONS[parts[0]];
    } else {
      parsed.city = parts[0];
    }
  }

  return parsed;
}

