import React, { useReducer, useEffect } from "react";
 import axios from "axios";
import  reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW
} from "../../reducers/application";


export default function useApplicationData() {
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviwers: {}
  })

  const setDay = day => dispatch({ type: SET_DAY, day })

  useEffect(() => {
    let promiseDays = axios.get(`/api/days`);
    let promiseAppointments = axios.get(`/api/appointments`);
    let promiseInterviewers = axios.get(`/api/interviewers`);


    Promise.all([
      promiseDays,
      promiseAppointments,
      promiseInterviewers
    ]).then((all) => {
      dispatch({
        type: SET_APPLICATION_DATA,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data
      })  });
    }, []);
  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview
    };
    return axios.put(`api/appointments/${id}`, appointment)
      .then(() => {
        if (!state.appointments[id].interview) {
          const dayObject = state.days.find(day => day.name === state.day);
          state.days[dayObject.id - 1].spots--;
          dispatch({ type: SET_INTERVIEW, id, interview })
        }else{
          dispatch({ type: SET_INTERVIEW, id, interview })
        }
      })
  }

  //deletes the appointment
  const cancelInterview = (id) => {
    return axios.delete(`/api/appointments/${id}`)
      .then(() => {
        const dayObject = state.days.find(day => day.name === state.day);
        state.days[dayObject.id - 1].spots++;
        dispatch({ type: SET_INTERVIEW, id, interview: null })
      })
  }

  const formatSpots = (prop) => {
    if(prop > 0) {
      return (
        <span>
          <span data-testid="spotsRemaining">{prop}</span> spot{prop > 1 && 's'} remaining
        </span>
      )
    }
    return (
      <span>
        <span data-testid="spotsRemaining">no</span> spots remaining
      </span>
    )

  }
  return {
    state,
    setDay,
    bookInterview,
    cancelInterview,
    formatSpots
  }

}
