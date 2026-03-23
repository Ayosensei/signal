/**
 * App.jsx — THE SIGNAL
 * Core game engine for a match-3 movement disguised as a game.
 * Features: 8x8 Grid, Recursive Cascadence, Multi-Input Support, Cinematic Navigation.
 */

import { useState, useEffect, useCallback } from 'react'
import './index.css'

// --- Configuration ---
const GRID_SIZE = 8
const NORMAL_TILE_TYPES = 5 // Types 0 to 4 are normal assets
const OBSERVER_TYPE = 5 // Special Mr. Observer tile

// --- Constants ---
const TILE_ASSETS = [
  'Alpha.png',
  'Clover.png',
  'Eyes.png',
  'Lightbulb.png',
  'Signal Node.png', // Index 4 (was 5)
  'Mr Observer.png'  // Index 5 (was 4)
]

function App() {
  // --- [STATE] ---
  const [view, setView] = useState('splash') // Current View: 'splash', 'game', 'about'
  const [grid, setGrid] = useState([])
  const [selectedTile, setSelectedTile] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Game Stats
  const [score, setScore] = useState(12450)
  const [highScore, setHighScore] = useState(12450)

  // --- [GAME INITIALIZATION] ---

  /**
   * Generates a randomized 8x8 board.
   * Ensures no natural matches exist at start-up.
   */
  const generateBoard = useCallback(() => {
    const newGrid = []
    for (let r = 0; r < GRID_SIZE; r++) {
      const row = []
      for (let c = 0; c < GRID_SIZE; c++) {
        // Only spawn normal tiles (0 to 4)
        row.push({ type: Math.floor(Math.random() * NORMAL_TILE_TYPES), special: null })
      }
      newGrid.push(row)
    }

    // Pattern Check: Regenerate if matches exist naturally
    while (findMatchGroups(newGrid).length > 0) {
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          newGrid[r][c] = { type: Math.floor(Math.random() * NORMAL_TILE_TYPES), special: null }
        }
      }
    }
    setGrid(newGrid)
  }, [])

  useEffect(() => {
    generateBoard()
  }, [generateBoard])

  // --- [ADVANCED MATCH DETECTION] ---

  /**
   * Scans the grid and groups connected orthogonal matches.
   * This allows detection of Match-4, Match-5, and L/T shapes.
   * @returns {Array} Array of match groups (each group is a Set of coordinates 'r,c' and metadata)
   */
  const findMatchGroups = (currentGrid) => {
    const horizontalMatches = []
    const verticalMatches = []

    // 1. Find all horizontal lines of 3+
    for (let r = 0; r < GRID_SIZE; r++) {
      let matchCount = 1
      for (let c = 0; c < GRID_SIZE; c++) {
        const current = currentGrid[r][c]
        const next = c < GRID_SIZE - 1 ? currentGrid[r][c + 1] : null
        
        if (current && next && current.type === next.type && current.type !== null && current.type !== OBSERVER_TYPE) {
          matchCount++
        } else {
          if (matchCount >= 3) {
            const line = []
            for (let i = 0; i < matchCount; i++) line.push({ r, c: c - i })
            horizontalMatches.push(line)
          }
          matchCount = 1
        }
      }
    }

    // 2. Find all vertical lines of 3+
    for (let c = 0; c < GRID_SIZE; c++) {
      let matchCount = 1
      for (let r = 0; r < GRID_SIZE; r++) {
        const current = currentGrid[r][c]
        const next = r < GRID_SIZE - 1 ? currentGrid[r + 1][c] : null
        
        if (current && next && current.type === next.type && current.type !== null && current.type !== OBSERVER_TYPE) {
          matchCount++
        } else {
          if (matchCount >= 3) {
            const line = []
            for (let i = 0; i < matchCount; i++) line.push({ r: r - i, c })
            verticalMatches.push(line)
          }
          matchCount = 1
        }
      }
    }

    const allLines = [...horizontalMatches, ...verticalMatches]
    if (allLines.length === 0) return []

    // 3. Group intersecting lines of the same color
    const groups = []
    const visitedIndices = new Set()

    for (let i = 0; i < allLines.length; i++) {
      if (visitedIndices.has(i)) continue
      
      const currentGroup = new Set(allLines[i].map(pt => `${pt.r},${pt.c}`))
      const type = currentGrid[allLines[i][0].r][allLines[i][0].c].type
      let addedToGroup = true
      
      while (addedToGroup) {
        addedToGroup = false
        for (let j = i + 1; j < allLines.length; j++) {
          if (visitedIndices.has(j)) continue
          const otherLineType = currentGrid[allLines[j][0].r][allLines[j][0].c].type
          if (type !== otherLineType) continue
          
          const hasIntersection = allLines[j].some(pt => currentGroup.has(`${pt.r},${pt.c}`))
          if (hasIntersection) {
            allLines[j].forEach(pt => currentGroup.add(`${pt.r},${pt.c}`))
            visitedIndices.add(j)
            addedToGroup = true
          }
        }
      }
      
      groups.push({
        coords: Array.from(currentGroup).map(str => {
          const [r, c] = str.split(',').map(Number)
          return { r, c }
        }),
        type: type,
        linesInvolved: horizontalMatches.filter(l => l.some(pt => currentGroup.has(`${pt.r},${pt.c}`))).length + 
                       verticalMatches.filter(l => l.some(pt => currentGroup.has(`${pt.r},${pt.c}`))).length,
        maxLength: Math.max(...allLines.filter(l => l.some(pt => currentGroup.has(`${pt.r},${pt.c}`))).map(l => l.length))
      })
    }
    
    return groups
  }

  // --- [GAME LOOP: CASCADE LOGIC] ---

  /**
   * Applies gravity, refills the board, and recurses matches.
   */
  const handleGravityAndRefill = async (currentGrid) => {
    const newGrid = currentGrid.map(row => [...row])
    
    // 2. GRAVITY: Shift tiles down
    for (let c = 0; c < GRID_SIZE; c++) {
      let emptyRow = GRID_SIZE - 1
      for (let r = GRID_SIZE - 1; r >= 0; r--) {
        if (newGrid[r][c] !== null) {
          const val = newGrid[r][c]
          newGrid[r][c] = null
          newGrid[emptyRow][c] = val
          emptyRow--
        }
      }
    }
    setGrid([...newGrid])
    await new Promise(resolve => setTimeout(resolve, 200))

    // 3. REFILL: New tiles from top
    for (let c = 0; c < GRID_SIZE; c++) {
      for (let r = 0; r < GRID_SIZE; r++) {
        if (newGrid[r][c] === null) {
          newGrid[r][c] = { type: Math.floor(Math.random() * NORMAL_TILE_TYPES), special: null }
        }
      }
    }
    setGrid([...newGrid])
    await new Promise(resolve => setTimeout(resolve, 300))

    // 4. RECURSION
    handleMatches(newGrid)
  }

  /**
   * Core Game Loop: Clears matches, spawns special tiles, then triggers gravity.
   */
  const handleMatches = async (currentGrid, swapPos1 = null, swapPos2 = null) => {
    const groups = findMatchGroups(currentGrid)
    if (groups.length === 0) {
      setIsProcessing(false) // Finish cascade loop
      return
    }

    setIsProcessing(true) // Lock inputs

    // 1. CLEAR & SPAWN
    const newGrid = currentGrid.map(row => [...row])
    let clearedCount = 0

    groups.forEach(group => {
      clearedCount += group.coords.length
      
      let specialToSpawn = null
      if (group.maxLength >= 5) {
        specialToSpawn = OBSERVER_TYPE
      }

      // Determine spawn coordinate (prioritize user swap location)
      let spawnCoord = group.coords[0]
      if (swapPos1 && swapPos2) {
        const inGroup1 = group.coords.some(pt => pt.r === swapPos1.r && pt.c === swapPos1.c)
        const inGroup2 = group.coords.some(pt => pt.r === swapPos2.r && pt.c === swapPos2.c)
        if (inGroup1) spawnCoord = swapPos1
        else if (inGroup2) spawnCoord = swapPos2
      }

      // Clear the tiles
      group.coords.forEach(({ r, c }) => {
        newGrid[r][c] = null
      })

      // Inject special tile
      if (specialToSpawn !== null) {
        newGrid[spawnCoord.r][spawnCoord.c] = { type: specialToSpawn, special: null }
      }
    })

    setGrid(newGrid)
    setScore(prev => prev + clearedCount * 10)

    await new Promise(resolve => setTimeout(resolve, 300))

    await handleGravityAndRefill(newGrid)
  }

  // --- [INPUT HANDLERS] ---

  /**
   * Swaps two adjacent tiles if it results in a match.
   * Auto-reverts if no match occurs.
   * Handles Special Tile activations.
   */
  const swapTiles = async (tile1, tile2) => {
    setIsProcessing(true)
    const newGrid = [...grid.map(row => [...row])]
    const temp = newGrid[tile1.r][tile1.c]
    newGrid[tile1.r][tile1.c] = newGrid[tile2.r][tile2.c]
    newGrid[tile2.r][tile2.c] = temp

    // SPECIAL: Check if Observer is activated
    const t1IsObserver = newGrid[tile1.r][tile1.c].type === OBSERVER_TYPE
    const t2IsObserver = newGrid[tile2.r][tile2.c].type === OBSERVER_TYPE

    if (t1IsObserver || t2IsObserver) {
       setGrid(newGrid)
       await new Promise(resolve => setTimeout(resolve, 200))
       
       const targetColor = t1IsObserver ? newGrid[tile2.r][tile2.c].type : newGrid[tile1.r][tile1.c].type
       
       const clearedGrid = newGrid.map(row => [...row])
       let clearedCount = 0
       for (let r = 0; r < GRID_SIZE; r++) {
         for (let c = 0; c < GRID_SIZE; c++) {
           if (clearedGrid[r][c] && (clearedGrid[r][c].type === targetColor || clearedGrid[r][c].type === OBSERVER_TYPE)) {
             clearedGrid[r][c] = null
             clearedCount++
           }
         }
       }
       setGrid(clearedGrid)
       setScore(prev => prev + clearedCount * 10)
       await new Promise(resolve => setTimeout(resolve, 300))
       
       await handleGravityAndRefill(clearedGrid)
       return
    }

    // NORMAL SWAP
    const groups = findMatchGroups(newGrid)
    if (groups.length > 0) {
      setGrid(newGrid)
      await handleMatches(newGrid, tile1, tile2)
    } else {
      // Revert logic
      setGrid(newGrid)
      await new Promise(resolve => setTimeout(resolve, 200))
      const revertedGrid = [...grid.map(row => [...row])]
      setGrid(revertedGrid)
      setIsProcessing(false)
    }
  }

  const handleTileClick = (r, c) => {
    if (isProcessing) return

    if (!selectedTile) {
      setSelectedTile({ r, c })
    } else {
      const isAdjacent =
        Math.abs(selectedTile.r - r) + Math.abs(selectedTile.c - c) === 1

      if (isAdjacent) {
        swapTiles(selectedTile, { r, c })
        setSelectedTile(null)
      } else {
        setSelectedTile({ r, c })
      }
    }
  }

  // --- [MULTI-INPUT: DRAG & SWIPE] ---

  const [touchStart, setTouchStart] = useState(null)

  const onDragStart = (e, r, c) => {
    if (isProcessing) return
    e.dataTransfer.setData('tile', JSON.stringify({ r, c }))
    setSelectedTile({ r, c })
  }

  const onDragOver = (e) => e.preventDefault()

  const onDrop = (e, r, c) => {
    e.preventDefault()
    if (isProcessing) return
    const draggedTile = JSON.parse(e.dataTransfer.getData('tile'))
    const isAdjacent = Math.abs(draggedTile.r - r) + Math.abs(draggedTile.c - c) === 1

    if (isAdjacent) {
      swapTiles(draggedTile, { r, c })
      setSelectedTile(null)
    }
  }

  const onTouchStart = (e, r, c) => {
    if (isProcessing) return
    setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY, r, c })
    setSelectedTile({ r, c })
  }

  const onTouchEnd = (e) => {
    if (!touchStart || isProcessing) return
    const touchEnd = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY }
    const dx = touchEnd.x - touchStart.x
    const dy = touchEnd.y - touchStart.y
    const absDx = Math.abs(dx)
    const absDy = Math.abs(dy)

    if (Math.max(absDx, absDy) > 30) {
      let targetR = touchStart.r
      let targetC = touchStart.c
      if (absDx > absDy) targetC += dx > 0 ? 1 : -1
      else targetR += dy > 0 ? 1 : -1

      if (targetR >= 0 && targetR < GRID_SIZE && targetC >= 0 && targetC < GRID_SIZE) {
        swapTiles({ r: touchStart.r, c: touchStart.c }, { r: targetR, c: targetC })
        setSelectedTile(null)
      }
    }
    setTouchStart(null)
  }

  // --- [RENDER VIEWS] ---

  // 1. ABOUT PAGE (Project Manifesto)
  if (view === 'about') {
    return (
      <div className="about-page">
        <div className="top-bar">
          <div className="logo-text">SIGNAL</div>
          <div className="close-about" onClick={() => setView('splash')}>✕</div>
        </div>

        <div className="about-content">
          <div className="about-hero">
            <h1 className="about-title">NOT LUCK.<br />DIVINE TIMING.</h1>
            <p className="about-subtitle">A signal disguised as a memecoin. For the ones who see it early.</p>
          </div>

          <section className="about-section">
            <h2 className="section-header">THE NARRATIVE</h2>
            <p className="section-text">
              In a world of noise, most look for luck. We look for patterns.
              The <strong>Clover Boys</strong> movement is built on the belief that timing is everything.
              It's about recognition — of the signal, of the community, and of the moment before the world catches up.
            </p>
          </section>

          <section className="about-section">
            <h2 className="section-header">THE 5 PILLARS</h2>
            <div className="pillars-grid">
              <div className="pillar-card">
                <h3>01 DIVINE TIMING</h3>
                <p>The universe doesn't happen to you; it happens for you. Recognition is the only tool you need.</p>
              </div>
              <div className="pillar-card">
                <h3>02 COMMUNITY FIRST</h3>
                <p>Ran by the people. For the people. A collective consciousness focused on the long-term signal.</p>
              </div>
              <div className="pillar-card">
                <h3>03 NO RUG CULTURE</h3>
                <p>Transparency isn't a feature; it's the foundation. We are here to build, not to blink.</p>
              </div>
              <div className="pillar-card">
                <h3>04 LONG-TERM ALIGNMENT</h3>
                <p>For the ones who stay early. Conviction is the highest form of intelligence.</p>
              </div>
              <div className="pillar-card">
                <h3>05 QUIET SIGNAL</h3>
                <p>Quiet, smart, focused, early, intentional. The loudest rooms often have nothing to say.</p>
              </div>
            </div>
          </section>

          <section className="about-section observer-focus">
            <div className="observer-info">
              <h2 className="section-header">THE OBSERVER</h2>
              <p className="section-text">
                He is the silent witness. He doesn't gamble; he waits.
                He is the symbol of pattern detection in a chaotic market.
                "You're either early or you're watching."
              </p>
            </div>
            <div className="observer-media">
              <img src="/mr-observer.png" alt="Mr. Observer" className="mr-observer-img" />
            </div>
          </section>

          <section className="about-section cta-box">
            <a href="https://cloverboys.vercel.app/" target="_blank" rel="noopener noreferrer" className="main-site-btn">
              EXPLORE THE MAIN HUB
            </a>
          </section>
        </div>

        <div className="footer-nav">
          <div className="nav-item active" onClick={() => setView('about')}>
            <span className="nav-icon">⌂</span>
            <span className="nav-label">HOME</span>
          </div>
          <div className="nav-item" onClick={() => setView('game')}>
            <span className="nav-icon">🎮</span>
            <span className="nav-label">PLAY</span>
          </div>
          <div className="nav-item">
            <span className="nav-icon">⚙</span>
            <span className="nav-label">SETTINGS</span>
          </div>
        </div>
      </div>
    )
  }

  // 2. SPLASH SCREEN (Home Page)
  if (view === 'splash') {
    return (
      <div className="splash-screen">
        <div className="top-bar">
          <div className="logo-text">SIGNAL</div>
          <div className="high-score-display">HIGH-SCORE: {highScore.toLocaleString()}</div>
          <div className="menu-icon">
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
        </div>

        <div className="main-content">
          <div className="diagnostics-card">
            <p className="diag-header">SYSTEM DIAGNOSTICS</p>
            <p>ENCRYPTION: ACTIVE</p>
            <p>PULSE_LOAD: 88.4%</p>
          </div>

          <div className="center-branding">
            <h1 className="hero-title">SIGNAL</h1>
            <p className="hero-tagline">NOT LUCK &gt; TIMING</p>
          </div>

          <div className="action-buttons">
            <button className="start-game-btn" onClick={() => setView('game')}>
              START GAME
            </button>
            <p className="tutorial-link">INITIALIZE TUTORIAL</p>
          </div>
        </div>

        <div className="bottom-info">
          <div className="version-info">VER_2.0.84_STABLE | LATENCY: 12MS</div>
          <div className="copyright">© 2124 SYNTHETIC PULSE LABS. ALL TRANSMISSIONS MONITORED.</div>
        </div>

        <div className="footer-nav">
          <div className="nav-item" onClick={() => setView('about')}>
            <span className="nav-icon">⌂</span>
            <span className="nav-label">HOME</span>
          </div>
          <div className="nav-item active" onClick={() => setView('game')}>
            <span className="nav-icon">🎮</span>
            <span className="nav-label">PLAY</span>
          </div>
          <div className="nav-item">
            <span className="nav-icon">⚙</span>
            <span className="nav-label">SETTINGS</span>
          </div>
        </div>
      </div>
    )
  }

  // 3. GAME VIEW (Main 8x8 Grid)
  return (
    <div className="app-container">
      <div className="game-header">
        <div className="header-left">
          <h1 className="game-title">SIGNAL</h1>
          <div className="game-score">SCORE: {score.toLocaleString()}</div>
        </div>
        <div className="header-right">
          <div className="header-icon">⏸</div>
          <div className="header-icon">≡</div>
        </div>
      </div>

      <div className="game-main-layout">
        <aside className="game-sidebar">
          <div className="powerup-card">
            <span className="powerup-icon">💣</span>
            <span className="powerup-count">03</span>
          </div>
          <div className="powerup-card">
            <span className="powerup-icon">⚡</span>
            <span className="powerup-count">01</span>
          </div>
          <div className="powerup-card">
            <span className="powerup-icon">🖐</span>
            <span className="powerup-count">05</span>
          </div>
        </aside>

        <div className="board-container">
          <div className="board">
            {grid.map((row, r) => (
              row.map((tile, c) => {
                const isSelected = selectedTile?.r === r && selectedTile?.c === c
                const hasTag = r === 0 && c === 7 
                
                // Safe extraction of the tile type
                const tileType = tile ? tile.type : null
                
                return (
                  <div
                    key={`${r}-${c}`}
                    className={`tile tile-${tileType} ${isSelected ? 'selected' : ''} ${tile === null ? 'cleared' : ''}`}
                    onClick={() => handleTileClick(r, c)}
                    draggable={!isProcessing}
                    onDragStart={(e) => onDragStart(e, r, c)}
                    onDragOver={onDragOver}
                    onDrop={(e) => onDrop(e, r, c)}
                    onTouchStart={(e) => onTouchStart(e, r, c)}
                    onTouchEnd={onTouchEnd}
                    data-row={r}
                    data-col={c}
                  >
                    <div className="tile-icon">
                      {tileType !== null && (
                        <img
                          src={`/tiles/${TILE_ASSETS[tileType]}`}
                          alt={`Tile ${tileType}`}
                          className="tile-img"
                        />
                      )}
                    </div>
                    {hasTag && <div className="tile-tag">24</div>}
                  </div>
                )
              })
            ))}
          </div>
        </div>
      </div>

      <div className="footer-nav">
        <div className="nav-item" onClick={() => setView('about')}>
          <span className="nav-icon">⌂</span>
          <span className="nav-label">HOME</span>
        </div>
        <div className="nav-item active" onClick={() => setView('game')}>
          <span className="nav-icon">🎮</span>
          <span className="nav-label">PLAY</span>
        </div>
        <div className="nav-item">
          <span className="nav-icon">⚙</span>
          <span className="nav-label">SETTINGS</span>
        </div>
      </div>
    </div>
  )
}

export default App
