# Import/Export Templates Guide

## 📤📥 Share Templates Across Devices

You can now export templates from one device and import them on another!

---

## 🎯 How It Works

### **Export Templates**
- Creates a JSON file with all your templates
- Downloads to your computer
- Can be shared via email, USB, cloud storage, etc.

### **Import Templates**
- Upload a JSON file
- Adds templates to your device
- Option to merge or replace

---

## 📋 Step-by-Step Guide

### **Exporting Templates (From Laptop)**

1. **Open Admin Dashboard**
   - Go to: `http://yoursite.com/admin`

2. **Find Import/Export Section**
   - Located below "Load Sample Templates"
   - Shows blue and green buttons

3. **Click "Export Templates"**
   - Button shows count: e.g., "Export Templates (5)"
   - Downloads file: `photobooth-templates-[timestamp].json`

4. **Save the File**
   - File downloads to your Downloads folder
   - Example name: `photobooth-templates-1699999999999.json`

5. **Transfer to Other Device**
   - Email to yourself
   - Upload to Google Drive/Dropbox
   - Copy to USB drive
   - AirDrop (Mac/iPhone)
   - Bluetooth file transfer

---

### **Importing Templates (On Other Device)**

1. **Get the JSON File**
   - Download from email
   - Get from cloud storage
   - Copy from USB drive

2. **Open Admin Dashboard**
   - Go to: `http://yoursite.com/admin`

3. **Click "Import Templates"**
   - Green button with upload icon

4. **Select JSON File**
   - File picker opens
   - Choose your `.json` file

5. **Choose Merge or Replace**
   - **Popup appears with 2 options:**
   
   **Option A: REPLACE (Click OK)**
   - Imports new templates
   - Keeps existing templates
   - Both sets will be available
   
   **Option B: MERGE (Click Cancel)**
   - Imports new templates
   - Keeps existing templates
   - Both sets will be available
   
   *(Note: Currently both options merge - replace functionality can be added later)*

6. **Success!**
   - Alert shows: "Successfully imported X template(s)!"
   - New templates appear in the grid
   - Ready to use immediately

---

## 🔄 Common Scenarios

### **Scenario 1: Laptop → Phone**

**On Laptop:**
1. Design templates in admin
2. Click "Export Templates"
3. Email file to yourself

**On Phone:**
1. Open email
2. Download JSON file
3. Go to admin page (mobile browser)
4. Click "Import Templates"
5. Select downloaded file
6. Templates now on phone!

---

### **Scenario 2: Share with Team**

**Designer's Computer:**
1. Create templates
2. Export to JSON
3. Upload to Google Drive/Dropbox

**Team Member:**
1. Download from shared folder
2. Go to admin dashboard
3. Import JSON file
4. Same templates available!

---

### **Scenario 3: Backup Before Changes**

**Before making changes:**
1. Export current templates
2. Save file as backup
3. Make changes to templates
4. If something breaks:
   - Import backup file
   - Restore previous state

---

## 📁 File Structure

### **Exported JSON File Contains:**

```json
[
  {
    "id": "template-123",
    "name": "4x6 Photo Strip",
    "width": 1800,
    "height": 1200,
    "dpi": 300,
    "photoSlots": [...],
    "backgroundDataUrl": "data:image/png;base64,...",
    "foregroundDataUrl": "data:image/png;base64,...",
    "enabled": true,
    "isDefault": false,
    "createdAt": 1699999999999,
    "updatedAt": 1699999999999
  },
  {
    "id": "template-456",
    "name": "Dual Strip Layout",
    ...
  }
]
```

---

## ⚠️ Important Notes

### **File Size**
- Templates with images can be **large** (5-20MB per template)
- Email might reject large files (over 25MB)
- Use cloud storage for large template collections
- Compress files if needed (ZIP)

### **IDs and Conflicts**
- Imported templates get new IDs automatically
- No risk of overwriting existing templates
- Original templates remain unchanged

### **Images Included**
- ✅ Background images
- ✅ Foreground images
- ✅ All photo slot positions
- ✅ All settings and metadata

