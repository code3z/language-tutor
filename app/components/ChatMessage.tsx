'use client';

import { ChatItem } from '../lesson/[language]/[id]/page';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { useRef } from 'react';

interface ChatMessageProps {
    item: ChatItem;
    currentLessonItem: number;
    typedString: string;
    formattedText: { [key: string]: string };
    language: string;
}

export default function ChatMessage({ item, currentLessonItem, typedString, formattedText, language }: ChatMessageProps) {
    const content = 'question' in item ? item.question :
                   'information' in item ? item.information :
                   'user' in item ? item.user : '';
    const self = useRef<HTMLDivElement>(null);
    
    // Get the formatted content based on the item type and current state
    const formattedContent = 'user' in item ? 
        formattedText[item.user] || '' :
        currentLessonItem === ('id' in item ? item.id : -1) ? 
            typedString : 
            ('id' in item ? formattedText[item.id] : '') || '';
    
    // Set up text-to-speech functionality
    //useTextToSpeech(language, formattedContent, self);

    if ('question' in item || 'information' in item) {
        return (
            <div className="text-secondary-text font-serif text-lg mb-3 mt-6" ref={self}>
                {currentLessonItem === item.id ? 
                    <div className="space-y-6" dangerouslySetInnerHTML={{ __html: typedString }} /> 
                    : <div className="space-y-6" dangerouslySetInnerHTML={{ __html: formattedText[item.id] || '' }} />
                }
            </div>
        );
    } else if ('user' in item) {
        return (
            <div ref={self} className="text-primary-text font-serif text-lg bg-white p-3 px-8 mb-3 mt-6 w-fit self-end rounded-full shadow border border-black/30">
                <div dangerouslySetInnerHTML={{ __html: formattedText[item.user] || '' }} />
            </div>
        );
    }

    return null;
} 