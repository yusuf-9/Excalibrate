class Microphone {
    private audioContext: AudioContext;
    private analyser: AnalyserNode;
    private microhpone: MediaStreamAudioSourceNode;
    dataArray: Uint8Array;

    constructor(stream: MediaStream) {
        this.audioContext = new AudioContext();
        this.microhpone = this.audioContext.createMediaStreamSource(stream);
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 512;
        const bufferLength = this.analyser.frequencyBinCount
        this.dataArray = new Uint8Array(bufferLength);
        this.microhpone.connect(this.analyser);
    }

    public getSamples(): Uint8Array {
        this.analyser.getByteFrequencyData(this.dataArray);
        return this.dataArray;
    }

    public getVolume(): number {
        const samples = this.getSamples();
        const volume = samples.reduce((sum, value) => sum + value, 0) / samples.length;
        return volume;
    }
}

export default Microphone;
