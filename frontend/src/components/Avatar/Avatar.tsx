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

  const intervalRef = useRef<number | null>(null);

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
    const input = getMouthInput();
    if (!input) return;
    if (intervalRef.current) return;

    intervalRef.current = window.setInterval(() => {
      const nextInput = getMouthInput();
      if (!nextInput) return;
      nextInput.value = Math.floor(Math.random() * 12) + 1;
    }, 120);
  }

  function stopTalking() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    rive?.reset({ stateMachines: STATE_MACHINE_NAME, autoplay: true });

    requestAnimationFrame(() => {
      rive?.play();
      const input = getMouthInput();
      if (input) {
        input.value = 0;
      }
    });
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
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
    <div style={{ width: 300, height: 300 }}>
      <RiveComponent />
      <button onClick={startTalking}>Start</button>
      <button onClick={stopTalking}>Stop</button>
    </div>
  );
}
