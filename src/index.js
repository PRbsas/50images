document.addEventListener('DOMContentLoaded',() => {
  getImages(collectionId)
  renderPageNumbers()
  setActivePage()
})

const UnsplashApi = {
  base_url: 'https://api.unsplash.com/collections',
  access_key: '27bc3a36c8d23946a78ece5e1b1a94ef0d93ca80b1373cf018ae12ca59dc04d6',
  collection_ids: [
    '2254180',
    '162213',
    '162468',
    '1538121',
    '1538150'
  ]
}

const imageGrid = document.getElementById('image-grid')
let pageNumbers = document.getElementById('page-numbers')
let modal = document.getElementById('modal')
let collectionId = UnsplashApi.collection_ids[0]
let currentCollection = document.getElementsByClassName('active').innerText
let imageCollection = []
let activeNumber


async function getImages (collectionId) {
  let response = await  fetch(`${UnsplashApi.base_url}/${collectionId}/photos/?client_id=${UnsplashApi.access_key}`)

  if (response.status === 200) {
    let images = await response.json()
    renderImages(images)
  }
}

// Create new Image instances and render them
const renderImages = (images) => {
  images.forEach((image) => {
    let newImage = new Image(image)
    imageGrid.innerHTML += newImage.formatGrid()
  })
}

class Image {
  constructor (image) {
    this.id = image.id
    this.description = image.description || 'This image has no description available, sorry!'
    this.regularUrl = image.urls.regular
    this.smallUrl = image.urls.small
    imageCollection.push(this)
  }

  formatGrid () {
    return `<div class="item-container"><img src="${this.smallUrl}" alt="${this.description}" id=${this.id} class="item"></div>`
  }

  formatModal () {
    return `<img src="${this.regularUrl}" alt="${this.description}" id=${this.id} class="item">`
  }
}

// Render pagination numbers iterating on Unsplash collections array
const renderPageNumbers = () => UnsplashApi.collection_ids.forEach((collection, index) => {
  if (currentCollection === index + 1) {
    pageNumbers.innerHTML += `<a href="#${collection}" class="active">${index + 1}</a>`
  } else {
    pageNumbers.innerHTML += `<a href="#${collection}">${index + 1}</a>`
  }
})

// Initialize first page as active
const setActivePage = () => pageNumbers.children[0].classList.add('active')

const pageHandler = (event) => {
  imageCollection = []
  activeNumber = pageNumbers.children[currentCollection] || pageNumbers.children[0]
  activeNumber.classList.remove('active')

  currentCollection = parseInt(event.target.innerText - 1)
  collectionId = UnsplashApi.collection_ids[currentCollection]

  activeNumber = pageNumbers.children[currentCollection]
  activeNumber.classList.add('active')

  imageGrid.innerHTML = ''
  getImages(collectionId)
}

const modalHandler = (event) => {
  let imageId = event.target.id
  let currentImage = imageCollection.find(image => imageId === image.id)
  modal.firstElementChild.innerHTML += currentImage.formatModal()
  modal.style.display = 'block'
}

// Close modal when clicking outside of the modal box
window.onclick = (event) => {
  if (event.target === modal) {
    modal.style.display = 'none'
    modal.firstElementChild.innerHTML = ''
  }
}

pageNumbers.addEventListener('click', pageHandler)
imageGrid.addEventListener('click', modalHandler)