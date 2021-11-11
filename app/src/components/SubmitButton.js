/** @jsx jsx */
import { jsx, css } from "@emotion/react";

const style = css({
  marginTop: "1vh",
  width: "65%",
  maxWidth: "420px",
  height: "6vh",
  maxHeight: "45px",
  fontSize: "2vmin",
  backgroundColor: "green",
  color: "white",
  border: "solid 1px green",
  borderRadius: '5px;',
  transition: "0.5s ease-in-out",
  
  "&:hover": {
    cursor: "pointer",
    transform: "scale(1.025)",
    transition: "all 0.5s ease-in-out",
  },
});

const SubmitButton = ({ text }) => {
  return (
    <button type="submit" css={style}>
      {text}
    </button>
  );
};

export default SubmitButton;
