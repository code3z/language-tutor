"use client";

import {
  ArrowRightIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import Button from "./Button";
import Link from "next/link";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter, useSearchParams } from "next/navigation";
import { ChatItem, LessonItem } from "../lesson/[language]/[id]/page";
import { debounce } from "../utils/debounce";
import ChatMessage from "./ChatMessage";
import { useChatState } from "../hooks/useChatState";
import { useLessonStatus } from "../hooks/useLessonStatus";
import { useEffect } from "react";

export default function Chat({
  language,
  id,
  lesson,
  startItemIndex,
  initialChat,
}: {
  language: string;
  id: number;
  lesson: LessonItem[];
  startItemIndex: number;
  startChatIndex: number;
  initialChat: ChatItem[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    currentLessonItem,
    chat,
    input,
    setInput,
    formattedText,
    chatFormRef,
    nextIsChallenge,
    loading,
    handleSubmit,
    dontKnow,
  } = useChatState(lesson, startItemIndex, initialChat);

  const { done } = useLessonStatus(
    language,
    id,
    currentLessonItem,
    lesson.length
  );

  // Update URL when currentLessonItem changes
  useEffect(() => {
    const updateURL = debounce(() => {
      if (currentLessonItem === startItemIndex) return;

      const current = new URLSearchParams(Array.from(searchParams.entries()));
      const newStartItem = Math.floor(currentLessonItem).toString();
     
      if (current.get("startItem") !== newStartItem) {
        current.set("startItem", newStartItem);
        router.replace(`/lesson/${language}/${id}?${current}`, {
          scroll: false,
        });
      }
    }, 300);

    updateURL();
  }, [
    currentLessonItem,
    router,
    language,
    id,
    searchParams,
    startItemIndex,
    chatFormRef,
  ]);

  if (startItemIndex > lesson.length - 1) {
    return (
      <div>
        Error: Start item index is greater than lesson length{" "}
        <Link
          href={`/lesson/${language}/${id}`}
          className="text-primary underline"
        >
          Restart this lesson
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background mx-auto px-16 h-screen max-w-3xl py-16 flex flex-col">
      <div className="fixed top-0 left-0 w-screen">
        <div className="h-16 w-full bg-background px-16" />
        <div className="flex items-center gap-3 max-w-3xl mx-auto bg-background px-16">
          <div className="relative flex-grow">
            <div className="w-full h-4 bg-[#fef8f5] rounded-full border border-black/30" />
            <div
              className={
                "absolute top-0 left-0 h-4 absolute bg-[#f68c5a] rounded-full transition-all duration-150" +
                (Math.floor(currentLessonItem) / (lesson.length - 1) < 0.03
                  ? " rounded-r-none"
                  : "")
              }
              style={{
                width:
                  (Math.floor(currentLessonItem) / (lesson.length - 1)) * 100 +
                  "%",
              }}
            />
          </div>
          <Link href={"/learn/" + language} className="w-6 h-6">
            <XMarkIcon className="icon stroke-secondary-text stroke-2 !w-full !h-full" />
          </Link>
        </div>
        <div className="bg-gradient-to-b from-background to-transparent h-8 w-full px-16"></div>
      </div>

      <div className="flex-grow flex items-center justify-center pb-32 pt-16">
        <div className="w-full flex flex-col" id="chat">
          {chat.map((item, index) => (
            <ChatMessage
              key={
                "id" in item
                  ? item.id
                  : "user" in item
                  ? item.user + index
                  : index
              }
              item={item}
              currentLessonItem={currentLessonItem}
              formattedText={formattedText}
              language={language}
            />
          ))}
          {loading && (
            <div className="w-3 h-3 bg-secondary-text rounded-full animate-pulse" />
          )}
          {!done && (
            <form className="mt-8" onSubmit={handleSubmit} ref={chatFormRef}>
              {!(
                nextIsChallenge &&
                lesson[currentLessonItem] &&
                !("answer" in lesson[currentLessonItem])
              ) && (
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="outline-primary-text px-6 py-2.5 bg-white rounded-md shadow text-secondary-text font-normal font-serif mr-5"
                  placeholder="Your amazing answer..."
                />
              )}
              <Button
                disabled={(!nextIsChallenge && input === "") || loading}
                text="Go"
                small
                Icon={ArrowRightIcon}
              />
            </form>
          )}
          {!done &&
            !(
              nextIsChallenge &&
              lesson[currentLessonItem] &&
              !("answer" in lesson[currentLessonItem])
            ) && (
              <button
                onClick={dontKnow}
                className="text-secondary-text text-left mt-2 font-medium"
              >
                <QuestionMarkCircleIcon className="icon stroke-2" /> I don&apos;t
                know
              </button>
            )}
          {done && (
            <Button
              to={`/learn/${language}`}
              text="Back to lessons"
              customClassName="mt-6 w-fit"
            />
          )}
        </div>
      </div>
    </div>
  );
}
