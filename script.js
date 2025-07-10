// Get chatbot elements
const chatbotToggleBtn = document.getElementById('chatbotToggleBtn');
const chatbotPanel = document.getElementById('chatbotPanel');
const chatbotMessages = document.getElementById('chatbotMessages');
const chatbotInput = document.getElementById('chatbotInput');
const chatbotSendBtn = document.getElementById('chatbotSendBtn');

// Variables for resize functionality
let isResizing = false;
let resizeDirection = '';
let startX, startY, startWidth, startHeight, startLeft, startTop;

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

// Function to initialize resize functionality
function initializeResize() {
  if (chatbotPanel) {
    // Add mouse events for edge-based resizing
    chatbotPanel.addEventListener('mousemove', handleMouseMove);
    chatbotPanel.addEventListener('mousedown', startResize);
    chatbotPanel.addEventListener('mouseleave', clearResizeCursor);
    
    // Add global mouse events for resizing
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', stopResize);
  }
}

// Function to detect which edge the mouse is over
function getResizeDirection(e) {
  const rect = chatbotPanel.getBoundingClientRect();
  const edgeThreshold = 8; // Pixels from edge to trigger resize
  
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  
  const isNearTop = mouseY - rect.top <= edgeThreshold;
  const isNearBottom = rect.bottom - mouseY <= edgeThreshold;
  const isNearLeft = mouseX - rect.left <= edgeThreshold;
  const isNearRight = rect.right - mouseX <= edgeThreshold;
  
  // Corner detection (prioritize corners)
  if (isNearTop && isNearLeft) return 'top-left';
  if (isNearTop && isNearRight) return 'top-right';
  if (isNearBottom && isNearLeft) return 'bottom-left';
  if (isNearBottom && isNearRight) return 'bottom-right';
  
  // Edge detection
  if (isNearTop) return 'top';
  if (isNearBottom) return 'bottom';
  if (isNearLeft) return 'left';
  if (isNearRight) return 'right';
  
  return '';
}

// Function to handle mouse movement for cursor changes
function handleMouseMove(e) {
  if (isResizing) return;
  
  const direction = getResizeDirection(e);
  
  // Clear all resize classes
  chatbotPanel.classList.remove(
    'resize-top', 'resize-bottom', 'resize-left', 'resize-right',
    'resize-top-left', 'resize-top-right', 'resize-bottom-left', 'resize-bottom-right'
  );
  
  // Add appropriate resize class
  if (direction) {
    chatbotPanel.classList.add(`resize-${direction}`);
  }
}

// Function to clear resize cursor when mouse leaves panel
function clearResizeCursor() {
  if (!isResizing) {
    chatbotPanel.classList.remove(
      'resize-top', 'resize-bottom', 'resize-left', 'resize-right',
      'resize-top-left', 'resize-top-right', 'resize-bottom-left', 'resize-bottom-right'
    );
  }
}

// Function to start resizing
function startResize(e) {
  const direction = getResizeDirection(e);
  
  if (!direction) return;
  
  isResizing = true;
  resizeDirection = direction;
  
  // Get initial mouse position
  startX = e.clientX;
  startY = e.clientY;
  
  // Get current panel dimensions and position
  const rect = chatbotPanel.getBoundingClientRect();
  startWidth = rect.width;
  startHeight = rect.height;
  startLeft = rect.left;
  startTop = rect.top;
  
  // Prevent text selection during resize
  document.body.style.userSelect = 'none';
  
  // Add resizing class for visual feedback
  chatbotPanel.classList.add('resizing');
  
  e.preventDefault();
  e.stopPropagation();
}

// Function to handle resizing
function handleResize(e) {
  if (!isResizing) return;
  
  const deltaX = e.clientX - startX;
  const deltaY = e.clientY - startY;
  
  let newWidth = startWidth;
  let newHeight = startHeight;
  
  // Calculate new dimensions based on resize direction
  switch (resizeDirection) {
    case 'right':
      // Dragging right = make wider
      newWidth = Math.max(320, Math.min(800, startWidth + deltaX));
      break;
    case 'left':
      // Dragging left = make narrower (panel stays anchored to right)
      newWidth = Math.max(320, Math.min(800, startWidth - deltaX));
      break;
    case 'bottom':
      // Dragging down = make taller
      newHeight = Math.max(400, Math.min(window.innerHeight * 0.8, startHeight + deltaY));
      break;
    case 'top':
      // Dragging up = make shorter (panel stays anchored to bottom)
      newHeight = Math.max(400, Math.min(window.innerHeight * 0.8, startHeight - deltaY));
      break;
    case 'bottom-right':
      // Dragging down-right = make taller and wider
      newWidth = Math.max(320, Math.min(800, startWidth + deltaX));
      newHeight = Math.max(400, Math.min(window.innerHeight * 0.8, startHeight + deltaY));
      break;
    case 'bottom-left':
      // Dragging down-left = make taller and narrower
      newWidth = Math.max(320, Math.min(800, startWidth - deltaX));
      newHeight = Math.max(400, Math.min(window.innerHeight * 0.8, startHeight + deltaY));
      break;
    case 'top-right':
      // Dragging up-right = make shorter and wider
      newWidth = Math.max(320, Math.min(800, startWidth + deltaX));
      newHeight = Math.max(400, Math.min(window.innerHeight * 0.8, startHeight - deltaY));
      break;
    case 'top-left':
      // Dragging up-left = make shorter and narrower
      newWidth = Math.max(320, Math.min(800, startWidth - deltaX));
      newHeight = Math.max(400, Math.min(window.innerHeight * 0.8, startHeight - deltaY));
      break;
  }
  
  // Apply new dimensions (panel stays anchored to bottom-right)
  chatbotPanel.style.width = `${newWidth}px`;
  chatbotPanel.style.height = `${newHeight}px`;
  
  e.preventDefault();
}

// Function to stop resizing
function stopResize() {
  if (isResizing) {
    isResizing = false;
    resizeDirection = '';
    
    // Re-enable text selection
    document.body.style.userSelect = '';
    
    // Remove resizing class
    chatbotPanel.classList.remove('resizing');
    
    // Clear resize cursor classes
    clearResizeCursor();
  }
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

// Initialize resize functionality
initializeResize();
