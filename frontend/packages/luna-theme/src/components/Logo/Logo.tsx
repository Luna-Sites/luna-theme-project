/**
 * Logo component for Luna Theme
 * Displays the crescent moon logo (also serves as theme toggle)
 */

import React from 'react';
import lunaLogoSVG from '../../icons/luna-logo.svg';
import Icon from '@plone/volto/components/theme/Icon/Icon';

interface LogoProps {
  pathname?: string;
  onToggleTheme?: () => void;
}

const Logo: React.FC<LogoProps> = ({ onToggleTheme }) => {
  return (
    <div className="luna-logo-wrapper" onClick={onToggleTheme} style={{ cursor: 'pointer' }} aria-label="Theme">
      <div className="luna-logo">
        <Icon name={lunaLogoSVG} size="32px" className="luna-logo-icon" />
      </div>
    </div>
  );
};

export default Logo;
