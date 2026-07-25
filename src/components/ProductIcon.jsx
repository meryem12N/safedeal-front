import { IconPhone, IconGame, IconBag, IconBox } from './DashboardIcons';

const ICONS = {
  phone: IconPhone,
  game: IconGame,
  bag: IconBag,
  laptop: IconBox,
};

export default function ProductIcon({ category, color = '#7C93FF' }) {
  const Icon = ICONS[category] || IconBox;
  return (
    <span className="ud-product-icon" style={{ background: `${color}18`, color }}>
      <Icon />
    </span>
  );
}