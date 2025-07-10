// Get chatbot elements
const chatbotToggleBtn = document.getElementById('chatbotToggleBtn');
const chatbotPanel = document.getElementById('chatbotPanel');
const chatbotMessages = document.getElementById('chatbotMessages');
const chatbotInput = document.getElementById('chatbotInput');
const chatbotSendBtn = document.getElementById('chatbotSendBtn');

// Array to store conversation messages
// Initialize with system message to define WayChat's role
let messages = [
  {
    role: 'system',
    content: `You are WayChat, Waymark's friendly creative assistant.

Waymark is a video ad creation platform that helps people turn ideas, products, or messages into high-quality, ready-to-run videos. The platform is used by small businesses, agencies, and marketers to create broadcast-quality ads with minimal friction.

Your job is to help users shape raw input — whether it's a business name, a tagline, a product, a vibe, or a rough idea — into a short-form video concept.

Your responses may include suggested video structures, voiceover lines, tone and visual direction, music suggestions, and clarifying follow-up questions.

If the user's input is unclear, ask 1–2 short questions to help sharpen the direction before offering creative suggestions.

Only respond to questions related to Waymark, its tools, its platform, or the creative process of making short-form video ads. If a question is unrelated, politely explain that you're focused on helping users create video ads with Waymark.

Keep your replies concise, collaborative, and focused on helping users express their message clearly. Always align with modern marketing best practices — and stay supportive and friendly.`
  }
];

// Function to add a message to the chat window
function addMessageToChat(content, isUser = false) {
  const messageDiv = document.createElement('div');
  messageDiv.className = isUser ? 'user-message' : 'assistant-message';
  
  if (isUser) {
    // For user messages, use plain text
    messageDiv.textContent = content;
  } else {
    // For assistant messages, format with line breaks and sections
    const formattedContent = formatAssistantMessage(content);
    messageDiv.innerHTML = formattedContent;
  }
  
  chatbotMessages.appendChild(messageDiv);
  
  // Scroll to the bottom to show the latest message
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Function to format assistant messages for better readability
function formatAssistantMessage(content) {
  // Replace double line breaks with section breaks
  let formatted = content.replace(/\n\n/g, '<br><br>');
  
  // Replace single line breaks with HTML line breaks
  formatted = formatted.replace(/\n/g, '<br>');
  
  // Add extra spacing around common sections
  formatted = formatted.replace(/(Script:|Tone:|CTA:|Call to Action:|Voiceover:|Music:|Visual Direction:|Structure:)/gi, '<br><strong>$1</strong>');
  
  // Add spacing around numbered lists
  formatted = formatted.replace(/(\d+\.)/g, '<br>$1');
  
  // Add spacing around bullet points
  formatted = formatted.replace(/([•\-\*])/g, '<br>$1');
  
  // Clean up extra breaks at the beginning
  formatted = formatted.replace(/^<br>/, '');
  
  return formatted;
}

// Function to show thinking animation
function showThinkingAnimation() {
  const thinkingDiv = document.createElement('div');
  thinkingDiv.className = 'thinking-message';
  thinkingDiv.id = 'thinking-animation';
  thinkingDiv.innerHTML = '<span class="thinking-dots">Thinking<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span></span>';
  chatbotMessages.appendChild(thinkingDiv);
  
  // Scroll to the bottom to show the thinking animation
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Function to hide thinking animation
function hideThinkingAnimation() {
  const thinkingDiv = document.getElementById('thinking-animation');
  if (thinkingDiv) {
    thinkingDiv.remove();
  }
}

// Function to send message to OpenAI API
async function sendMessageToOpenAI(userMessage) {
  try {
    // Add user message to messages array
    messages.push({
      role: 'user',
      content: userMessage
    });
    
    // Show thinking animation while waiting for response
    showThinkingAnimation();
    
    // Make API call to OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: messages,
        max_completion_tokens: 300,
        temperature: 0.8
      })
    });
    
    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    // Parse the response
    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;
    
    // Hide thinking animation
    hideThinkingAnimation();
    
    // Add assistant message to messages array
    messages.push({
      role: 'assistant',
      content: assistantMessage
    });
    
    // Display assistant's response in chat
    addMessageToChat(assistantMessage, false);
    
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    
    // Hide thinking animation on error
    hideThinkingAnimation();
    
    addMessageToChat('Sorry, I encountered an error. Please try again.', false);
  }
}

// Function to handle sending a message
function handleSendMessage() {
  const userMessage = chatbotInput.value.trim();
  
  // Don't send empty messages
  if (!userMessage) {
    return;
  }
  
  // Display user message in chat
  addMessageToChat(userMessage, true);
  
  // Clear the input field
  chatbotInput.value = '';
  
  // Send message to OpenAI API
  sendMessageToOpenAI(userMessage);
}

if (chatbotToggleBtn && chatbotPanel) {
  // Toggle chat open/closed when clicking the button
  chatbotToggleBtn.addEventListener('click', () => {
    chatbotPanel.classList.toggle('open');
  });

  // Close chat when clicking anywhere except the chat panel or button
  document.addEventListener('click', (e) => {
    // If chat is open AND user clicked outside chat area, close it
    if (chatbotPanel.classList.contains('open') && 
        !chatbotPanel.contains(e.target) && 
        !chatbotToggleBtn.contains(e.target)) {
      chatbotPanel.classList.remove('open');
    }
  });
}

// Add event listeners for sending messages
if (chatbotSendBtn) {
  chatbotSendBtn.addEventListener('click', handleSendMessage);
}

// Allow sending messages with Enter key
if (chatbotInput) {
  chatbotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  });
}
