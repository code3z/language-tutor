import Lessons from "@/app/components/Lessons";
import User from "@/app/components/User";
import { languageData } from "@/app/languageData";
import { createClient } from "@/supabaseServer";

export default async function Page({
  params,
}: {
  params: Promise<{ language: string }>;
}) {
  let lessonsStatus: { [key: string]: string } = {};
  const supabase = await createClient();
  const { language } = await params;

  // Fetch lessons for the current language
  const { data: lessons, error } = await supabase
    .from("lessons")
    .select("name, language, number, minutes_to_complete")
    .eq("language", language)
    .order("number");

  if (error) {
    console.error("Error fetching lessons:", error);
    return <div>Error loading lessons</div>;
  }

  const {
    data: { session }
  } = await supabase.auth.getSession();
  if (!session) return <div>Error loading user</div>;

  const { data: lessonsStatusData, error: lessonsStatusError } = await supabase
    .from("lesson_status")
    .select("status")
    .eq("user_id", session.user.id)
    .eq("language", language);
  if (lessonsStatusError) console.error("Error fetching lesson status:", lessonsStatusError);

  if (lessonsStatusData && lessonsStatusData.length === 0) {
    const { error: lessonsStatusError } = await supabase
      .from("lesson_status")
      .insert({
        user_id: "33a69455-db24-4277-81a3-6aeb37ca72a0",
        language,
        status: "",
      });
      if (lessonsStatusError) {
        console.error("Error creating lessons status:", lessonsStatusError);
      }
  } else if (lessonsStatusData) {
    lessonsStatus = JSON.parse(lessonsStatusData[0].status);
  }

  let defaultActiveLesson = 0;
  // If status is empty, keep activeLesson as 0
  if (Object.keys(lessonsStatus).length !== 0) {
    // Find the last completed lesson
    const lastCompletedLesson = Math.max(
      0,
      ...Object.entries(lessonsStatus)
        .filter(([, value]) => value === "done")
        .map(([lessonNumber]) => parseInt(lessonNumber))
    );
    console.log(lastCompletedLesson, "lastCompletedLesson", Object.entries(lessonsStatus))
    // If no completed lessons found, set to 0
    // Otherwise set to the next lesson after the last completed one
    defaultActiveLesson = lastCompletedLesson;
  }

  return (
    <div className="relative">
      <div className="fixed top-0 w-full">
        <div className="bg-background max-w-4xl mx-auto px-8 sm:px-12 pt-32 pb-4">
          <div className="flex justify-between">
            <p className="text-tertiary-text font-serif mb-2">
              Swahili
              {/*Object.keys(languageData).map((langCode, index) => (
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
              ))*/}
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
        <Lessons
          language={language}
          lessons={lessons || []}
          status={lessonsStatus}
          defaultActiveLesson={defaultActiveLesson}
        />
      </div>
    </div>
  );
}
