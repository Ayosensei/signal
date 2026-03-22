# Signal — MVP Dev Breakdown

## 🎯 Project Goal
Build a **6x6 match-3 web game** with:
- 3 modes (Observation, Signal, Conviction)
- 1 special tile (Mr. Observer)
- Clean Clover Boys branding
- Smooth, bug-free gameplay

---

## 🧱 SYSTEM ARCHITECTURE (Simple Mental Model)

Think of your game like this:
- Game
- ├── Board (grid + tiles)
- ├── Input (click + swap)
- ├── Match Engine
- ├── Gravity System
- ├── Score System
- ├── Game Modes
- ├── Special Tile (Observer)
- └── UI Layer


---

## ⚙️ CORE FEATURES (Build Order Priority)

### 🔵 PRIORITY 1 — Board System
**Goal:** Display a working 6x6 grid

**Tasks:**
- [ ] Create 6x6 array
- [ ] Assign random tile types (5 types)
- [ ] Render tiles on screen
- [ ] Store tile position (row, col)

**Output:**  
Static grid visible

---

### 🟢 PRIORITY 2 — Input + Swap
**Goal:** Player can interact

**Tasks:**
- [ ] Click/select tile
- [ ] Select second adjacent tile
- [ ] Swap positions
- [ ] Animate swap (basic)

**Rules:**
- Only allow adjacent swaps

**Output:**  
Tiles can move

---

### 🟡 PRIORITY 3 — Match Detection (🔥 CRITICAL)
**Goal:** Detect 3+ matches

**Tasks:**
- [ ] Check horizontal matches
- [ ] Check vertical matches
- [ ] Mark matched tiles

**Output:**  
Game knows when a match happens

---

### 🟠 PRIORITY 4 — Clear + Gravity
**Goal:** Make board dynamic

**Tasks:**
- [ ] Remove matched tiles
- [ ] Drop tiles downward
- [ ] Spawn new tiles from top
- [ ] Repeat until stable

**Output:**  
Real match-3 behavior

---

### 🔴 PRIORITY 5 — Score System
**Goal:** Track progress

**Tasks:**
- [ ] Add score variable
- [ ] Apply scoring rules:
  - 3 = 30
  - 4 = 50
  - 5+ = 80
- [ ] Add combo bonus

**Output:**  
Score updates live

---

## 🎮 GAME MODES (After Core Works)

### 🟢 Observation Mode
- [ ] Endless play loop

---

### 🟡 Signal Mode
- [ ] Add timer (60s)
- [ ] End game at 0

---

### 🔴 Conviction Mode
- [ ] Add move counter
- [ ] Add target score
- [ ] End on win/lose

---

## 🌟 SPECIAL SYSTEM — MR. OBSERVER TILE

### 🎯 Behavior (MVP)
- Spawn when:
  - [ ] Player creates 5-match

- When matched:
  - [ ] Clear all tiles of one type

---

### Tasks:
- [ ] Detect 5-match
- [ ] Replace one tile with Observer tile
- [ ] Add special logic on match
- [ ] Add visual distinction

---

## 🧠 UI SYSTEM

### 🎮 Menu
- [ ] Game title (Signal)
- [ ] Mode selection
- [ ] Start button

---

### 🕹️ In-Game
- [ ] Score display
- [ ] Timer (Signal mode)
- [ ] Moves + goal (Conviction)
- [ ] Restart button

---

### 🏁 End Screen
- [ ] Final score
- [ ] Replay button
- [ ] Back to menu

---

## 🎨 VISUAL TASKS (Keep It Minimal)

### Tiles:
- [ ] Create 5 icons (simple shapes first)
- [ ] Add green glow effect later

### Background:
- [ ] Dark (#0B0B0B)

### Effects:
- [ ] Match fade
- [ ] Tile drop animation

---

## 🧩 NARRATIVE LAYER (Optional but Powerful)

### Trigger Lines:
- [ ] After combos
- [ ] End screen

**Examples:**
- “you’re early”
- “not luck. timing.”
- “most won’t see this yet”

---

## 🚫 DO NOT BUILD (MVP TRAPS)

- ❌ Wallet connect  
- ❌ Leaderboards  
- ❌ Multiplayer  
- ❌ Multiple special tiles  
- ❌ Complex power-ups  
- ❌ Backend  

---

## ⏱️ REALISTIC TIMELINE

| Phase | Time |
|------|------|
| Setup + Grid | 2–3 days |
| Swap + Match | 3–5 days |
| Gravity + Score | 2–3 days |
| Modes | 2–3 days |
| Observer + UI | 3–5 days |

**Total:** ~2–3 weeks

---

## 🧪 TESTING CHECKLIST

- [ ] No broken swaps  
- [ ] No infinite loops  
- [ ] No disappearing tiles bug  
- [ ] Matches always detected correctly  
- [ ] Board always refills  
- [ ] Game modes end properly  
- [ ] Observer tile works  

---

## 🎯 MILESTONES

### Milestone 1:
Grid shows on screen

### Milestone 2:
Tiles swap

### Milestone 3:
Matches detected

### Milestone 4:
Tiles fall + refill

### Milestone 5:
Game fully playable

### Milestone 6:
Modes working

### Milestone 7:
Observer tile working