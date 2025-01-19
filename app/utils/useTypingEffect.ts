import { useState, useRef, useEffect } from 'react';
import { formatText } from './textFormatting';

export function useTypingEffect(text: string | undefined, typingSpeed = 10) {
    const [typedString, setTypedString] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

    useEffect(() => {
        if (!text) return;

        setIsTyping(true);
        setTypedString('');
        
        // Clear any existing timeouts
        timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
        timeoutsRef.current = [];

        const chars = text.split('');
        chars.forEach((_, index) => {
            const timeout = setTimeout(async () => {
                const formattedText = await formatText(text, index + 1);
                setTypedString(formattedText);
                
                // Check if this is the last character
                if (index === chars.length - 1) {
                    setIsTyping(false);
                }
            }, typingSpeed * index);
            timeoutsRef.current.push(timeout);
        });

        return () => {
            timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
            timeoutsRef.current = [];
        };
    }, [text, typingSpeed]);

    return { typedString, isTyping };
} 