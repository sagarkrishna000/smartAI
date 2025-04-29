//Mutation Observer to watch for changes in the DOM

function createAIButton() {
    const button = document.createElement('div');
    button.innerHTML = '✨ Generate Reply';
    button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3';
    button.style.marginRight = '8px';
    button.style.cursor = 'pointer';
    button.setAttribute('role', 'button');
    button.setAttribute('data-tooltip', 'Generate Reply');
    button.style.backgroundColor = '#0b57d0'; 
    button.style.borderRadius = '25px';
    button.style.padding = '8px 16px';
    return button;
}

function getEmailContent() {
    const selectors = [
        '.a3s.aiL',
        '.h7',
        '.gmail_quote',
        '.ii.gt',
        '[role="presentation"]'
    ];
    for (const selector of selectors) {
        const content = document.querySelector(selector);
        if(content) {
            return content.innerText.trim();
        }
        return '';
    }
}

function findComposeToolbar() {
    const selectors = [
        '.btC',
        '.aDh',
        '[role="toolbar"]',
        '.gU.Up'
    ];
    for (const selector of selectors) {
        const toolbar = document.querySelector(selector);
        if(toolbar) {
            return toolbar;
        }
        return null;
    }
}

function injectButton() {
    const existingButton = document.querySelector('.generate-ai-reply-button');
    if (existingButton) existingButton.remove();

    const toolbar = findComposeToolbar();
    if(!toolbar) {
        console.log("Toolbar not found");
        return;
    }
    console.log("Generating AI Reply button");

    const button = createAIButton();
    button.classList.add('generate-ai-reply-button');

    button.addEventListener('click', async() => {
        try {
            button.innerHTML = 'Generating Response...';
            button.disabled = true;

            const emailContent = getEmailContent();
            const response = await fetch('http://localhost:8080/api/email/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    emailContent: emailContent,
                    tone: "professional"
                })
            });

            if(!response.ok) {
                throw new Error('API request failed');
            }

            const reply = await response.text();
            const replyTextArea = document.querySelector('[role="textbox"][g_editable="true"]');
            if(replyTextArea) {
                replyTextArea.focus();
                document.execCommand('insertText', false, reply);
            } else {
                console.error("Text area not found");
            }
        } catch (error) {
            console.error("Reply generation failed", error);
        } finally {
            button.innerHTML = 'Generate Reply';
            button.disabled = false;
        }
    });

    toolbar.insertBefore(button, toolbar.firstChild);
}

const observer = new MutationObserver((mutations) => {
    for(const mutation of mutations) {
        const addedNodes = Array.from(mutation.addedNodes);
        const hasComposeElements = addedNodes.some(node => 
            node.nodeType === Node.ELEMENT_NODE &&
            (node.matches('.aDh, .btC, [role="dialog"]') || node.querySelector('.aDh, .btC, [role="dialog"]')) 
        );
        if (hasComposeElements) {
            console.log("Compose elements detected");
            setTimeout(injectButton, 500);
        }   
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});
