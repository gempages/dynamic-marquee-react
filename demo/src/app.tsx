import * as React from 'react';
import { Marquee } from '../../src/marquee';

import './style.css';

export default function App() {
  const [counter, setCounter] = React.useState([1]);
  const [width, setWidth] = React.useState(1000);
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
      <div onClick={() => setRate(!rate ? 50 : 0)}>rate</div>
      <Marquee rate={rate} startOnScreen>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {counter.map((item, index) => (
            <div
              style={{
                textWrap: 'wrap',
                marginRight: '40px',
                width: `${width}px`,
                wordBreak: 'break-all',
              }}
              key={index}
            >
              truongnctruongnctruongnctruongnctruongnctruongnc
            </div>
          ))}
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
