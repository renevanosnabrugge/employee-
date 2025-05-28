document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const questionTextElement = document.getElementById('question-text');
    const textAnswerInput = document.getElementById('text-answer');
    const submitTextAnswerButton = document.getElementById('submit-text-answer');
    const startRecordButton = document.getElementById('start-record-btn');
    const stopRecordButton = document.getElementById('stop-record-btn');
    const audioPlayback = document.getElementById('audio-playback');
    const statusTextElement = document.getElementById('status-text');

    // Application State
    let questions = [];
    let currentQuestionIndex = 0;
    let mediaRecorder;
    let audioChunks = [];

    // Initialize UI
    stopRecordButton.disabled = true;
    audioPlayback.style.display = 'none'; // Hide playback initially

    // --- Function to load questions ---
    async function loadQuestions() {
        try {
            const response = await fetch('questions.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            questions = await response.json();
            if (questions.length > 0) {
                displayQuestion();
            } else {
                statusTextElement.textContent = 'No questions loaded. Please add questions to questions.json.';
            }
        } catch (error) {
            console.error('Error loading questions:', error);
            statusTextElement.textContent = 'Error loading questions. See console for details.';
        }
    }

    // --- Function to display current question ---
    function displayQuestion() {
        if (currentQuestionIndex < questions.length) {
            questionTextElement.textContent = questions[currentQuestionIndex].text;
            // Clear previous answer and reset UI elements for the new question
            textAnswerInput.value = '';
            audioPlayback.style.display = 'none';
            audioPlayback.src = '';
            audioChunks = [];
            statusTextElement.textContent = ''; // Clear status
            startRecordButton.disabled = false;
            submitTextAnswerButton.disabled = false;
            textAnswerInput.disabled = false;
        } else {
            questionTextElement.textContent = 'All questions answered. Thank you!';
            // Disable inputs as there are no more questions
            textAnswerInput.disabled = true;
            submitTextAnswerButton.disabled = true;
            startRecordButton.disabled = true;
            stopRecordButton.disabled = true;
        }
    }
    
    // --- Placeholder for saving data (will be implemented later) ---
    function saveToFile(data, filename) {
        // This is a placeholder. In a real browser environment,
        // direct file saving like this is not possible for security reasons.
        // We'd typically send it to a server.
        // For this project, we'll simulate by logging or preparing a download link.
        console.log(`Attempting to save ${filename}:`, data);
        statusTextElement.textContent = `${filename} prepared for download (simulated save).`;

        // Create a downloadable link
        const blob = data instanceof Blob ? data : new Blob([JSON.stringify(data, null, 2)], {type : 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Load questions when the DOM is fully loaded
    loadQuestions();

    // --- Function to proceed to the next question ---
    function nextQuestion() {
        currentQuestionIndex++;
        displayQuestion();
    }

    // --- Event Listener for Submitting Text Answer ---
    submitTextAnswerButton.addEventListener('click', () => {
        const textAnswer = textAnswerInput.value.trim();
        if (!textAnswer) {
            statusTextElement.textContent = 'Please enter an answer.';
            return;
        }

        if (currentQuestionIndex < questions.length) {
            const questionId = questions[currentQuestionIndex].id;
            const filename = `answer_q${questionId}_${Date.now()}.txt`;
            saveToFile(textAnswer, filename); // Simulate saving the text answer
            
            statusTextElement.textContent = `Text answer for question ${questionId} saved.`;
            nextQuestion();
        }
    });

    // --- Event Listener for Starting Audio Recording ---
    startRecordButton.addEventListener('click', async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder = new MediaRecorder(stream);

                mediaRecorder.ondataavailable = (event) => {
                    audioChunks.push(event.data);
                };

                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                    const audioUrl = URL.createObjectURL(audioBlob);
                    audioPlayback.src = audioUrl;
                    audioPlayback.style.display = 'block'; // Show playback controls
                    statusTextElement.textContent = 'Recording stopped. Review or record again. Click "Stop Recording" again to save if satisfied, or "Start Recording" to redo.';
                    
                    // For this version, stopping means ready to save.
                    // A more complex UI might have a separate "Save Audio" button.
                    if (currentQuestionIndex < questions.length) {
                        const questionId = questions[currentQuestionIndex].id;
                        const filename = `audio_q${questionId}_${Date.now()}.webm`;
                        saveToFile(audioBlob, filename); // Simulate saving the audio
                        statusTextElement.textContent = `Audio for question ${questionId} saved.`;
                        nextQuestion();
                    }
                };

                audioChunks = []; // Clear previous chunks
                mediaRecorder.start();
                statusTextElement.textContent = 'Recording...';
                startRecordButton.disabled = true;
                stopRecordButton.disabled = false;
                submitTextAnswerButton.disabled = true; // Disable text submission while recording
                textAnswerInput.disabled = true; // Disable text input while recording

            } catch (err) {
                console.error('Error accessing microphone:', err);
                statusTextElement.textContent = 'Error accessing microphone. Please ensure permission is granted.';
            }
        } else {
            statusTextElement.textContent = 'Audio recording not supported in this browser.';
        }
    });

    // --- Event Listener for Stopping Audio Recording ---
    stopRecordButton.addEventListener('click', () => {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
            // The onstop event handler will take care of saving and moving to the next question.
            startRecordButton.disabled = false;
            stopRecordButton.disabled = true;
            submitTextAnswerButton.disabled = false; // Re-enable text submission
            textAnswerInput.disabled = false; // Re-enable text input
        }
    });
});
