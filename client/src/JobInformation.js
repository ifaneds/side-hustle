import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./css/JobInformation.css";

function JobInformation() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [unavailableEvents, setUnavailableEvents] = useState([]);
  const [clashingSlots, setClashingSlots] = useState([]);

  useEffect(() => {
    // Load availability data from localStorage
    const savedDates = localStorage.getItem('unavailableDates');
    const savedEvents = localStorage.getItem('unavailableEvents');
    
    if (savedDates) {
      setUnavailableDates(JSON.parse(savedDates));
    }
    if (savedEvents) {
      try {
        setUnavailableEvents(JSON.parse(savedEvents));
      } catch (error) {
        console.error('Error loading events from localStorage:', error);
        setUnavailableEvents([]);
      }
    }
  }, []);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:8081/api/jobs/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError("Job not found.");
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return;
        }
        const data = await response.json();
        setJob(data);
      } catch (error) {
        setError("Failed to fetch job details.");
      } finally {
        setLoading(false);
      }
    };
    const fetchJobTimeSlots = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:8081/api/jobs/${id}/time-slots`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTimeSlots(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchJobTimeSlots();
    fetchJob();
  }, [id]);

  // Check for clashes between time slots and availability
  useEffect(() => {
    if (timeSlots.length > 0 && unavailableEvents.length > 0) {
      const processedSlots = timeSlots.map(slot => {
        // Get the date string and create time values for the slot
        const slotDate = new Date(slot.startTime).toISOString().split('T')[0];
        
        // Create Date objects in local timezone
        const slotStartDate = new Date(slot.startTime);
        const slotEndDate = new Date(slot.endTime);

        // Format times in 24-hour format for logging
        const slotStartTime = slotStartDate.getHours().toString().padStart(2, '0') + ':' + 
                            slotStartDate.getMinutes().toString().padStart(2, '0');
        const slotEndTime = slotEndDate.getHours().toString().padStart(2, '0') + ':' + 
                           slotEndDate.getMinutes().toString().padStart(2, '0');

        // Convert slot times to minutes
        const slotStartMins = slotStartDate.getHours() * 60 + slotStartDate.getMinutes();
        const slotEndMins = slotEndDate.getHours() * 60 + slotEndDate.getMinutes();

        console.log(`\nProcessing slot: ${slotStartTime}-${slotEndTime} (${slotStartMins}-${slotEndMins} minutes)`);
        
        // Find events on this day
        const eventsOnThisDay = unavailableEvents.filter(event => {
          if (event.startDate === slotDate) return true;
          if (event.recurrence && event.recurrence.type !== 'none') {
            const recurringDates = getRecurringDates(event, event.startDate);
            return recurringDates.includes(slotDate);
          }
          return false;
        });

        // Separate events into clashing and non-clashing
        const { clashing, nonClashing } = eventsOnThisDay.reduce((acc, event) => {
          // Convert event times to minutes
          const [eventStartHour, eventStartMin] = event.start.split(':').map(Number);
          const [eventEndHour, eventEndMin] = event.end.split(':').map(Number);
          const eventStartMins = eventStartHour * 60 + eventStartMin;
          const eventEndMins = eventEndHour * 60 + eventEndMin;

          console.log(`\nComparing event ${event.title}: ${event.start}-${event.end} (${eventStartMins}-${eventEndMins} minutes)`);
          console.log(`with slot: ${slotStartTime}-${slotEndTime} (${slotStartMins}-${slotEndMins} minutes)`);

          // Check if the event is strictly before or after the slot
          const isBeforeSlot = eventEndMins <= slotStartMins;
          const isAfterSlot = eventStartMins >= slotEndMins;
          const isNonOverlapping = isBeforeSlot || isAfterSlot;

          console.log('Time relation:', {
            isBeforeSlot: `${eventEndMins} <= ${slotStartMins} = ${isBeforeSlot}`,
            isAfterSlot: `${eventStartMins} >= ${slotEndMins} = ${isAfterSlot}`,
            isNonOverlapping
          });

          if (isNonOverlapping) {
            console.log(`Event ${event.title} is non-overlapping (same day)`);
            acc.nonClashing.push(event);
          } else {
            console.log(`Event ${event.title} is clashing`);
            acc.clashing.push(event);
          }

          return acc;
        }, { clashing: [], nonClashing: [] });

        const result = {
          ...slot,
          hasClash: clashing.length > 0,
          hasSameDay: nonClashing.length > 0,
          clashingEvents: clashing,
          sameDayEvents: nonClashing
        };

        console.log('\nFinal classification:', {
          slot: `${slotStartTime}-${slotEndTime}`,
          hasClash: result.hasClash,
          hasSameDay: result.hasSameDay,
          clashingEvents: clashing.map(e => `${e.title}: ${e.start}-${e.end}`),
          sameDayEvents: nonClashing.map(e => `${e.title}: ${e.start}-${e.end}`)
        });

        return result;
      });

      setClashingSlots(processedSlots);
    }
  }, [timeSlots, unavailableEvents, unavailableDates]);

  // Get events for a specific date
  const getEventsForDate = (date) => {
    if (!date) return [];
    const dateStr = new Date(date).toISOString().split('T')[0];
    
    return unavailableEvents.filter(event => {
      if (event.recurrence && event.recurrence.type !== 'none') {
        // Handle recurring events
        const recurringDates = getRecurringDates(event, event.startDate);
        return recurringDates.includes(dateStr);
      } else {
        return event.startDate === dateStr;
      }
    });
  };

  // Get recurring dates for an event
  const getRecurringDates = (event, startDate) => {
    const dates = new Set();
    const start = new Date(startDate);
    const until = new Date(event.recurrence.until);
    
    dates.add(start.toISOString().split('T')[0]);
    
    if (event.recurrence.type === 'weekly') {
      let nextDate = new Date(start);
      nextDate.setDate(nextDate.getDate() + 7);
      
      while (nextDate <= until) {
        dates.add(nextDate.toISOString().split('T')[0]);
        nextDate = new Date(nextDate);
        nextDate.setDate(nextDate.getDate() + 7);
      }
    } else if (event.recurrence.type === 'monthly') {
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

  // Format event time for display
  const formatEventTime = (event) => {
    if (event.start === '00:00' && event.end === '23:59') {
      return 'All day';
    }
    return `${event.start} - ${event.end}`;
  };

  // Get unique clashing events
  const getUniqueClashingEvents = (events) => {
    const uniqueEvents = new Map();
    events.forEach(event => {
      const key = `${event.title}-${event.start}-${event.end}`;
      if (!uniqueEvents.has(key)) {
        uniqueEvents.set(key, event);
      }
    });
    return Array.from(uniqueEvents.values());
  };

  if (loading) {
    return <div>Loading job details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!job) {
    return <div>No job details found.</div>;
  }

  function formatDate(timestampString) {
    const date = new Date(timestampString);
    const options = {
      weekday: 'long',
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString(undefined, options);
  }

  function formatTime(timestampString) {
    const date = new Date(timestampString);
    const options = {
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    };
    return date.toLocaleTimeString(undefined, options);
  }

  return (
    <div className="job-info-container">
      <div className="job-header">
        <h2>{job.title}</h2>
      </div>
      
      <div className="job-details">
        <div className="job-detail-item">
          <span className="job-detail-label">Location</span>
          <span className="job-detail-value">{job.location}</span>
        </div>
        <div className="job-detail-item">
          <span className="job-detail-label">Pay Rate</span>
          <span className="job-detail-value">{job.payRate}</span>
        </div>
        <div className="job-detail-item">
          <span className="job-detail-label">Category</span>
          <span className="job-detail-value">{job.category}</span>
        </div>
        <div className="job-detail-item">
          <span className="job-detail-label">Skills</span>
          <span className="job-detail-value">
            {job.skills
              ? job.skills.map((skill) => skill.name).join(", ")
              : "No skills listed"}
          </span>
        </div>
      </div>
      
      <div className="job-detail-item">
        <span className="job-detail-label">Description</span>
        <span className="job-detail-value">{job.description}</span>
      </div>
      
      <div className="time-slots-section">
        <h3>Available Time Slots</h3>
        {timeSlots.length > 0 ? (
          <ul className="time-slots-list">
            {timeSlots.map((slot) => {
              const slotDate = new Date(slot.startTime).toISOString().split('T')[0];
              const eventsForSlot = getEventsForDate(slotDate);
              const clashingSlot = clashingSlots.find(clash => clash.id === slot.id);

              return (
                <li key={slot.id} className={`time-slot-card ${
                  clashingSlot?.hasClash ? 'clashing' : 
                  clashingSlot?.hasSameDay ? 'same-day' : 'no-conflicts'
                }`}>
                  <div className={`time-slot-date ${
                    clashingSlot?.hasClash ? 'date-clash' : 
                    clashingSlot?.hasSameDay ? 'date-same-day' : 'date-no-conflicts'
                  }`}>
                    {formatDate(slot.startTime)}
                  </div>
                  <div className="time-slot-time">
                    <div className="time-slot-start">
                      <span className="time-slot-label">Start</span>
                      <span>{formatTime(slot.startTime)}</span>
                    </div>
                    <div className="time-slot-end">
                      <span className="time-slot-label">End</span>
                      <span>{formatTime(slot.endTime)}</span>
                    </div>
                  </div>
                  
                  {clashingSlot?.hasClash && (
                    <div className="clash-warning">
                      ⛔ This time slot clashes with your availability:
                      <ul className="clash-events-list">
                        {clashingSlot.clashingEvents.map((event, index) => (
                          <li key={index}>
                            {event.title}: {formatEventTime(event)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {clashingSlot?.hasSameDay && !clashingSlot?.hasClash && (
                    <div className="same-day-warning">
                      ⚠️ You have other events on this day:
                      <ul className="same-day-events-list">
                        {clashingSlot.sameDayEvents.map((event, index) => (
                          <li key={index}>
                            {event.title}: {formatEventTime(event)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {!clashingSlot?.hasClash && !clashingSlot?.hasSameDay && (
                    <div className="no-conflicts-message">
                      ✅ This time slot has no conflicts with your availability
                    </div>
                  )}
                  {eventsForSlot.length > 0 && (
                    <div className="availability-events">
                      <h4>Your Availability Events:</h4>
                      <ul>
                        {eventsForSlot.map((event, index) => (
                          <li key={index}>
                            {event.title}: {formatEventTime(event)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="no-time-slots">
            No availability information found for this job.
          </div>
        )}
      </div>
    </div>
  );
}

export default JobInformation;
