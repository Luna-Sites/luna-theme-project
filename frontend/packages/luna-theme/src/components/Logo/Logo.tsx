/**
 * Logo component for Luna Theme
 * Displays the crescent moon logo (also serves as theme toggle)
 */

import React from 'react';
import moonSVG from '../../icons/moon.svg';
import sunSVG from '../../icons/theme-toggle.svg';
import Icon from '@plone/volto/components/theme/Icon/Icon';

interface LogoProps {
  pathname?: string;
  onToggleTheme?: () => void;
  isDarkTheme?: boolean;
}

const Logo: React.FC<LogoProps> = ({ onToggleTheme, isDarkTheme = false }) => {
  return (
    <div className="luna-logo-wrapper" onClick={onToggleTheme} style={{ cursor: 'pointer' }} aria-label="Toggle Theme">
      <div className="luna-logo">
        <Icon
          name={isDarkTheme ? sunSVG : moonSVG}
          size="32px"
          className="luna-logo-icon"
        />
      </div>
    </div>
  );
};

export default Logo;
