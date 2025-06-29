# Freight Class (NMFC) Implementation

## Overview
This implementation adds comprehensive NMFC (National Motor Freight Classification) freight class selection to the FleetFlow system, allowing users to properly classify their cargo for accurate quoting and handling.

## Features Implemented

### 1. Freight Class Utility (`app/utils/freightClass.ts`)
- **Complete NMFC class data**: All classes from 50 to 500 with proper ranges and descriptions
- **Detailed characteristics**: Updated characteristics based on your specifications:
  - **Class 50-65**: Very high density, very durable, easy to handle and stow (e.g., bricks, cement, steel bars, nuts & bolts)
  - **Class 85-100**: Moderately dense, still quite durable (e.g., crated machinery, refrigerators, wine cases)
  - **Class 150-200**: Lower density, less durable, may be oddly shaped (e.g., auto parts, clothing, couches)
  - **Class 250-500**: Very low density, fragile, and/or high value (e.g., mattresses, plasma TVs, kayaks, ping-pong balls)
- **Real-world examples**: Each class includes specific commodity examples
- **Density calculator**: Automatically suggests freight class based on weight and dimensions

### 2. Enhanced Load Upload Form (`app/components/LoadUpload.tsx`)
- **Freight class selector**: Dropdown with all NMFC classes and descriptions
- **Interactive density calculator**: 
  - Input weight, length, width, height
  - Automatically calculates and suggests appropriate freight class
  - One-click selection from calculator results
- **Real-time class details**: Shows characteristics and examples when class is selected
- **Quick reference panel**: Displays freight class ranges and general guidelines
- **Optional but recommended**: Field is marked as optional but encouraged for better service

### 3. Load Board Display Enhancement (`app/broker/page.tsx`)
- **Freight class badges**: Classes displayed as colored badges in load listings
- **Commodity information**: Shows both commodity type and freight class
- **Enhanced load details**: Freight class information flows through the system
- **Sample data**: Updated with realistic freight classes and commodities

### 4. System Integration
- **LoadContext updated**: Added `freightClass` field to the shared LoadData interface
- **Cross-component compatibility**: Freight class data flows between upload, display, and document generation
- **Backwards compatibility**: System works with existing loads that don't have freight class data

## Technical Details

### Freight Class Categories
```
Class 50-85:   Dense, durable goods (metals, machinery, food products)
Class 92.5-125: Medium density items (appliances, electronics, auto parts)  
Class 150-200: Lower density goods (clothing, furniture, sheet metal)
Class 250-500: Low density, fragile, or high-value items (artwork, specialty items)
```

### Density Calculation Formula
```
Volume = (length × width × height) ÷ 1728  // Convert cubic inches to cubic feet
Density = weight ÷ volume  // Pounds per cubic foot
```

### Usage Examples
1. **Steel bars (42,000 lbs)**: Class 60 - High density, durable
2. **Electronics (38,500 lbs)**: Class 85 - Moderately dense, needs care
3. **General freight**: Class 150-200 - Standard handling
4. **Specialty items**: Class 250+ - Requires special care

## User Interface Features

### Load Upload Process
1. User fills out standard load information
2. Selects commodity type
3. Optionally selects freight class from dropdown OR
4. Uses density calculator for automatic classification
5. System shows class details and handling requirements
6. Load is posted with complete classification data

### Load Board Display
- Freight class shown as colored badge
- Commodity information prominently displayed
- Quick visual reference for carriers and dispatchers

## Benefits
- **Accurate Pricing**: Proper classification leads to more accurate quotes
- **Better Handling**: Carriers understand special requirements
- **Industry Compliance**: Follows NMFC standards
- **User Education**: Built-in guidance helps users choose correct classes
- **System Intelligence**: Automatic suggestions reduce classification errors

## Files Modified
- `app/utils/freightClass.ts` - Core freight class data and utilities
- `app/components/LoadUpload.tsx` - Enhanced form with class selection
- `app/broker/page.tsx` - Display improvements for load board
- `app/contexts/LoadContext.tsx` - Added freight class to data model

## Testing
The implementation includes:
- Sample data with realistic freight classes
- Interactive calculator for testing density calculations
- Visual feedback for class selection
- Error handling for edge cases

This implementation provides a comprehensive freight classification system that educates users while ensuring proper cargo classification for the logistics industry.
