import React from "react";
import BigCalendar, {
  Calendar,
  Views,
  dayjsLocalizer,
} from "react-big-calendar";
import moment, { now } from "moment";
import * as dates from "../../utils/dates";
import "react-big-calendar/lib/css/react-big-calendar.css";
import zhtw from "dayjs/locale/zh-tw";
import dayjs from "dayjs";

dayjs.locale(zhtw);

const dLocalizer = dayjsLocalizer(dayjs);
// const mLocalizer = momentLocalizer(moment);

// const ColoredDateCellWrapper = ({ children }) =>
//   React.cloneElement(React.Children.only(children), {
//     style: {
//       backgroundColor: "lightblue",
//     },
//   });

const backgroundEvents = [
  {
    id: 0,
    title: "Available for Clients",
    start: new Date(2023, 3, 13, 6),
    end: new Date(2023, 3, 13, 18),
  },
];

const events = [
  {
    id: 0,
    title: "All Day Event very long title",
    allDay: true,
    start: new Date(2023, 9, 0),
    end: new Date(2023, 9, 1),
  },
  {
    id: 1,
    title: "Long Event",
    start: new Date(2023, 3, 7),
    end: new Date(2023, 3, 10),
  },

  {
    id: 2,
    title: "DTS STARTS",
    start: new Date(2023, 2, 13, 0, 0, 0),
    end: new Date(2023, 2, 20, 0, 0, 0),
  },

  {
    id: 3,
    title: "DTS ENDS",
    start: new Date(2023, 10, 6, 0, 0, 0),
    end: new Date(2023, 10, 13, 0, 0, 0),
  },

  {
    id: 4,
    title: "Some Event",
    start: new Date(2023, 3, 9, 0, 0, 0),
    end: new Date(2023, 3, 10, 0, 0, 0),
  },
  {
    id: 5,
    title: "Conference",
    start: new Date(2023, 3, 11),
    end: new Date(2023, 3, 13),
    desc: "Big conference for important people",
  },
  {
    id: 6,
    title: "Meeting",
    start: new Date(2023, 3, 12, 10, 30, 0, 0),
    end: new Date(2023, 3, 12, 12, 30, 0, 0),
    desc: "Pre-meeting meeting, to prepare for the meeting",
  },
  {
    id: 7,
    title: "Lunch",
    start: new Date(2023, 3, 12, 12, 0, 0, 0),
    end: new Date(2023, 3, 12, 13, 0, 0, 0),
    desc: "Power lunch",
  },
  {
    id: 8,
    title: "Meeting",
    start: new Date(2023, 3, 12, 14, 0, 0, 0),
    end: new Date(2023, 3, 12, 15, 0, 0, 0),
  },
  {
    id: 9,
    title: "Happy Hour",
    start: new Date(2023, 3, 12, 17, 0, 0, 0),
    end: new Date(2023, 3, 12, 17, 30, 0, 0),
    desc: "Most important meal of the day",
  },
  {
    id: 10,
    title: "Dinner",
    start: new Date(2023, 3, 12, 20, 0, 0, 0),
    end: new Date(2023, 3, 12, 21, 0, 0, 0),
  },
  {
    id: 11,
    title: "Planning Meeting with Paige",
    isSchedule: true,
    start: new Date(2023, 3, 13, 8, 0, 0),
    end: new Date(2023, 3, 13, 10, 30, 0),
  },
  {
    id: 11.1,
    title: "Inconvenient Conference Call",
    start: new Date(2023, 3, 13, 9, 30, 0),
    end: new Date(2023, 3, 13, 12, 0, 0),
  },
  {
    id: 11.2,
    title: "Project Kickoff - Lou's Shoes",
    start: new Date(2023, 3, 13, 11, 30, 0),
    end: new Date(2023, 3, 13, 14, 0, 0),
  },
  {
    id: 11.3,
    title: "Quote Follow-up - Tea by Tina",
    start: new Date(2023, 3, 13, 15, 30, 0),
    end: new Date(2023, 3, 13, 16, 0, 0),
  },
  {
    id: 12,
    title: "Late Night Event",
    start: new Date(2023, 3, 17, 19, 30, 0),
    end: new Date(2023, 3, 18, 2, 0, 0),
  },
  {
    id: 12.5,
    title: "Late Same Night Event",
    start: new Date(2023, 3, 17, 19, 30, 0),
    end: new Date(2023, 3, 17, 23, 30, 0),
  },
  {
    id: 13,
    title: "Multi-day Event",
    start: new Date(2023, 3, 20, 19, 30, 0),
    end: new Date(2023, 3, 22, 2, 0, 0),
  },
  {
    id: 14,
    title: "Today",
    start: new Date(new Date().setHours(new Date().getHours() - 3)),
    end: new Date(new Date().setHours(new Date().getHours() + 3)),
  },
  {
    id: 15,
    title: "Point in Time Event",
    start: now,
    end: now,
  },
  {
    id: 16,
    title: "Video Record",
    start: new Date(2023, 3, 14, 15, 30, 0),
    end: new Date(2023, 3, 14, 19, 0, 0),
  },
  {
    id: 17,
    title: "Dutch Song Producing",
    start: new Date(2023, 3, 14, 16, 30, 0),
    end: new Date(2023, 3, 14, 20, 0, 0),
  },
  {
    id: 18,
    title: "Itaewon Meeting",
    start: new Date(2023, 3, 14, 16, 30, 0),
    end: new Date(2023, 3, 14, 17, 30, 0),
  },
  {
    id: 19,
    title: "Online Coding Test",
    start: new Date(2023, 3, 14, 17, 30, 0),
    end: new Date(2023, 3, 14, 20, 30, 0),
  },
  {
    id: 20,
    title: "An overlapped Event",
    start: new Date(2023, 3, 14, 17, 0, 0),
    end: new Date(2023, 3, 14, 18, 30, 0),
  },
  {
    id: 21,
    title: "Phone Interview",
    start: new Date(2023, 3, 14, 17, 0, 0),
    end: new Date(2023, 3, 14, 18, 30, 0),
  },
  {
    id: 22,
    title: "Cooking Class",
    start: new Date(2023, 3, 14, 17, 30, 0),
    end: new Date(2023, 3, 14, 19, 0, 0),
  },
  {
    id: 23,
    title: "Go to the gym",
    start: new Date(2023, 3, 14, 18, 30, 0),
    end: new Date(2023, 3, 14, 20, 0, 0),
  },
  {
    id: 24,
    title: "DST ends on this day (Europe)",
    start: new Date(2022, 9, 30, 0, 0, 0),
    end: new Date(2022, 9, 30, 4, 30, 0),
  },
  {
    id: 25,
    title: "DST ends on this day (America)",
    start: new Date(2022, 10, 6, 0, 0, 0),
    end: new Date(2022, 10, 6, 4, 30, 0),
  },
  {
    id: 26,
    title: "DST starts on this day (America)",
    start: new Date(2023, 2, 12, 0, 0, 0),
    end: new Date(2023, 2, 12, 4, 30, 0),
  },
  {
    id: 27,
    title: "DST starts on this day (Europe)",
    start: new Date(2023, 2, 26, 0, 0, 0),
    end: new Date(2023, 2, 26, 4, 30, 0),
  },
];

export default function Basic({
  localizer = dLocalizer,
  showDemoLink = true,
  ...props
}) {
  const { defaultDate, max, views } = React.useMemo(
    () => ({
      //   components: {
      //     timeSlotWrapper: ColoredDateCellWrapper,
      //   },
      defaultDate: new Date(2023, 3, 1),
      max: dates.add(dates.endOf(new Date(2023, 17, 1), "day"), -1, "hours"),
      views: Object.keys(Views).map((k) => Views[k]),
    }),
    []
  );

  return (
    <>
      <div style={{ height: 600 }} {...props}>
        <Calendar
          backgroundEvents={backgroundEvents}
          //   components={components}
          culture="zhtw"
          defaultDate={defaultDate}
          events={events}
          localizer={localizer}
          max={max}
          showMultiDayTimes
          step={60}
          views={views}
          eventPropGetter={(event, start, end, isSelected) => {
            let newStyle = {
              backgroundColor: "lightgrey",
              color: "black",
              borderRadius: "0px",
              border: "none",
            };

            if (event.isSchedule) {
              newStyle.backgroundColor = "#8dcdec";
            }

            return {
              className: "",
              style: newStyle,
            };
          }}
        />
      </div>
    </>
  );
}
