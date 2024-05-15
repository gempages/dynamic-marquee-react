import * as React from 'react';
import { Marquee } from '../../src/marquee';

import './style.css';

export default function App() {
  const [counter, setCounter] = React.useState([1]);
  const [text, setText] = React.useState('truongcount');
  const [width, setWidth] = React.useState(1200);
  const [rate, setRate] = React.useState(0);

  return (
    <div id="marquee">
      <div onClick={() => setCounter((pre) => pre.concat(1))}>Click</div>
      <div
        onClick={() =>
          setCounter((pre) =>
            pre.filter((_, index) => index !== pre.length - 1),
          )
        }
      >
        ++
      </div>
      <div onClick={() => setWidth((pre) => pre - 100)}>width</div>
      <div onClick={() => setRate(!rate ? -50 : 0)}>rate</div>

      <Marquee rate={rate} startOnScreen>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              height: '60px',
              marginRight: '40px',
              width: `${width}px`,
              wordBreak: 'break-all',
              whiteSpace: 'wrap',
              textWrap: 'wrap',
            }}
          >
            truong bkhn truongtruongtruongtruongtruongtruongtruongtruong truong
            bkhn truongtruongtruongtruongtruongtruongtruongtruong truong bkhn
            truongtruongtruongtruongtruongtruongtruongtruong
          </div>
          <div
            style={{
              height: '60px',
              marginRight: '40px',
            }}
            contentEditable
            onInput={(e) => {
              setText(e.currentTarget.innerText);
            }}
          >
            {text}
          </div>
          <div
            style={{
              height: '60px',
              marginRight: '40px',
              background: 'blue',
            }}
          >
            60px
          </div>
        </div>
      </Marquee>
    </div>
  );
}
