/* ============================================
   AI CHATBOT - Ultra Premium with Streaming
   Smooth ChatGPT-like Text Generation
   ============================================ */

class VashistaAIBot {
    constructor() {
        // API Configuration - Set your key in config.js or replace 'YOUR_GROQ_API_KEY'
        this.GROQ_API_KEY = window.GROQ_CONFIG?.API_KEY || 'YOUR_GROQ_API_KEY';
        this.GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
        this.MODEL = 'llama-3.3-70b-versatile';

        this.conversationHistory = [];
        this.isTyping = false;
        this.typingSpeed = 15; // milliseconds per character

        this.vashistaProfile = `
You are Vashista's personal AI assistant. Follow these FORMATTING RULES strictly:
1. Use clean bullet points with "•" symbol for lists
2. Use **bold** for important terms and headings
3. Keep responses concise - max 5-6 bullet points
4. DO NOT use numbered lists (1. 2. 3.) - use bullet points instead
5. DO NOT use asterisks (*) for lists - use • symbol
6. Add proper spacing between sections

## VASHISTA C V - PROFILE

**Current Role:** Project Student at ISRO-NRSC (National Remote Sensing Centre), Hyderabad
**Education:** B.E. Computer Science Engineering, Jain Institute of Technology, Davangere (Final Year)
**Contact:** vasisthamanju796@gmail.com
**LinkedIn:** linkedin.com/in/vashistacv
**GitHub:** github.com/vasistacv

## ABOUT
Vashista is currently at ISRO-NRSC working on satellite imagery analysis and remote sensing. He is an EXPERT in Data Science and Deep Learning with extensive experience in building production-ready AI systems.

## CORE EXPERTISE (Very Strong)
• **Data Science** - Expert level. Pandas, NumPy, Statistical Analysis, Feature Engineering, Data Visualization
• **Deep Learning** - Expert level. TensorFlow, PyTorch, Keras, CNNs, RNNs, LSTMs, 3D-CNNs, Transfer Learning
• **Machine Learning** - Expert level. Scikit-learn, XGBoost, Random Forest, Ensemble Methods
• **Computer Vision** - Advanced. OpenCV, Image Classification, Object Detection
• **NLP & LLMs** - Advanced. LangChain, RAG Systems, Prompt Engineering

## EXPERIENCE (Latest First)
• **ISRO-NRSC Project Student** (Sep 2025 - Present) - Hyderabad
  Working on satellite data processing, remote sensing, and AI/ML for space technology
• **AI/ML Intern** - AICTE, Shell India & Edunet (Jul-Aug 2025)
• **Python Intern** - Motioncut (Feb-May 2025)
• **ML Intern** - Cognifyz Technologies (Nov-Dec 2024)
• **Data Science Intern** - Brainwave Matrix (May-Jun 2024)

## KEY PROJECTS
• **3D-CNN Rainfall Prediction** - Deep learning model using spatio-temporal convolutions for climate analysis
• **Samarth AI** - Production RAG system with LangChain (projectsamarth.vercel.app)
• **Self-Healing Cyber Defense** - 1st Place Winner at Mysterio 2025
• **EV Demand Prediction** - Random Forest with R²=0.94
• **Deepfake Detection** - ResNet-CNN + LSTM with 88% accuracy

## OTHER SKILLS
• Remote Sensing & Satellite Data Analysis
• Cybersecurity & Ethical Hacking
• Blockchain & Cryptography
• Full Stack Development (HTML, CSS, JS, Flask)

## ACHIEVEMENTS
• Research Paper Published in IJPREMS (Dec 2024)
• 1st Place - Mysterio 2025, JNNCE Shivamogga

RESPONSE STYLE: Be friendly, professional, and use proper formatting with bullet points.
`;

        this.systemMessage = {
            role: 'system',
            content: this.vashistaProfile
        };

        this.init();
    }

    init() {
        this.chatbotToggle = document.querySelector('.chatbot-toggle');
        this.chatbotContainer = document.querySelector('.chatbot-container');
        this.messagesContainer = document.querySelector('.chatbot-messages');
        this.inputField = document.querySelector('.chatbot-input');
        this.sendButton = document.querySelector('.chatbot-send');
        this.quickSuggestions = document.querySelectorAll('.quick-suggestion');

        if (!this.chatbotToggle) return;

        this.bindEvents();
        this.addWelcomeMessage();
    }

    bindEvents() {
        this.chatbotToggle.addEventListener('click', () => this.toggleChat());
        this.sendButton.addEventListener('click', () => this.sendMessage());

        this.inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        this.quickSuggestions.forEach(btn => {
            btn.addEventListener('click', () => {
                this.inputField.value = btn.textContent;
                this.sendMessage();
            });
        });
    }

    toggleChat() {
        this.chatbotToggle.classList.toggle('active');
        this.chatbotContainer.classList.toggle('open');

        if (this.chatbotContainer.classList.contains('open')) {
            setTimeout(() => this.inputField.focus(), 300);
        }
    }

    addWelcomeMessage() {
        const welcomeMsg = `Hey there! 👋 I'm Vashista's AI assistant.

I can tell you about:
• His current work at **ISRO-NRSC**
• Technical skills & expertise
• Projects & achievements
• How to get in touch

What would you like to know?`;

        this.addMessage(welcomeMsg, 'bot', false);
    }

