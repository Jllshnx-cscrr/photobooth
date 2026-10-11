# Countdown Timer Selection Guide

## 📸 Choose Your Photo Capture Speed

Your Photo Booth now includes **customizable countdown timers**! Users can select how much time they want between each photo capture.

---

## ⏱️ Available Timer Options

### ⚡ 3 Seconds - Fast & Fun
- **Best for**: Quick sessions, energetic groups
- **Total session time**: ~24 seconds (8 photos)
- **Perfect for**: Kids, parties, high-energy events
- **Pros**: Fast-paced, exciting, multiple poses quickly
- **Cons**: Less time to prepare between photos

### ⏱️ 5 Seconds - Balanced (Default)
- **Best for**: Most situations, general use
- **Total session time**: ~40 seconds (8 photos)
- **Perfect for**: Weddings, events, casual photoshoots
- **Pros**: Good balance of speed and preparation time
- **Cons**: None - this is the sweet spot

### ⏰ 10 Seconds - Relaxed
- **Best for**: Formal events, costume changes, props
- **Total session time**: ~80 seconds (8 photos)
- **Perfect for**: Formal events, complex poses, costume swaps
- **Pros**: Plenty of time to adjust, change props, strike poses
- **Cons**: Slower session, may lose momentum

---

## 🎯 How to Use

### Step 1: Welcome Screen
1. When you open the Photo Booth, you'll see the welcome screen
2. Look for the "Choose Countdown Timer" section
3. You'll see three options with icons:
   - ⚡ 3 seconds (Fast)
   - ⏱️ 5 seconds (Default)
   - ⏰ 10 seconds (Relaxed)

### Step 2: Select Your Timer
- Click on any timer button to select it
- The selected button will be **larger** and **highlighted**
- You can change your selection as many times as you want

### Step 3: Start Session
- Click "START PHOTO SESSION" button
- The camera will use your selected countdown time

### Step 4: During Capture
- You'll see the countdown timer clearly displayed
- Each photo will have the same countdown duration
- The header shows: "Timer: X seconds between photos"

---

## 💡 Tips for Different Timers

### For 3-Second Timer (⚡):
- **Have poses planned** in advance
- Keep props **simple and accessible**
- Works great for **silly faces** and **quick reactions**
- Best with **minimal costume changes**
- Creates an **exciting, fast-paced** atmosphere

### For 5-Second Timer (⏱️):
- **Standard recommended** setting
- Good for **most situations**
- Enough time for **pose changes**
- Works with **simple props**
- Balances **fun and preparation**

### For 10-Second Timer (⏰):
- Perfect for **elaborate poses**
- Time for **costume or prop changes**
- Great for **group coordination**
- Allows for **careful composition**
- Ideal for **formal events**

---

## 🎨 Use Cases by Event Type

### Birthday Parties
**Recommended**: ⚡ 3 seconds
- Kids love the fast pace
- Quick, fun, energetic
- Captures spontaneous reactions

### Weddings
**Recommended**: ⏱️ 5 seconds or ⏰ 10 seconds
- Time for formal poses
- Guests can adjust attire
- More elegant, controlled

### Corporate Events
**Recommended**: ⏱️ 5 seconds
- Professional but fun
- Quick enough to maintain flow
- Time for proper poses

### Costume Parties
**Recommended**: ⏰ 10 seconds
- Time to adjust costumes
- Change props between photos
- Complex outfit coordination

### School Events
**Recommended**: ⚡ 3 seconds or ⏱️ 5 seconds
- Keeps students engaged
- Prevents line backup
- Fun and dynamic

---

## 🔧 Technical Details

### How It Works
1. User selects countdown duration on welcome screen
2. Selection is stored in SessionContext
3. CameraCapture component uses the selected duration
4. Same countdown applies to all 8 photos in the session

### Countdown Display
- **Large numbers** appear on screen
- Numbers **pulse** to draw attention
- Current photo progress shown
- Timer setting displayed in header

### Session Consistency
- Once selected, timer applies to entire session
- All 8 photos use the same countdown
- Cannot change mid-session (prevents confusion)
- New session allows new timer selection

---

## 🎥 Photo Capture Process

