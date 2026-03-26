import React, { useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import Tile from './Tile'

const GameBoard = ({ grid, isProcessing, swapTiles }) => {
  const [selectedTile, setSelectedTile] = useState(null)
  const [isPointerDown, setIsPointerDown] = useState(false)

  const handleTileClick = useCallback((r, c) => {
    if (isProcessing) return
    
    // Deselection logic
    if (selectedTile && selectedTile.r === r && selectedTile.c === c) {
      setSelectedTile(null)
      return
    }

    if (!selectedTile) {
      setSelectedTile({ r, c })
    } else {
      const isAdjacent = Math.abs(selectedTile.r - r) + Math.abs(selectedTile.c - c) === 1
      if (isAdjacent) {
        swapTiles(selectedTile, { r, c })
        setSelectedTile(null)
      } else {
        setSelectedTile({ r, c })
      }
    }
  }, [isProcessing, selectedTile, swapTiles])

  const handlePointerDown = useCallback((r, c) => {
    if (isProcessing) return
    setIsPointerDown(true)
    setSelectedTile({ r, c })
  }, [isProcessing])

  const handlePointerEnter = useCallback((r, c) => {
    if (!isPointerDown || !selectedTile || isProcessing) return
    
    const isAdjacent = Math.abs(selectedTile.r - r) + Math.abs(selectedTile.c - c) === 1
    if (isAdjacent) {
      swapTiles(selectedTile, { r, c })
      setSelectedTile(null)
      setIsPointerDown(false) // Reset after swap
    }
  }, [isPointerDown, selectedTile, isProcessing, swapTiles])

  const handlePointerUp = useCallback(() => {
    setIsPointerDown(false)
  }, [])

  // Global pointer up listener to handle releases outside tiles
  React.useEffect(() => {
    window.addEventListener('pointerup', handlePointerUp)
    return () => window.removeEventListener('pointerup', handlePointerUp)
  }, [handlePointerUp])

  return (
    <div className="board" onPointerLeave={handlePointerUp}>
      <AnimatePresence>
        {grid.flatMap((row, r) => 
          row.map((tile, c) => tile && (
            <Tile
              key={tile.id}
              r={r}
              c={c}
              tile={tile}
              isSelected={selectedTile?.r === r && selectedTile?.c === c}
              isProcessing={isProcessing}
              onClick={handleTileClick}
              onPointerDown={handlePointerDown}
              onPointerEnter={handlePointerEnter}
            />
          ))
        )}
      </AnimatePresence>
    </div>
  )
}

export default GameBoard
