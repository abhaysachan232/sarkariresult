type JobData = {
  title: string;
  organization: string;
  type: string; // latest-jobs | admit-card | exam-city | interview-letter
};

export function generateJobFAQs(job: JobData) {
  const { title, organization, type } = job;

  const isAdmit = type === "admit-card" || type === "exam-city" || type === "interview-letter";

  return [
    {
      question: `What is ${title}?`,
      answer: `${title} ${organization} ke dwara release kiya gaya hai. Is page par aapko latest updates, important dates, direct links aur official information milti hai jo candidates ke liye useful hoti hai.`,
    },
    {
      question: `Who can apply for ${title}?`,
      answer: isAdmit
        ? `Sirf wahi candidates ${title} download kar sakte hain jinhone ${organization} ke exam / recruitment ke liye successfully registration kiya hai.`
        : `${organization} ke dwara prescribed eligibility criteria ko fulfill karne wale candidates ${title} ke liye apply kar sakte hain.`,
    },
    {
      question: `How can I check or download ${title}?`,
      answer: `Candidates ${organization} ki official website par visit karke ${title} se related link ke through online process complete kar sakte hain. Direct link is page par bhi diya gaya hota hai.`,
    },
    {
      question: `Is there any fee for ${title}?`,
      answer: isAdmit
        ? `Nahi, ${title} download karne ke liye koi bhi application fee nahi li jati hai.`
        : `Application fee category-wise hoti hai. Complete fee details is page par clearly mention ki gayi hain.`,
    },
    {
      question: `What details are mentioned in ${title}?`,
      answer: isAdmit
        ? `${title} me candidate ka naam, roll number, exam date, exam city, reporting time aur important instructions mention hote hain.`
        : `${title} notification me vacancy details, eligibility, age limit, selection process aur important dates di jati hain.`,
    },
    {
      question: `What should I do if there is an error in ${title}?`,
      answer: `Agar ${title} me kisi bhi prakar ki galti ho, to candidates ko turant ${organization} ke official helpdesk ya notification me diye gaye contact details par sampark karna chahiye.`,
    },
    {
      question: `Is ${title} officially released by ${organization}?`,
      answer: `Haan, ${title} ${organization} ke official sources ke basis par hi publish kiya gaya hai. Candidates ko hamesha official website ko bhi verify karna chahiye.`,
    }
  ];
}
