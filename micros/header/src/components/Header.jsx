import React from "react";

export default function Header(props) {
  return (
    <header onClick={() => alert("HYDRATED")}>
      <h1>{props.title}</h1>
    </header>
  );
}
