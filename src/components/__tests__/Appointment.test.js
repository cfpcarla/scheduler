import React from "react";
import Application from "components/Application"
import Appointment from "components/appointment/index";
// import useApplicationData from "../hooks/useApplicationData";
import axios from "../../__mocks__/axios";
import {
  render,
  cleanup,
  waitForElement,
  fireEvent,
  prettyDOM,
  getByText,
  getByPlaceholderText,
  getByAltText,
  getAllByTestId,
  queryByText,
  getByDisplayValue,
  queryByAltText
} from "@testing-library/react";

afterEach(cleanup);

describe("Appointment", () => {
  it("renders without crashing", () => {
    render(<Appointment />);
  });

  //Default to monday
  it("defaults to Monday and changes the schedule when a new day is selected", () => {

    const { getByText } = render(<Application  />);

    return waitForElement(() => getByText("Monday"))
    .then(res => {
      fireEvent.click(getByText("Tuesday"));
      expect(getByText("Leopold Silvers")).toBeInTheDocument();
    })
  });

  //Loads data, books
  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container, debug } = render(<Application  />)

    await waitForElement(() => getByText(container, "Archie Cohen"))

    const appointments = getAllByTestId(container, "appointment");

    const appointment = appointments[0]

    fireEvent.click(getByAltText(appointment, "Add"));

    await fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    const interviewList = getAllByTestId(container, "interview")[0];

    await fireEvent.click(getAllByTestId(interviewList, "interview-item")[0])

    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    await waitForElement(() => queryByText(appointment, "Lydia Miller-Jones"));

    expect(getByAltText(appointment, "Edit")).toBeInTheDocument();
    expect(getByAltText(appointment, "Delete")).toBeInTheDocument();

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
      );

      expect(getByText(day, "no spots remaining")).toBeInTheDocument();
    })

    //Loads data, cancels
    it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
      const { container, debug } = render(<Application  />);
      await waitForElement(() => getByText(container, "Archie Cohen"));
      const appointment = getAllByTestId(container, "appointment").find(appointment => queryByText(appointment, "Archie Cohen"));

      fireEvent.click(queryByAltText(appointment, "Delete"));

      expect(getByText(appointment, "Delete the appointment?")).toBeInTheDocument();

      fireEvent.click(getByText(appointment, "Confirm"));
      expect(getByText(appointment, "Deleting")).toBeInTheDocument();
      await waitForElement(() => getByAltText(appointment, "Add"));

      const day = getAllByTestId(container, "day").find(day =>
        queryByText(day, "Monday")
        );

        expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
      });

      //Loads data, edits
      it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
        const { container, debug } = render(<Application   />);
        await waitForElement(() => getByText(container, "Archie Cohen"));
        const appointment = getAllByTestId(container, "appointment").find(appointment => queryByText(appointment, "Archie Cohen"));

        fireEvent.click(queryByAltText(appointment, "Edit"));

        fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
          target: { value: "Lydia Miller-Jones" }
        });

        fireEvent.click(getByText(appointment, "Save"));

        expect(getByText(appointment, "Saving")).toBeInTheDocument();

        await waitForElement(() => queryByText(appointment, "Lydia Miller-Jones"));
        const day = getAllByTestId(container, "day").find(day =>
          queryByText(day, "Monday")
          );

          expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
        })

        // Shows the save error
        it("shows the save error when failing to save an appointment", async () => {
          axios.put.mockRejectedValueOnce();
          const { container, debug } = render(<Application />);

          await waitForElement(() => getByText(container, "Archie Cohen"));

          const appointment = getAllByTestId(container, "appointment").find(appointment => queryByText(appointment, "Archie Cohen"));

          fireEvent.click(queryByAltText(appointment, "Edit"));

          fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
            target: { value: "Lydia Miller-Jones" }
          });

          fireEvent.click(getByText(appointment, "Save"));

          expect(getByText(appointment, "Saving")).toBeInTheDocument();

          await waitForElement(() => getByText(container, "Error"));

          fireEvent.click(getByAltText(appointment, "Close"));

          expect(getByDisplayValue(appointment, "Archie Cohen")).toBeInTheDocument();
        });

        //Shows the delete
        it("shows the delete error when failing to delete an existing appointment", async () => {
          axios.delete.mockRejectedValueOnce();
          const { container, debug } = render(<Application   />);
          await waitForElement(() => getByText(container, "Archie Cohen"));
          const appointment = getAllByTestId(container, "appointment").find(appointment => queryByText(appointment, "Archie Cohen"));

          fireEvent.click(queryByAltText(appointment, "Delete"));

          expect(getByText(appointment, "Delete the appointment?")).toBeInTheDocument();

          fireEvent.click(getByText(appointment, "Confirm"));

          expect(getByText(appointment, "Deleting")).toBeInTheDocument();
          await waitForElement(() => getByText(appointment, "Error"));

          fireEvent.click(getByAltText(appointment, "Close"));

          expect(getByText(appointment, "Archie Cohen")).toBeInTheDocument();
        })
      });