import React from "react";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status"
import useVisualMode from "../hooks/useVisualMode";
import Error from "./Error";

import "./styles.scss";
import Confirm from "./Confirm";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETE = "DELETE";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

export default function Appointment(props) {

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props
      .bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(error => transition(ERROR_SAVE, true));
  }

  function del() {
    transition(DELETE, true);
    props
      .cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch(error => transition(ERROR_DELETE, true));
  }

  return (<article className="appointment" data-testid="appointment">
    <Header time={props.time} />

    {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
    {mode === SHOW && (
      <Show
        student={props.interview.student}
        interviewer={props.interview.interviewer}
        onEdit={() => transition(EDIT)}
        onDelete={() => transition(CONFIRM)}
      />
    )}
    {mode === CREATE &&
      <Form
        name={""}
        interviewer={""}
        onCancel={() => back()}
        interviewers={props.interviewers}
        onSave={save}
      />
    }
    {mode === SAVING &&
      < Status
        message={'Saving'}
      />
    }
    {mode === DELETE &&
      < Status
        message={'Deleting'}
      />
    }
    {mode === CONFIRM &&
      < Confirm
        message={'Delete?'}
        onConfirm={() => del()}
        onCancel={() => back()}
      />
    }
    {mode === EDIT &&
      <Form
        onCancel={() => back()}
        interviewers={props.interviewers}
        onSave={save}
        name={props.interview && props.interview.student}
        interviewer={props.interview && props.interview.interviewer.id}
      />
    }
    {mode === ERROR_SAVE &&
      <Error
        message={`Appointment not saved`}
        onClose={() => back()}
      />
    }
    {mode === ERROR_DELETE &&
      <Error
        message={`Error deleting appointment`}
        onClose={() => back()}
      />

    }


  </article>
  )

}