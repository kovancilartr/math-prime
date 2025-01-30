import * as LucideIcons from "lucide-react";

export const useIcon = (iconName: string) => {
  // Convert string to proper format (e.g., "home" -> "Home")
  const formattedName = iconName.charAt(0).toUpperCase() + iconName.slice(1);

  // Get the icon component from lucide-react
  const IconComponent = (LucideIcons as any)[formattedName];

  // Return the icon component or a default icon if not found
  return IconComponent || LucideIcons.Circle;
};
