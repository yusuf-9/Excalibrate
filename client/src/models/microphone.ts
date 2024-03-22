class Microphone {
    private audioContext: AudioContext;
    private analyserNode: AnalyserNode;
    private scriptNode: ScriptProcessorNode;
    private stream: MediaStream;
    private handleMicrophoneInput: (event: AudioProcessingEvent) => void;
  
    constructor(stream: MediaStream, handleMicrophoneInput: (event: AudioProcessingEvent) => void) {
      this.audioContext = new AudioContext();
      this.analyserNode = this.audioContext.createAnalyser();
      this.scriptNode = this.audioContext.createScriptProcessor(16384, 1, 1);
      this.stream = stream;
      this.handleMicrophoneInput = handleMicrophoneInput;
  
      this.setup();
    }
  
    private setup(): void {
      const microphone = this.audioContext.createMediaStreamSource(this.stream);
      microphone.connect(this.analyserNode);
      this.analyserNode.connect(this.scriptNode);
      this.scriptNode.connect(this.audioContext.destination);
      this.scriptNode.onaudioprocess = this.handleMicrophoneInput;
    }
  
    public close(): void {
      this.audioContext.close();
    }
  }
  
  export default Microphone;
  