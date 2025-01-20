import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export function useLessonStatus(language: string, id: number, currentLessonItem: number, lessonLength: number) {
    const [done, setDone] = useState(false);

    const updateLessonStatus = async (currentSection: number, isDone = false) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: lessonsStatusData, error: fetchError } = await supabase
            .from("lesson_status")
            .select("*")
            .eq("user_id", user.id)
            .eq("language", language)
            .single();
        if (fetchError) console.error("Error fetching lesson status:", fetchError);

        const currentStatus = lessonsStatusData?.status ? JSON.parse(lessonsStatusData.status) : {};
        const newStatus = (isDone || currentSection === lessonLength - 1) ? "done" : currentSection;
        
        // Only update if the status has changed
        if (currentStatus[id] !== newStatus) {
            currentStatus[id] = newStatus;

            // If we found an existing record, update it
            if (lessonsStatusData) {
                const { error: updateError } = await supabase
                    .from("lesson_status")
                    .update({
                        status: JSON.stringify(currentStatus)
                    })
                    .eq("user_id", user.id)
                    .eq("language", language);

                if (updateError) {
                    console.error("Error updating lesson status:", updateError);
                }
            } else {
                // If no record exists, insert a new one
                const { error: insertError } = await supabase
                    .from("lesson_status")
                    .insert({
                        user_id: user.id,
                        language,
                        status: JSON.stringify(currentStatus)
                    });

                if (insertError) {
                    console.error("Error inserting lesson status:", insertError);
                }
            }
        }
    };

    useEffect(() => {
        const currentLessonSection = Math.floor(currentLessonItem);
        
        // Update status when section changes or lesson is completed
        if (currentLessonSection === lessonLength - 1 && !done) {
            setDone(true);
            updateLessonStatus(currentLessonSection, true);
        } else {
            updateLessonStatus(currentLessonSection);
        }
    }, [Math.floor(currentLessonItem), done, lessonLength, currentLessonItem, updateLessonStatus]);

    return { done };
} 