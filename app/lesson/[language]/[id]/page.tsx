import { createClient } from "@/supabaseServer";
import Chat from "@/app/components/Chat";
import Link from "next/link";

export type LessonItem =
    | { information?: string; question?: undefined; answer?: undefined; challenge?: boolean; id: number }
    | { question: string; answer: string; information?: undefined; challenge?: boolean; id: number };

export type ChatItem = LessonItem | { user: string }

export default async function Page({ params, searchParams }: { 
    params: Promise<{ language: string, id: string }>,
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const {language, id} = await params
    const {startItem} = await searchParams
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('language', language)
        .eq('number', parseInt(id))
        .single();

    if (error) {
        console.error('Error fetching lesson:', error);
        return <div>Error loading lesson</div>;
    }

    const lesson = data.lesson;
    const startItemIndex = parseInt(startItem as string || '0');

    if (startItemIndex > lesson.length - 1) {
        return <div>Error: Start item index is greater than lesson length <Link href={`/lesson/${language}/${id}`} className="text-primary underline">Restart this lesson</Link></div>
    }

    const startChatIndex =
        lesson
            .slice(0, startItemIndex + 1)
            .reverse()
            .find((item: LessonItem) => item.challenge)?.id || 0;

    const chat: ChatItem[] = []
    for (const item of lesson.slice(startChatIndex, startItemIndex)) {
        if ('question' in item && item.question) {
            chat.push(item)
            chat.push({ user: item.answer })
        } else {
            chat.push(item)
        }
    }
    chat.push(lesson[startItemIndex])

    return (
        <Chat 
            language={language} 
            id={parseInt(id)} 
            startChatIndex={startChatIndex} 
            startItemIndex={startItemIndex} 
            lesson={lesson} 
            initialChat={chat} 
        />
    )
}