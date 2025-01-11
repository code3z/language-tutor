import Chat from "@/app/components/Chat";

export type LessonItem =
    | { information?: string; question?: undefined; answer?: undefined; challenge?: boolean; id: number }
    | { question: string; answer: string; information?: undefined; challenge?: boolean; id: number };

export type ChatItem = LessonItem | { user: string }

const lesson: LessonItem[] = [
    {
        "information": "We're going to break down Swahili and language generally to see how we use it to express ideas, and how we convert ideas into language. The first thing we can say about languages generally is that they have words and also that they have different types of words. These different types of words behave in different ways. For example, we have verbs. In English, these are two words; so: *to come*, *to want*, *to be* in the standard form. Whether we can put *to* in front of *to eat*, *to sleep*...\n\nIn Swahili, verbs don't have *to* in front of them but *<span class='foreign'>ku</span>*. So, where in English, we have *to sleep* and that's two words, in Swahili, we have one word and that's *<span class='foreign'>kulala</span>*. So, <span class='foreign'>kulala</span> is *to sleep*.",
        id: 0,
    },
    {
        "question": "What is *to sleep* in Swahili?",
        "answer": "*Kulala*",
        challenge: true,
        id: 1,
    },
    {
        "information": "And the word is probably echoic which just means it's like an echo of the action of the verb. So, *kulala* might come from singing somebody to sleep, like a lullaby. There we have *kulala*, *to sleep*.",
        id: 2,
    },
    {
        "question": "What is the Swahili word for *to sleep*?",
        "answer": "*Kulala*",
        challenge: true,
        id: 3,
    },
    {
        "question": "If we get rid of one of those *las*, how is this going to sound?",
        "answer": "*Kula*",
        id: 4,
    },
    {
        "information": "*Kula*, good, and that means *to eat* by coincidence. So, already we have two verbs in Swahili.",
        id: 5,
    },
    {
        "question": "What is *to sleep* in Swahili?",
        "answer": "*Kulala*",
        challenge: true,
        id: 6,
    },
    {
        "question": "And *to eat*?",
        "answer": "*Kula*",
        id: 7,
    },
    {
        "information": "Very good. So, these are verbs once we put *to* in front of. But of course, verbs aren't just the *to* forms, right? We don't just say *to sleep* but *I sleep*, *he sleeps*, *I slept*, and all of this we get from *to sleep*. In Swahili, to get these different meanings out of a true form the first thing we do is the same as what we do in English: we lose the *to*. Before we say *I sleep* we get rid of the *to* of *to sleep*.",
        id: 8,
    },
    {
        "question": "If *kulala* is *to sleep*, what is the bit that represents *to*?",
        "answer": "*Ku*",
        id: 9,
    },
    {
        "question": "So, if you get rid of it, what are we left with?",
        "answer": "*Lala*",
        id: 10,
    },
    {
        "information": "Now to show *I sleep* or *I'm sleeping* we will add on to the beginning of *lala* to give that information. And to say *I sleep* or *I'm sleeping* we need to add on two pieces of information. We need to add on the information of *I* and we need to add on the information of the present; that we are in the present tense. That is *I am sleeping* rather than *I slept* or *will sleep*.\n\nThe sound for *I* in Swahili is *ni*.",
        id: 11,
    },
    {
        "question": "What is the sound for *I* in Swahili?",
        "answer": "*Ni*",
        challenge: true,
        id: 12,
    },
    {
        "information": "The sound for the present is *na*.",
        id: 13,
    },
    {
        "question": "What is the sound for the present tense in Swahili?",
        "answer": "*Na*",
        challenge: true,
        id: 14,
    },
    {
        "information": "Now put those two sounds together. What will it sound like?",
        id: 15,
    },
    {
        "question": "What is the combination of the sounds for *I* and the present tense?",
        "answer": "*Nina*",
        id: 16,
    },
    {
        "information": "So, to say *I* in the present we have *nina* and we add that to our verb without the *ku*. Let's run through this again from the beginning with *to sleep*.",
        id: 17,
    },
    {
        "question": "What is *to sleep* in Swahili?",
        "answer": "*Kulala*",
        challenge: true,
        id: 18,
    },
    {
        "question": "And just *sleep* without the *to*?",
        "answer": "*Lala*",
        id: 19,
    },
    {
        "question": "If we add on to the beginning our sound for *I* which is?",
        "answer": "*Ni*",
        id: 20,
    },
    {
        "question": "And the sound for present?",
        "answer": "*Na*",
        id: 21,
    },
    {
        "information": "You are ready to tell me: *I sleep* or *I'm sleeping*.",
        id: 22,
    },
    {
        "question": "What is *I sleep* or *I'm sleeping* in Swahili?",
        "answer": "*Ninalala*",
        id: 23,
    },
    {
        "information": "Very good. *Ninalala*, so this means *I sleep* or *I'm sleeping*. \n\n*Kucheka* means *to laugh*. *Kucheka*.",
        id: 24,
    },
    {
        "question": "What is the Swahili word for *to laugh*?",
        "answer": "*Kucheka*",
        challenge: true,
        id: 25,
    },
    {
        "information": "Again, an echoic verb, the sound of *cheka* is coming from the sound it makes to laugh like to chuckle. So, *kucheka*; *to laugh*. Swahili is written in the Latin alphabet, the same as English.",
        id: 26,
    },
    {
        "question": "Which bit of *kucheka* means *to*?",
        "answer": "*Ku*",
        id: 27,
    },
    {
        "question": "And which bit of *kucheka* means *laugh*?",
        "answer": "*Cheka*",
        id: 28,
    },
    {
        "information": "Good. *Ku*, *to* and *cheka*, *laugh*. *Kucheka*, *to laugh*. If you want to build: *I laugh* or *I'm laughing*, what is the first thing we do?",
        id: 29,
    },
    {
        "question": "What do we remove from the verb to say *I laugh* or *I'm laughing*?",
        "answer": "We get rid of the *to*, *ku*.",
        id: 30,
    },
    {
        "question": "And we’re left with?",
        "answer": "*Cheka*",
        id: 31,
    },
    {
        "information": "Then we need to put two sounds. We need to give two pieces of information: the information of *I* and the information of present.",
        id: 32,
    },
    {
        "question": "What is *I laugh* or *I'm laughing* in Swahili?",
        "answer": "*Ninacheka*",
        id: 33,
    },
    {
        "information": "Very good. *Ni* is for *I*, *na* is for present, and then *cheka*. *Ninacheka*. All one word and that means *I laugh* or *I'm laughing*. \n\n*To want* is *kutaka*. *Kutaka*.",
        id: 34,
    },
    {
        "question": "What is the Swahili word for *to want*?",
        "answer": "*Kutaka*",
        challenge: true,
        id: 35,
    },
    {
        "question": "Which bit there carries the meaning of *want*?",
        "answer": "*Taka*",
        id: 36,
    },
    {
        "question": "How do we get *I want* from *to want*?",
        "answer": "We get rid of the *ku*, so we have *taka* and then *ninataka*.",
        id: 37,
    },
    {
        "information": "Very good. *Ninataka*, *I want*, *ninataka*. *Ni* shows it’s *I*, *na* shows it’s present, and *taka* gives us our meaning of *want*. *Ninataka*.",
        id: 38,
    },
    {
        "question": "What was *to sleep* in Swahili?",
        "answer": "*Kulala*",
        challenge: true,
        id: 39,
    },
    {
        "question": "How would you say *I want to sleep*?",
        "answer": "*Ninataka kulala*",
        id: 40,
    },
    {
        "information": "Very good. *Ninataka kulala*.",
        id: 41,
    },
    {
        "question": "What was *to eat* in Swahili?",
        "answer": "*Kula*",
        id: 42,
    },
    {
        "question": "How would you say *I want to eat*?",
        "answer": "*Ninataka kula*",
        id: 43,
    },
    {
        "information": "Very good. The word for *now* in Swahili is *sasa*.",
        id: 44,
    },
    {
        "question": "What is the Swahili word for *now*?",
        "answer": "*Sasa*",
        challenge: true,
        id: 45,
    },
    {
        "information": "*S-a-s-a*, and that's a repeated syllable. That happens very often in Swahili. In fact, we've already seen an example of it.",
        id: 46,
    },
    {
        "question": "What was *to sleep* in Swahili?",
        "answer": "*Kulala*",
        id: 47,
    },
    {
        "information": "So, *lala* of *kulala* again is a repeated syllable. That happens quite often in Swahili. So, we have *sasa* for *now*.",
        id: 48,
    },
    {
        "question": "How would you say *I want to sleep now*?",
        "answer": "*Ninataka kulala sasa*",
        id: 49,
    },
    {
        "information": "Very good. *Ninataka kulala sasa*.",
        id: 50,
    },
    {
        "question": "How would you say *I want to eat now*?",
        "answer": "*Ninataka kula sasa*",
        id: 51,
    },
    {
        information: "Very good. You might also hear in some dialects of Swahili *sasa* as a greeting; an informal greeting, like *hey*; *sasa*.",
        id: 52,
    },
    {
        information: "That's all for today!",
        id: 53,
    }
]

export default async function Page({ params, searchParams }: {
    params: { language: string, id: number }
    searchParams: { startItem?: string }
}) {

    const { language, id } = await params;
    const { startItem } = await searchParams;
    const startItemIndex = startItem ? parseInt(startItem) : 0;

    const startChatIndex =
    lesson
    .slice(0, startItemIndex + 1)
    .reverse()
    .find(item => item.challenge)?.id || 0; // find the last item that is a challenge, which could be the current start item

    const chat = []
    for (let item of lesson.slice(startChatIndex, startItemIndex)) {
        if ('question' in item && item.question) {
            chat.push(item)
            chat.push({ user: item.answer })
        } else {
            chat.push(item)
        }
    }
    chat.push(lesson[startItemIndex])


    return (
        <Chat language={language} id={id} startChatIndex={startChatIndex} startItemIndex={startItemIndex} lesson={lesson} initialChat={chat} />
    )
}