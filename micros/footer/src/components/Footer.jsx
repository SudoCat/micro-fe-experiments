import React from "react";

export default function Footer(props) {
  return (
    <footer onClick={() => alert("HYDRATED")}>
      <h3>{props.title}</h3>
    </footer>
  );
}
