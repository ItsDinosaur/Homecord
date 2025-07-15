export interface ColorPalette {
  name: string;
  id: string;
  colors: {
    // Background colors
    backgroundPrimary: string;
    backgroundSecondary: string;
    backgroundTertiary: string;
    
    // Text colors
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    
    // Accent colors
    accentPrimary: string;
    accentSecondary: string;
    accentDanger: string;
    accentDangerDisabled: string;
    accentDangerHover: string;
    accentSuccess: string;
    accentSuccessDisabled: string;
    accentSuccessHover: string;
    accentWarning: string;
    accentWarningDisabled: string;
    accentWarningHover: string;
    
    // Border colors
    borderPrimary: string;
    borderSecondary: string;
    
    // Interactive colors
    hoverBackground: string;
    activeBackground: string;
  };
}

export const colorPalettes: ColorPalette[] = [
  {
    name: "Dark Theme",
    id: "dark",
    colors: {
      backgroundPrimary: "#36393f",
      backgroundSecondary: "#2f3136",
      backgroundTertiary: "#40444b",
      textPrimary: "#ffffff",
      textSecondary: "#b9bbbe",
      textMuted: "#6c757d",
      accentPrimary: "#5865f2",
      accentSecondary: "#4752c4",
      accentDanger: "#ed4245",
      accentDangerDisabled: "#b9bbbe",
      accentDangerHover: "#dc143c",
      accentSuccess: "#3ba55c",
      accentSuccessDisabled: "#b9bbbe",
      accentSuccessHover: "#2f8547",
      accentWarning: "#faa61a",
      accentWarningDisabled: "#b9bbbe",
      accentWarningHover: "#e6a23c",
      borderPrimary: "#40444b",
      borderSecondary: "#2f3136",
      hoverBackground: "#40444b",
      activeBackground: "#4752c4",
    }
  },
  {
    name: "Light Theme",
    id: "light",
    colors: {
      backgroundPrimary: "#ffffff",
      backgroundSecondary: "#f8f9fa",
      backgroundTertiary: "#e9ecef",
      textPrimary: "#212529",
      textSecondary: "#6c757d",
      textMuted: "#adb5bd",
      accentPrimary: "#0d6efd",
      accentSecondary: "#0b5ed7",
      accentDanger: "#dc3545",
      accentDangerDisabled: "#adb5bd",
      accentDangerHover: "#dc143c",
      accentSuccess: "#198754",
      accentSuccessDisabled: "#adb5bd",
      accentSuccessHover: "#2f8547",
      accentWarning: "#fd7e14",
      accentWarningDisabled: "#adb5bd",
      accentWarningHover: "#e6a23c",
      borderPrimary: "#dee2e6",
      borderSecondary: "#e9ecef",
      hoverBackground: "#e9ecef",
      activeBackground: "#0b5ed7",
    }
  },
  {
    name: "Forest Theme",
    id: "forest",
    colors: {
      backgroundPrimary: "#334e2b",
      backgroundSecondary: "#1a251a",
      backgroundTertiary: "#51773e",
      textPrimary: "#ffffff",
      textSecondary: "#b2c8b2",
      textMuted: "#8fa88f",
      accentPrimary: "#99c35c",
      accentSecondary: "#719032",
      accentDanger: "#e63946",
      accentDangerDisabled: "#7a7a7aff",
      accentDangerHover: "#dc143c",
      accentSuccess: "#2a9d8f",
      accentSuccessDisabled: "#7a7a7aff",
      accentSuccessHover: "#2f8547",
      accentWarning: "#f1c40f",
      accentWarningDisabled: "#7a7a7aff",
      accentWarningHover: "#e6a23c",
      borderPrimary: "#4a6b4a",
      borderSecondary: "#334e2b",
      hoverBackground: "#88a42f",
      activeBackground: "#719032",
    }
  },
  {
    name: "Pink Forest Theme",
    id: "pink-forest",
    colors: {
      backgroundPrimary: "#456e66",
      backgroundSecondary: "#07313d",
      backgroundTertiary: "#9d446a",
      textPrimary: "#ffffff",
      textSecondary: "#f7c6d7",
      textMuted: "#f1a7b2",
      accentPrimary: "#f67989",
      accentSecondary: "#9d446a",
      accentDanger: "#e63946",
      accentDangerDisabled: "#7a7a7aff",
      accentDangerHover: "#dc143c",
      accentSuccess: "#38a169",
      accentSuccessDisabled: "#7a7a7aff",
      accentSuccessHover: "#2f8547",
      accentWarning: "#f1c40f",
      accentWarningDisabled: "#7a7a7aff",
      accentWarningHover: "#e6a23c",
      borderPrimary: "#c1a194",
      borderSecondary: "#f1a7b2",
      hoverBackground: "#9d446a",
      activeBackground: "#a046c1ff",
    }
  },
  {
    name: "Blue Forest Theme",
    id: "blue-forest",
    colors: {
      backgroundPrimary: "#1a2b3d",
      backgroundSecondary: "#0d1a2b",
      backgroundTertiary: "#2f4a6b",
      textPrimary: "#ffffff",
      textSecondary: "#b0c4de",
      textMuted: "#8fa8c0",
      accentPrimary: "#4682b4",
      accentSecondary: "#4169e1",
      accentDanger: "#dc143c",
      accentDangerDisabled: "#7a7a7aff",
      accentDangerHover: "#dc143c",
      accentSuccess: "#3cb371",
      accentSuccessDisabled: "#7a7a7aff",
      accentSuccessHover: "#2f8547",
      accentWarning: "#ffa500",
      accentWarningDisabled: "#7a7a7aff",
      accentWarningHover: "#e6a23c",
      borderPrimary: "#5f9ea0",
      borderSecondary: "#1a2b3d",
      hoverBackground: "#4682b4",
      activeBackground: "#4169e1",
    }
  },
  {
    name: "Bee Theme",
    id: "bee",
    colors: {
      backgroundPrimary: "#fff8dc",
      backgroundSecondary: "#f0e68c",
      backgroundTertiary: "#ffe4b5",
      textPrimary: "#000000",
      textSecondary: "#8b4513",
      textMuted: "#d2b48c",
      accentPrimary: "#ffeb3b",
      accentSecondary: "#ffc107",
      accentDanger: "#ff5722",
      accentDangerDisabled: "#d32f2f",
      accentDangerHover: "#dc143c",
      accentSuccess: "#4caf50",
      accentSuccessDisabled: "#388e3c",
      accentSuccessHover: "#2f8547",
      accentWarning: "#ff9800",
      accentWarningDisabled: "#f57c00",
      accentWarningHover: "#e6a23c",
      borderPrimary: "#ffeb3b",
      borderSecondary: "#ffc107",
      hoverBackground: "#ffe082",
      activeBackground: "#ff9800",
    }
  }
];

export function applyColorPalette(palette: ColorPalette) {
  const root = document.documentElement;
  Object.entries(palette.colors).forEach(([key, value]) => {
    const cssVarName = `--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
    root.style.setProperty(cssVarName, value);
  });
}

export function getCurrentPalette(): string {
  return localStorage.getItem('selectedPalette') || 'dark';
}

export function saveSelectedPalette(paletteId: string) {
  localStorage.setItem('selectedPalette', paletteId);
}