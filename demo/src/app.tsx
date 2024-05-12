import * as React from 'react';
import { Marquee } from '../../src/marquee';

import './style.css';

export default function App() {
  const [counter, setCounter] = React.useState([1]);

  return (
    <div id="marquee">
      <div onClick={() => setCounter((pre) => pre.concat(1))}>Click</div>
      <div
        onClick={() =>
          setCounter((pre) => pre.filter((_, index) => index !== 3))
        }
      >
        Click
      </div>
      <Marquee rate={0} startOnScreen>
        {counter.map((item, index) => (
          <div key={index} style={{ width: '100px' }}>
            {index}
          </div>
        ))}
      </Marquee>
    </div>
  );
}
