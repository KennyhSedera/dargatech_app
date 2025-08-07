import React, { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import fr from 'date-fns/locale/fr';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { fr };

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const MyBigCalendar = () => {
    const [events, setEvents] = useState([]);

    const getIntervention = async () => {
        try {
            const response = await fetch('/api/maintenance');
            const res = await response.json();

            const calendarEvents = res.data.map(el => ({
                title: el.installation.code_installation + ' Intervention...',
                start: new Date(el.date_intervention),
                end: new Date(el.date_intervention),
                allDay: true,
                status: el.status_intervention,
            }));

            setEvents(calendarEvents);
        } catch (error) {
            console.error('Erreur récupération interventions:', error);
        }
    };

    useEffect(() => {
        getIntervention();
    }, []);

    const eventStyleGetter = (event) => {
        let backgroundColor = '';

        switch (event.status) {
            case 'en attente':
                backgroundColor = '#f39c12';  // orange
                break;
            case 'terminée':
                backgroundColor = '#27ae60';  // vert
                break;
            case 'annulée':
                backgroundColor = '#c0392b';  // rouge
                break;
            default:
                backgroundColor = '#3498db';  // bleu par défaut
        }

        const style = {
            backgroundColor,
            borderRadius: '4px',
            opacity: 0.8,
            color: 'white',
            border: '0px',
            display: 'block',
        };

        return { style };
    };

    return (
        <div style={{ height: 500 }} className="p-4 mt-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                culture="fr"
                messages={{ today: "Aujourd'hui" }}
                views={['month', 'week', 'day']}
                eventPropGetter={eventStyleGetter}
            />
        </div>
    );
};

export default MyBigCalendar;
