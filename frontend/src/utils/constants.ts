export const COLORS = {
  green: '#16854f', darkGreen: '#0d5231', brightGreen: '#22c55e', background: '#2e302d',
  surface: '#242622', card: '#2f312d', border: '#555851', text: '#f7faf8', textMuted: '#b9beb8',
  white: '#ffffff', orange: '#f59e0b', red: '#ef4444', yellow: '#facc15', blue: '#3b82f6',
  blueBg: '#dbeafe', paleGreen: '#dff7e8', paleRed: '#fee2e2', paleYellow: '#fef3c7', black: '#111827',
};

export const WASTE_TYPES = ['Organic', 'Plastic', 'Paper', 'Metal', 'Glass'] as const;
export const WASTE_META: Record<string, { color: string; icon: string; bin: string; tip: string }> = {
  Organic: { color: COLORS.brightGreen, icon: 'leaf-outline', bin: 'Green Bin', tip: 'Compost food scraps and garden waste where possible.' },
  Plastic: { color: COLORS.blue, icon: 'water-outline', bin: 'Blue Bin', tip: 'Rinse bottles before recycling and avoid mixed dirty plastic.' },
  Paper: { color: COLORS.yellow, icon: 'newspaper-outline', bin: 'Yellow Bin', tip: 'Keep paper dry and flatten cartons to save space.' },
  Metal: { color: '#6b7280', icon: 'cube-outline', bin: 'Gray Bin', tip: 'Empty cans and foil trays before collection.' },
  Glass: { color: '#c4b5fd', icon: 'wine-outline', bin: 'White Bin', tip: 'Separate glass by color if your local system requires it.' },
};
