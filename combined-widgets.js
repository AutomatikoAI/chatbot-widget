(function() {

    //======================================================================
    // TEXT CHAT WIDGET IMPLEMENTATION 
    //======================================================================
    
    function initializeTextChatWidget() {
        // Set up the Text Chat Widget configuration
        window.ChatWidgetConfig = window.ChatWidgetConfig || {
            webhook: {
                url: 'https://primary-production-273d.up.railway.app/webhook/f406671e-c954-4691-b39a-66c90aa2f103/chat',
                route: 'general'
            },
            branding: {
                logo: 'https://raw.githubusercontent.com/AutomatikoAI/chatbot-widget/refs/heads/main/logo.jpg',
                name: 'Zamna Real Estate Assistant',
                welcomeText: 'Hello! How can I help you?',
                // responseTimeText: 'We typically respond right away',
                poweredBy: {
                    text: 'Powered by n8n',
                    link: 'https://n8n.partnerlinks.io/m8a94i19zhqq?utm_source=nocodecreative.io'
                }
            },
            style: {
                primaryColor: '#854fff',
                secondaryColor: '#6b3fd4',
                position: 'left',
                backgroundColor: '#ffffff',
                fontColor: '#333333'
            }
        };
        
        // Create and inject styles
        const styles = `
            .n8n-chat-widget {
                --chat--color-primary: var(--n8n-chat-primary-color, #854fff);
                --chat--color-secondary: var(--n8n-chat-secondary-color, #6b3fd4);
                --chat--color-background: var(--n8n-chat-background-color, #ffffff);
                --chat--color-font: var(--n8n-chat-font-color, #333333);
                font-family: 'Outfit', sans-serif;
            }
            .n8n-chat-widget .chat-container {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999999;
                display: none;
                width: 380px;
                height: 600px;
                background: var(--chat--color-background);
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(133, 79, 255, 0.15);
                border: 1px solid rgba(133, 79, 255, 0.2);
                overflow: hidden;
                font-family: 'Outfit', sans-serif;
            }
            .n8n-chat-widget .chat-container.position-left {
                right: auto;
                left: 20px;
            }
            .n8n-chat-widget .chat-container.open {
                display: flex;
                flex-direction: column;
            }
            .n8n-chat-widget .brand-header {
                padding: 16px;
                display: flex;
                align-items: center;
                gap: 12px;
                border-bottom: 1px solid rgba(133, 79, 255, 0.1);
                position: relative;
            }
            .n8n-chat-widget .close-button {
                position: absolute;
                right: 16px;
                top: 50%;
                transform: translateY(-50%);
                background: none;
                border: none;
                color: var(--chat--color-font);
                cursor: pointer;
                padding: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: color 0.2s;
                font-size: 20px;
                opacity: 0.6;
            }
            .n8n-chat-widget .close-button:hover {
                opacity: 1;
            }
            .n8n-chat-widget .brand-header img {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                object-fit: cover;
            }
            .n8n-chat-widget .brand-header span {
                font-size: 18px;
                font-weight: 700;
                color: #000000;
            }
            .n8n-chat-widget .new-conversation {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                padding: 20px;
                text-align: center;
                width: 100%;
                max-width: 300px;
            }
            .n8n-chat-widget .welcome-text {
                font-size: 24px;
                font-weight: 700;
                color: #000000;
                margin-bottom: 24px;
                line-height: 1.3;
                text-transform: none !important;
            }
            .n8n-chat-widget .new-chat-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                width: 100%;
                padding: 16px 24px;
                // background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
                background: #0F2027;  /* fallback for old browsers */
                background: -webkit-linear-gradient(to right, #2C5364, #203A43, #0F2027);  /* Chrome 10-25, Safari 5.1-6 */
                background: linear-gradient(to right, #2C5364, #203A43, #0F2027); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
                transition: transform 0.3s;
                font-weight: 500;
                font-family: 'Outfit', sans-serif;
                margin-bottom: 12px;
            }
            .n8n-chat-widget .new-chat-btn:hover {
                transform: scale(1.02);
            }
            .n8n-chat-widget .message-icon {
                width: 20px;
                height: 20px;
            }
            .n8n-chat-widget .response-text {
                font-size: 14px;
                color: var(--chat--color-font);
                opacity: 0.7;
                margin: 0;
            }
            .n8n-chat-widget .chat-interface {
                display: none;
                flex-direction: column;
                height: 100%;
            }
            .n8n-chat-widget .chat-interface.active {
                display: flex;
            }
            .n8n-chat-widget .chat-messages {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
                background: var(--chat--color-background);
                display: flex;
                flex-direction: column;
            }
            .n8n-chat-widget .chat-message {
                padding: 12px 16px;
                margin: 8px 0;
                border-radius: 12px;
                max-width: 80%;
                word-wrap: break-word;
                font-size: 14px;
                line-height: 1.5;
            }
            .n8n-chat-widget .chat-message.user {
                // background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
                background: #0F2027;  /* fallback for old browsers */
                background: -webkit-linear-gradient(to right, #2C5364, #203A43, #0F2027);  /* Chrome 10-25, Safari 5.1-6 */
                background: linear-gradient(to right, #2C5364, #203A43, #0F2027); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
                color: white;
                align-self: flex-end;
                box-shadow: 0 4px 12px rgba(133, 79, 255, 0.2);
                border: none;
            }
            .n8n-chat-widget .chat-message.bot {
                background: var(--chat--color-background);
                border: 1px solid rgba(133, 79, 255, 0.2);
                color: var(--chat--color-font);
                align-self: flex-start;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            }
            .n8n-chat-widget .chat-input {
                padding: 16px;
                background: var(--chat--color-background);
                border-top: 1px solid rgba(133, 79, 255, 0.1);
                display: flex;
                gap: 8px;
            }
            .n8n-chat-widget .chat-input textarea {
                flex: 1;
                padding: 12px;
                border: 1px solid rgba(133, 79, 255, 0.2);
                border-radius: 8px;
                background: var(--chat--color-background);
                color: var(--chat--color-font);
                resize: none;
                font-family: 'Outfit', sans-serif;
                font-size: 14px;
            }
            .n8n-chat-widget .chat-input textarea::placeholder {
                color: var(--chat--color-font);
                opacity: 0.6;
            }
            .n8n-chat-widget .chat-input button {
                // background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
                background: #0F2027;  /* fallback for old browsers */
                background: -webkit-linear-gradient(to right, #2C5364, #203A43, #0F2027);  /* Chrome 10-25, Safari 5.1-6 */
                background: linear-gradient(to right, #2C5364, #203A43, #0F2027); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
                
                color: white;
                border: none;
                border-radius: 8px;
                padding: 0 20px;
                cursor: pointer;
                transition: transform 0.2s;
                font-family: 'Outfit', sans-serif;
                font-weight: 500;
            }
            .n8n-chat-widget .chat-input button:hover {
                transform: scale(1.05);
            }
            .n8n-chat-widget .chat-toggle {
                position: fixed;
                bottom: 20px;
                left: 20px;
                margin-right: 0px;
                margin-bottom: 13.5px;
                width: 62px;
                height: 62px;
                cursor: pointer;
                z-index: 999999;
                transition: transform 0.3s;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                overflow: visible;
                padding: 2px;
                background: linear-gradient(60deg, #f79533, #f37055, #ef4e7b, #a166ab, #5073b8, #1098ad, #07b39b, #6fba82);
                background-size: 300% 300%;
                animation: animatedgradient 3s ease alternate infinite;
                box-shadow: none;
                border: none;
            }
            .n8n-chat-widget .chat-toggle::before {
                content: '';
                position: absolute;
                top: 2px;
                left: 2px;
                right: 2px;
                bottom: 2px;
                background: transparent;
                border-radius: 50%;
                z-index: 0;
            }
            @keyframes animatedgradient {
                0% {
                    background-position: 0% 50%;
                }
                50% {
                    background-position: 100% 50%;
                }
                100% {
                    background-position: 0% 50%;
                }
            }
            .n8n-chat-widget .chat-toggle.position-left {
                right: auto;
                left: 20px;
            }
            .n8n-chat-widget .chat-toggle.position-right {
                left: auto;
                right: 20px;
            }
            .n8n-chat-widget .chat-toggle:hover {
                transform: scale(1.05);
            }
            .n8n-chat-widget .chat-toggle img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                object-fit: cover;
                position: relative;
                z-index: 1;
            }
            .n8n-chat-widget .live-indicator {
                position: absolute;
                top: 5px;
                right: 9px;
                width: 12px;
                height: 12px;
                background-color: #00d084;
                border-radius: 50%;
                border: 2px solid #ffffff;
                z-index: 2;
                transform: translate(30%, -30%);
            }
            .n8n-chat-widget .chat-footer {
                padding: 8px;
                text-align: center;
                background: var(--chat--color-background);
                border-top: 1px solid rgba(133, 79, 255, 0.1);
            }
            .n8n-chat-widget .chat-footer a {
                // color: var(--chat--color-primary);
                color:rgb(202, 202, 202);
                text-decoration: none;
                font-size: 12px;
                opacity: 0.8;
                transition: opacity 0.2s;
                font-family: 'Outfit', sans-serif;
            }
            .n8n-chat-widget .chat-footer a:hover {
                opacity: 1;
            }
        `;
        
        // Load Outfit font from Google Fonts
        const fontLink1 = document.createElement('link');
        fontLink1.rel = 'preconnect';
        fontLink1.href = 'https://fonts.googleapis.com';
        document.head.appendChild(fontLink1);
        
        const fontLink2 = document.createElement('link');
        fontLink2.rel = 'preconnect';
        fontLink2.href = 'https://fonts.gstatic.com';
        fontLink2.crossOrigin = 'anonymous';
        document.head.appendChild(fontLink2);
        
        const fontLink3 = document.createElement('link');
        fontLink3.rel = 'stylesheet';
        fontLink3.href = 'https://fonts.googleapis.com/css2?family=Outfit&display=swap';
        document.head.appendChild(fontLink3);
        
        // Inject styles
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
        
        // Default configuration
        const defaultConfig = {
            webhook: {
                url: '',
                route: ''
            },
            branding: {
                logo: '',
                name: '',
                welcomeText: '',
                responseTimeText: '',
                poweredBy: {
                    text: 'Powered by n8n',
                    link: 'https://n8n.partnerlinks.io/m8a94i19zhqq?utm_source=nocodecreative.io'
                }
            },
            style: {
                primaryColor: '',
                secondaryColor: '',
                position: 'left',
                backgroundColor: '#ffffff',
                fontColor: '#333333'
            }
        };
        
        // Merge user config with defaults
        const config = window.ChatWidgetConfig ? 
            {
                webhook: { ...defaultConfig.webhook, ...window.ChatWidgetConfig.webhook },
                branding: { ...defaultConfig.branding, ...window.ChatWidgetConfig.branding },
                style: { ...defaultConfig.style, ...window.ChatWidgetConfig.style }
            } : defaultConfig;
        
        // Prevent multiple initializations
        if (window.N8NChatWidgetInitialized) return;
        window.N8NChatWidgetInitialized = true;
        
        let currentSessionId = '';
        
        // Create widget container
        const widgetContainer = document.createElement('div');
        widgetContainer.className = 'n8n-chat-widget';
        
        // Set CSS variables for colors
        widgetContainer.style.setProperty('--n8n-chat-primary-color', config.style.primaryColor);
        widgetContainer.style.setProperty('--n8n-chat-secondary-color', config.style.secondaryColor);
        widgetContainer.style.setProperty('--n8n-chat-background-color', config.style.backgroundColor);
        widgetContainer.style.setProperty('--n8n-chat-font-color', config.style.fontColor);
        
        const chatContainer = document.createElement('div');
        chatContainer.className = 'chat-container';
        if (config.style.position === 'left') {
            chatContainer.classList.add('position-left');
            chatContainer.style.left = '20px';
            chatContainer.style.right = 'auto';
        } else {
            chatContainer.style.right = '20px';
            chatContainer.style.left = 'auto';
        }
        
        const newConversationHTML = `
            <div class="brand-header">
                <img src="${config.branding.logo}" alt="${config.branding.name}">
                <span>${config.branding.name}</span>
                <button class="close-button">×</button>
            </div>
            <div class="new-conversation">
                <h2 class="welcome-text">${config.branding.welcomeText}</h2>
                <button class="new-chat-btn">
                    <svg class="message-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/>
                    </svg>
                    Send me a message
                </button>
                <p class="response-text">${config.branding.responseTimeText}</p>
            </div>
        `;
        
        const chatInterfaceHTML = `
            <div class="chat-interface">
                <div class="brand-header">
                    <img src="${config.branding.logo}" alt="${config.branding.name}">
                    <span>${config.branding.name}</span>
                    <button class="close-button">×</button>
                </div>
                <div class="chat-messages"></div>
                <div class="chat-input">
                    <textarea placeholder="Type your message here..." rows="1"></textarea>
                    <button type="submit">Send</button>
                </div>
                <div class="chat-footer">
                    <a href="${config.branding.poweredBy.link}" target="_blank">${config.branding.poweredBy.text}</a>
                </div>
            </div>
        `;
        
        chatContainer.innerHTML = newConversationHTML + chatInterfaceHTML;
        
        const toggleButton = document.createElement('button');
        toggleButton.className = 'chat-toggle';
        if (config.style.position === 'left') {
            toggleButton.classList.add('position-left');
            toggleButton.style.left = '20px';
            toggleButton.style.right = 'auto';
        } else {
            toggleButton.classList.add('position-right');
            toggleButton.style.right = '20px';
            toggleButton.style.left = 'auto';
        }
        toggleButton.innerHTML = `
            <img src="${config.branding.logo}" alt="${config.branding.name}">
            <div class="live-indicator"></div>`;
        
        widgetContainer.appendChild(chatContainer);
        widgetContainer.appendChild(toggleButton);
        document.body.appendChild(widgetContainer);
        
        const newChatBtn = chatContainer.querySelector('.new-chat-btn');
        const chatInterface = chatContainer.querySelector('.chat-interface');
        const messagesContainer = chatContainer.querySelector('.chat-messages');
        const textarea = chatContainer.querySelector('textarea');
        const sendButton = chatContainer.querySelector('button[type="submit"]');
        
        function generateUUID() {
            return crypto.randomUUID();
        }
        
        async function startNewConversation() {
            currentSessionId = generateUUID();
            const data = [{
                action: "loadPreviousSession",
                sessionId: currentSessionId,
                route: config.webhook.route,
                metadata: {
                    userId: ""
                }
            }];
            
            try {
                const response = await fetch(config.webhook.url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                const responseData = await response.json();
                
                chatContainer.querySelector('.brand-header').style.display = 'none';
                chatContainer.querySelector('.new-conversation').style.display = 'none';
                chatInterface.classList.add('active');
                
                const botMessageDiv = document.createElement('div');
                botMessageDiv.className = 'chat-message bot';
                botMessageDiv.textContent = Array.isArray(responseData) ? responseData[0].output : responseData.output;
                messagesContainer.appendChild(botMessageDiv);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            } catch (error) {
                console.error('Error:', error);
            }
        }
        
        async function sendMessage(message) {
            const messageData = {
                action: "sendMessage",
                sessionId: currentSessionId,
                route: config.webhook.route,
                chatInput: message,
                metadata: {
                    userId: ""
                }
            };
            
            const userMessageDiv = document.createElement('div');
            userMessageDiv.className = 'chat-message user';
            userMessageDiv.textContent = message;
            messagesContainer.appendChild(userMessageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            try {
                const response = await fetch(config.webhook.url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(messageData)
                });
                
                const data = await response.json();
                
                const botMessageDiv = document.createElement('div');
                botMessageDiv.className = 'chat-message bot';
                botMessageDiv.textContent = Array.isArray(data) ? data[0].output : data.output;
                messagesContainer.appendChild(botMessageDiv);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            } catch (error) {
                console.error('Error:', error);
            }
        }
        
        newChatBtn.addEventListener('click', startNewConversation);
        
        sendButton.addEventListener('click', () => {
            const message = textarea.value.trim();
            if (message) {
                sendMessage(message);
                textarea.value = '';
            }
        });
        
        textarea.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const message = textarea.value.trim();
                if (message) {
                    sendMessage(message);
                    textarea.value = '';
                }
            }
        });
        
        toggleButton.addEventListener('click', () => {
            chatContainer.classList.toggle('open');
            toggleButton.style.display = 'none';
        });
        
        // Add close button handlers
        const closeButtons = chatContainer.querySelectorAll('.close-button');
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                chatContainer.classList.remove('open');
                toggleButton.style.display = 'flex';
            });
        });
    }
    
    //======================================================================
    // INITIALIZE WIDGET ON PAGE LOAD
    //======================================================================
    
    // Initialize both widgets when the DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        
        // Initialize Text Chat Widget
        initializeTextChatWidget();
    
    });
    
})();