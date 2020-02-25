import React from "react";
import classnames from "classnames"
import "components/DayListItem.scss";

export default function DayListItem(props) {
  let dayClass = classnames("day-list__item", {
    "day-list__item--selected": props.selected,
    "day-list__item--full": !props.spots
  });

  let formatSpots = function (spots) {
    if (spots > 1) {
      return `${spots} spots remaining`;
    } else if (spots === 1) {
      return `${spots} spot remaining`;
    } else {
      return `no spots remaining`
    }
  }

  return (
    <li className={dayClass} onClick={() => props.setDay(props.name)} data-testid="day">

      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{formatSpots(props.spots)}</h3>
    </li>
  );
}