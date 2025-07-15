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
    name: "Purple Theme",
    id: "purple",
    colors: {
      backgroundPrimary: "#2d1b69",
      backgroundSecondary: "#1a0e42",
      backgroundTertiary: "#3c2a7a",
      textPrimary: "#ffffff",
      textSecondary: "#b794f6",
      textMuted: "#9f7aea",
      accentPrimary: "#805ad5",
      accentSecondary: "#6b46c1",
      accentDanger: "#e53e3e",
      accentDangerDisabled: "#7a7a7aff",
      accentDangerHover: "#dc143c",
      accentSuccess: "#38a169",
      accentSuccessDisabled: "#7a7a7aff",
      accentSuccessHover: "#2f8547",
      accentWarning: "#d69e2e",
      accentWarningDisabled: "#7a7a7aff",
      accentWarningHover: "#e6a23c",
      borderPrimary: "#553c9a",
      borderSecondary: "#3c2a7a",
      hoverBackground: "#553c9a",
      activeBackground: "#6b46c1",
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