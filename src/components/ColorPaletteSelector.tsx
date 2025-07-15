import React from 'react';
import { colorPalettes, ColorPalette } from '../appearance/ColorPalette';

interface ColorPaletteSelectorProps {
  selectedPaletteId: string;
  onPaletteChange: (paletteId: string) => void;
}

export function ColorPaletteSelector({ selectedPaletteId, onPaletteChange }: ColorPaletteSelectorProps) {
  return (
    <div className="form-group">
      <label>Color Theme</label>
      <div className="palette-selector">
        {colorPalettes.map((palette) => (
          <div
            key={palette.id}
            className={`palette-option ${selectedPaletteId === palette.id ? 'selected' : ''}`}
            onClick={() => onPaletteChange(palette.id)}
            title={palette.name}
          >
            <div className="palette-preview">
              <div 
                className="palette-color" 
                style={{ backgroundColor: palette.colors.backgroundPrimary }}
              />
              <div 
                className="palette-color" 
                style={{ backgroundColor: palette.colors.accentPrimary }}
              />
              <div 
                className="palette-color" 
                style={{ backgroundColor: palette.colors.backgroundSecondary }}
              />
              <div 
                className="palette-color" 
                style={{ backgroundColor: palette.colors.textPrimary }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}