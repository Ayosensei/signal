import React, { memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const TILE_ASSETS = [
  'Alpha.png',
  'Clover.png',
  'Eyes.png',
  'Lightbulb.png',
  'Signal Node.png',
  'Mr Observer.png'
]

const Tile = memo(({ 
  r, 
  c, 
  tile, 
  isSelected, 
  isProcessing, 
  onClick, 
  onDragStart, 
  onDragOver, 
  onDrop, 
  onTouchStart, 
  onTouchEnd 
}) => {
  if (!tile) return null
  const tileType = tile.type

  return (
    <motion.div
      layout
      key={tile.id}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: isProcessing ? 1 : 1.05 }}
      whileTap={{ scale: isProcessing ? 1 : 0.9 }}
      transition={{ 
        type: 'spring', 
        stiffness: 400, 
        damping: 30,
        layout: { 
          type: 'spring', 
          stiffness: 500, 
          damping: 30,
          mass: 0.8
        }
      }}
      style={{
        gridRow: r + 1,
        gridColumn: c + 1
      }}
      className={`tile tile-${tileType} ${tile?.special ? 'special-' + tile.special : ''} ${isSelected ? 'selected' : ''}`}
      onClick={() => onClick(r, c)}
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
    </motion.div>
  )
})

export default Tile