    async sendMessage() {
        const message = this.inputField.value.trim();
        if (!message || this.isTyping) return;

        this.inputField.value = '';
        this.addMessage(message, 'user', false);
        this.showTyping();

        try {
            this.conversationHistory.push({ role: 'user', content: message });
            const response = await this.getAIResponse(message);
            this.hideTyping();

            // Add message with streaming effect
            await this.addMessage(response, 'bot', true);
            this.conversationHistory.push({ role: 'assistant', content: response });

        } catch (error) {
            console.error('Error:', error);
            this.hideTyping();
            this.addMessage("Sorry, I'm having trouble connecting. Please try again!", 'bot', false);
        }
    }

    async getAIResponse(userMessage) {
        const messages = [
            this.systemMessage,
            ...this.conversationHistory.slice(-8),
            { role: 'user', content: userMessage }
        ];

        const response = await fetch(this.GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: this.MODEL,
                messages: messages,
                max_tokens: 800,
                temperature: 0.7
            })
        });

        if (!response.ok) throw new Error(`API error: ${response.status}`);

        const data = await response.json();
        return data.choices[0].message.content;
    }

    async addMessage(text, sender, stream = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;

        const time = new Date().toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });

        const avatarSVG = sender === 'bot'
            ? `<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>`
            : `<svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`;

        messageDiv.innerHTML = `
            <div class="message-avatar">${avatarSVG}</div>
            <div class="message-content">
                <div class="message-bubble"></div>
                <span class="message-time">${time}</span>
            </div>
        `;

        this.messagesContainer.appendChild(messageDiv);
        const bubble = messageDiv.querySelector('.message-bubble');

        if (stream && sender === 'bot') {
            await this.streamText(bubble, text);
        } else {
            bubble.innerHTML = this.formatMessage(text);
        }

        this.scrollToBottom();
    }

    async streamText(element, text) {
        this.isTyping = true;
        const formattedText = this.formatMessage(text);
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = formattedText;
        const plainText = tempDiv.textContent;

        let currentIndex = 0;
        element.innerHTML = '<span class="typing-cursor"></span>';

        return new Promise((resolve) => {
            const typeNextChar = () => {
                if (currentIndex < plainText.length) {
                    // Get the portion of formatted text up to current position
                    const displayText = this.getFormattedSubstring(formattedText, currentIndex + 1);
                    element.innerHTML = displayText + '<span class="typing-cursor"></span>';
                    currentIndex++;
                    this.scrollToBottom();

                    // Variable speed for natural feel
                    let delay = this.typingSpeed;
                    const char = plainText[currentIndex - 1];
                    if (char === '.' || char === '!' || char === '?') delay = 150;
                    else if (char === ',' || char === ':') delay = 80;
                    else if (char === '\n') delay = 100;

                    setTimeout(typeNextChar, delay);
                } else {
                    element.innerHTML = formattedText;
                    this.isTyping = false;
                    this.scrollToBottom();
                    resolve();
                }
            };

            setTimeout(typeNextChar, 200);
        });
    }

    getFormattedSubstring(html, charCount) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        let count = 0;

        const truncateNode = (node) => {
            if (count >= charCount) return null;

            if (node.nodeType === Node.TEXT_NODE) {
                const remaining = charCount - count;
                if (node.textContent.length <= remaining) {
                    count += node.textContent.length;
                    return node.cloneNode();
                } else {
                    count = charCount;
                    const newNode = document.createTextNode(node.textContent.substring(0, remaining));
                    return newNode;
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const clone = node.cloneNode(false);
                for (const child of node.childNodes) {
                    const truncatedChild = truncateNode(child);
                    if (truncatedChild) clone.appendChild(truncatedChild);
                    if (count >= charCount) break;
                }
                return clone;
            }
            return null;
        };

        const result = document.createElement('div');
        for (const child of tempDiv.childNodes) {
            const truncated = truncateNode(child);
            if (truncated) result.appendChild(truncated);
            if (count >= charCount) break;
        }

        return result.innerHTML;
    }

    formatMessage(text) {
        // Clean up the text first
        let formatted = text
            // Convert ** to bold
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Convert single * to italics (but not bullet points)
            .replace(/(?<!•\s)\*(.*?)\*/g, '<em>$1</em>')
            // Convert backticks to code
            .replace(/`(.*?)`/g, '<code>$1</code>')
            // Convert bullet points with proper styling
            .replace(/^[•\-\*]\s*(.+)$/gm, '<div class="chat-list-item">• $1</div>')
            // Convert numbered lists to bullet format
            .replace(/^\d+\.\s*(.+)$/gm, '<div class="chat-list-item">• $1</div>')
            // Double newlines become paragraph breaks
            .replace(/\n\n/g, '</p><p>')
            // Single newlines become line breaks
            .replace(/\n/g, '<br>')
            // Wrap in paragraph tags
            .replace(/^/, '<p>')
            .replace(/$/, '</p>');

        return formatted;
    }

    showTyping() {
        this.isTyping = true;
        this.sendButton.disabled = true;

        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
            </div>
            <div class="typing-dots">
                <span></span><span></span><span></span>
            </div>
        `;

        this.messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTyping() {
        this.sendButton.disabled = false;
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) typingIndicator.remove();
    }

    scrollToBottom() {
        this.messagesContainer.scrollTo({
            top: this.messagesContainer.scrollHeight,
            behavior: 'smooth'
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.vashistaBot = new VashistaAIBot();
});
