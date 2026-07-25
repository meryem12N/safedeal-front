import { IconStarFilled } from './DashboardIcons';

export default function RatingStars({ value }) {
  return (
    <span className="ud-rating">
      <IconStarFilled /> {value.toFixed(1)}
    </span>
  );
}