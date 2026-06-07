class AudioCustomElement extends HTMLElement {
  #PLAY_TEXT = 'Play';
  #PAUSE_TEXT = 'Pause';
  declare audioEl: HTMLAudioElement | null;
  declare playBtn: HTMLButtonElement | null;
  declare progressBar: HTMLInputElement | null;

  constructor() {
    super();
    this.audioEl = null;
  }

  connectedCallback() {
    this.audioEl = this.querySelector('audio');
    if(!this.audioEl) {
      console.warn('AudioCustomElement: Mising child <audio> element.')
      return;
    }

    this.audioEl.addEventListener('loadedmetadata', () => {
      if(!this.progressBar || !this.audioEl) return;
      this.progressBar.max = Math.ceil(this.audioEl.duration).toString();
    })

    this.audioEl.addEventListener('play', () => {
      if(!this.playBtn) return;
      this.playBtn.innerText = this.#PAUSE_TEXT;
    })

    this.audioEl.addEventListener('pause', () => {
      if(!this.playBtn) return;
      this.playBtn.innerText = this.#PLAY_TEXT;
    })

    this.audioEl.addEventListener('timeupdate', () => {
      if(!this.audioEl?.duration || !this.progressBar) return;
      this.progressBar.value = this.audioEl.currentTime.toString();
    })

    const customControls = document.createElement('div');
    
    this.playBtn = document.createElement('button');
    this.playBtn.innerText = this.#PLAY_TEXT
    this.playBtn.addEventListener('click', () => {
      if(this.audioEl?.paused) {
        this.audioEl.play();
        
      } else {
        this.audioEl?.pause();
      }
    })

    
    this.progressBar = document.createElement('input');
    this.progressBar.type = 'range'
    this.progressBar.min = '0'
    this.progressBar.max = Math.ceil(this.audioEl.duration).toString();
    this.progressBar.value = '0'
    this.progressBar.addEventListener('change', (event: Event) => {
      if(!(event.target instanceof HTMLInputElement) || !this.audioEl) return;
      this.audioEl.currentTime = Number(event.target.value);
    })

    customControls.appendChild(this.playBtn)
    customControls.appendChild(this.progressBar)
    this.appendChild(customControls)
  }
}

customElements.define('audio-custom-element', AudioCustomElement)