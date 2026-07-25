import { IconChevronLeft, IconChevronRight } from './DashboardIcons';
import { calendarEvents, CURRENT_MONTH_LABEL } from '../mocks/mockDashboard';

const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

function buildJuly2026Grid() {
  // Juillet 2026 commence un mercredi
  const leadingPrev = [29, 30];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const trailingNext = [1, 2];
  const all = [...leadingPrev.map((d) => ({ d, muted: true })), ...days.map((d) => ({ d, muted: false })), ...trailingNext.map((d) => ({ d, muted: true }))];
  const rows = [];
  for (let i = 0; i < all.length; i += 7) rows.push(all.slice(i, i + 7));
  return rows;
}

export default function MiniCalendar() {
  const rows = buildJuly2026Grid();
  const today = 20;
  const todaysEvents = calendarEvents[today] || [];

  return (
    <div className="ud-calendar-card">
      <div className="ud-calendar-head">
        <h3>Calendrier</h3>
        <div className="ud-calendar-nav">
          <button><IconChevronLeft /></button>
          <span>{CURRENT_MONTH_LABEL}</span>
          <button><IconChevronRight /></button>
        </div>
      </div>

      <div className="ud-calendar-grid">
        {WEEKDAYS.map((w) => <span key={w} className="ud-calendar-weekday">{w}</span>)}
        {rows.flat().map((cell, i) => (
          <span
            key={i}
            className={`ud-calendar-day ${cell.muted ? 'ud-cal-muted' : ''} ${cell.d === today && !cell.muted ? 'ud-cal-today' : ''}`}
          >
            {cell.d}
          </span>
        ))}
      </div>

      <div className="ud-calendar-events">
        <span className="ud-calendar-events-count">{todaysEvents.length} événements aujourd'hui</span>
        {todaysEvents.map((e) => (
          <div key={e.id} className="ud-calendar-event-row">
            <span className="ud-calendar-event-dot" />
            <span className="ud-calendar-event-title">{e.title}</span>
            <span className="ud-calendar-event-time">{e.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}