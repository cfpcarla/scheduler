export function getInterview(state,interview) {
  if (interview) {
    const stateUpdated = {...interview, interviewer:state.interviewers[interview.interviewer]}//not right?

    return stateUpdated
  } else {
    return null
  }
}

export function getAppointmentsForDay(state, day) {
  const filteredDays = state.days.filter( mappedDay => mappedDay.name === day);
  if (!filteredDays.length) { return []; }
  const appointmentArray = [];
  for (let item in filteredDays[0].appointments){

    appointmentArray.push(state.appointments[filteredDays[0].appointments[item]])
  }
  return appointmentArray
}

export  function getInterviewersForDay(state, day) {
  if (!state.interviewers) return [];
  const filteredDay = state.days.filter( mappedDay => mappedDay.name === day)[0];

  if (!filteredDay) return [];

  if (!filteredDay.interviewers) return [];

  const result =  Object.values(state.interviewers).filter( interviewer => filteredDay.interviewers.includes(interviewer.id))

  return result;
}
