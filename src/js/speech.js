export default {
  recognition: null,
  speechSynthesisMSG: null,
  recognitionStarted: false,
  init() {
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    this.recognition = new window.SpeechRecognition();
    this.recognition.interimResults = true;

    this.speechSynthesisMSG = new SpeechSynthesisUtterance();

    this.recognition.addEventListener('start', () => {
      this.recognitionStarted = true;
    });

    const searchField = document.querySelector('.form__search-field');
    const mic = document.querySelector('.form__mic');
    this.recognition.addEventListener('result', (event) => {
      const transcript = [...event.results].map((result) => result[0].transcript).join('');
      searchField.value = transcript;
    });
    this.recognition.addEventListener('end', () => {
      this.recognitionStarted = false;
      mic.classList.remove('form__mic--active');
    });
  },
  startRecognition() {
    if (this.recognitionStarted) return;

    this.recognition.start();
  },
  speech(text) {
    this.speechSynthesisMSG.text = text;
    speechSynthesis.speak(this.speechSynthesisMSG);
  },
};
