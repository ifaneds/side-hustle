import React, { useState, useEffect } from 'react';
import '../css/Calendar.css';

// Separate button component to ensure proper rendering
const ModeToggleButton = ({ isRangeMode, onClick }) => {
  return (
    <button 
      className={isRangeMode ? 'active' : ''} 
      onClick={onClick}
      type="button"
    >
      {isRangeMode ? 'Range Selection Mode' : 'Single Date Mode'}
    </button>
  );
};

const MonthlyCalendar = ({ onDateSelect, eventsByDate, selectedDate: externalSelectedDate, selectedRange }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [isRangeSelection, setIsRangeSelection] = useState(false);

  // Update internal range state when external range changes
  useEffect(() => {
    if (selectedRange) {
      setRangeStart(selectedRange.start);
      setRangeEnd(selectedRange.end);
      setIsRangeSelection(true);
    }
  }, [selectedRange]);

  // Format date to YYYY-MM-DD format without timezone issues
  const formatDateString = (year, month, day) => {
    const monthStr = (month + 1).toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');
    return `${year}-${monthStr}-${dayStr}`;
  };

  // Apply the range selection
  const applyRangeSelection = (start, end) => {
    if (!start || !end) return;
    
    // Sort dates to ensure start is before end
    const [rangeStart, rangeEnd] = [start, end].sort();
    
    // Notify parent component of the range selection
    onDateSelect && onDateSelect(rangeStart, true, { start: rangeStart, end: rangeEnd });
  };

  // Handle date selection
  const handleDateClick = (day) => {
    if (!day) return;
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const dateString = formatDateString(year, month, day);
    
    if (isRangeSelection) {
      // Range selection mode
      if (!rangeStart) {
        // First click - set range start
        setRangeStart(dateString);
      } else if (rangeStart === dateString) {
        // Clicking the same date again - clear selection
        clearRangeSelection();
        onDateSelect && onDateSelect(dateString, false);
      } else {
        // Second click - set range end and apply selection immediately
        setRangeEnd(dateString);
        applyRangeSelection(rangeStart, dateString);
      }
    } else {
      // Single date selection mode
      if (dateString === externalSelectedDate) {
        onDateSelect && onDateSelect(dateString, false);
      } else {
        onDateSelect && onDateSelect(dateString, true);
      }
    }
  };

  // Clear range selection
  const clearRangeSelection = () => {
    setRangeStart(null);
    setRangeEnd(null);
    onDateSelect && onDateSelect(null, false, null);
  };

  // Toggle range selection mode
  const toggleRangeSelection = () => {
    const newMode = !isRangeSelection;
    setIsRangeSelection(newMode);
    clearRangeSelection();
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Format month and year for display
  const monthYearString = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Check if a day has events
  const hasEvents = (day) => {
    if (!day) return false;
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const dateString = formatDateString(year, month, day);
    
    return eventsByDate && eventsByDate[dateString] && eventsByDate[dateString].length > 0;
  };

  // Check if a day is selected
  const getSelectionClass = (day) => {
    if (!day) return '';
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const dateString = formatDateString(year, month, day);
    
    if (isRangeSelection) {
      // In range selection mode
      if (!rangeStart) return '';
      
      if (rangeEnd) {
        // If range end is set, check if date is in the range
        const [start, end] = [rangeStart, rangeEnd].sort();
        
        if (dateString === start) return 'range-start';
        if (dateString === end) return 'range-end';
        if (dateString > start && dateString < end) return 'in-range';
        return '';
      } else {
        // If only range start is set, only that date is selected
        return dateString === rangeStart ? 'selected' : '';
      }
    } else {
      // In single date selection mode
      return dateString === externalSelectedDate ? 'selected' : '';
    }
  };

  // Get the first day of the month
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  
  // Get the last day of the month
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
  // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfWeek = firstDayOfMonth.getDay();
  
  // Get the total number of days in the month
  const totalDays = lastDayOfMonth.getDate();
  
  // Create an array of days to display
  const days = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(null);
  }
  
  // Add cells for each day of the month
  for (let i = 1; i <= totalDays; i++) {
    days.push(i);
  }

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={goToPreviousMonth}>&lt;</button>
        <h2>{monthYearString}</h2>
        <button onClick={goToNextMonth}>&gt;</button>
      </div>
      
      <div className="calendar-mode-toggle">
        <ModeToggleButton 
          isRangeMode={isRangeSelection} 
          onClick={toggleRangeSelection} 
        />
      </div>
      
      {isRangeSelection && (
        <div className="range-selection-instructions">
          <p>Click a start date, then click an end date to select a range.</p>
          {rangeStart && !rangeEnd && (
            <p className="range-in-progress">Start date selected: {rangeStart}</p>
          )}
          {rangeStart && rangeEnd && (
            <p className="range-selected">Range selected: {rangeStart} to {rangeEnd}</p>
          )}
        </div>
      )}
      
      <div className="calendar-grid">
        <div className="calendar-day-header">Sun</div>
        <div className="calendar-day-header">Mon</div>
        <div className="calendar-day-header">Tue</div>
        <div className="calendar-day-header">Wed</div>
        <div className="calendar-day-header">Thu</div>
        <div className="calendar-day-header">Fri</div>
        <div className="calendar-day-header">Sat</div>
        
        {days.map((day, index) => (
          <div 
            key={index} 
            className={`calendar-day ${day ? 'has-day' : 'empty'} ${getSelectionClass(day)} ${hasEvents(day) ? 'has-events' : ''}`}
            onClick={() => handleDateClick(day)}
          >
            {day}
            {hasEvents(day) && <span className="event-indicator"></span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthlyCalendar; 