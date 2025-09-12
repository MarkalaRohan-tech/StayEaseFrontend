import { useState, useEffect } from "react";
import { DateRange } from "react-date-range";
import axios from "axios";
import { addDays } from "date-fns";
import "react-date-range/dist/styles.css"; // main css
import "react-date-range/dist/theme/default.css"; // theme css

const BookingCalendar = ({ propertyId, onDateSelect }) => {
  const [bookedRanges, setBookedRanges] = useState([]);
  const [selection, setSelection] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      key: "selection",
      color: "#facc15", // 🌟 yellow highlight
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
    <div className="max-w-lg mx-auto p-6 bg-white rounded-2xl shadow-lg border border-gray-200 flex flex-col justify-center items-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Select Your Dates
      </h2>

      <DateRange
        ranges={selection} // ✅ only keep user-selected range
        onChange={(item) => {
          if (item.selection) {
            setSelection([item.selection]);
            onDateSelect(item.selection);
          }
        }}
        minDate={new Date()}
        disabledDates={bookedDates} // ✅ booked dates stay greyed out
      />

      <div className="flex justify-evenly gap-5 text-sm text-gray-600 mt-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-yellow-400 rounded"></span> Selected
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-gray-400 rounded"></span> Booked
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;
