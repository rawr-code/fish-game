import { useEffect, useRef, useState } from 'react';
import { IRefPhaserGame, PhaserGame } from './game/PhaserGame';
import { updateSpawnTime } from './game/EventBus';

function App() {
  //  References to the PhaserGame component (game and scene are exposed)
  const phaserRef = useRef<IRefPhaserGame | null>(null);

  const [spawnTime, setSpawnTime] = useState('1000');

  useEffect(() => {
    if (phaserRef.current) {
      updateSpawnTime(+spawnTime);
    }
  }, [spawnTime]);

  return (
    <div id="app" className="flex flex-col space-y-5">
      <div className="flex space-x-5">
        <select
          className="border p-5 bg-transparent"
          value={spawnTime}
          onChange={({ target }) => {
            setSpawnTime(target.value);
          }}
        >
          <option value="10">10</option>
          <option value="100">100</option>
          <option value="500">500</option>
          <option value="1000">1000</option>
          <option value="2000">2000</option>
          <option value="5000">5000</option>
        </select>
      </div>
      <PhaserGame ref={phaserRef} />
    </div>
  );
}

export default App;
