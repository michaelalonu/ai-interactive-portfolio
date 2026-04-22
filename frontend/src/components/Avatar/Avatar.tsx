import { useRive } from "@rive-app/react-canvas";
import { useEffect, useRef } from "react";

type Props = {
  onReady?: (controls: {
    startTalking: () => void;
    stopTalking: () => void;
  }) => void;
};

export default function Avatar({ onReady }: Props) {
  const STATE_MACHINE_NAME = "State Machine 1";
  const MOUTH_INPUT_NAME = "Number 1";

  const { rive, RiveComponent } = useRive({
    src: "talking-avatar.riv",
    stateMachines: STATE_MACHINE_NAME,
    autoplay: true,
  });

  const timeoutRef = useRef<number | null>(null);
  // const currentValueRef = useRef(0);

  const getMouthInput = () =>
    rive
      ?.stateMachineInputs(STATE_MACHINE_NAME)
      .find((input) => input.name === MOUTH_INPUT_NAME);

  useEffect(() => {
    const input = rive
      ?.stateMachineInputs(STATE_MACHINE_NAME)
      .find((input) => input.name === MOUTH_INPUT_NAME);
    if (!input) return;
    input.value = 0;
  }, [rive]);

  function startTalking() {
    if (timeoutRef.current) return; //prevent race condition of multipile call to start talking

    const talkLoop = () => {
      const input = getMouthInput();

      if (!input) {
        timeoutRef.current = window.setTimeout(talkLoop, 100); // if there isn't input yet, try again in a bit later.
        return;
      }

      input.value = Math.floor(Math.random() * 12) + 1;
      const delay = 20 + Math.random() * 70; // dynamic change, more real.
      timeoutRef.current = window.setTimeout(talkLoop, delay);
    };

    talkLoop();

  }

  function stopTalking() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    rive?.reset({ stateMachines: STATE_MACHINE_NAME, autoplay: true });

    const resetMouth = () => {
      rive?.play();
      const input = getMouthInput();
      if (input) {
        input.value = 0;
      }
    };

    resetMouth();
    requestAnimationFrame(resetMouth);
    setTimeout(resetMouth, 50);
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      const input = rive
        ?.stateMachineInputs(STATE_MACHINE_NAME)
        .find((input) => input.name === MOUTH_INPUT_NAME);
      if (input) {
        input.value = 0;
      }
    };
  }, [rive]);

  useEffect(() => {
    const input = getMouthInput();
    if (!input) return;

    onReady?.({ startTalking, stopTalking });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onReady]);

  return (
    <div>
      <RiveComponent />
      <button onClick={startTalking}>Start</button>
      <button onClick={stopTalking}>Stop</button>
    </div>
  );
}
