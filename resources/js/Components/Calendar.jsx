import { logo } from "@/constant";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState } from "react";
import Modal from "./Modal";
import { router } from "@inertiajs/react";

const Calendar = ({ className, events = [] }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const [showEventDetails, setShowEventDetails] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedEvents, setSelectedEvents] = useState([]);

    const monthNames = [
        "Janvier",
        "Février",
        "Mars",
        "Avril",
        "Mai",
        "Juin",
        "Juillet",
        "Août",
        "Septembre",
        "Octobre",
        "Novembre",
        "Décembre",
    ];

    const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

    const today = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const firstDayWeekday = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    const formatDate = (year, month, day) => {
        return `${year}-${String(month + 1).padStart(2, "0")}-${String(
            day
        ).padStart(2, "0")}`;
    };

    const getEventsForDate = (dateStr) => {
        return events.filter((event) => event.date === dateStr);
    };

    const calendarDays = [];

    const prevMonth = new Date(year, month - 1, 0);
    const daysInPrevMonth = prevMonth.getDate();
    const prevMonthYear = month === 0 ? year - 1 : year;
    const prevMonthIndex = month === 0 ? 11 : month - 1;

    for (let i = firstDayWeekday - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        const dateStr = formatDate(prevMonthYear, prevMonthIndex, day);
        calendarDays.push({
            day,
            dateStr,
            isCurrentMonth: false,
            isToday: false,
            isPrevMonth: true,
            events: getEventsForDate(dateStr),
        });
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = formatDate(year, month, day);
        const isToday =
            today.getFullYear() === year &&
            today.getMonth() === month &&
            today.getDate() === day;

        calendarDays.push({
            day,
            dateStr,
            isCurrentMonth: true,
            isToday,
            isPrevMonth: false,
            events: getEventsForDate(dateStr),
        });
    }

    const remainingDays = 42 - calendarDays.length;
    const nextMonthYear = month === 11 ? year + 1 : year;
    const nextMonthIndex = month === 11 ? 0 : month + 1;

    for (let day = 1; day <= remainingDays; day++) {
        const dateStr = formatDate(nextMonthYear, nextMonthIndex, day);
        calendarDays.push({
            day,
            dateStr,
            isCurrentMonth: false,
            isToday: false,
            isPrevMonth: false,
            events: getEventsForDate(dateStr),
        });
    }

    const navigateMonth = (direction) => {
        setCurrentDate(new Date(year, month + direction, 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const handleDayClick = (dateObj, e) => {
        e.stopPropagation();
        if (dateObj.isCurrentMonth) {
            if (dateObj.events.length > 0) {
                setSelectedEvents(dateObj.events);
                setSelectedDate(dateObj.dateStr);
                setShowEventDetails(true);
            } else {
                setSelectedDate(dateObj.dateStr);
            }
        }
    };

    const handleEventClick = (event, e) => {
        e.stopPropagation();
        setSelectedEvent(event);
        setSelectedEvents([event]);
        setShowEventDetails(true);
    };

    const closeEventDetails = () => {
        setShowEventDetails(false);
        setSelectedEvent(null);
        setSelectedEvents([]);
        setSelectedDate("");
    };

    const handleNavigationClick = (event) => {
        if (event.type === "installation") {
            router.visit(`/installation/${event.id}`);
        }
        if (event.type === "paiement") {
            router.visit(`/paiement/${event.id}/view`);
        }
        if (event.type === "maintenance") {
            router.visit(`/intervention/${event.id}/view`);
        }
    };

    return (
        <div
            className={`max-w-full p-6 mx-auto bg-white dark:bg-gray-800 dark:text-gray-300 rounded-lg shadow-lg ${
                className || ""
            }`}
        >
            {/* En-tête avec navigation */}
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => navigateMonth(-1)}
                    className="p-2 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>

                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                        {monthNames[month]} {year}
                    </h2>
                    <button
                        onClick={goToToday}
                        className="text-sm text-blue-600 transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        Aujourd'hui
                    </button>
                </div>

                <button
                    onClick={() => navigateMonth(1)}
                    className="p-2 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
            </div>

            {/* Jours de la semaine */}
            <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map((dayName) => (
                    <div
                        key={dayName}
                        className="py-2 text-sm font-medium text-center text-gray-500 dark:text-gray-400"
                    >
                        {dayName}
                    </div>
                ))}
            </div>

            {/* Grille du calendrier */}
            <div className="grid grid-cols-7 gap-1 mb-4">
                {calendarDays.map((dateObj, index) => (
                    <div
                        key={index}
                        onClick={(e) => handleDayClick(dateObj, e)}
                        className={`
              h-20 border rounded-lg p-1 cursor-pointer transition-colors relative
              ${
                  dateObj.isCurrentMonth
                      ? dateObj.isToday
                          ? "bg-blue-50 dark:bg-blue-900 border-blue-300 dark:border-blue-600"
                          : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                      : "bg-gray-50 dark:bg-gray-700 border-gray-100 dark:border-gray-600"
              }
            `}
                    >
                        <div
                            className={`text-sm font-medium ${
                                dateObj.isCurrentMonth
                                    ? dateObj.isToday
                                        ? "text-blue-600 dark:text-blue-300"
                                        : "text-gray-800 dark:text-white"
                                    : "text-gray-400 dark:text-gray-500"
                            }`}
                        >
                            {dateObj.day}
                        </div>

                        {/* Événements */}
                        <div className="mt-1 space-y-1">
                            {dateObj.events
                                .slice(
                                    0,
                                    dateObj.events.length > 2
                                        ? 1
                                        : dateObj.events.length
                                )
                                .map((event) => (
                                    <div
                                        key={event.id}
                                        onClick={(e) =>
                                            handleEventClick(event, e)
                                        }
                                        className={`text-xs text-white px-1 py-0.5 rounded truncate cursor-pointer hover:opacity-80 bg-${event.color}`}
                                        title={event.title}
                                    >
                                        {event.title}
                                    </div>
                                ))}
                            {dateObj.events.length > 2 && (
                                <div
                                    className="text-xs text-gray-500 cursor-pointer dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedEvents(dateObj.events);
                                        setSelectedDate(dateObj.dateStr);
                                        setShowEventDetails(true);
                                    }}
                                >
                                    +{dateObj.events.length - 1} autres
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal d'affichage des événements */}

            <Modal
                show={showEventDetails}
                onClose={closeEventDetails}
                closeOnOutsideClick={false}
                role="dialog"
                aria-labelledby="modal-title"
            >
                <div className="w-full p-1 overflow-y-auto bg-white rounded-lg dark:bg-gray-800 max-h-[80vh]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                            {selectedEvents.length === 1
                                ? "Détails de l'événement"
                                : `Événements du ${new Date(
                                      selectedDate
                                  ).toLocaleDateString("fr-FR")}`}
                        </h3>
                        <button
                            onClick={closeEventDetails}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {selectedEvents.map((event, index) => (
                            <div
                                key={event.id}
                                className="pb-4 border-b last:border-b-0 dark:border-gray-600"
                            >
                                <div className="flex items-center mb-2">
                                    <h4 className="font-semibold text-gray-800 dark:text-white">
                                        {event.title}
                                    </h4>
                                </div>
                                <p className="mb-2 text-sm text-gray-600 dark:text-gray-300">
                                    📅{" "}
                                    {new Date(event.date).toLocaleDateString(
                                        "fr-FR"
                                    )}
                                </p>
                                {event.description && (
                                    <p className="mb-2 text-sm text-gray-700 dark:text-gray-300">
                                        {event.description}
                                    </p>
                                )}
                                <div
                                    className={`flex items-center justify-between mt-2 text-sm`}
                                >
                                    <div
                                        className={`flex items-center text-${event.color}`}
                                    >
                                        <div
                                            className={`w-4 h-4 rounded-full bg-${event.color} mr-2`}
                                        ></div>
                                        {event.status}
                                    </div>
                                    <div
                                        onClick={() =>
                                            handleNavigationClick(event)
                                        }
                                        className="p-2 text-white bg-blue-500 rounded cursor-pointer hover:bg-blue-600"
                                    >
                                        Voir details
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Calendar;
