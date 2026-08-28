import { useState } from 'react';
import { IconChevronLeft, IconChevronRight } from './DashboardIcons';

const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const MONTH_LABELS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

function buildMonthGrid(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startWeekday = (firstDay.getDay() + 6) % 7; // lundi = 0
  const daysInMonth = lastDay.getDate();

  const prevMonthLastDay = new Date(year, month, 0).getDate();
  const leading = Array.from({ length: startWeekday }, (_, i) => ({
    d: prevMonthLastDay - startWeekday + i + 1,
    muted: true,
  }));
  const current = Array.from({ length: daysInMonth }, (_, i) => ({ d: i + 1, muted: false }));
  const totalSoFar = leading.length + current.length;
  const trailingCount = (7 - (totalSoFar % 7)) % 7;
  const trailing = Array.from({ length: trailingCount }, (_, i) => ({ d: i + 1, muted: true }));

  const all = [...leading, ...current, ...trailing];
  const rows = [];
  for (let i = 0; i < all.length; i += 7) rows.push(all.slice(i, i + 7));
  return rows;
}

export default function MiniCalendar() {
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());

  const rows = buildMonthGrid(viewYear, viewMonth);
  const isCurrentMonth = viewYear === now.getFullYear() && viewMonth === now.getMonth();
  const today = now.getDate();

  const goPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  return (
    <div className="ud-calendar-card">
      <div className="ud-calendar-head">
        <h3>Calendrier</h3>
        <div className="ud-calendar-nav">
          <button type="button" onClick={goPrevMonth}><IconChevronLeft /></button>
          <span>{MONTH_LABELS[viewMonth]} {viewYear}</span>
          <button type="button" onClick={goNextMonth}><IconChevronRight /></button>
        </div>
      </div>

      <div className="ud-calendar-grid">
        {WEEKDAYS.map((w) => <span key={w} className="ud-calendar-weekday">{w}</span>)}
        {rows.flat().map((cell, i) => (
          <span
            key={i}
            className={`ud-calendar-day ${cell.muted ? 'ud-cal-muted' : ''} ${cell.d === today && !cell.muted && isCurrentMonth ? 'ud-cal-today' : ''}`}
          >
            {cell.d}
          </span>
        ))}
      </div>
    </div>
  );
}