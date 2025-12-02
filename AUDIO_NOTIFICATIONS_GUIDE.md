## 🎵 Audio Notifications Guide

### How Audio Notifications Work

Your messaging app now plays notification sounds to alert you when:

#### 1. **Message Send Sound** 📤
- **When:** Every time you send a message
- **Sound Type:** Soft "ping" sound
- **Volume:** 50%
- **Purpose:** Immediate feedback that your message was sent

#### 2. **Message Receive Sound** 📥
- **When:** When you receive a new message
- **Sound Type:** Gentle notification chime
- **Volume:** 60%
- **Plays in:**
  - Messages page when polling detects new messages
  - Notification bell when unread count increases
  - Header notification center

---

### Audio Notification Triggers

| Action | Sound | Location |
|--------|-------|----------|
| Send message | Send ping | Messages page |
| Receive message (in chat) | Receive chime | Messages page |
| Receive message (not in chat) | Receive chime | Notification bell header |
| New unread messages arrive | Receive chime | All pages (if notification bell visible) |

---

### Features

✅ **Automatic Playback**
- No settings needed - sounds play automatically
- Works across all browsers that support Web Audio API

✅ **Non-Intrusive**
- Moderate volume levels (50-60%)
- Doesn't interfere with system sounds
- Respects browser autoplay policies

✅ **Smart Timing**
- Prevents duplicate notifications using message ID tracking
- Only plays on actual new messages, not on refresh
- Won't spam if multiple messages arrive

✅ **Fallback Handling**
- Gracefully handles cases where audio can't play
- Browser autoplay restrictions respected
- Snackbar notifications still appear as backup

---

### Browser Requirements

Audio notifications work on all modern browsers:
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari 14.5+, Chrome Android)

---

### Troubleshooting Audio Notifications

**I don't hear any sounds**

1. Check browser volume isn't muted
2. Check system volume isn't muted
3. Check browser notification permissions
4. Refresh the page
5. Some browsers require user interaction before playing audio - click somewhere on the page first

**Sound is too loud/quiet**

You can adjust the hook in `/client/src/hooks/useAudio.js`:
- Send sound volume: line 14 (default: 0.5)
- Receive sound volume: line 17 (default: 0.6)

**Only getting snackbar, no sound**

- Browser may have autoplay disabled (common in some configurations)
- Snackbar notification is the fallback - you'll still know about new messages
- Click the notification bell to see all unread messages

---

### Sound Quality & Format

- Sounds use optimized WAV format embedded as data URIs
- Minimal file size for fast playback
- No network requests needed
- Instant playback with <100ms latency

---

### Tips

💡 **For Busy Environments:**
- Keep notification sounds enabled to stay updated
- Visual badges (red dots) also appear even if sound doesn't play

💡 **For Quiet Environments:**
- Adjust browser volume to low level
- Snackbar notifications appear regardless of sound

💡 **For Power Users:**
- Different sound pitches for send vs receive help you distinguish message direction
- Audio plays in addition to visual notifications for redundancy

