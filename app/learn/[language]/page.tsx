import Lessons from "@/app/components/Lessons";
import User from "@/app/components/User";
import { languageData } from "@/app/languageData";
import { supabase } from "@/app/supabaseClient";
import Link from "next/link";
import { useEffect } from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ language: string }>;
}) {
  const { language } = await params;

  return (
    <div className="relative">
      <div className="fixed top-0 w-full">
        <div className="bg-background max-w-4xl mx-auto px-8 sm:px-12 pt-32 pb-4">
          <div className="flex justify-between">
            <p className="text-tertiary-text font-serif mb-2">
              {Object.keys(languageData).map((langCode, index) => (
                <span key={langCode}>
                  {language === langCode ? (
                    <span className="text-secondary-text underline">
                      {
                        languageData[langCode as keyof typeof languageData]
                          .title
                      }
                    </span>
                  ) : (
                    <Link href={`/learn/${langCode}`}>
                      {
                        languageData[langCode as keyof typeof languageData]
                          .title
                      }
                    </Link>
                  )}
                  {index < Object.keys(languageData).length - 1 && " // "}
                </span>
              ))}
            </p>
            <User />
          </div>
          <h1 className="text-primary-text text-4xl font-serif">
            Nice to see you
          </h1>
          <p className="text-secondary-text font-serif mt-2">
            Keep learning{" "}
            {language &&
            (typeof language as string) === "string" &&
            language in languageData
              ? languageData[language as keyof typeof languageData].title
              : "loading..."}{" "}
            below, with curriculum from languagetransfer.org
          </p>
        </div>
        <div className="bg-gradient-to-b from-background to-transparent h-6 w-full"></div>
      </div>
      <div className="mt-72 max-w-4xl mx-auto px-8 sm:px-12 pb-12">
        <Lessons language={language} />
      </div>
    </div>
  );
}
