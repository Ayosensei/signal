import React, { useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import Tile from './Tile'

const GameBoard = ({ grid, isProcessing, swapTiles }) => {
  const [selectedTile, setSelectedTile] = useState(null)
  const [touchStart, setTouchStart] = useState(null)

  const handleTileClick = useCallback((r, c) => {
    if (isProcessing) return
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

  const onDragStart = useCallback((e, r, c) => {
    if (isProcessing) return
    e.dataTransfer.setData('tile', JSON.stringify({ r, c }))
    setSelectedTile({ r, c })
  }, [isProcessing])

  const onDragOver = useCallback((e) => e.preventDefault(), [])

  const onDrop = useCallback((e, r, c) => {
    e.preventDefault()
    if (isProcessing) return
    const draggedTile = JSON.parse(e.dataTransfer.getData('tile'))
    const isAdjacent = Math.abs(draggedTile.r - r) + Math.abs(draggedTile.c - c) === 1
    if (isAdjacent) {
      swapTiles(draggedTile, { r, c })
      setSelectedTile(null)
    }
  }, [isProcessing, swapTiles])

  const onTouchStart = useCallback((e, r, c) => {
    if (isProcessing) return
    setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY, r, c })
    setSelectedTile({ r, c })
  }, [isProcessing])

  const onTouchEnd = useCallback((e) => {
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
      if (targetR >= 0 && grid.length > 0 && targetR < grid.length && targetC >= 0 && targetC < grid[0].length) {
        swapTiles({ r: touchStart.r, c: touchStart.c }, { r: targetR, c: targetC })
        setSelectedTile(null)
      }
    }
    setTouchStart(null)
  }, [isProcessing, touchStart, swapTiles, grid])

  return (
    <div className="board">
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
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDrop={onDrop}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            />
          ))
        )}
      </AnimatePresence>
    </div>
  )
}

export default GameBoard
