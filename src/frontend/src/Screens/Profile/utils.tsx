import { Role, Theme } from '../../../../declarations/backend/backend.did'

export type ThemeVariant = 'Light' | 'System' | 'Dark'
export type RoleVariant = 'Member' | 'Administrator'

// Get the key as a string value from a Theme object
export const getThemeVariant = (theme: 'Light' | 'System' | 'Dark'): Theme => {
  switch (theme) {
    case 'Light':
      return { Light: null } as Theme
    case 'Dark':
      return { Dark: null }
    case 'System':
      return { System: null }
    default:
      return { System: null }
  }
}

export const getRoleVariant = (role: 'Member' | 'Administrator'): Role => {
  switch (role) {
    case 'Member':
      return { Member: null }
    case 'Administrator':
      return { Administrator: null }
    default:
      return { Member: null }
  }
}

// Helper function to ensure a valid theme
export const getValidTheme = (theme: unknown): ThemeVariant => {
  if (theme === 'Light' || theme === 'System' || theme === 'Dark') {
    return theme
  }
  return 'System' // Default theme if invalid
}

// // Helper function to ensure a valid role
export const getValidRole = (role: unknown): RoleVariant => {
  if (role === 'Member' || role === 'Administrator') {
    return role
  }
  return 'Member' // Default role if invalid
}
