import React from "react";
import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "./appointment/index";
import useApplicationData from "./hooks/useApplicationData";
import {
  getAppointmentsForDay,
  getInterviewersForDay,
  getInterview
} from "../helpers/selectors";

export default function Application(props) {

  const {
    state,
    setDay,
    bookInterview,
    cancelInterview
  } = useApplicationData();

  console.log('state:', state);

  const interviewers = getInterviewersForDay(state, state.day)

  console.log('interviewers:', interviewers);

  const appointments = getAppointmentsForDay(state, state.day).map((e) => {
    const interview = getInterview(state, e.interview);

    return (
      <Appointment
        key={e.id}
        id={e.id}
        time={e.time}
        interview={interview}
        interviewers={interviewers}
        bookInterview={bookInterview}
        deleteInterview={cancelInterview}
      />
    )
  });

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            day={state.day}
            setDay={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {appointments}
        <Appointment
          key="last"
          time="5pm"
        />

      </section>
    </main>
  );
}