### Timeline Example (5-second timer):
```
1. Camera activates → Ready
2. Countdown: 5... 4... 3... 2... 1... 📸
3. Photo 1 captured → Flash effect
4. Countdown: 5... 4... 3... 2... 1... 📸
5. Photo 2 captured → Flash effect
6. ... (repeat for 8 photos total)
7. Automatically advance to photo selection
```

### What Users See:
- ✅ **Large countdown numbers** (clear visibility)
- ✅ **Progress indicator** (Photo X of 8)
- ✅ **Thumbnail gallery** (see captured photos)
- ✅ **Timer reminder** in header
- ✅ **Progress bar** showing session completion

---

## 🎭 Suggested Poses by Timer

### 3-Second Timer Poses
1. Big smile
2. Funny face
3. Thumbs up
4. Peace sign
5. Wink
6. Surprised face
7. Silly tongue out
8. Happy dance

### 5-Second Timer Poses
1. Classic smile
2. Group hug
3. Jump shot
4. Silly pose
5. Serious face
6. Prop use (simple)
7. Turn around
8. Wave goodbye

### 10-Second Timer Poses
1. Formal portrait
2. Change hat/accessory
3. Complex group arrangement
4. Multiple prop setup
5. Costume adjustment
6. Choreographed pose
7. Switch positions
8. Final group shot

---

## 🚨 Common Questions

### Can I change the timer mid-session?
**No** - Timer is set at the start and applies to all 8 photos. This prevents confusion and ensures consistent pacing. Start a new session to choose a different timer.

### Why are these the only options?
3, 5, and 10 seconds cover the range from fast-paced fun to relaxed formal. More options would be overwhelming without adding much value.

### Can I add custom timer durations?
Yes! Edit `src/components/WelcomeScreen.tsx` and add to the `timerOptions` array:
```tsx
const timerOptions = [
  { value: 3, label: '3 seconds', icon: '⚡' },
  { value: 5, label: '5 seconds', icon: '⏱️' },
  { value: 7, label: '7 seconds', icon: '⏲️' }, // NEW
  { value: 10, label: '10 seconds', icon: '⏰' }
];
```

### Does the timer affect download/print?
**No** - The timer only affects the capture process. Final output quality and features remain the same regardless of timer selection.

---

## 🎨 Customization

### Change Default Timer
Edit `src/contexts/SessionContext.tsx`:
```tsx
const [countdownSeconds, setCountdownSeconds] = useState<number>(5); // Change default here
```

### Add More Timer Options
Edit `src/components/WelcomeScreen.tsx`:
```tsx
const timerOptions = [
  { value: 2, label: '2 seconds', icon: '💨' },
  { value: 3, label: '3 seconds', icon: '⚡' },
  { value: 5, label: '5 seconds', icon: '⏱️' },
  { value: 7, label: '7 seconds', icon: '⏲️' },
  { value: 10, label: '10 seconds', icon: '⏰' },
  { value: 15, label: '15 seconds', icon: '🕐' }
];
```

### Change Button Styling
The timer buttons use Tailwind classes. Edit `src/components/WelcomeScreen.tsx` or add custom styles in `src/custom.css`:

```css
/* Customize timer selection buttons */
.timer-button-selected {
  background: linear-gradient(135deg, #667eea, #764ba2);
  transform: scale(1.15);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.timer-button-unselected {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
}
```

---

## 📊 Recommendations Summary

| Event Type | Recommended Timer | Why |
|------------|------------------|-----|
| Kids Party | 3s ⚡ | Fast, energetic |
| Wedding | 5s or 10s ⏱️⏰ | Formal, composed |
| Corporate | 5s ⏱️ | Professional, efficient |
| Costume Party | 10s ⏰ | Time for changes |
| School Event | 3s or 5s ⚡⏱️ | Fun, quick flow |
| General Use | 5s ⏱️ | Best balance |

---

## 🎉 Feature Benefits

✅ **User Control**: Let users choose their preferred pace  
✅ **Flexibility**: Works for all event types  
✅ **Clear Feedback**: Visual timer selection and countdown display  
✅ **Consistent Experience**: Same timing throughout session  
✅ **Easy to Use**: Simple 3-option selection  
✅ **Professional**: Adapts to formal or casual events  

---

**Enjoy your customizable Photo Booth experience!** 📸✨
