/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import SubmitButton from "./SubmitButton";

const formStyle = css`
  width: 100%;
  align-self: center;
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const inputStyle = css`
  text-align: left;
  padding: 3px;
  width: 90%;
  max-width: 420px;
  height: 6vh;
  max-height: 45px;
  border: solid 1px black;
  border-radius: 5px;
  margin-top: 1vh;
  font-size: 16px;
  font-family: "Courier New";
`;

const SubmitTake = ({ onSubmit, onChange, message }) => {
  return (
    <form onSubmit={onSubmit} css={formStyle}>
      <textarea
        css={inputStyle}
        type="text"
        name="text"
        placeholder="your hottest take"
        onChange={onChange}
        value={message}
        autoComplete="off"
        aria-label={`Message Input`}
        maxLength="280"
      />
      <SubmitButton text="Send Take" />
    </form>
  );
};

export default SubmitTake;
