import * as React from 'react';
import { Marquee } from '../../src/marquee';

import './style.css';

export default function App() {
  const [counter, setCounter] = React.useState([1]);
  const [text, setText] = React.useState('truongcount');
  const [width, setWidth] = React.useState(2200);
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
      <div onClick={() => setWidth(width === 2200 ? 400 : 2200)}>width</div>
      <div onClick={() => setRate(!rate ? -550 : 0)}>rate</div>

      <Marquee key={1} rate={rate} startOnScreen>
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
              width: width + 'px',
              wordBreak: 'break-all',
              whiteSpace: 'wrap',
              textWrap: 'wrap',
            }}
          >
            truong bkhn truongtruongtruongtruongtruongtruongtruongtruon truong
            bkhn truongtruongtruongtruongtruongtruongtruongtruontruong bkhn
            truongtruongtruongtruongtruongtruongtruongtruontruong bkhn
            truongtruongtruongtruongtruongtruongtruongtruontruong bkhn
            truongtruongtruongtruongtruongtruongtruongtruon
          </div>
          <div
            style={{
              height: '60px',
             
              marginRight: '40px',
            }}
            contentEditable
          
            onInput={(e) => setText(e.currentTarget.innerText)}
          >
            {text}
          </div>
        </div>
      </Marquee>
    </div>
  );
}
