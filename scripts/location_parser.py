"""
Location parsing utilities for extracting region, state, country from location strings.
"""

# US State to Region mapping
US_STATE_REGIONS = {
    # Northeast
    'Maine': 'Northeast',
    'New Hampshire': 'Northeast',
    'Vermont': 'Northeast',
    'Massachusetts': 'Northeast',
    'Rhode Island': 'Northeast',
    'Connecticut': 'Northeast',
    'New York': 'Northeast',
    'New Jersey': 'Northeast',
    'Pennsylvania': 'Northeast',
    
    # Southeast
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
    
    # Midwest
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
    
    # Southwest
    'Texas': 'Southwest',
    'Oklahoma': 'Southwest',
    'New Mexico': 'Southwest',
    'Arizona': 'Southwest',
    
    # West
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
}

def parse_location(location: str) -> dict:
    """
    Parse a location string to extract city, state, country, and region.
    
    Args:
        location: Location string (e.g., "Rolesville, North Carolina")
    
    Returns:
        Dictionary with keys: city, state, country, region
    """
    parsed = {
        'country': 'USA',
    }
    
    if not location:
        return parsed
    
    # Try to extract city and state
    parts = [p.strip() for p in location.split(',')]
    
    if len(parts) >= 2:
        parsed['city'] = parts[0]
        state_part = parts[1]
        
        # Check if it's a US state
        if state_part in US_STATE_REGIONS:
            parsed['state'] = state_part
            parsed['region'] = US_STATE_REGIONS[state_part]
            parsed['country'] = 'USA'
        else:
            # Might be a country or other location format
            parsed['state'] = state_part
            if state_part not in ('USA', 'United States'):
                parsed['country'] = state_part
    elif len(parts) == 1:
        # Single part - could be state or city
        if parts[0] in US_STATE_REGIONS:
            parsed['state'] = parts[0]
            parsed['region'] = US_STATE_REGIONS[parts[0]]
        else:
            parsed['city'] = parts[0]
    
    return parsed

