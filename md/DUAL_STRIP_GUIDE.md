# 🎞️ Dual Photo Strip Guide

How to create templates with duplicate photo strips (2 identical strips per 4×6" paper).

## What is a Dual Strip Layout?

A dual strip layout prints **two identical photo strips side-by-side** on a single 4×6" photo paper. This lets you:
- Cut down the middle to get 2 strips per print
- Give both strips to the guest (one to keep, one to share)
- Save paper and printing costs
- Standard photo booth format

## Layout Structure

```
┌─────────────────────────────┐
│  4 × 6 inches @ 300 DPI     │
│  (1200 × 1800 pixels)       │
├──────────────┬──────────────┤
│   Photo 1    │   Photo 1    │  ← Same photo twice
├──────────────┼──────────────┤
│   Photo 2    │   Photo 2    │  ← Same photo twice
├──────────────┼──────────────┤
│   Photo 3    │   Photo 3    │  ← Same photo twice
├──────────────┼──────────────┤
│   Photo 4    │   Photo 4    │  ← Same photo twice
└──────────────┴──────────────┘
     Cut here ↑
```

## How to Create a Dual Strip Template

### Method 1: Automatic (Recommended)

1. **Go to Admin** (`/admin`)
2. **Create New Template**
3. **Set dimensions:**
   - Toggle to **Inches**
   - Width: **4.0**
   - Height: **6.0**
   - DPI: **300**
   - Result: 1200 × 1800 pixels

4. **Upload your background** (optional)
   - Use a maroon/red background like your example
   - Or use a solid color

5. **Click "Create Dual Strip (2×4)" button** 🎞️
   - This automatically creates 8 slots
   - 4 on the left, 4 on the right
   - Properly spaced and sized
   - Ready to use!

6. **Save Template**

### Method 2: Manual

If you want custom positioning:

1. Create template at 4×6" (1200×1800px)
2. Add 8 photo slots manually
3. Name them:
   - `Photo 1 (Left)` and `Photo 1 (Right)`
   - `Photo 2 (Left)` and `Photo 2 (Right)`
   - `Photo 3 (Left)` and `Photo 3 (Right)`
   - `Photo 4 (Left)` and `Photo 4 (Right)`
4. Position them in two columns

**Important:** Include `(Left)` and `(Right)` in the names - this tells the system to duplicate photos automatically!

## How It Works

### For Users
When a user selects 4 photos:
- ✅ Photo 1 appears in top-left AND top-right
- ✅ Photo 2 appears in both middle-top slots
- ✅ Photo 3 appears in both middle-bottom slots
- ✅ Photo 4 appears in both bottom slots

**The system automatically duplicates the 4 selected photos to fill all 8 slots!**

### For Printing
1. Print the 4×6" image
2. Use a paper cutter to cut down the middle
3. You now have 2 identical photo strips!

## Template Dimensions

### For 4×6" Photo Paper

| Measurement | Pixels @ 300 DPI | Notes |
|-------------|------------------|-------|
| Total Size | 1200 × 1800 | Standard 4×6" |
| Each Strip | ~550 × 1800 | After margins |
| Each Photo | ~550 × 400 | Approximate |
| Margins | ~50-100px | 5-8% recommended |

### Suggested Slot Sizes (at 300 DPI)

For 4×6" paper with 5% margins:
- **Margin:** 60px (~0.2")
- **Gap between columns:** 96px (~0.32")
- **Slot width:** 492px (~1.64")
- **Slot height:** 397px (~1.32")

The "Create Dual Strip" button calculates these automatically!

## Design Tips

### Background Design
- Use darker colors (maroon, navy, black) for contrast
- Add decorative borders around photo openings
- Include cutting guides or perforation lines
- Add text/branding at top or bottom
- Leave the middle gap clear for cutting

### Photo Slots
- Keep photos away from center (cutting line)
- Equal spacing between all photos
- Rounded corners optional (looks professional)
- Use "cover" fit mode for best results

### Margins
- **Outer margins:** 0.2-0.3" (safe zone)
- **Between photos:** 0.1-0.2"
- **Center gap:** 0.3-0.4" (cutting space)

## Example Template Setup

### Using the Automatic Button

```
1. Template Size: 4" × 6" @ 300 DPI
2. Click "Create Dual Strip (2×4)"
3. Upload background (optional)
4. Adjust margins if needed
5. Save!
```

Result: 8 slots perfectly positioned!

### Slot Positions (Auto-generated)

Left column (Photos 1-4):
- Slot 1: X: 60px, Y: 60px, W: 492px, H: 397px
- Slot 2: X: 60px, Y: 487px, W: 492px, H: 397px
- Slot 3: X: 60px, Y: 914px, W: 492px, H: 397px
- Slot 4: X: 60px, Y: 1341px, W: 492px, H: 397px

Right column (duplicate):
- Slots positioned at X: 648px (same Y values)

## Why PDF Format?

### Benefits of PDF for Photo Booth Prints

**Better for Printing:**
- ✅ Industry standard for print shops
- ✅ Preserves exact dimensions (4×6", 2×6", etc.)
- ✅ No accidental resizing by printers
- ✅ Better color management
- ✅ Smaller file sizes than PNG

**Professional Use:**
- Print shops prefer PDF
- Photo labs accept PDF
- Consistent output across devices
- Embeddable fonts and metadata

### When to Use Each Format

| Format | Best For |
|--------|----------|
| **PDF** | Printing at photo labs, professional prints |
| **PNG** | Sharing digitally, social media, viewing on screen |
| **Print** | Immediate printing at home/event |

## PDF Features

The PDF export includes:
- ✅ Exact template dimensions (e.g., 4×6" at 300 DPI)
- ✅ High-quality image embedding
- ✅ Proper orientation (portrait/landscape)
- ✅ No borders or margins
- ✅ Print-ready format

### PDF Specifications

For a 4×6" template at 300 DPI:
- **PDF Size:** 4.0" × 6.0"
- **Resolution:** 1200 × 1800 pixels embedded
- **Format:** PDF 1.3 compatible
- **Color Space:** RGB
- **File Size:** ~500KB-2MB (depending on image complexity)

## Printing Workflow

### Professional Print Shop
1. Click "Download PDF"
2. Send PDF to print shop or photo lab
3. Specify: "Print at actual size, no scaling"
4. Paper: 4×6" glossy photo paper
5. Result: Perfect prints every time!

### Home Printer
- **For best results:** Use PDF
- **For quick prints:** Use Print button
- **For digital:** Use PNG

### Photo Booth Printer (DNP, Mitsubishi, etc.)
- Some accept PDF directly
- Others work better with PNG
- Check your printer's manual

### Printer Settings
- **Paper:** 4×6" photo paper (glossy recommended)
- **Quality:** Best/High (300 DPI minimum)
- **Fit:** Actual size (no scaling)
- **Orientation:** Portrait
- **Margins:** Borderless if supported

### Cutting
1. Use a paper trimmer or guillotine cutter
2. Cut straight down the vertical center
3. Each half should be ~2" × 6"

### Professional Setup
- Use a photo booth printer (DNP, Mitsubishi, etc.)
- These often have built-in cutters
- Set to 4×6" print size
- May support auto-cutting

## Troubleshooting

### Photos Don't Duplicate
**Problem:** Photos only appear on left side

**Solution:** Check slot names include `(Left)` and `(Right)`

### Slots Overlap
**Problem:** Photos overlap the cutting line

**Solution:** 
- Increase the center gap
- Use the automatic button for proper spacing
- Or manually adjust X positions

### Print Cuts Off
**Problem:** Photos get cut off when printed

**Solution:**
- Check printer margins
- Use borderless printing
- Increase outer margins in template

### Wrong Size
**Problem:** Strips don't fit standard frames

**Solution:** Standard photo strip is 2" × 6"
- Template: 4" × 6" 
- Each strip after cutting: 2" × 6"

## Advanced Customizations

### Triple Strip (3 columns)
Change template to 6" × 6" or wider, create 12 slots (4 rows × 3 columns)

### Different Photo Counts
- 3 photos: Create 6 slots (3×2)
- 5 photos: Create 10 slots (5×2)

### Asymmetric Layouts
Left and right don't need to be identical - just use different photo assignments

## Quick Reference

**Standard Dual Strip:**
- Size: 4×6" @ 300 DPI (1200×1800px)
- Slots: 8 total (4 left + 4 right)
- Names: Include (Left) and (Right)
- Cutting: Down the middle
- Result: Two 2×6" strips

**Button:** Click "Create Dual Strip (2×4)" for instant setup! 🎞️

---

**Pro Tip:** After printing, keep one strip and give the duplicate to the guest. Or let them take both! Perfect for parties and events where guests want multiple copies.
