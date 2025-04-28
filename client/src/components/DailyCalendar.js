import React, { useState, useEffect } from 'react';
import '../css/Calendar.css';

const DailyCalendar = ({ selectedDate, selectedRange, onTimeSlotSelect, unavailableDates = [], unavailableEvents = {} }) => {
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [isEditingEvent, setIsEditingEvent] = useState(false);
  const [isAllDay, setIsAllDay] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [newEvent, setNewEvent] = useState({
    startTime: '09:00',
    endTime: '10:00',
    title: '',
    recurrence: {
      type: 'weekly',
      until: ''
    }
  });
  
  // Generate time options for dropdowns
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        options.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return options;
  };
  
  const timeOptions = generateTimeOptions();
  
  // Handle adding a new event
  const handleAddEvent = () => {
    if (!selectedDate && !selectedRange) {
      alert('Please select a date or date range first');
      return;
    }

    if (!isAllDay && (!newEvent.startTime || !newEvent.endTime)) {
      alert('Please select both start and end times');
      return;
    }

    if (isRecurring && !newEvent.recurrence.until) {
      alert('Please select an end date for the recurring event');
      return;
    }

    const eventToAdd = {
      id: `event-${Date.now()}`,
      start: isAllDay ? '00:00' : newEvent.startTime,
      end: isAllDay ? '23:59' : newEvent.endTime,
      title: newEvent.title || (isAllDay ? 'All Day' : 'Unavailable'),
      recurrence: isRecurring ? {
        type: newEvent.recurrence.type || 'weekly',
        until: newEvent.recurrence.until
      } : { type: 'none', until: '' }
    };

    onTimeSlotSelect(eventToAdd, true);
    resetEventForm();
  };
  
  // Handle removing an event
  const handleRemoveEvent = (event) => {
    onTimeSlotSelect(event, false);
  };
  
  // Format the display date or range
  const getDisplayDate = () => {
    const dateOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };

    if (selectedRange) {
      const startDate = new Date(selectedRange.start);
      const endDate = new Date(selectedRange.end);
      return `${startDate.toLocaleDateString('en-US', dateOptions)} - ${endDate.toLocaleDateString('en-US', dateOptions)}`;
    } else if (selectedDate) {
      return new Date(selectedDate).toLocaleDateString('en-US', dateOptions);
    }
    return 'No date selected';
  };

  // Format event time with optional date
  const formatEventTime = (event) => {
    let timeStr = isAllDayEvent(event) ? 'All Day' : `${event.start} - ${event.end}`;
    
    // For recurring events, show the range if it exists
    if (event.recurrence && event.recurrence.type !== 'none') {
      if (event.startDate !== event.endDate) {
        const startDate = new Date(event.startDate);
        const endDate = new Date(event.endDate);
        const dateStr = `${startDate.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric'
        })} - ${endDate.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric'
        })}: `;
        return `${dateStr}${timeStr}`;
      }
      return timeStr;
    }
    
    // For non-recurring events, show dates if they span multiple days
    if (selectedRange || event.startDate !== event.endDate) {
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);
      const dateStr = startDate.toLocaleDateString('en-US', { 
        weekday: 'short',
        month: 'short', 
        day: 'numeric'
      });
      
      if (startDate.toISOString().split('T')[0] !== endDate.toISOString().split('T')[0]) {
        const endDateStr = endDate.toLocaleDateString('en-US', { 
          weekday: 'short',
          month: 'short', 
          day: 'numeric'
        });
        return `${dateStr} - ${endDateStr}: ${timeStr}`;
      }
      
      return `${dateStr}: ${timeStr}`;
    }
    
    return timeStr;
  };

  // Format recurrence text
  const formatRecurrence = (event) => {
    if (!event.recurrence || event.recurrence.type === 'none') return '';
    
    const untilDate = new Date(event.recurrence.until);
    const dateStr = untilDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    
    return ` (Repeats ${event.recurrence.type} until ${dateStr})`;
  };

  // Check if an event is all day
  const isAllDayEvent = (event) => {
    return event.start === '00:00' && event.end === '23:59';
  };

  // Get events for the current date or range
  const getCurrentEvents = () => {
    if (!unavailableEvents) return [];
    return unavailableEvents;
  };
  
  // Check if the current date or any date in the range is unavailable
  const isUnavailable = () => {
    if (selectedRange) {
      const { start, end } = selectedRange;
      const startDate = new Date(start);
      const endDate = new Date(end);
      
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateKey = d.toISOString().split('T')[0];
        if (unavailableDates.includes(dateKey)) {
          return true;
        }
      }
      return false;
    } else if (selectedDate) {
      return unavailableDates.includes(selectedDate);
    }
    return false;
  };
  
  // Handle editing an event
  const handleEditEvent = (event) => {
    setEditingEventId(event.id);
    setIsEditingEvent(true);
    setIsAllDay(isAllDayEvent(event));
    // Check if event has recurrence settings
    const hasRecurrence = event.recurrence && event.recurrence.type && event.recurrence.type !== 'none';
    setIsRecurring(hasRecurrence);
    setNewEvent({
      startTime: event.start,
      endTime: event.end,
      title: event.title || '',
      recurrence: {
        type: hasRecurrence ? event.recurrence.type : 'none',
        until: hasRecurrence ? event.recurrence.until : ''
      }
    });
  };

  // Handle saving edited event
  const handleSaveEdit = () => {
    if (!isAllDay && (!newEvent.startTime || !newEvent.endTime)) {
      alert('Please select both start and end times');
      return;
    }

    if (isRecurring && !newEvent.recurrence.until) {
      alert('Please select an end date for the recurring event');
      return;
    }

    const eventToUpdate = {
      id: editingEventId,
      start: isAllDay ? '00:00' : newEvent.startTime,
      end: isAllDay ? '23:59' : newEvent.endTime,
      title: newEvent.title || (isAllDay ? 'All Day' : 'Unavailable'),
      recurrence: isRecurring ? {
        type: newEvent.recurrence.type || 'weekly',
        until: newEvent.recurrence.until
      } : { type: 'none', until: '' }
    };

    onTimeSlotSelect(eventToUpdate, true, true);
    resetEventForm();
  };

  // Reset event form
  const resetEventForm = () => {
    setNewEvent({ 
      startTime: '09:00', 
      endTime: '10:00', 
      title: '',
      recurrence: { type: 'weekly', until: '' }
    });
    setIsAllDay(false);
    setIsRecurring(false);
    setIsAddingEvent(false);
    setIsEditingEvent(false);
    setEditingEventId(null);
  };

  return (
    <div className="daily-calendar-container">
      <h3>{getDisplayDate()}</h3>
      
      {isUnavailable() && (
        <div className="date-status-banner unavailable">
          {selectedRange ? 'Some dates in this range are marked as unavailable' : 'This date is marked as unavailable'}
        </div>
      )}
      
      <div className="events-container">
        <div className="events-header">
          <h4>Unavailable Periods</h4>
        </div>
        
        {getCurrentEvents().length === 0 ? (
          <p className="no-events">No unavailable periods set for {selectedRange ? 'these dates' : 'this date'}</p>
        ) : (
          <ul className="events-list">
            {getCurrentEvents().map(event => (
              <li key={event.id} className="event-item">
                <div className="event-info">
                  <span className="event-time">
                    {formatEventTime(event)}
                  </span>
                  {event.title && <span className="event-title">: {event.title}</span>}
                  <span className="event-recurrence">{formatRecurrence(event)}</span>
                </div>
                <div className="event-actions">
                  <button 
                    className="edit-event-btn"
                    onClick={() => handleEditEvent(event)}
                  >
                    Edit
                  </button>
                  <button 
                    className="remove-event-btn"
                    onClick={() => handleRemoveEvent(event)}
                  >
                    ×
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        
        {!isAddingEvent && !isEditingEvent ? (
          <button 
            className="add-event-btn"
            onClick={() => {
              if (!selectedDate && !selectedRange) {
                alert('Please select a date or date range first');
                return;
              }
              setIsAddingEvent(true);
            }}
            disabled={!selectedDate && !selectedRange}
          >
            Add Unavailable Period
          </button>
        ) : (
          <div className="add-event-form">
            <h4>{isEditingEvent ? 'Edit Event' : 'Add Event'}</h4>
            <div className="form-group">
              <label>
                <input 
                  type="checkbox"
                  checked={isAllDay}
                  onChange={(e) => setIsAllDay(e.target.checked)}
                /> All Day
              </label>
            </div>

            {!isAllDay && (
              <>
                <div className="form-group">
                  <label>Start Time:</label>
                  <select 
                    value={newEvent.startTime}
                    onChange={(e) => setNewEvent({...newEvent, startTime: e.target.value})}
                  >
                    {timeOptions.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>End Time:</label>
                  <select 
                    value={newEvent.endTime}
                    onChange={(e) => setNewEvent({...newEvent, endTime: e.target.value})}
                  >
                    {timeOptions.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
            
            <div className="form-group">
              <label>Title (optional):</label>
              <input 
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                placeholder={isAllDay ? "All Day" : "e.g. Meeting, Appointment"}
              />
            </div>

            <div className="form-group">
              <label>
                <input 
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => {
                    setIsRecurring(e.target.checked);
                    if (e.target.checked && !newEvent.recurrence.type) {
                      setNewEvent({
                        ...newEvent,
                        recurrence: { type: 'weekly', until: '' }
                      });
                    }
                  }}
                /> Recurring Event
              </label>
            </div>

            {isRecurring && (
              <div className="recurrence-options">
                <div className="form-group">
                  <label>Repeat:</label>
                  <select
                    value={newEvent.recurrence.type}
                    onChange={(e) => setNewEvent({
                      ...newEvent,
                      recurrence: { ...newEvent.recurrence, type: e.target.value }
                    })}
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Until:</label>
                  <input
                    type="date"
                    value={newEvent.recurrence.until}
                    onChange={(e) => setNewEvent({
                      ...newEvent,
                      recurrence: { ...newEvent.recurrence, until: e.target.value }
                    })}
                    min={selectedDate || selectedRange?.start}
                    required={isRecurring}
                  />
                </div>
              </div>
            )}
            
            <div className="form-actions">
              <button 
                className="cancel-btn"
                onClick={resetEventForm}
              >
                Cancel
              </button>
              <button 
                className="save-btn"
                onClick={isEditingEvent ? handleSaveEdit : handleAddEvent}
              >
                {isEditingEvent ? 'Save Changes' : 'Add'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyCalendar; 