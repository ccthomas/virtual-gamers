// ChipIcon.tsx
import React from 'react';
import Chip from '@mui/material/Chip';
import { SvgIconComponent } from '@mui/icons-material';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import PersonIcon from '@mui/icons-material/Person';

// Define the type for the icon map
type IconMap = {
  [key: string]: SvgIconComponent;
};

export const DEFAULT_ICON_KEY = 'personIcon';

// Create the icon map
export const SupportedIcons: IconMap = {
  accessibilityIcon: AccessibilityIcon,
  accountTreeIcon: AccountTreeIcon,
  airplanemodeActiveIcon: AirplanemodeActiveIcon,
  helpOutlineIcon: HelpOutlineIcon,
  personIcon: PersonIcon,
};

// Define the props for the ChipIcon component
interface ChipIconProps {
  label: string;
  iconName?: string | undefined;
}

// Create the ChipIcon component
const ChipIcon: React.FC<ChipIconProps> = ({ label, iconName = DEFAULT_ICON_KEY }) => {
  // Retrieve the icon component from the map, default to HelpOutlineIcon
  const IconComponent = SupportedIcons[iconName] || SupportedIcons[DEFAULT_ICON_KEY];

  return (
    <Chip
      icon={<IconComponent />}
      label={label}
      variant="outlined"
      sx={{ color: 'white' }}
    />
  );
};

export default ChipIcon;
