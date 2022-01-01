import React, { useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment';

import { calendarService, eventService } from '@/_services';

function EventsCalendar({ match }) {
    const { id } = match.params;
    const localizer = momentLocalizer(moment);
    const now = new Date();
    const [calendars, setCalendars ] = useState([]); 
    const [events, setEvents ] = useState(() => {
        const savedEvents = localStorage.getItem("events");
        if (savedEvents)
        {
            console.log(savedEvents);
            return JSON.parse(savedEvents);
        } else {
            if (events)
            {
                return events;
            } else {
                return [];
            }
        }
    });

    useEffect(() => {
        calendarService.getAll().then(x => setCalendars(x));
        if (!id) {
            eventService.getAll().then(x => {
                var evs = x.map(function(row){
                    return { id: row.id, title: row.name, start: new Date(row.starts), end: new Date(row.ends) };
                });
                localStorage.setItem("events", JSON.stringify(evs));
                setEvents(evs);
                }
            );
            console.log(events);
        } else {
            eventService.getByCalendarId(id).then(x => {
                var evs = x.map(function(row){
                    return { id: row.id, title: row.name, start: new Date(row.starts), end: new Date(row.ends) };
                });
                localStorage.setItem("events", JSON.stringify(evs));
                setEvents(evs);
            });
        }
    }, []);

    return (
        <div className="row">
            <div className="col-md-2">
                <h3>Calendars</h3>
                <ul>
                    <li><a href="/events">All Calendars</a></li>
                {
                calendars.map((calendar, index) =>
                    (<li key={calendar.id}><NavLink key={calendar.id} to={`/events/${calendar.id}`}>{calendar.name}</NavLink></li>)
                )
                }
                </ul>
            </div>
            <div className="col-md-10">
                <Calendar
            localizer={localizer}
            defaultDate={new Date()}
            events={events}
            defaultView="month"
            style={{ height: "100vh" }}
            />
            </div>
        </div>
    );
}

export { EventsCalendar };