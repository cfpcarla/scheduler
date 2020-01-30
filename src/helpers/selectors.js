function getAppointmentsForDay(state, day) {
  const filteredDay = state.days.find(d => d.name === day);
  if (filteredDay === undefined) {
    return []
  } else {
    const detailedAppointments = filteredDay.appointments.map(id => state.appointments[id])
    return detailedAppointments
  }
}

function getInterviewersForDay(state, day) {
  const appointments = getAppointmentsForDay(state, day)
  let interviews = appointments.map(appointment => appointment.interview)
  interviews = interviews.filter(Boolean) // remove null interviewers

  return interviews.map(interview => state.interviewers[interview.interviewer])
}

function getInterview(state, interview) {
  if (!interview) return null;
  return {
    ...interview,
    interviewer: state.interviewers[interview.interviewer]
  }
}
export {
  getAppointmentsForDay,
  getInterviewersForDay,
  getInterview
}