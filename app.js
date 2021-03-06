const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
// selected image 
let sliders = [];

// enter key event
document.getElementById('search').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        document.getElementById('search-btn').click();
    }
})
searchBtn.addEventListener('click', function () {
    document.querySelector('.main').style.display = 'none';
    clearInterval(timer);
    const search = document.getElementById('search');
    sniperLoading()
    getImages(search.value)
    sliders.length = 0;
})
// If this key 
const KEY = '20268189-d9306f1db7d93ef8803a60d45';
const getImages = (query) => {
    setTimeout(() => {
        fetch(`https://pixabay.com/api/?key=${KEY}&q=${query}&image_type=photo&pretty=true`)
            .then(response => response.json())
            .then(data => showImages(data.hits))
            .catch(error => displayError('Result in not found..Try another'))
    }, 500);
    
}

// show images 
const showImages = (images) => {
    imagesArea.style.display = 'block';
    gallery.innerHTML = '';
    // show gallery title
    galleryHeader.style.display = 'flex';
    images.forEach(image => {
        let div = document.createElement('div');
        div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
        div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick="selectItem(event,'${image.webformatURL}')" src="${image.webformatURL}" alt="${image.tags}">`;
        gallery.appendChild(div)

    })
    sniperLoading()
}

// slider area
sliderBtn.addEventListener('click', function () {
    if (parseInt(document.getElementById('duration').value) <= 0) {
        alert('Hay...It is not valid time.')
    }
    else{
        createSlider()
    }
    
})
let slideIndex = 0;
const selectItem = (event, img) => {
    let element = event.target;
    element.classList.toggle('added');
    let item = sliders.indexOf(img);
    if (item === -1) {
        sliders.push(img);
    }
    else {
        const newArray = sliders.filter(val => val !== sliders[item]);
        sliders = newArray;
    }

}
var timer
const createSlider = () => {
    // check slider image length
    if (sliders.length < 2) {
        alert('Select at least 2 image.')
        return;
    }
    // crate slider previous next area
    sliderContainer.innerHTML = '';
    const prevNext = document.createElement('div');
    prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
    prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

    sliderContainer.appendChild(prevNext)
    document.querySelector('.main').style.display = 'block';
    // hide image aria
    imagesArea.style.display = 'none';
    const duration = document.getElementById('duration').value || 1000;
    sliders.forEach(slide => {
        let item = document.createElement('div')
        item.className = "slider-item";
        item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
        sliderContainer.appendChild(item)
    })

    changeSlide(0)
    timer = setInterval(function () {
        slideIndex++;
        changeSlide(slideIndex);
    }, duration);

}

// change slider index 
const changeItem = index => {
    changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

    const items = document.querySelectorAll('.slider-item');
    if (index < 0) {
        slideIndex = items.length - 1
        index = slideIndex;
    };

    if (index >= items.length) {
        index = 0;
        slideIndex = 0;
    }

    items.forEach(item => {
        item.style.display = "none"
    })

    items[index].style.display = "block"
}

// sniper 
const sniperLoading = () => {
    const sniper = document.getElementById('sniper-loading');
    sniper.classList.toggle('d-none');
    document.querySelector('.gallery').classList.toggle('d-none');
}

// error case 
const displayError = error => {
    const errorTag = document.getElementById('error-msg');
    errorTag.innerText = error;
}