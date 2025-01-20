'use client';

import { ChatItem } from '../lesson/[language]/[id]/page';
import { useRef } from 'react';
import { useTypingEffect } from '../utils/useTypingEffect';

interface ChatMessageProps {
    item: ChatItem;
    currentLessonItem: number;
    formattedText: { [key: string]: string };
    language: string;
}

export default function ChatMessage({ item, currentLessonItem, formattedText }: ChatMessageProps) {
    const content = 'question' in item ? item.question :
                   'information' in item ? item.information :
                   'user' in item ? item.user : '';
    const self = useRef<HTMLDivElement>(null);
    
    // Get the formatted content based on the item type and current state
    const formattedContent = 'user' in item ? 
        formattedText[item.user] || '' :
        ('id' in item ? formattedText[item.id] : '') || '';

    // Set up typing effect for non-user messages when they are current
    const shouldType = !('user' in item) && currentLessonItem === ('id' in item ? item.id : -1);
    const { typedString } = useTypingEffect(shouldType ? content : undefined);
    
    if ('question' in item || 'information' in item) {
        return (
            <div className="text-secondary-text font-serif text-lg mb-3 mt-6" ref={self}>
                {shouldType ? 
                    <div className="space-y-6" dangerouslySetInnerHTML={{ __html: typedString }} /> 
                    : <div className="space-y-6" dangerouslySetInnerHTML={{ __html: formattedContent }} />
                }
            </div>
        );
    } else if ('user' in item) {
        return (
            <div ref={self} className="text-primary-text font-serif text-lg bg-white p-3 px-8 mb-3 mt-6 w-fit self-end rounded-full shadow border border-black/30">
                <div dangerouslySetInnerHTML={{ __html: formattedContent }} />
            </div>
        );
    }

    return null;
} 