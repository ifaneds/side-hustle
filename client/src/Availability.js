import React, { useState, useEffect } from "react";
import "./css/Profile.css";
import "./css/Availability.css";
import MonthlyCalendar from "./components/MonthlyCalendar";
import DailyCalendar from "./components/DailyCalendar";
import { format, toZonedTime, formatInTimeZone } from 'date-fns-tz';

function Availability() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedRange, setSelectedRange] = useState(null);
  const [unavailableDates, setUnavailableDates] = useState(() => {
    // Initialize from localStorage or empty array
    const saved = localStorage.getItem('unavailableDates');
    return saved ? JSON.parse(saved) : [];
  });
  const [unavailableEvents, setUnavailableEvents] = useState(() => {
    try {
      // Initialize from localStorage or empty array
      const saved = localStorage.getItem('unavailableEvents');
      const parsed = saved ? JSON.parse(saved) : [];
      // Ensure we have an array
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Error loading events from localStorage:', error);
      return [];
    }
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('unavailableDates', JSON.stringify(unavailableDates));
    localStorage.setItem('unavailableEvents', JSON.stringify(unavailableEvents));
  }, [unavailableDates, unavailableEvents]);

  // Debug: Log state changes
  useEffect(() => {
    console.log('Availability - State Updated:', {
      selectedDate,
      selectedRange,
      unavailableDates,
      unavailableEvents
    });
  }, [selectedDate, selectedRange, unavailableDates, unavailableEvents]);

  // Handle date selection from MonthlyCalendar
  const handleDateSelect = (date, isSelected, range = null) => {
    if (range) {
      // Handle range selection
      setSelectedRange(range);
      setSelectedDate(range.start); // Set the start date as the selected date
    } else {
      // Handle single date selection
      setSelectedRange(null);
      if (isSelected) {
        setSelectedDate(date);
      } else {
        if (selectedDate === date) {
          // Find another date that has events
          const datesWithEvents = [...new Set(unavailableEvents.flatMap(event => 
            getDatesInRange(event.startDate, event.endDate)
          ))];
          const nextDate = datesWithEvents.find(d => d !== date);
          setSelectedDate(nextDate || null);
        }
      }
    }
  };

  // Get all dates between start and end dates
  const getDatesInRange = (startDate, endDate) => {
    const dates = [];
    const current = new Date(startDate);
    const end = new Date(endDate);
    
    while (current <= end) {
      dates.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
    
    return dates;
  };

  // Get all dates for a recurring event
  const getRecurringDates = (event, startDate) => {
    const dates = new Set();
    const start = new Date(startDate);
    const until = new Date(event.recurrence.until);
    
    // Always include the start date
    dates.add(start.toISOString().split('T')[0]);
    
    if (event.recurrence.type === 'weekly') {
      // For weekly recurrence, add dates every 7 days
      let nextDate = new Date(start);
      nextDate.setDate(nextDate.getDate() + 7);
      
      while (nextDate <= until) {
        dates.add(nextDate.toISOString().split('T')[0]);
        nextDate = new Date(nextDate);
        nextDate.setDate(nextDate.getDate() + 7);
      }
    } else if (event.recurrence.type === 'monthly') {
      // For monthly recurrence, add dates on the same day of each month
      let nextDate = new Date(start);
      nextDate.setMonth(nextDate.getMonth() + 1);
      
      while (nextDate <= until) {
        dates.add(nextDate.toISOString().split('T')[0]);
        nextDate = new Date(nextDate);
        nextDate.setMonth(nextDate.getMonth() + 1);
      }
    }
    
    return [...dates];
  };

  // Handle event selection from DailyCalendar
  const handleEventSelect = (event, isSelected, isEditing = false) => {
    if (!selectedDate && !selectedRange) return;
    
    if (isSelected) {
      const eventToAdd = {
        ...event,
        id: isEditing ? event.id : `event-${Date.now()}`,
        startDate: selectedRange ? selectedRange.start : selectedDate,
        endDate: selectedRange ? selectedRange.end : selectedDate,
        recurrence: event.recurrence || { type: 'none', until: '' }
      };

      // Update events list
      if (isEditing) {
        setUnavailableEvents(prev => prev.map(e => 
          e.id === event.id ? eventToAdd : e
        ));
      } else {
        setUnavailableEvents(prev => [...prev, eventToAdd]);
      }

      // Calculate all affected dates
      let affectedDates = new Set();
      
      if (eventToAdd.recurrence && eventToAdd.recurrence.type !== 'none') {
        // For recurring events
        if (selectedRange) {
          // If it's a range, add all dates in the range and their recurrences
          const rangeDates = getDatesInRange(selectedRange.start, selectedRange.end);
          rangeDates.forEach(date => {
            affectedDates.add(date);
            const recurringDates = getRecurringDates({
              ...eventToAdd,
              startDate: date,
              endDate: date
            }, date);
            recurringDates.forEach(d => affectedDates.add(d));
          });
        } else {
          // Single date recurring event
          getRecurringDates(eventToAdd, eventToAdd.startDate)
            .forEach(date => affectedDates.add(date));
        }
      } else if (selectedRange) {
        // Non-recurring range
        getDatesInRange(selectedRange.start, selectedRange.end)
          .forEach(date => affectedDates.add(date));
      } else {
        // Single non-recurring date
        affectedDates.add(selectedDate);
      }

      setUnavailableDates(prev => [...new Set([...prev, ...affectedDates])]);
    } else {
      // Remove event
      const eventToRemove = unavailableEvents.find(e => e.id === event.id);
      if (eventToRemove) {
        let datesToRemove = new Set();
        
        if (eventToRemove.recurrence && eventToRemove.recurrence.type !== 'none') {
          // For recurring events
          if (eventToRemove.startDate !== eventToRemove.endDate) {
            // If it's a range, remove all dates in the range and their recurrences
            const rangeDates = getDatesInRange(eventToRemove.startDate, eventToRemove.endDate);
            rangeDates.forEach(date => {
              datesToRemove.add(date);
              getRecurringDates({
                ...eventToRemove,
                startDate: date,
                endDate: date
              }, date).forEach(d => datesToRemove.add(d));
            });
          } else {
            // Single date recurring event
            getRecurringDates(eventToRemove, eventToRemove.startDate)
              .forEach(date => datesToRemove.add(date));
          }
        } else {
          // Non-recurring event
          getDatesInRange(eventToRemove.startDate, eventToRemove.endDate)
            .forEach(date => datesToRemove.add(date));
        }
        
        setUnavailableDates(prev => prev.filter(date => !datesToRemove.has(date)));
      }
      
      setUnavailableEvents(prev => prev.filter(e => e.id !== event.id));
    }
  };

  // Get events for a specific date
  const getEventsForDate = (date) => {
    if (!date) return [];
    
    return unavailableEvents.filter(event => {
      if (event.recurrence && event.recurrence.type !== 'none') {
        const recurringDates = getRecurringDates(event, event.startDate);
        return recurringDates.includes(date);
      } else {
        const eventDates = getDatesInRange(event.startDate, event.endDate);
        return eventDates.includes(date);
      }
    });
  };

  // Convert events to the format expected by MonthlyCalendar
  const getEventsByDate = () => {
    const eventsByDate = {};
    
    unavailableEvents.forEach(event => {
      let dates;
      if (event.recurrence && event.recurrence.type !== 'none') {
        // For recurring events
        if (event.startDate !== event.endDate) {
          // If it's a range, first add all dates in the range
          const rangeDates = getDatesInRange(event.startDate, event.endDate);
          rangeDates.forEach(date => {
            if (!eventsByDate[date]) eventsByDate[date] = [];
            eventsByDate[date].push(event);
          });
          
          // Then calculate recurring dates for each date in the range
          rangeDates.forEach(date => {
            const recurringDates = getRecurringDates({
              ...event,
              startDate: date,
              endDate: date
            }, date);
            
            recurringDates.forEach(recDate => {
              if (!eventsByDate[recDate]) eventsByDate[recDate] = [];
              eventsByDate[recDate].push(event);
            });
          });
        } else {
          // Single date recurring event
          const recurringDates = getRecurringDates(event, event.startDate);
          recurringDates.forEach(date => {
            if (!eventsByDate[date]) eventsByDate[date] = [];
            eventsByDate[date].push(event);
          });
        }
      } else {
        // Non-recurring event
        dates = getDatesInRange(event.startDate, event.endDate);
        dates.forEach(date => {
          if (!eventsByDate[date]) eventsByDate[date] = [];
          eventsByDate[date].push(event);
        });
      }
    });
    
    return eventsByDate;
  };

  // Save availability to backend
  const saveAvailability = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("User ID not found in localStorage");
        alert("You must be logged in to save availability. Please sign in and try again.");
        return;
      }

      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const availabilityData = {
        userId: Number(userId),
        unavailableEvents: unavailableEvents.map(event => {
          // Create Date objects in the user's timezone
          const startDate = new Date(`${event.startDate}T${event.start}`);
          let endDate;

          // Handle "All Day" events
          if (event.start === '00:00' && event.end === '23:59') {
            // Set endDate to the end of the day
            endDate = new Date(`${event.startDate}T23:59:59`);
          } else {
            endDate = new Date(`${event.startDate}T${event.end}`);
          }

          // Format to UTC using the user's time zone
          const startDateTime = formatInTimeZone(startDate, userTimeZone, "yyyy-MM-dd'T'HH:mm:ssXXX");
          const endDateTime = formatInTimeZone(endDate, userTimeZone, "yyyy-MM-dd'T'HH:mm:ssXXX");

          return {
            start: startDateTime,
            end: endDateTime,
            timeZone: userTimeZone,
            title: event.title || (event.start === '00:00' && event.end === '23:59' ? 'All Day' : 'Unavailable')
          };
        })
      };

      // Make API call with credentials and headers
      const response = await fetch('http://localhost:8081/api/availability/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(availabilityData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to save availability');
      }

      alert("Availability saved successfully!");
    } catch (error) {
      console.error('Error saving availability:', error);
      alert("Failed to save availability. Please try again.");
    }
  };

  // Load availability from backend
  useEffect(() => {
    const loadAvailability = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.error("User ID not found in localStorage");
          return; // Silently return without showing an alert
        }

        console.log("Loading availability for user ID:", userId);
        
        const response = await fetch(`http://localhost:8081/api/availability/user/${userId}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || 'Failed to load availability');
        }

        const data = await response.json();
        console.log("Received availability data:", data);
        
        // Convert backend format to frontend format
        const events = data.map(event => {
          // Parse the dates from the backend with the correct time zone
          const startDateTime = new Date(event.startTime);
          const endDateTime = new Date(event.endTime);

          // Adjust for the time zone
          const userTimeZone = event.timeZone; // Assuming this is stored in the event
          const startDateTimeInUserZone = formatInTimeZone(startDateTime, userTimeZone, "yyyy-MM-dd'T'HH:mm:ssXXX");
          const endDateTimeInUserZone = formatInTimeZone(endDateTime, userTimeZone, "yyyy-MM-dd'T'HH:mm:ssXXX");

          // Format dates in YYYY-MM-DD format
          const startDate = startDateTimeInUserZone.split('T')[0];
          const endDate = endDateTimeInUserZone.split('T')[0];
          
          // Format times in 24-hour format with leading zeros
          const startTime = startDateTimeInUserZone.toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit'
          });
          
          const endTime = endDateTimeInUserZone.toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit'
          });

          console.log('Parsed event:', {
            original: event,
            parsed: {
              startDate,
              endDate,
              startTime,
              endTime
            }
          });

          // Create event object with properties that match what DailyCalendar expects
          return {
            id: `event-${event.id}`,
            startDate,
            endDate,
            start: startTime,
            end: endTime,
            title: event.title || (startTime === '00:00' && endTime === '23:59' ? 'All Day' : 'Unavailable'),
            recurrence: { type: 'none', until: '' }
          };
        });

        console.log("Converted events:", events);
        setUnavailableEvents(events);
        
        // Update unavailable dates based on events
        const dates = new Set();
        events.forEach(event => {
          const rangeDates = getDatesInRange(event.startDate, event.endDate);
          rangeDates.forEach(date => dates.add(date));
        });
        setUnavailableDates([...dates]);

      } catch (error) {
        console.error('Error loading availability:', error);
      }
    };

    loadAvailability();
  }, []);

  return (
    <div>
      <div id="content">
        <h1>Availability</h1>
        
        <div className="availability-container">
          <div className="calendar-section">
            <h2>Select Dates</h2>
            <MonthlyCalendar 
              onDateSelect={handleDateSelect} 
              eventsByDate={getEventsByDate()}
              selectedDate={selectedDate}
              selectedRange={selectedRange}
            />
          </div>
          
          <div className="calendar-section">
            <h2>Add Time Periods</h2>
            <DailyCalendar 
              selectedDate={selectedDate}
              selectedRange={selectedRange}
              onTimeSlotSelect={handleEventSelect} 
              unavailableDates={unavailableDates}
              unavailableEvents={getEventsForDate(selectedDate)}
            />
          </div>
          
          <div className="availability-actions">
            <button 
              className="save-button"
              onClick={saveAvailability}
            >
              Save Availability
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Availability;
