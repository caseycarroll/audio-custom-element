import './audio-custom-element.css'
/**
 * TODO:
 * - Play and pause icon
 *  - handrawn look
 *  - aria label for play pause, hide icon to a11y tree
 *  - sr only requires consumer to provide those styles, or move to shadow dom
 * - external styles
 *  - border 
 *  - color 
 *  - 
 */

class AudioCustomElement extends HTMLElement {
  #PLAY_TEXT = 'Play';
  #PAUSE_TEXT = 'Pause';
  #PLAY_SVG = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
      <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l10.86-6.86a1 1 0 0 0 0-1.72L9.5 4.28a1 1 0 0 0-1.5.86z"/>
    </svg>`
  #PAUSE_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
  </svg>`
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
    this.audioEl.style.display = 'none'

    this.audioEl.addEventListener('loadedmetadata', () => {
      if(!this.progressBar || !this.audioEl) return;
      this.progressBar.max = Math.ceil(this.audioEl.duration).toString();
    })

    this.audioEl.addEventListener('play', () => {
      if(!this.playBtn) return;
      this.playBtn.ariaLabel = this.#PAUSE_TEXT;
      this.playBtn.innerHTML = this.#PAUSE_SVG;
    })

    this.audioEl.addEventListener('pause', () => {
      if(!this.playBtn) return;
      this.playBtn.ariaLabel = this.#PLAY_TEXT;
      this.playBtn.innerHTML = this.#PLAY_SVG;
    })

    this.audioEl.addEventListener('timeupdate', () => {
      if(!this.audioEl?.duration || !this.progressBar) return;
      this.progressBar.value = this.audioEl.currentTime.toString();
    })
    
    this.playBtn = document.createElement('button');
    this.playBtn.ariaLabel = this.#PLAY_TEXT
    this.playBtn.innerHTML = this.#PLAY_SVG;
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
    this.progressBar.step = 'any'
    this.progressBar.addEventListener('change', (event: Event) => {
      if(!(event.target instanceof HTMLInputElement) || !this.audioEl) return;
      this.audioEl.currentTime = Number(event.target.value);
    })

    this.appendChild(this.playBtn)
    this.appendChild(this.progressBar)
  }
}

customElements.define('audio-custom-element', AudioCustomElement)

