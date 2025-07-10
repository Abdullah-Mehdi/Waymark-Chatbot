# WayChat - Conversational Creative Assistant

WayChat is an intelligent chatbot interface built with HTML, CSS, and JavaScript using the OpenAI Chat Completions API. It serves as Waymark's friendly creative assistant, helping users transform raw ideas into compelling short-form video ad concepts.

## ✨ Features

### 🤖 **AI-Powered Conversations**
- Powered by OpenAI's GPT-4o model for creative and intelligent responses
- Contextual conversation memory - remembers the entire chat history
- Specialized prompts for video ad creation and marketing guidance
- Temperature setting of 0.8 for creative responses, limited to 300 tokens for concise feedback

### 💬 **Modern Chat Interface**
- **Chat bubbles**: User messages (blue) and assistant messages (gray) with distinct styling
- **Real-time "Thinking..." animation**: Shows animated dots while AI generates responses
- **Formatted responses**: Automatic formatting with line breaks, bold section headers, and proper spacing
- **Auto-scroll**: Automatically scrolls to show the latest messages

### 🎨 **Professional Design**
- Modern gradient backgrounds and sleek styling
- Material Design icons for intuitive UI elements
- Responsive design that works on different screen sizes
- Smooth animations and transitions

### 🔧 **Advanced Functionality**
- **Enter key support**: Send messages by pressing Enter or clicking the send button
- **Empty message prevention**: Won't send blank messages
- **Error handling**: Graceful error messages if API calls fail
- **Toggle interface**: Click the chat icon to open/close the chatbot panel

### 📏 **Resizable Chat Panel**
- **Edge-based resizing**: Hover over any edge of the chat panel to resize it
- **Smart cursor feedback**: Cursor changes to indicate resize direction
- **Boundary constraints**: Minimum (320px × 400px) and maximum (800px × 80% screen height) sizes
- **Fixed positioning**: Panel stays anchored to bottom-right corner while resizing
- **Flexible message area**: Chat messages expand with panel size for better readability

## 🏗️ **Technical Architecture**

### **Frontend Technologies**
- **HTML5**: Semantic structure with accessibility features
- **CSS3**: Modern styling with flexbox, gradients, and animations
- **Vanilla JavaScript**: Clean, beginner-friendly ES6+ code with async/await
- **Google Fonts**: Inter and Space Grotesk for professional typography
- **Material Icons**: Outlined icons for consistent UI elements

### **API Integration**
- **OpenAI Chat Completions API**: GPT-4o model integration
- **Secure API key management**: Keys stored in separate `secrets.js` file
- **Error handling**: Comprehensive error catching and user feedback
- **Rate limiting awareness**: Respects OpenAI's usage guidelines

## 📁 **Project Structure**

```
/
├── index.html          # Main HTML structure
├── style.css           # All styling and animations
├── script.js           # JavaScript functionality
├── secrets.js          # API key storage (not in version control)
├── prompts.md          # Development steps and feature requirements
├── README.md           # This documentation
└── img/
    └── logo.png        # Waymark logo asset
```

## 🚀 **Getting Started**

### **Prerequisites**
- A modern web browser (Chrome, Firefox, Safari, Edge)
- OpenAI API key ([get one here](https://platform.openai.com/api-keys))

### **Setup Instructions**

1. **Clone or fork this repository**
   ```bash
   git clone https://github.com/your-username/waymark-chatbot.git
   cd waymark-chatbot
   ```

2. **Configure your API key**
   - Open `secrets.js`
   - Replace `'your-api-key-here'` with your actual OpenAI API key:
   ```javascript
   const OPENAI_API_KEY = 'sk-your-actual-api-key-here';
   ```

3. **Launch the application**
   - Open `index.html` in your web browser
   - Or use a local development server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   ```

4. **Start chatting!**
   - Click the chat icon in the bottom-right corner
   - Type your message and press Enter or click Send
   - Resize the chat panel by dragging its edges for better viewing

## 💡 **Usage Examples**

### **Creative Brainstorming**
```
User: "I need a video ad for my coffee shop"
WayChat: "Great! I'd love to help you create a compelling coffee shop ad. 

**Script:** Start with the aroma - close-up of coffee beans, steam rising...

**Tone:** Warm, inviting, community-focused

**CTA:** 'Visit us today for your perfect cup!'"
```

### **Video Structure Guidance**
```
User: "How should I structure a 30-second restaurant ad?"
WayChat: "Perfect! Here's a proven 30-second restaurant ad structure:

**Structure:**
1. Hook (0-3s): Mouth-watering food shot
2. Problem/Solution (3-15s): Show the dining experience
3. Social Proof (15-25s): Happy customers
4. CTA (25-30s): Location and call-to-action

**Visual Direction:** Warm lighting, close-up food shots, diverse happy diners"
```

## 🎯 **WayChat's Specialization**

WayChat is specifically designed to help with:
- **Video ad conceptualization** and storyboarding
- **Script writing** for short-form video content
- **Tone and style guidance** for brand consistency
- **Call-to-action optimization** for better conversion
- **Visual direction** and cinematography suggestions
- **Music and audio recommendations** for video ads

## 🔒 **Security & Privacy**

- **API keys**: Never commit your `secrets.js` file to version control
- **Client-side only**: All processing happens in the browser
- **OpenAI compliance**: Follows OpenAI's usage policies and guidelines
- **No data persistence**: Conversations are not stored server-side

## 🛠️ **Development Notes**

### **Code Style**
- **Beginner-friendly**: Clear comments and simple, readable code
- **Modern JavaScript**: Uses `const`/`let`, async/await, and template literals
- **No frameworks**: Pure vanilla JavaScript for educational purposes
- **Consistent formatting**: Proper indentation and naming conventions

### **Key Functions**
- `addMessageToChat()`: Handles message display and formatting
- `sendMessageToOpenAI()`: Manages API calls and responses
- `formatAssistantMessage()`: Applies smart formatting to AI responses
- `initializeResize()`: Sets up the edge-based resizing functionality

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 **License**

This project is open source and available under the [MIT License](LICENSE).

## 🙏 **Acknowledgments**

- **OpenAI** for the powerful GPT-4o API
- **Waymark** for the creative inspiration and branding
- **Material Design** for the beautiful icon system
- **Google Fonts** for the professional typography

---

**Built with ❤️**