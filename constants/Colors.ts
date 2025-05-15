// constants/colors.ts

const tintColorLight = '#E53935';   // Bold red for selected tabs
const tintColorDark = '#FF5252';    // Lighter red for selected tab in dark mode

export const Colors = {
  light: {
    text: '#E4E4E4',                // Light grey text for light mode
    subtext: '#b0b0b0',             // Lighter grey for subtitles or less important text
    background: '#121212',          // Dark grey for background in light mode
    card: '#1f1f1f',                // Slightly lighter grey for cards
    accent: '#E53935',              // Bold red for accents and highlights
    tint: tintColorLight,
    icon: '#a3a3a3',                // Grey for icons in light mode
    tabIconDefault: '#595959',      // Medium grey for default tabs
    tabIconSelected: tintColorLight,
    border: '#2a2a2a',              // Dark grey for borders
    shadow: 'rgba(0, 0, 0, 0.5)',   // Shadow for elevated elements
  },
  dark: {
    text: '#E4E4E4',                // Light grey text for dark mode
    subtext: '#b0b0b0',             // Lighter grey for subtitles or less important text
    background: '#0d0d0d',          // Darker black for background in dark mode
    card: '#1a1a1a',                // Slightly lighter black for cards
    accent: '#FF5252',              // Bright red for accents and highlights
    tint: tintColorDark,
    icon: '#a3a3a3',                // Grey for icons in dark mode
    tabIconDefault: '#595959',      // Medium grey for default tabs
    tabIconSelected: tintColorDark,
    border: '#2a2a2a',              // Dark grey for borders
    shadow: 'rgba(0, 0, 0, 0.5)',   // Shadow for elevated elements
  },
};
