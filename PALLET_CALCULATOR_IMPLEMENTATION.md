# Pallet Weight Calculator Implementation

## Overview
Added a comprehensive pallet weight calculator to the LoadUpload component that allows users to calculate total shipment weight by specifying the number of pallets and weight per pallet, including the weight of the pallets themselves.

## Features Implemented

### 1. Pallet Weight Calculator (`app/components/LoadUpload.tsx`)

#### **Interactive Calculator Interface**
- **Number of Pallets**: Input field for total pallet count
- **Weight per Pallet**: Input field for cargo weight on each pallet (in lbs)
- **Empty Pallet Weight**: Pre-filled with standard 40 lbs, but editable
- **Real-time Calculation**: Shows breakdown as user types:
  - Cargo weight: `Number of pallets × Weight per pallet`
  - Pallet weight: `Number of pallets × Empty pallet weight` 
  - **Total weight**: `Cargo weight + Pallet weight`

#### **Smart Integration**
- **Automatic Weight Update**: Calculator result populates the main weight field
- **Pieces Field Update**: Automatically sets pieces field (e.g., "18 pallets")
- **One-Click Application**: "Calculate Total Weight" button applies results
- **Form Validation**: Ensures all calculator fields are filled before calculation

### 2. Enhanced UI Components

#### **Weight Field Enhancement**
- Added "📦 Calculate by pallets" toggle button
- Expandable calculator section with green-themed design
- Non-intrusive integration with existing weight input
- Clear visual feedback for calculation results

#### **Pieces/Units Field**
- New optional field for tracking shipment units
- Supports various formats: "12 pallets", "5 crates", "3 bundles", etc.
- Automatically populated by pallet calculator
- Manually editable for custom descriptions

### 3. Load Board Display Updates (`app/broker/page.tsx`)

#### **Enhanced Load Information**
- **Pieces Display**: Shows package count with 📦 icon
- **Sample Data**: Updated with realistic pallet counts
- **Information Hierarchy**: 
  1. Commodity type (bold)
  2. Weight and equipment type
  3. Pieces/units count
  4. Freight class badge
  5. Broker information

## Technical Implementation

### **State Management**
```typescript
const [palletData, setPalletData] = useState({
  numberOfPallets: '',
  weightPerPallet: '',
  palletWeight: '40' // Standard pallet weight
})
```

### **Calculation Logic**
```typescript
const calculateTotalWeight = () => {
  const totalCargoWeight = numberOfPallets × weightPerPallet
  const totalPalletWeight = numberOfPallets × palletWeight
  const totalWeight = totalCargoWeight + totalPalletWeight
  
  // Update main form fields
  handleInputChange('weight', totalWeight.toString())
  handleInputChange('pieces', `${numberOfPallets} pallets`)
}
```

### **Real-time Preview**
Shows calculation breakdown before applying:
- "Cargo weight: 36,000 lbs"
- "Pallet weight: 720 lbs" 
- "**Total weight: 36,720 lbs**"

## Usage Examples

### **Example 1: Electronics Shipment**
- **18 pallets** × **2,000 lbs per pallet** + **40 lbs pallet weight**
- **Result**: 36,720 lbs total (36,000 lbs cargo + 720 lbs pallets)
- **Pieces**: "18 pallets"

### **Example 2: Food Products**
- **22 pallets** × **1,700 lbs per pallet** + **40 lbs pallet weight**
- **Result**: 38,280 lbs total (37,400 lbs cargo + 880 lbs pallets)
- **Pieces**: "22 pallets"

### **Example 3: Custom Pallet Weight**
- **15 pallets** × **2,500 lbs per pallet** + **50 lbs heavy-duty pallet**
- **Result**: 38,250 lbs total (37,500 lbs cargo + 750 lbs pallets)
- **Pieces**: "15 pallets"

## Benefits

### **For Users**
- **Accuracy**: Includes pallet weight in total calculations
- **Efficiency**: Quick calculation without external tools
- **Flexibility**: Supports different pallet weights and configurations
- **Education**: Shows weight breakdown for transparency

### **For Operations**
- **Better Planning**: Accurate weight information for equipment selection
- **Compliance**: Proper weight calculation for DOT regulations
- **Documentation**: Clear piece count for BOL and invoicing
- **Cost Accuracy**: Precise weight data for rate calculations

## Visual Design
- **Green color scheme** for pallet calculator (distinguishes from freight class calculator)
- **Collapsible interface** to avoid form clutter
- **Real-time feedback** with formatted number display
- **Clear labeling** with emoji icons for visual appeal

## Files Modified
- `app/components/LoadUpload.tsx` - Added pallet calculator functionality
- `app/broker/page.tsx` - Enhanced load display with pieces information
- `app/contexts/LoadContext.tsx` - Already included pieces field support

## Integration Points
- **Freight Class Calculator**: Works alongside existing density calculator
- **Load Board Display**: Pieces information flows to load listings
- **Document Generation**: Weight and pieces data available for BOL/invoices
- **Data Persistence**: Calculated values saved with load data

This implementation provides a professional, user-friendly way to calculate shipment weights for pallet-based cargo while maintaining integration with the existing freight classification and load management system.
