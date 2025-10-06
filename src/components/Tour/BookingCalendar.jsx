import { useState, useEffect } from "react";
import { DateRange } from "react-date-range";
import axios from "axios";
import { addDays } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const BookingCalendar = ({ propertyId, onDateSelect }) => {
  const [bookedRanges, setBookedRanges] = useState([]);
  const [selection, setSelection] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      key: "selection",
      color: "#facc15",
    },
  ]);

  const expandRangeToDates = (start, end) => {
    const dates = [];
    let current = new Date(start);
    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`/api/bookings/${propertyId}`);
        if (Array.isArray(res.data)) {
          setBookedRanges(
            res.data
              .filter((b) => b.startDate && b.endDate)
              .map((b) => ({
                startDate: new Date(b.startDate),
                endDate: new Date(b.endDate),
                key: "booked",
                color: "#9ca3af",
              }))
          );
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };
    fetchBookings();
  }, [propertyId]);

  const bookedDates = bookedRanges.flatMap((r) =>
    expandRangeToDates(r.startDate, r.endDate)
  );

  return (
    <div className="w-full max-w-4xl mx-auto p-3 sm:p-4 md:p-6 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200">

      {/* Calendar Container */}
      <div className="flex justify-center items-center overflow-x-auto">
        <div className="calendar-wrapper w-full flex justify-center">
          <DateRange
            ranges={selection}
            onChange={(item) => {
              if (item.selection) {
                setSelection([item.selection]);
                onDateSelect(item.selection);
              }
            }}
            minDate={new Date()}
            disabledDates={bookedDates}
            direction="horizontal"
            months={window.innerWidth < 768 ? 1 : 2}
            showDateDisplay={false}
            rangeColors={["#facc15"]}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-600 mt-4 sm:mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-400 rounded"></span>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-400 rounded"></span>
          <span>Booked</span>
        </div>
      </div>

      {/* Custom Styles for Responsive Calendar */}
      <style jsx>{`
        .calendar-wrapper {
          /* Mobile styles */
          @media (max-width: 640px) {
            :global(.rdrCalendarWrapper) {
              font-size: 12px;
            }

            :global(.rdrMonth) {
              width: 100% !important;
              padding: 0 !important;
            }

            :global(.rdrMonthAndYearWrapper) {
              padding-top: 8px !important;
              height: auto !important;
            }

            :global(.rdrMonthName) {
              font-size: 14px !important;
            }

            :global(.rdrWeekDays) {
              padding: 4px 0 !important;
            }

            :global(.rdrWeekDay) {
              font-size: 11px !important;
              line-height: 2em !important;
            }

            :global(.rdrDay) {
              height: 2.5em !important;
              line-height: 2.5em !important;
            }

            :global(.rdrDayNumber span) {
              font-size: 12px !important;
            }

            :global(.rdrNextPrevButton) {
              width: 24px !important;
              height: 24px !important;
            }

            :global(.rdrMonths) {
              flex-direction: column !important;
            }
          }

          /* Tablet styles */
          @media (min-width: 641px) and (max-width: 1024px) {
            :global(.rdrCalendarWrapper) {
              font-size: 13px;
            }

            :global(.rdrMonth) {
              padding: 0 8px !important;
            }

            :global(.rdrDay) {
              height: 3em !important;
              line-height: 3em !important;
            }
          }

          /* General responsive improvements */
          :global(.rdrDefinedRangesWrapper) {
            display: none !important;
          }

          :global(.rdrDateDisplayWrapper) {
            display: none !important;
          }

          :global(.rdrCalendarWrapper) {
            width: 100% !important;
            max-width: 100% !important;
          }

          :global(.rdrMonth) {
            width: 100% !important;
          }

          :global(.rdrMonthsHorizontal) {
            flex-wrap: wrap !important;
            justify-content: center !important;
          }
        }
      `}</style>
    </div>
  );
};

export default BookingCalendar;
