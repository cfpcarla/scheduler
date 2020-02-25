import React from "react"
import Button from "components/Button.js"

export default function Confirm (props) {
  return (
    <main
    id={props.id}
    className="appointment__card appointment__card--confirm"
    data-testid="confirmModal">
    <h1 className="text--semi-bold">{props.message}</h1>
    <section className="appointment__actions">
    <Button data-testid="cancelButton" danger onClick={props.onCancel}>Cancel</Button>
    <Button data-testid="confirmButton" danger onClick={props.onConfirm} >Confirm</Button>
    </section>
    </main>)
}