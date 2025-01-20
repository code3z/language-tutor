"use client";

import { useEffect, useState } from "react";
import Button from "./Button";
import { ArrowRightIcon, CheckBadgeIcon, LockClosedIcon } from "@heroicons/react/24/outline";

interface Lesson {
  name: string;
  language: string;
  number: number;
  minutes_to_complete: number;
}

interface LessonCardProps {
  lesson: Lesson;
  language: string;
  status: string | undefined;
  isActive: boolean;
  onClick: () => void;
  isLocked: boolean;
}

function LessonCard({ lesson, language, status, isActive, onClick, isLocked }: LessonCardProps) {
  console.log(status, "status")
  if (isActive) {
    return (
      <div className="my-8 max-w-lg rounded-2xl shadow border-2 border-black/10 px-8 py-6 text-left text-base transition-all duration-300 transform">
        <h2 className="mb-2 text-primary-text text-2xl">
          Lesson {lesson.number}: {lesson.name} {status === "done" ? <CheckBadgeIcon className="icon stroke-2" aria-label="Completed" /> : ""}
        </h2>
        <p className="mb-6 text-secondary-text text-lg">
          ~ {lesson.minutes_to_complete} {lesson.minutes_to_complete === 1 ? "minute" : "minutes"}
        </p>
        <Button
          small
          text={status && status !== "done" ? "Continue" : (status === "done" ? "Redo" : "Begin")}
          Icon={ArrowRightIcon}
          to={`/lesson/${language}/${lesson.number}${status && status !== "done" ? `?startItem=${status}` : ""}`}
          shadow={false}
        />
      </div>
    );
  }

  const Icon = status === "done" ? CheckBadgeIcon : 
               isLocked ? LockClosedIcon : 
               ArrowRightIcon;

  return (
    <button 
      onClick={onClick} 
      className={"flex items-center gap-2" + " " + ((status !== "done" && !isLocked) ? "text-primary-text" : "")} 
      disabled={isLocked}
      aria-label={`Select Lesson ${lesson.number}: ${lesson.name}${isLocked ? ' (Locked)' : ''}`}
    >
      Lesson {lesson.number}: {lesson.name}
      <Icon className="w-6 h-6 stroke-2" aria-label={status === "done" ? "Completed" : isLocked ? "Locked" : ""} />
    </button>
  );
}

interface LessonsProps {
  language: string;
  lessons: Lesson[];
  status: { [key: string]: string };
  defaultActiveLesson: number;
}

export default function Lessons({ language, lessons, status, defaultActiveLesson }: LessonsProps) {
  const [activeLesson, setActiveLesson] = useState<number>(defaultActiveLesson);
  
  const allLessonsCompleted = lessons.every(lesson => 
    status[lesson.number.toString()] === "done"
  );

  return (
    <div>
      {allLessonsCompleted && (
        <div className="mb-8 p-6 rounded-2xl border border-black/20 font-serif">
          <h2 className="text-2xl font-semibold text-primary-text mb-2">Congratulations! 🎉</h2>
          <p className="text-secondary-text">You've completed all of our Swahili lessons! Feel free to review any lesson.<br/> If you'd like to learn more, give feedback, or sponsor more lessons, please email ian@ianc.me</p>
        </div>
      )}
      <div role="list" aria-label="Available lessons">
        {lessons.map((lesson, index) => (
          <div
            key={index}
            className={`block my-3 text-xl font-serif text-secondary-text transition-all duration-300 ${
              activeLesson === index 
                ? 'scale-100 opacity-100' 
                : `scale-95 opacity-60 ${index <= defaultActiveLesson ? "hover:opacity-80" : ""}`
            }`}
            role="listitem"
          >
            <LessonCard
              lesson={lesson}
              language={language}
              status={status[lesson.number.toString()]}
              isActive={activeLesson === index}
              onClick={() => setActiveLesson(index)}
              isLocked={index > defaultActiveLesson}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
