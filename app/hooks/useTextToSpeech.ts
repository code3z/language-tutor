import { useEffect, useRef } from "react";

export function useTextToSpeech(language: string) {
  if (typeof Audio === "undefined") return;

  useEffect(() => {
    let audio: HTMLAudioElement;
    const elements = document.querySelectorAll(
      "span.foreign:not(.initialized)"
    );

    const playAudio = (text: string) => {
      audio = audio || new Audio();
      audio.src = `/api/textToSpeech?language=${language}&text=${encodeURIComponent(
        text.toLowerCase()
      )}`;
      audio.play();
    };

    const mouseEnterListener = (e: Event) => {
      const text = (e.target as HTMLElement).innerText;
      playAudio(text);
    };

    const clickListener = (e: Event) => {
      const text = (e.target as HTMLElement).innerText;
      playAudio(text);
    };

    elements.forEach((element) => {
      element.addEventListener("mouseenter", mouseEnterListener);
      element.addEventListener("click", clickListener);
      element.classList.add("initialized");
    });

    return () => {
      elements.forEach((element) => {
        element.removeEventListener("mouseenter", mouseEnterListener);
        element.removeEventListener("click", clickListener);
        element.classList.remove("initialized");
      });
    };
  });
}
