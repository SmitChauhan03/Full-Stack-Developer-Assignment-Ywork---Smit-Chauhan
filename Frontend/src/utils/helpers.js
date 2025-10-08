export const getCurrentTime = () => {
  const now = new Date();
  return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

let lastReply = null;

export const getRandomReply = (botReplies, userMessage = "") => {
  const msg = userMessage.toLowerCase();

  // Basic intent detection
  if (/hello|hi|hey/.test(msg)) {
    return "Hey! Kem che? 😊";
  } else if (/thank|thx|thanks/.test(msg)) {
    return "You're welcome!";
  } else if (/how are you/.test(msg)) {
    return "I am good! Tamne kem cho?";
  } else if (/ok|okay/.test(msg)) {
    return "Perfect! Chalo fine che ";
  } else if (/bye|goodnight|gn/.test(msg)) {
    return "Bye! Have a great day 🙌";
  }

  // Avoid repeating last reply
  let newReply;
  do {
    newReply = botReplies[Math.floor(Math.random() * botReplies.length)];
  } while (newReply === lastReply && botReplies.length > 1);

  lastReply = newReply;
  return newReply;
};

