export default {
  recognition: null,
  speechSynthesisMSG: null,
  recognitionStarted: false,
  init() {
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    this.recognition = new window.SpeechRecognition();
    this.recognition.interimResults = true;

    this.speechSynthesisMSG = new SpeechSynthesisUtterance();

    const test = document.querySelector('.test');
    this.recognition.addEventListener('result', (event) => {
      const transcript = [...event.results].map((result) => result[0].transcript).join('');
      test.value = transcript;
      this.recognitionStarted = false;
    });
    this.recognition.addEventListener('start', () => {
      this.recognitionStarted = true;
    });
  },
  startRecognition() {
    if (!this.recognitionStarted) this.recognition.start();
  },
  speech(text) {
    this.speechSynthesisMSG.text = text;
    speechSynthesis.speak(this.speechSynthesisMSG);
  },
};
