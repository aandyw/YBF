# Your Biggest Fan

Your personal over-the-top stan to convince ANYONE that you deserve more than you do.

## Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/aandyw/YBF.git
    cd YBF
    ```

2.  **Install dependencies:**
    This project uses pnpm. If you don't have pnpm installed, you can install it globally:
    ```bash
    npm install -g pnpm
    ```
    Then, install the project dependencies:
    ```bash
    pnpm install
    ```

3.  **Environment Variables:**
    Create a `.env.local` file in the root of the project and add your OpenAI API key:
    ```
    OPENAI_API_KEY=your_openai_api_key_here
    ```

4.  **Index Your Resume Content:**
    To allow the chatbot to use your resume content, you need to index it. Place your resume content (e.g., as a text file) in a designated directory (you might need to adjust the `generate` script to point to your resume file). Then run:
    ```bash
    pnpm run generate
    ```
    This command processes your resume content and prepares it for the chatbot to use as context.

5.  **Run the application:**
    ```bash
    pnpm run dev
    ```

    The application will be accessible at `http://localhost:3000`.

## Features

*   **Chatbot:** A personal "fan" chatbot that can hype up a subject based on provided content.
*   **Customizable:** Configure subject name, initial messages, and more.
*   **Dark Mode:** (If applicable - based on previous conversation, but removed now, so this line might be removed) The application supports a consistent light/dark theme.

## Contributing

This is just a toy project. Please don't contribute 😭.
Your time is probably better spent watching paint dry or [alternatively](https://www.youtube.com/watch?v=dQw4w9WgXcQ).
