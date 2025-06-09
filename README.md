# Your Biggest Fan (v0.1.29)

Your personal over-the-top stan to convince ANYONE that you deserve more than you do.

This application provides a customizable chatbot experience, acting as your ultimate hype-man. It also exposes a Chat Widget SDK for easy integration into any web application. Simply index your resume content, and the chatbot will leverage it to sing your praises, perfect for job applications or self-promotion.

## Todos

- [x] Local MVP Demo works!
- [ ] Make it installable as an npm package

## Usage


### Using the Chat Widget SDK
*Experimental -- Not working yet...*

To embed the Your Biggest Fan chatbot into your own web application, follow these steps:

1.  **Install the YBF Chat Widget SDK:**
    ```bash
    pnpm install @aandyw/ybf
    ```

2.  **Environment Variables:**
    Copy over `.env.sample` to `.env` and fill in any necessary environment variables.
    *  OpenAI is used as the embedding model and Gemini 2.5 Flash is the chat model.

3.  **Integrate the Widget:**
    You can now import and initialize the `ChatWidgetSDK` in your JavaScript/TypeScript application.
    ```typescript
    import ChatWidgetSDK from 'ybf';

    useEffect(() => {
      const ybfChat = new ChatWidgetSDK({
        subjectName: "George P. Thompson", // The name of the person the chatbot is hyping up
        // Optional configurations:
        height: "520px",
        width: "380px",
        position: "bottom-right", // or "bottom-left", "top-right", "top-left"
        openByDefault: false,
        initialMessages: ["Yo, I'm here to glaze."],
        numHistoryMessages: 3,
        systemPrompt: "You are a helpful assistant that provides information.",
      });

      ybfChat.init();
    }, []);

    // To remove the widget later:
    // ybfChat.destroy();
    ```

4.  **Index Your Resume Content (Crucial for Chatbot Context):**
    The chatbot requires your resume content to function effectively.
    *   Place your resume content (e.g., PDF, Text, etc.) in `data/` (under your project root).
    *   Run:
        ```bash
        pnpm run generate
        ```
        This command processes your resume content and prepares it for the chatbot to use as context.

### Development

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/aandyw/YBF.git
    cd YBF
    ```

2.  **Install dependencies:**
    Install [pnpm](https://pnpm.io/installation) if it's not already installed.
    
    Then, install the project dependencies:
    ```bash
    pnpm install
    ```

3.  **Environment Variables:**
    Copy over `.env.sample` to `.env` and fill in any necessary environment variables.

4.  **Index Your Resume Content**

5.  **Run the application:**
    ```bash
    pnpm run dev
    ```

    The application will be accessible at `http://localhost:3000`.

### Build
To build the `dist/` package:

```bash
pnpm run build
```

Then, to publish:

```bash
pnpm run publish
```

### Validation

```bash
# Format
npx prettier src/ --write

# Lint Check
npx eslint src/
```

## Contributing

Why would you contribute? Please don't contribute 😭.  
Your time is probably better spent watching paint dry or [alternatively](https://www.youtube.com/watch?v=dQw4w9WgXcQ).
