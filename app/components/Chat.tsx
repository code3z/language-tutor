"use client";

import { ArrowRightIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import Button from "./Button";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import Link from "next/link";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { ChatItem, LessonItem } from "../lesson/[language]/[id]/page";

function truncateHTML(htmlString: string, maxChars: number) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const body = doc.body;
    let charCount = 0;
    interface TruncateNode {
        nodeType: number;
        textContent: string | null;
        childNodes: NodeListOf<ChildNode>;
        removeChild: (child: ChildNode) => ChildNode;
        lastChild: ChildNode | null;
    }

    function truncateNode(node: TruncateNode): TruncateNode | null {
        if (charCount >= maxChars) {
            return null;
        }

        if (node.nodeType === Node.TEXT_NODE) {
            const remaining = maxChars - charCount;
            if (node.textContent && node.textContent.length > remaining) {
                node.textContent = node.textContent.slice(0, remaining);
                charCount = maxChars;
            } else {
                charCount += node.textContent?.length || 0;
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            const children = Array.from(node.childNodes);
            for (const child of children) {
                const truncatedChild = truncateNode(child as TruncateNode);
                if (!truncatedChild) {
                    while (node.lastChild && node.lastChild !== child) {
                        node.removeChild(node.lastChild);
                    }
                    node.removeChild(child);
                    break;
                }
            }
        }
        return node;
    }

    truncateNode(body);
    return body.innerHTML;
}


const formatText = async (text: string, char?: number) => {
    const rawHTML = await marked.parse(text);

    // Sanitize the HTML using DOMPurify
    const safeHTML = DOMPurify.sanitize(rawHTML);

    if (char === undefined) {
        return safeHTML;
    }
    return truncateHTML(safeHTML, char);
}

export default function Chat({ language, id, lesson, startItemIndex, startChatIndex, initialChat }: { language: string, id: number, lesson: LessonItem[], startItemIndex: number, startChatIndex: number, initialChat: ChatItem[] }) {
    const [currentLessonItem, setCurrentLessonItem] = useState(startItemIndex);
    const [chat, setChat] = useState<ChatItem[]>(initialChat);
    const [input, setInput] = useState('');
    const chatFormRef = useRef<HTMLFormElement>(null);
    //const [typingId, setTypingId] = useState<number>();
    const [isTyping, setIsTyping] = useState(false);
    const [typedString, setTypedString] = useState('');
    const [nextIsChallenge, setNextIsChallenge] = useState('challenge' in lesson[startItemIndex + 1] && lesson[startItemIndex + 1].challenge === true ? true : false);
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);



    useEffect(() => {
        const currentLessonSection = Math.floor(currentLessonItem)
        if (currentLessonSection + 1 === lesson.length - 1 && !done) { // if the next item is the last item
            console.log('done!')
            setDone(true);
            //setChat([...chat, { user: input }, lesson[currentLessonSection + 1]]);
        }

       // if (done === true) return; // this will work on the next round after done has been set
        const newChat = chat[chat.length - 1];
        if (newChat && ('information' in newChat || 'question' in newChat) && 'id' in newChat) {
            const currentText = (newChat.information || newChat.question) as string;

            chatFormRef.current?.scrollIntoView({ behavior: 'smooth' });
            chatFormRef.current?.querySelector('input')?.focus();

            // if the current item is information, and the next item is a non-challenge question, start typing the next question after the current info is typed
            if (lesson[currentLessonItem] && 'information' in lesson[currentLessonItem] && lesson[currentLessonItem + 1] && lesson[currentLessonItem + 1].challenge !== true) {
                const timeOutId = setTimeout(() => {
                    setChat([...chat, lesson[currentLessonItem + 1]]);
                    setCurrentLessonItem(currentLessonItem + 1);
                }, 10 * currentText.length);
                //return () => clearTimeout(timeOutId);
            }

            // set typing
            //setTypingId(nextLessonItem - 1);
            setTypedString("");

            setIsTyping(true);
            for (let char in currentText.split("")) {
                setTimeout(() => {
                    formatText(currentText, parseInt(char) + 1).then((formattedText) => {
                        setTypedString(formattedText);
                    });
                }, 10 * parseInt(char));
            }
            setTimeout(() => {
                setIsTyping(false);
            }, 10 * currentText.length);
            // @ts-expect-error
        } else if ('user' in chat[chat.length - 1] && chat[chat.length - 1].user === "I don't know") {
            (async () => {
                const response = await fetch("/api/dontKnow?chat=" + JSON.stringify(chat) + "&answer=" + JSON.stringify(lesson[currentLessonItem].answer));
                const data = await response.text();
                if ('answer' in lesson[currentLessonItem]) {
                    setChat([...chat, { question: data, answer: lesson[currentLessonItem].answer as string, id: currentLessonItem + 0.01 }]); // go into 0.01 of an ID when we get off-script
                    setCurrentLessonItem(currentLessonItem + 0.01);
                } else {
                    throw new Error("'Don't know' used on a non-question item");
                }
            })();
        }
    }, [chat]);


    const moveToNextItem = (newStatement?: string) => {
        console.log(newStatement)
        const currentLessonSection = Math.floor(currentLessonItem)
        if ('challenge' in lesson[currentLessonSection + 1] && lesson[currentLessonSection + 1].challenge === true) {
            setChat([lesson[currentLessonSection + 1]]);

        } else {
            if (newStatement) { // there is almost never a case where a challenge is preceded by a question and not information
                setChat([...chat, { user: input }, { information: newStatement, id: currentLessonSection + 1 }]);
            } else {
                setChat([...chat, { user: input }, lesson[currentLessonSection + 1]]);
            }
        }
        setCurrentLessonItem(currentLessonSection + 1);
        setInput('');
        if (lesson[currentLessonSection + 2]) setNextIsChallenge(lesson[currentLessonSection + 2].challenge ? true : false);
    }

    const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
        e && e.preventDefault();
        const currentLessonSection = Math.floor(currentLessonItem)

        console.log(lesson[currentLessonSection].answer, input);
        if (lesson[currentLessonSection].answer && input.toLowerCase() !== lesson[currentLessonSection].answer.replaceAll("*", "").toLowerCase()) {
            setInput('');
            setLoading(true);
            setChat([...chat, { user: input }]);
            const nextStatement = lesson[currentLessonSection + 1].question || lesson[currentLessonSection + 1].information;
            fetch("/api/wrongAnswer?chat=" + JSON.stringify([...chat, { user: input }]) + "&intendedAnswer=" + JSON.stringify(lesson[currentLessonSection].answer) + "&nextStatement=" + JSON.stringify(nextStatement)).then(async result => {
                const json = await result.json();
                if (json.correct === true) {
                    if (json.typo) moveToNextItem(json.guidance);
                    else moveToNextItem();
                } else {
                    setChat([...chat, { user: input }, { information: json.guidance, id: currentLessonItem + 0.01 }]);
                    setCurrentLessonItem(currentLessonItem + 0.01);
                }
                setLoading(false);
            }).catch(err => {
                console.error(err);
                setLoading(false);
            })
        } else {
            moveToNextItem();
        }
    };

    useEffect(() => {
        const handleEnterKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                if (nextIsChallenge && !isTyping) {
                    handleSubmit();
                }
            }
        };

        // Add the event listener to the whole page
        document.addEventListener('keydown', handleEnterKeyPress);

        // Cleanup to avoid memory leaks
        return () => {
            document.removeEventListener('keydown', handleEnterKeyPress);
        };
    }, [nextIsChallenge, isTyping, handleSubmit]);


    const dontKnow = async () => {
        setInput('');
        setChat([...chat, { user: "I don't know" }]);
    }


    useEffect(() => {
        const listener = (e: Event) => {
            const text = (e.target as HTMLElement).innerText;
            fetch(`/api/textToSpeech?language=${language}&text=${encodeURIComponent(text)}`)
                .then(res => res.blob())
                .then(blob => {
                    const audioUrl = URL.createObjectURL(blob);
                    const audio = new Audio(audioUrl);
                    audio.play();
                });
        };
        const chat = document.getElementById("chat");
        chat?.querySelectorAll("span.foreign").forEach((span) => {
            span.addEventListener("mouseover", listener);
        });
        return () => {
            chat?.querySelectorAll("span.foreign").forEach((span) => {
                span.removeEventListener("mouseover", listener);
            });
        };
    });

    return (
        <div className="bg-background mx-auto px-16 h-screen max-w-3xl py-16 flex flex-col">
            <div className="fixed top-0 left-0 w-screen">
                <div className="h-16 w-full bg-background px-16" />
                <div className="flex items-center gap-3 max-w-3xl mx-auto bg-background px-16">
                    <div className="relative flex-grow">
                        <div className="w-full h-4 bg-[#fef8f5] rounded-full border border-black/30" />
                        <div className={"absolute top-0 left-0 h-4 absolute bg-[#f68c5a] rounded-full transition-all duration-150" + (((Math.floor(currentLessonItem) / (lesson.length - 1)) < 0.03) ? " rounded-r-none" : "")} style={{ width: (Math.floor(currentLessonItem) / (lesson.length - 1)) * 100 + "%" }} />
                    </div>
                    <Link href={"/learn/" + language} className="w-6 h-6"><XMarkIcon className="icon stroke-secondary-text stroke-2 !w-full !h-full" /></Link>
                </div>
                <div className="bg-gradient-to-b from-background to-transparent h-8 w-full px-16"></div>
            </div>


            <div className="flex-grow flex items-center justify-center pb-32 pt-16">

                <div className="w-full flex flex-col" id="chat">
                    {chat.map((item, index) => {
                        if ('question' in item) {
                            return (
                                <div key={item.id} className="text-secondary-text font-serif text-lg mb-3 mt-6">
                                    {currentLessonItem === item.id ? <div className="space-y-6" dangerouslySetInnerHTML={{ __html: typedString }} /> : <ReactMarkdown className="space-y-6" rehypePlugins={[rehypeSanitize]}>{item.question}</ReactMarkdown>}
                                </div>
                            );
                        } else if ('information' in item) {
                            return (
                                <div key={item.id} className="text-secondary-text font-serif text-lg mb-3 mt-6">
                                    {currentLessonItem === item.id ? <div className="space-y-6" dangerouslySetInnerHTML={{ __html: typedString }} /> : <ReactMarkdown className="space-y-6" rehypePlugins={[rehypeSanitize]}>{item.information}</ReactMarkdown>}
                                </div>
                            );
                        } else if ('user' in item) {
                            return (
                                <div key={item.user + index} className="text-primary-text font-serif text-lg bg-white p-3 px-8 mb-3 mt-6 w-fit self-end rounded-full shadow border border-black/30">
                                    <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{item.user}</ReactMarkdown>
                                </div>
                            )
                        }
                    })}
                    {loading && <div className="w-3 h-3 bg-secondary-text rounded-full animate-pulse" />}
                    {!done && <form className="mt-8" onSubmit={handleSubmit} ref={chatFormRef}>
                        {!(nextIsChallenge && !('answer' in lesson[currentLessonItem])) && <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="outline-primary-text px-6 py-2.5 bg-white rounded-md shadow text-secondary-text font-normal font-serif mr-5" placeholder="Your amazing answer..."
                        />}
                        <Button disabled={isTyping || (!nextIsChallenge && input === '')} text="Go" small Icon={ArrowRightIcon} />
                    </form>}
                    {!nextIsChallenge && !done && <button onClick={dontKnow} className="text-secondary-text text-left mt-2 font-medium"><QuestionMarkCircleIcon className="icon stroke-2" /> I don't know</button>}
                    {done && <Button to={`/learn/${language}`} text="Back to lessons" customClassName="mt-6 w-fit" />}
                </div>
            </div>
        </div>
    )
}