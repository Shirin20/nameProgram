/**
 * The my-hello web component module.
 *
 * @author // Shirin Meirkhan <sm223qi@student.lnu.se>
 * @version 1.1.0
 */
const nameGender = 'https://api.genderize.io/?name='
const DogPic = 'https://dog.ceo/api/breeds/image/random'
const nameApis = [nameGender, DogPic]
const template = document.createElement('template')
template.innerHTML = `
   <style>
       .hide {
        display: none;
        }
       :host {
          background: #295BA2;
          width: 90%;
          height:100%;
          font-size: 1.2em;
          padding:10px;
          border:6px solid #000000;
          border-bottom:12px solid #000000;
          overflow:hidden;
          margin:50px;
          float:left;
          border-radius: 3px;         
        }
       form, h1 {
          text-align: center;
          margin: 0;
          padding: 10px;
        }
       label {
          font-size: 1.2em;
        }

       img {
          display: block;
          margin-left: auto;
          margin-right: auto;
        }

        button, input {
          background-color: #F8DA59;
          font-size: 0.9em;
          transition-duration: 0.4s;
        }
        button:hover {
          background-color: #295BA2;
          color: white;
        }
        p {
          text-align: center;
          color: #F8DA59;
        }
        button:focus, input:focus {
                outline: none;
                background-color: #295BA2;
                color:#F8DA59;
        }
        button:active {
          text-align: center;
          color: blue;
        }
   </style>

<h1>Write your name</h1>
<div>
  <form>
    <input type="text" name="name" id="name">
    <button type="submit">Go</button>
  </form>
  <p id='gender'></p>
  <p id='likePhrase'></p>
  <img id='dog' >
  <button class="hide" id="restart">check a new name</button>
</div>
 `
customElements.define('user-name',
/**
 * Represents a user-name element.
 */
  class extends HTMLElement {
    #form
    #userName
    #h1
    #genderElement
    #likePhraseElement
    #dogPicElement
    #restartButton

    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))
      this.#form = this.shadowRoot.querySelector('form')
      this.#userName = this.shadowRoot.querySelector('#name')
      this.#h1 = this.shadowRoot.querySelector('h1')
      this.#genderElement = this.shadowRoot.querySelector('#gender')
      this.#likePhraseElement = this.shadowRoot.querySelector('#likePhrase')
      this.#dogPicElement = this.shadowRoot.querySelector('#dog')
      this.#restartButton = this.shadowRoot.querySelector('#restart')
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    async connectedCallback () {
      this.#form.addEventListener('submit', (event) => {
        event.preventDefault()
        this.#writeName()
      })
      this.#restartButton.addEventListener('click', (event) => {
        event.preventDefault()
        location.reload()
      })
    }

    /**
     * Returns json array.
     *
     * @param {string} apiUrl  string.
     * @param {string} Username string.
     */
    async #fetchNameInfo (apiUrl, Username = '') {
      const response = await fetch(`${apiUrl}${Username}`, {
        method: 'GET'
      })
      const nameInfoInJson = await response.json()
      return nameInfoInJson
    }

    /**
     * The user writes his name and gets a gender of his/her name and a picture of a dog.
     */
    async #writeName () {
      const userNameGenderDogPic = await this.#getsNameGenderDogPic(nameApis)
      if (this.#userName.value === '' || this.#userName.value === null) {
        this.#h1.textContent = 'Please enter your name'
      } else if (this.#userName.value.length > 0) {
        this.#h1.textContent = `Welcome ${this.#userName.value}`
        this.#form.classList.add('hide')
        this.#restartButton.classList.remove('hide')
        this.#genderElement.textContent = `Your name is most likely a ${userNameGenderDogPic[0].gender} name`
        this.#likePhraseElement.textContent = 'And this nice dog likes your name!'
        this.#dogPicElement.setAttribute('src', userNameGenderDogPic[1].message)
      }
    }

    /**
     * Returns an array of the gender name and a dog pic..
     *
     * @param {string} nameApis  string.
     */
    async #getsNameGenderDogPic (nameApis) {
      const NameGenderDogPicArray = []
      for (let i = 0; i < nameApis.length; i++) {
        if (nameApis[i] === DogPic) {
          NameGenderDogPicArray.push(await this.#fetchNameInfo(nameApis[i]))
        } else {
          NameGenderDogPicArray.push(await this.#fetchNameInfo(nameApis[i], this.#userName.value))
        }
      }
      return NameGenderDogPicArray
    }
  }
)
