/** @jsx jsx */
import { jsx, css } from '@emotion/react';

const style = css`
    border: solid 1px grey;
    margin: 5px;
    padding: 5px;
`

const TakesCard = ({ take }) => {
    const { text, timestamp } = take;
    return (
      <div css={style}>
        <h3>{text}</h3>
        <div>{timestamp.toLocaleString()}</div>
      </div>
    );
  };

  export default TakesCard;