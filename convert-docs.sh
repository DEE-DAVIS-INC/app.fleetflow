#!/bin/bash

# FleetFlow Documentation Converter
# Converts markdown files to PDF for presentations

echo "🚛 FleetFlow Documentation Converter"
echo "===================================="

# Create output directory
mkdir -p ./presentations

echo "📄 Converting documentation to PDF format..."

# Check if pandoc is installed
if ! command -v pandoc &> /dev/null; then
    echo "❌ Pandoc not found. Installing via Homebrew..."
    brew install pandoc
fi

# Convert key documents to PDF
echo "📋 Converting USER_GUIDE.md..."
pandoc USER_GUIDE.md -o presentations/FleetFlow_User_Guide.pdf --pdf-engine=wkhtmltopdf

echo "📊 Converting EXECUTIVE_SUMMARY.md..."
pandoc EXECUTIVE_SUMMARY.md -o presentations/FleetFlow_Executive_Summary.pdf --pdf-engine=wkhtmltopdf

echo "📋 Converting QUICK_REFERENCE_CARDS.md..."
pandoc QUICK_REFERENCE_CARDS.md -o presentations/FleetFlow_Quick_Reference.pdf --pdf-engine=wkhtmltopdf

echo "🤖 Converting AI_IMPLEMENTATION_GUIDE.md..."
pandoc AI_IMPLEMENTATION_GUIDE.md -o presentations/FleetFlow_AI_Guide.pdf --pdf-engine=wkhtmltopdf

echo "💼 Converting BUSINESS_PLAN.md..."
pandoc BUSINESS_PLAN.md -o presentations/FleetFlow_Business_Plan.pdf --pdf-engine=wkhtmltopdf

echo "✅ Conversion complete! PDFs saved in ./presentations/"
echo "📁 Files created:"
ls -la presentations/

echo ""
echo "🎯 For presentations, we recommend:"
echo "• FleetFlow_Executive_Summary.pdf - For stakeholders"
echo "• FleetFlow_User_Guide.pdf - For training"
echo "• FleetFlow_Quick_Reference.pdf - For day-to-day use"
