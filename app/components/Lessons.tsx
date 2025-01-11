"use client";

import { useEffect, useState } from "react";
import Button from "./Button";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { supabase } from "../supabaseClient";

const lessons = [
  {
    lesson_number: 1,
    lesson_name: "Greetings and Introductions",
    minutes_to_complete: 6,
    new_words: 8,
  },
  {
    lesson_number: 2,
    lesson_name: "Basic Numbers",
    minutes_to_complete: 5,
    new_words: 6,
  },
  {
    lesson_number: 3,
    lesson_name: "Common Phrases",
    minutes_to_complete: 8,
    new_words: 10,
  },
  {
    lesson_number: 4,
    lesson_name: "Family Members",
    minutes_to_complete: 7,
    new_words: 9,
  },
  {
    lesson_number: 5,
    lesson_name: "Simple Verbs",
    minutes_to_complete: 9,
    new_words: 10,
  },
  {
    lesson_number: 6,
    lesson_name: "The Weather",
    minutes_to_complete: 6,
    new_words: 5,
  },
  {
    lesson_number: 7,
    lesson_name: "Ordering Food",
    minutes_to_complete: 10,
    new_words: 7,
  },
  {
    lesson_number: 8,
    lesson_name: "Shopping Vocabulary",
    minutes_to_complete: 7,
    new_words: 8,
  },
  {
    lesson_number: 9,
    lesson_name: "Colors and Shapes",
    minutes_to_complete: 5,
    new_words: 6,
  },
  {
    lesson_number: 10,
    lesson_name: "Days of the Week",
    minutes_to_complete: 4,
    new_words: 7,
  },
  {
    lesson_number: 11,
    lesson_name: "Months and Seasons",
    minutes_to_complete: 6,
    new_words: 6,
  },
  {
    lesson_number: 12,
    lesson_name: "Telling Time",
    minutes_to_complete: 8,
    new_words: 8,
  },
  {
    lesson_number: 13,
    lesson_name: "Simple Questions",
    minutes_to_complete: 7,
    new_words: 5,
  },
  {
    lesson_number: 14,
    lesson_name: "Basic Grammar Rules",
    minutes_to_complete: 12,
    new_words: 0,
  },
  {
    lesson_number: 15,
    lesson_name: "Transportation Terms",
    minutes_to_complete: 6,
    new_words: 9,
  },
  {
    lesson_number: 16,
    lesson_name: "Jobs and Professions",
    minutes_to_complete: 7,
    new_words: 8,
  },
  {
    lesson_number: 17,
    lesson_name: "Hobbies and Activities",
    minutes_to_complete: 8,
    new_words: 10,
  },
  {
    lesson_number: 18,
    lesson_name: "Health and Medicine",
    minutes_to_complete: 10,
    new_words: 9,
  },
  {
    lesson_number: 19,
    lesson_name: "Describing People",
    minutes_to_complete: 9,
    new_words: 8,
  },
  {
    lesson_number: 20,
    lesson_name: "Household Items",
    minutes_to_complete: 6,
    new_words: 7,
  },
  {
    lesson_number: 21,
    lesson_name: "The Animal Kingdom",
    minutes_to_complete: 7,
    new_words: 10,
  },
  {
    lesson_number: 22,
    lesson_name: "Nature Words",
    minutes_to_complete: 5,
    new_words: 8,
  },
  {
    lesson_number: 23,
    lesson_name: "Polite Expressions",
    minutes_to_complete: 6,
    new_words: 6,
  },
  {
    lesson_number: 24,
    lesson_name: "Cultural Phrases",
    minutes_to_complete: 8,
    new_words: 7,
  },
  {
    lesson_number: 25,
    lesson_name: "Travel Vocabulary",
    minutes_to_complete: 9,
    new_words: 9,
  },
  {
    lesson_number: 26,
    lesson_name: "Basic Adjectives",
    minutes_to_complete: 5,
    new_words: 8,
  },
  {
    lesson_number: 27,
    lesson_name: "Expressing Emotions",
    minutes_to_complete: 8,
    new_words: 6,
  },
  {
    lesson_number: 28,
    lesson_name: "Simple Negations",
    minutes_to_complete: 7,
    new_words: 5,
  },
  {
    lesson_number: 29,
    lesson_name: "Holiday Words",
    minutes_to_complete: 6,
    new_words: 7,
  },
  {
    lesson_number: 30,
    lesson_name: "Common Commands",
    minutes_to_complete: 8,
    new_words: 5,
  },
  {
    lesson_number: 31,
    lesson_name: "Food Ingredients",
    minutes_to_complete: 9,
    new_words: 10,
  },
  {
    lesson_number: 32,
    lesson_name: "Market Bargaining",
    minutes_to_complete: 12,
    new_words: 7,
  },
  {
    lesson_number: 33,
    lesson_name: "Basic Sentence Structure",
    minutes_to_complete: 10,
    new_words: 0,
  },
  {
    lesson_number: 34,
    lesson_name: "City Vocabulary",
    minutes_to_complete: 6,
    new_words: 7,
  },
  {
    lesson_number: 35,
    lesson_name: "Describing Weather",
    minutes_to_complete: 7,
    new_words: 5,
  },
  {
    lesson_number: 36,
    lesson_name: "Clothing Words",
    minutes_to_complete: 5,
    new_words: 9,
  },
  {
    lesson_number: 37,
    lesson_name: "Basic Pronouns",
    minutes_to_complete: 4,
    new_words: 6,
  },
  {
    lesson_number: 38,
    lesson_name: "Travel Phrases",
    minutes_to_complete: 9,
    new_words: 8,
  },
  {
    lesson_number: 39,
    lesson_name: "Expressing Needs",
    minutes_to_complete: 6,
    new_words: 6,
  },
  {
    lesson_number: 40,
    lesson_name: "School Vocabulary",
    minutes_to_complete: 7,
    new_words: 8,
  },
  {
    lesson_number: 41,
    lesson_name: "Common Mistakes",
    minutes_to_complete: 10,
    new_words: 3,
  },
  {
    lesson_number: 42,
    lesson_name: "Public Transportation",
    minutes_to_complete: 8,
    new_words: 9,
  },
  {
    lesson_number: 43,
    lesson_name: "Basic Shapes",
    minutes_to_complete: 5,
    new_words: 6,
  },
  {
    lesson_number: 44,
    lesson_name: "House Descriptions",
    minutes_to_complete: 9,
    new_words: 7,
  },
  {
    lesson_number: 45,
    lesson_name: "Hospital Vocabulary",
    minutes_to_complete: 10,
    new_words: 8,
  },
  {
    lesson_number: 46,
    lesson_name: "Personal Hygiene",
    minutes_to_complete: 8,
    new_words: 6,
  },
  {
    lesson_number: 47,
    lesson_name: "Simple Comparisons",
    minutes_to_complete: 7,
    new_words: 5,
  },
  {
    lesson_number: 48,
    lesson_name: "At the Airport",
    minutes_to_complete: 9,
    new_words: 8,
  },
  {
    lesson_number: 49,
    lesson_name: "Banking and Money",
    minutes_to_complete: 10,
    new_words: 7,
  },
  {
    lesson_number: 50,
    lesson_name: "Final Review",
    minutes_to_complete: 12,
    new_words: 0,
  },
];

export default function Lessons({ language }: { language: string }) {
  const [activeLesson, setActiveLesson] = useState(0);

  return (
    <div>
      {lessons.map((lesson, index) => (
        <div
          key={index}
          className="block my-3 text-xl font-serif text-secondary-text"
        >
          {activeLesson === index ? (
            <div className="my-8 max-w-lg rounded-md shadow border-2 border-black/10 px-8 py-6 text-left text-base">
              <h2 className="mb-1 text-primary-text text-2xl">
                Lesson {lesson.lesson_number}: {lesson.lesson_name}
              </h2>
              <p className="mb-6">
                ~{lesson.minutes_to_complete} minutes &bull; {lesson.new_words}{" "}
                new words
              </p>
              <Button
                small
                text="Begin"
                Icon={ArrowRightIcon}
                to={"/lesson/" + language + "/" + lesson.lesson_number}
              />
            </div>
          ) : (
            <button onClick={() => setActiveLesson(index)}>
              Lesson {lesson.lesson_number}: {lesson.lesson_name}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
