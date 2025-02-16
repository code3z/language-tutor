const gptResult = `
The verb "to sleep" in Swahili is <span class='foreign'>kulala</span>.

---

challenge: true

Question: What was "Are you sleeping"?  
Answer: Je, unalala

---

challenge: true

Question: What was "to eat"?  
Answer: Kula

---

Verbs that are very short like <span class='foreign'>kula</span> often keep the <span class='foreign'>ku</span> outside of the true form.  
For example, if we say "I'm eating," it's "ninakula" rather than "ninala."  
This is important when building with short verbs.

Question: How would you say "you are eating"?  
Answer: Unakula

---

challenge: true

Question: Are you eating?  
Answer: Unakula?

---

challenge: true

Question: Where are you eating?  
Answer: Unakula wapi?

---

The word "wapi" goes after the verb, but it doesn't attach to it.  
When asking "how do you eat?" it's added directly to the end of the verb, altering its sound.

Question: How would you say "how do you eat?"  
Answer: Unakulaje?

---

When giving an order, you say <span class='foreign'>kula</span> for "eat."

---

challenge: true

Question: Eat now.  
Answer: Kula sasa.

---

The verb "to do" or "to make" is <span class='foreign'>kufanya</span>.  
When building with it, we drop the <span class='foreign'>ku</span>.

---

challenge: true

Question: Are you doing it?  
Answer: Unafanya?

---

challenge: true

Question: Do it now.  
Answer: Fanya sasa.

---

"No object" means the verb references an action, not an object.

The verb "to come" is <span class='foreign'>kuja</span>.

---

challenge: true

Question: I'm coming now.  
Answer: Ninakuja sasa.

---

challenge: true

Question: Are you coming?  
Answer: Unakuja?

---

challenge: true

Question: How are you coming?  
Answer: Unakujaje?

---

The word for "here" is <span class='foreign'>hapa</span>.

---

challenge: true

Question: Are you coming here?  
Answer: Unakuja hapa?

---

challenge: true

Question: How are you coming here?  
Answer: Unakujaje hapa?

---

The verb "to know" is <span class='foreign'>kujua</span>.

---

challenge: true

Question: How would you say "I know"?  
Answer: Ninajua

---

challenge: true

Question: I want to know.  
Answer: Ninataka kujua.

---

challenge: true

Question: Do you know me?  
Answer: Unanijua?

---

challenge: true

Question: How do you know me?  
Answer: Unanijuaje?

---

The command "come" in Swahili is <span class='foreign'>njoo</span>.  
It's a bit irregular because it doesn't start with a vowel.

---

challenge: true

Question: Come here now.  
Answer: Njoo hapa sasa.
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
