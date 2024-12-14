import { useCallback, useEffect, useRef, useState } from 'react';
import { IRefPhaserGame, PhaserGame } from './game/PhaserGame';
import { eventSystem, updateSpawnTime } from './game/EventBus';
import { SpeechRecognitionSystem } from './game/systems/SpeechRecognitionSystem';

function App() {
  //  References to the PhaserGame component (game and scene are exposed)
  const phaserRef = useRef<IRefPhaserGame | null>(null);

  const [speechSystem, setSpeechSystem] =
    useState<SpeechRecognitionSystem | null>(null);
  const [isListening, setIsListening] = useState(false);

  const [spawnTime, setSpawnTime] = useState('1000');

  useEffect(() => {
    if (phaserRef.current) {
      updateSpawnTime(+spawnTime);
    }
  }, [spawnTime]);

  useEffect(() => {
    const system = new SpeechRecognitionSystem(eventSystem);
    setSpeechSystem(system);

    return () => {
      system.stop();
    };
  }, []);

  const toggleVoiceRecognition = useCallback(() => {
    if (speechSystem) {
      speechSystem.toggle();
      setIsListening(!isListening);
    }
  }, [isListening, speechSystem]);

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
      <div>
        <button
          onClick={toggleVoiceRecognition}
          className={`voice-button ${isListening ? 'active' : ''}`}
        >
          {isListening
            ? 'Detener reconocimiento de voz'
            : 'Iniciar reconocimiento de voz'}
        </button>
        {isListening && (
          <div className="voice-indicator">Escuchando comandos de voz...</div>
        )}
      </div>
      <PhaserGame ref={phaserRef} />
    </div>
  );
}

export default App;
