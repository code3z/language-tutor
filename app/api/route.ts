const gptResult = `
Information:  
<span class='foreign'>Kutoka</span> means to get or go out, to exit. 

---  
Question: How would you say, I'm going out now?  
Answer: Ninatoka sasa or just natoka sasa.  

---  

Information:  
<span class='foreign'>Kutaka</span> means to want.  

---  
Question: How would you say, I want to get out or I want to go out?  
Answer: Ninataka kutoka or nataka kutoka.  

---  

Information:  
<span class='foreign'>Kutoka</span>, to get out, can also be used to mean I am from. For example, to say "I am from America," you use the word <span class='foreign'>marekani</span> for America. <span class='foreign'>Marekani</span> is like the word America, but arranged to sound more Swahili, with consonant-vowel patterns such as <span class='foreign'>kulala</span>, <span class='foreign'>kutaka</span>, <span class='foreign'>kutoka</span>.  

---  
Question: Tell me how to say, I am from America.  
Answer: Ninatoka Marekani or natoka Marekani.  

---  

Information:  
To ask "Are you from Kenya?" you use <span class='foreign'>kenya</span> which is the same in Swahili. The word for "where" in Swahili is <span class='foreign'>wapi</span>. When asking "Where are you from?" in Swahili, the word <span class='foreign'>wapi</span> is most commonly placed after the verb.  

---  
Question: How would you say, Where are you from?  
Answer: Unatoka wapi?  

---  

Question: What was to want?  
Answer: Kutaka.  

---  

Information:  
To ask, "Where do you want to sleep?" you say "You want to sleep where?" in Swahili.  
<span class='foreign'>Kulala</span> means to sleep.

---  
Question: How would you say, Where do you want to sleep?  
Answer: Unataka kulala wapi?  

---  

Question: What was to eat?  
Answer: Kula.  

---  

Question: How would you say, Where do you want to eat?  
Answer: Unataka kula wapi?  

---  

Question: Where do you sleep or Where are you sleeping?  
Answer: Unalala wapi?  

---  

Information:  
To give a command in Swahili, like telling someone to sleep, you simply drop the to from the verb. For example, from <span class='foreign'>kulala</span> for to sleep, you simply say <span class='foreign'>lala</span>.

You might also hear the phrase <span class='foreign'>lala salama</span>, which means sleep well or more literally, sleep peacefully. <span class='foreign'>Salama</span> is derived from Arabic, like salaam aleikum, meaning peace.   

---  

Information:  
To travel in Swahili is <span class='foreign'>kusafiri</span>. Most verbs in Swahili end in an a, such as <span class='foreign'>kutaka</span>, <span class='foreign'>kutoka</span>, <span class='foreign'>kulala</span>, <span class='foreign'>kula</span>, <span class='foreign'>kucheka</span>, <span class='foreign'>kuona</span>. However, verbs from Arabic don't typically end in a, like <span class='foreign'>kusafiri</span>. The root in <span class='foreign'>kusafiri</span> is <span class='foreign'>safiri</span>, with <span class='foreign'>ku</span> meaning to. 

The word <span class='foreign'>safiri</span> shares a root with the English word safari, which likely entered English through Swahili, not directly from Arabic. 

---  
Question: Do you want to travel?  
Answer: Unataka kusafiri?  

---  

Information:  
To specify where you want to travel, use <span class='foreign'>wapi</span>, meaning where.  

---  
Question: How would you say, Where do you want to travel?  
Answer: Unataka kusafiri wapi?  

---  

Information:  
To ask "Where are you traveling now?" or "Are you traveling?" use the verb <span class='foreign'>kusafiri</span>, and place <span class='foreign'>wapi</span> after the verb.  

---  
Question: Where are you traveling now?  
Answer: Unasafiri wapi sasa? or Sasa unasafiri wapi?

---  

Question: How do you tell someone to travel?  
Answer: Safiri.

---  

Information:  
Great! Swahili has a lot of vocabulary from Arabic. The word Swahili itself comes from the Arabic word for coasts, indicating that Swahili is a coastal language.

---

Information: That's all for today.
`

export async function GET() {
  const sections = gptResult.split("---").filter(item => item.trim() !== "") // remove any blank items
  const data = sections.map((section, index) => {
    if (section.includes("Question")) {
      const sectionParts = section.split("\n")
      return {
        id: index,
        question: sectionParts.find(part => part.includes("Question"))?.replace("Question:", "").trim(),
        answer: sectionParts.find(part => part.includes("Answer"))?.replace("Answer:", "").trim()
      }
    } else {
      return { 
        id: index,
        information: section.trim() 
      }
    }
  })
  
  const jsonString = JSON.stringify(data, null, 2)
    .replace(/\\u003C/g, '<')
    .replace(/\\u003E/g, '>')
    .replace(/\\u0027/g, "'")
  
  return new Response(jsonString, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