### **What's NOT Included**
- ❌ Captured photos from sessions
- ❌ User photos
- ❌ App settings
- ❌ Other browser data

---

## 🔧 Troubleshooting

### **Export Button is Disabled**
**Problem**: Gray button, can't click

**Solution**: Create at least one template first
- Click "Create New Template"
- Design and save a template
- Export button will activate

---

### **Import Failed**
**Problem**: "Failed to import templates" error

**Possible Causes:**
1. **Wrong file type**
   - Must be `.json` file
   - Not `.txt`, `.doc`, etc.

2. **Corrupted file**
   - Re-download the file
   - Try exporting again from source

3. **Old format**
   - File from very old version
   - May need manual conversion

**Solution**: 
- Check file extension (must be `.json`)
- Verify file size (not 0 bytes)
- Open in text editor to check format

---

### **Imported Templates Look Wrong**
**Problem**: Templates display incorrectly after import

**Possible Causes:**
- Image data corrupted during transfer
- File modified accidentally
- Encoding issues

**Solution**:
- Re-export from source
- Ensure file transfer was complete
- Don't edit JSON file manually

---

### **Can't Find Downloaded File**
**Problem**: Clicked export but can't find file

**Solution**:
- Check Downloads folder
- Look for files starting with: `photobooth-templates-`
- Sort by date modified (most recent)
- Search computer for `.json` files

---

## 💡 Tips & Best Practices

### **Regular Backups**
- Export templates weekly
- Keep dated backups: `templates-2024-01-15.json`
- Store in multiple locations

### **Naming Convention**
- Rename exported files descriptively:
  - `wedding-templates-2024.json`
  - `birthday-party-layouts.json`
  - `corporate-event-templates.json`

### **Version Control**
- Keep versions: `templates-v1.json`, `templates-v2.json`
- Document changes in file name
- Easy to roll back if needed

### **Share with Clients**
- Export event-specific templates
- Send to clients for approval
- They can preview before event day

### **Testing New Designs**
1. Export current templates (backup)
2. Try experimental designs
3. If don't like: delete and re-import backup
4. Risk-free experimentation!

---

## 🚀 Future Backend Integration

### **Current Status: Local Storage**
- Templates stored in browser (IndexedDB)
- Export/Import for manual sync
- Works offline
- No account needed

### **Future: Database Backend**
When you add a backend later:
- ✅ Automatic sync across devices
- ✅ Real-time updates
- ✅ Team collaboration
- ✅ Cloud backup
- ✅ Access from anywhere
- ✅ User accounts

These export/import features will remain useful for:
- Offline backups
- Sharing with non-users
- Migration between systems
- Emergency recovery

---

## 📊 Quick Reference

### **Export:**
```
Admin → Import/Export Section → Export Templates → Download JSON
```

### **Import:**
```
Admin → Import/Export Section → Import Templates → Choose File → OK
```

### **File Location:**
```
Downloads/photobooth-templates-[timestamp].json
```

### **File Size:**
- No templates: Can't export
- 1-5 templates: ~1-10 MB
- 10+ templates: ~10-50 MB

---

## ✅ Checklist

### **Before Exporting:**
- [ ] All templates saved
- [ ] Templates enabled/disabled as desired
- [ ] Default template set (if applicable)

### **Before Importing:**
- [ ] JSON file downloaded
- [ ] File not corrupted (check size)
- [ ] Admin dashboard open
- [ ] Decided on merge vs replace

### **After Importing:**
- [ ] Check template count increased
- [ ] Preview imported templates
- [ ] Test templates work correctly
- [ ] Enable/disable as needed
- [ ] Set default if required

---

## 🎉 Benefits

✅ **Device Independence** - Use templates anywhere  
✅ **Easy Backup** - Save your work  
✅ **Team Sharing** - Collaborate easily  
✅ **Quick Setup** - New devices ready fast  
✅ **Version Control** - Track changes over time  
✅ **No Internet Required** - Works offline  
✅ **Simple Process** - Just 2 clicks  

---

**Your templates are now portable!** 🚀📱💻

Export once, use everywhere until you add backend sync later! 🎨✨
