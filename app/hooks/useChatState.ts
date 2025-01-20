import { useState, useEffect, useRef } from 'react';
import { ChatItem, LessonItem } from '../lesson/[language]/[id]/page';
import { formatText } from '../utils/textFormatting';

export function useChatState(lesson: LessonItem[], startItemIndex: number, initialChat: ChatItem[]) {
    const [currentLessonItem, setCurrentLessonItem] = useState(startItemIndex);
    const [chat, setChat] = useState<ChatItem[]>(initialChat);
    const [input, setInput] = useState('');
    const [formattedText, setFormattedText] = useState<{ [key: string]: string }>({});
    const [nextIsChallenge, setNextIsChallenge] = useState(
        startItemIndex === lesson.length - 1 
            ? false 
            : Boolean(lesson[startItemIndex + 1]?.challenge)
    );
    const [loading, setLoading] = useState(false);
    const chatFormRef = useRef<HTMLFormElement>(null);

    // Format text for items
    useEffect(() => {
        chat.forEach(async (item) => {
            if ('question' in item && typeof item.question === 'string' && !formattedText[item.id]) {
                const formatted = await formatText(item.question);
                setFormattedText(prev => ({ ...prev, [item.id]: formatted }));
            } else if ('information' in item && typeof item.information === 'string' && !formattedText[item.id]) {
                const formatted = await formatText(item.information);
                setFormattedText(prev => ({ ...prev, [item.id]: formatted }));
            } else if ('user' in item && typeof item.user === 'string' && !formattedText[item.user]) {
                const formatted = await formatText(item.user);
                setFormattedText(prev => ({ ...prev, [item.user]: formatted }));
            }
        });
    }, [chat, formattedText]);

    useEffect(() => {
        const currentLessonSection = Math.floor(currentLessonItem)
        const newChat = chat[chat.length - 1];
        if (newChat && ('information' in newChat || 'question' in newChat) && 'id' in newChat) {
            chatFormRef.current?.scrollIntoView({ behavior: 'smooth' });
            chatFormRef.current?.querySelector('input')?.focus();

            if (lesson[currentLessonSection] && 
                'information' in lesson[currentLessonSection] && 
                lesson[currentLessonSection + 1] && 
                lesson[currentLessonSection + 1].challenge !== true) {
                const delay = ((newChat.information || newChat.question) as string).length * 10;
                const timeoutId = setTimeout(() => {
                    setChat([...chat, lesson[currentLessonSection + 1]]);
                    setCurrentLessonItem(currentLessonSection + 1);
                }, delay);
                return () => clearTimeout(timeoutId);
            }
        } else if ('user' in chat[chat.length - 1] && (chat[chat.length - 1] as { user: string }).user === "I don't know") {
            (async () => {
                const response = await fetch("/api/dontKnow?chat=" + JSON.stringify(chat) + "&answer=" + JSON.stringify(lesson[currentLessonSection].answer));
                const data = await response.text();
                if ('answer' in lesson[currentLessonSection]) {
                    setChat([...chat, { question: data, answer: lesson[currentLessonSection].answer as string, id: currentLessonSection + 0.01 }]);
                    setCurrentLessonItem(currentLessonSection + 0.01);
                } else {
                    throw new Error("'Don't know' used on a non-question item");
                }
            })();
        }
    }, [chat, currentLessonItem, lesson]);

    const moveToNextItem = (newStatement?: string) => {
        const currentLessonSection = Math.floor(currentLessonItem)
        if ('challenge' in lesson[currentLessonSection + 1] && lesson[currentLessonSection + 1].challenge === true) {
            setChat([lesson[currentLessonSection + 1]]);
        } else {
            if (newStatement) {
                setChat([...chat, { user: input }, { information: newStatement, id: currentLessonSection + 1 }]);
            } else {
                setChat([...chat, { user: input }, lesson[currentLessonSection + 1]]);
            }
        }
        setCurrentLessonItem(currentLessonSection + 1);
        setInput('');
        if (lesson[currentLessonSection + 2]) setNextIsChallenge(lesson[currentLessonSection + 2].challenge ? true : false);
    }

    const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
        if (e) e.preventDefault();
        const currentLessonSection = Math.floor(currentLessonItem)

        if (lesson[currentLessonSection].answer && input.toLowerCase() !== lesson[currentLessonSection].answer.replaceAll("*", "").toLowerCase()) {
            setInput('');
            setLoading(true);
            setChat([...chat, { user: input }]);
            const nextStatement = lesson[currentLessonSection + 1].question || lesson[currentLessonSection + 1].information;
            try {
                const result = await fetch("/api/wrongAnswer?chat=" + JSON.stringify([...chat, { user: input }]) + "&intendedAnswer=" + JSON.stringify(lesson[currentLessonSection].answer) + "&nextStatement=" + JSON.stringify(nextStatement));
                const json = await result.json();
                if (json.correct === true) {
                    if (json.typo) moveToNextItem(json.guidance);
                    else moveToNextItem();
                } else {
                    setChat([...chat, { user: input }, { information: json.guidance, id: currentLessonItem + 0.01 }]);
                    setCurrentLessonItem(currentLessonItem + 0.01);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        } else {
            moveToNextItem();
        }
    };

    const dontKnow = () => {
        setInput('');
        setChat([...chat, { user: "I don't know" }]);
    }

    return {
        currentLessonItem,
        chat,
        input,
        setInput,
        formattedText,
        chatFormRef,
        nextIsChallenge,
        loading,
        handleSubmit,
        dontKnow
    };
} 