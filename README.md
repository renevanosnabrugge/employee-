# Simple Chat Interface Web App

This is a simple web application that presents a series of questions to the user and allows them to respond via text input or audio recording.

## Features

- Loads questions sequentially from a `questions.json` file.
- Users can type text answers.
- Users can record audio answers using their microphone.
- Answers (both text and audio) are "saved" by initiating a browser download for the respective files.

## How to Run

1.  **Clone or Download:** Ensure all project files (`index.html`, `style.css`, `script.js`, `questions.json`) are in the same directory on your local machine.
2.  **Open the Application:** Open the `index.html` file in a modern web browser (e.g., Google Chrome, Mozilla Firefox).
3.  **Microphone Permission:** If you intend to use the audio recording feature, your browser will prompt you for microphone access. You need to grant this permission for audio recording to work.

## File Structure

-   `index.html`: The main HTML file for the chat interface.
-   `style.css`: Contains the CSS styles for the application.
-   `script.js`: Contains the JavaScript logic for application functionality (loading questions, handling input, recording audio).
-   `questions.json`: A JSON file containing the questions to be asked. You can edit this file to change or add questions. Each question should have an `id` (unique number) and `text` (the question itself).
-   `uploads/`: This directory was initially planned for storing output files directly on the server-side. However, in this client-side version, files are not saved into this directory automatically. Instead, text and audio answers will be initiated as downloads directly in your browser. You can then save them to any location you choose, including this `uploads/` directory if you wish.

## Notes

-   **File Saving:** Due to browser security restrictions, web applications running purely on the client-side (like this one, opened directly from a file) cannot directly save files to your computer's file system without user interaction. This application simulates saving by triggering a download for each answer. You will be prompted to choose a location to save each text or audio file.
-   **Browser Compatibility:** Developed and tested on modern browsers. Features like `MediaRecorder` (for audio) are generally well-supported, but older browsers might have issues.
