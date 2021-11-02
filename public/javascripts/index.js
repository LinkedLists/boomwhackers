import Game from './game';
import { modalHandler } from './modal';

document.addEventListener('DOMContentLoaded', () => {
  let startBtn = document.getElementById('start-btn')
  let selectBtn = document.getElementById('selection-back-btn')
  let audio = document.getElementById('audio')
  audio.volume = 0.6
  let currentPreviewIndex = 0

  // carousel wheel elements
  let wheelNext = document.getElementById('selection-next-btn')
  let wheelPrev = document.getElementById('selection-prev-btn')
  let carouselWheel = document.getElementsByClassName('selection-circle')[0]
  let selectCircle = document.getElementsByClassName('song-selection-container-closed')[0]
  let preview = document.getElementsByClassName('preview-carousel-container')[0]
  let previewCarousel = document.getElementsByClassName('preview-carousel')[0]
  let previewCarouselItems = document.querySelectorAll('.preview-img-container');
  let previewCarouselImg = document.querySelectorAll('.preview-shadow');
  let songCarouselWheelItems = document.querySelectorAll('.song-carousel-item')
      // make first item selectable
      songCarouselWheelItems[0].classList.add("selectable")
      let carouselWheelLength = songCarouselWheelItems.length
  let carouselPositionsSet = false
  let wheelIndex = 0
  let thetaDeg = (360 / carouselWheelLength)

  let linksNav = document.getElementsByClassName('links-container-nav')[0]
  let mainMenu = document.getElementsByClassName('main-menu-container')[0]
  let mainMenuL = document.getElementsByClassName('main-menu-l-container')[0]
  let mainMenuR = document.getElementsByClassName('main-menu-r-container')[0]
  let homePage = document.getElementsByClassName('homepage-container')[0]
  let gameView = document.getElementsByClassName('game-view')[0]
  let selectMenuVolume = document.getElementById('select-menu-volume')

  selectMenuVolume.defaultValue = 70
  let currentVolume = selectMenuVolume.value / 100
  selectMenuVolume.addEventListener('change', (e) => {
    audio.volume = e.target.value / 100
    currentVolume = audio.volume
  })

  // open wheel
  startBtn.addEventListener('click', () => {
    selectCircle.classList.add('song-selection-container-open')
    selectCircle.classList.remove('song-selection-container-closed')
    selectCircle.classList.remove('hidden')
    
    carouselWheel.classList.remove('circleClose')
    carouselWheel.classList.add('circleOpen')

    preview.classList.remove('carouselClosed')
    preview.classList.add('carouselOpen')

    linksNav.classList.remove('navOut')
    linksNav.classList.add('navIn')

    cartWheelIn()
    audioPreviewLoop()


    mainMenuL.classList.remove('Lopen')
    mainMenuR.classList.remove('Ropen')
    mainMenuL.classList.add('Lclose')
    mainMenuR.classList.add('Rclose')
    
    setTimeout(() => {
      mainMenu.classList.add('hidden')
      mainMenuL.classList.remove('Lclose')
      mainMenuR.classList.remove('Rclose')
    }, 600)

    if (!carouselPositionsSet) {
      setCarouselPositions()
      carouselPositionsSet = true
    }
  })

  //close wheel
  selectBtn.addEventListener('click', () => {
    selectCircle.classList.remove('song-selection-container-open')
    selectCircle.classList.add('song-selection-container-closed')

    carouselWheel.classList.remove('circleOpen')
    carouselWheel.classList.add('circleClose')
    
    linksNav.classList.remove('navIn')
    linksNav.classList.add('navOut')

    mainMenu.classList.remove('hidden')

    mainMenuL.classList.add('Lopen')
    mainMenuR.classList.add('Ropen')

    preview.classList.remove('carouselOpen')
    preview.classList.add('carouselClosed')

    cartWheelOut()
    clearInterval(loop)
    volumeDown()
    setTimeout( () => {
      audio.pause()
      clearInterval(loop)
      clearTimeout(previewTimeout)
      clearInterval(intervalDown)
      clearInterval(intervalUp)
    }, 80)

    setTimeout(() => {
      selectCircle.classList.add('hidden')
    }, 450)

    setTimeout(() => {
      
      mainMenuL.classList.remove('Lopen')
      mainMenuR.classList.remove('Ropen')
    }, 1500)
  })

  function cartWheelIn() {
    let transformVal = previewCarousel.style.transform
    if (transformVal.length === 0) {
      previewCarousel.style.transform = `rotateX(60deg)`
      setTimeout( () => {
        previewCarousel.style.transform = `rotateX(0deg)`
      }, 300)
    } else {
      transformVal = parseFloat(transformVal.substring(
        transformVal.lastIndexOf("(") + 1, 
        transformVal.lastIndexOf("d")
      ))
      previewCarousel.style.transform = `rotateX(${transformVal + 60}deg)`
      setTimeout( () => {
        previewCarousel.style.transform = `rotateX(${transformVal}deg)`
      }, 300)
    }
  }

  function cartWheelOut() {
    let transformVal = previewCarousel.style.transform
    if (transformVal.length === 0) {
      previewCarousel.style.transform = `rotateX(0deg)`
      setTimeout( () => {
        previewCarousel.style.transform = `rotateX(60deg)`
      }, 300)
    } else {
      transformVal = parseFloat(transformVal.substring(
        transformVal.lastIndexOf("(") + 1, 
        transformVal.lastIndexOf("d")
      ))
      previewCarousel.style.transform = `rotateX(${transformVal + 180}deg)`
      setTimeout( () => {
        previewCarousel.style.transform = `rotateX(${transformVal}deg)`
      }, 300)
    }
  }

  let degrees = []

  function setCarouselPositions() {
    carouselWheel.style.height = getComputedStyle(carouselWheel).width
    
    let radius = parseFloat(getComputedStyle(carouselWheel).width)

    let centerx = parseFloat(getComputedStyle(songCarouselWheelItems[0]).left) 
    let centery = parseFloat(getComputedStyle(songCarouselWheelItems[0]).top) 

    let thetaRad = (Math.PI / 180.0) * (360 / carouselWheelLength)
  
    songCarouselWheelItems.forEach( (songItem, i) => {

      degrees.push(-1.0 * i * 360 / carouselWheelLength)

      songItem.style.left = `${centerx + (radius) * Math.cos(thetaRad * (i))}px`
      songItem.style.top = `${centery - (radius) * Math.sin(thetaRad * (i))}px`
      if (i !== 0) {
        songItem.style.transform = `rotate(${-1.0 * i * 360 / carouselWheelLength}deg) perspective(200px) rotateY(28deg) translate(-50%, -50%)`
      } else {
        songItem.style.transform = `rotate(0deg)  translate(-50%, -50%)`
        songItem.style.opacity = `1`
        previewCarouselItems[0].style.opacity = '0.92'
        previewCarouselItems[0].style.cursor = 'pointer'
        previewCarouselImg[0].classList.add("selectable-preview")
      }
    })
  }

  let selectWheel = document.getElementsByClassName("selection-circle-ul")[0]

  wheelNext.addEventListener('click', () => {
    removeSelectable()
    wheelIndex -= 1
    selectable()
    selectWheel.style.transform = `rotate(${-1.0 * thetaDeg * wheelIndex}deg)`
    previewCarousel.style.transform = `rotateX(${wheelIndex/6 * 360}deg)`
  })


  wheelPrev.addEventListener('click', () => {
    removeSelectable()
    wheelIndex += 1
    selectable()
    selectWheel.style.transform = `rotate(${-1.0 * thetaDeg * wheelIndex}deg)`

    previewCarousel.style.transform = `rotateX(${wheelIndex/6 * 360}deg)`
  })

  let audioUrls = [
    "https://fsp-seed.s3-us-west-1.amazonaws.com/yt1s.com+-+Marshmello+Halsey++Be+Kind+Halsey+Lyric+Video.mp3",
    "https://keytar-hero-seed.s3-us-west-1.amazonaws.com/yt1s.com+-+Neon+Genesis+Evangelion++Opening++1080p+Japanese.mp3",
    "https://keytar-hero-seed.s3-us-west-1.amazonaws.com/yt1s.com+-+JoJo+Part+5+OST++Il+vento+doro+Improved+MET+Ver.mp3",
    "https://keytar-hero-seed.s3-us-west-1.amazonaws.com/yt1s.com+-+JoJo+Part+5+OST++Il+vento+doro+Improved+MET+Ver.mp3",
    "https://keytar-hero-seed.s3-us-west-1.amazonaws.com/yt1s.com+-+Breaking+the+Law.mp3",
    "https://fsp-seed.s3-us-west-1.amazonaws.com/yt1s.com+-+The+Weeknd++Save+Your+Tears+Audio.mp3",
  ]

  let loop
  function audioPreviewLoop(index = currentPreviewIndex) {
    clearInterval(loop)
    clearTimeout(previewTimeout)
    volumeDown()
    audioPreview(index)
    loop = setInterval( () => {
      clearTimeout(previewTimeout)
      clearInterval(intervalDown)
      clearInterval(intervalUp)
      volumeDown()
      audioPreview(index)
    }, 12000)
  }

  let previewTimeout
  function audioPreview(index = currentPreviewIndex) {
    currentPreviewIndex = index
    previewTimeout = setTimeout( () => {
      audio.src = audioUrls[index]
      audio.play()
      volumeUp()
    }, 1000)
  }

  let intervalUp
  function volumeUp() {
    clearInterval(intervalDown)
    clearInterval(intervalUp)
    intervalUp = setInterval(() => {
      if (audio.volume <= (currentVolume - currentVolume/100 )) {
        if (currentVolume/100 === 0 ) {
          audio.volume = currentVolume
          clearInterval(intervalUp)
        }
        audio.volume += currentVolume/100 
      } else {
        audio.volume = currentVolume
        clearInterval(intervalUp)
      }
    }, 13)
  }

  let intervalDown
  function volumeDown() {
    clearInterval(intervalDown)
    clearInterval(intervalUp)
    intervalDown = setInterval(() => {
      if (audio.volume >= currentVolume/60 ) {
        if (currentVolume/60 === 0 ) {
          clearInterval(intervalDown)
        }
        audio.volume -= currentVolume/60 
      } else {
        audio.volume = 0
        clearInterval(intervalDown)
      }
    }, 13)
  }

  //make current wheel item clickable
  let selectableTimeout
  function selectable() {
    let index = wheelIndex % carouselWheelLength
    if (index < 0) {
      index *= -1
    }
    else if (index > 0) {
      index = 6 - index
    }
    songCarouselWheelItems[index].style.transform = `rotate(${degrees[index]}deg) perspective(0px) rotateY(0deg) translate(-50%, -50%)`
    songCarouselWheelItems[index].style.opacity = `1`
    previewCarouselItems[index].style.cursor = 'pointer'
    previewCarouselItems[index].style.opacity = '0.92'

    clearTimeout(selectableTimeout)
    selectableTimeout = setTimeout(() => {
      songCarouselWheelItems[index].classList.add("selectable")
      previewCarouselImg[index].classList.add("selectable-preview")
    }, 500)
    audioPreviewLoop(index)
  }

  //make prev item nonclickable
  function removeSelectable() {
    let index = wheelIndex % carouselWheelLength
    if (index <= 0) {
      index *= -1
    } 
    else {
      index = 6 - index
    }

    songCarouselWheelItems[index].classList.remove("selectable")
    songCarouselWheelItems[index].style.transform = `rotate(${degrees[index]}deg) perspective(200px) rotateY(28deg) translate(-50%, -50%)`
    songCarouselWheelItems[index].style.opacity = `0.4`
    previewCarouselItems[index].style.cursor = 'default'
    previewCarouselItems[index].style.opacity = '0.6'
    previewCarouselImg[index].classList.remove("selectable-preview")
    volumeDown()
  }

  //play song
  const canvas = document.getElementById('canvas');
  songCarouselWheelItems.forEach( song => { song.addEventListener('click', () => {
    if (song.classList.contains('selectable')) {
      if (song.id !== 'song5' && song.id !== 'song6') {
        homePage.classList.remove('fadeIn')
        homePage.classList.add('fadeOut')
        selectCircle.classList.remove('song-selection-container-open')
        selectCircle.classList.add('song-selection-container-closed')
        clearInterval(loop)
        volumeDown()
        new Game(canvas, song.id);
        setTimeout(() => {
          volumeUp()
          audio.pause()
          audio.currentTime = 0
          homePage.classList.add('hidden')
          homePage.classList.remove('fadeOut')
    
          gameView.classList.remove('hidden')
          gameView.classList.add('fadeIn')
        }, 666)
      }
    }
    }) 
  })

  previewCarouselImg.forEach( (preview, i) => {
    preview.addEventListener('click', () => {
      if (preview.classList.contains('selectable-preview')) {
        if (i !== 4 && i !== 5) {
          homePage.classList.remove('fadeIn')
          homePage.classList.add('fadeOut')
          selectCircle.classList.remove('song-selection-container-open')
          selectCircle.classList.add('song-selection-container-closed')
          clearInterval(loop)
          volumeDown()
          new Game(canvas, 'song' + (i + 1).toString());
          setTimeout(() => {
            volumeUp()
            audio.pause()
            audio.currentTime = 0
            homePage.classList.add('hidden')
            homePage.classList.remove('fadeOut')
          
            gameView.classList.remove('hidden')
            gameView.classList.add('fadeIn')
          }, 666)
      }
      }
    })
  })

  let mute = document.getElementById('carousel-mute');
  let unmute = document.getElementById('carousel-unmute');

  audio.addEventListener('volumechange', () => {
    if (audio.muted) {
      unmute.classList.remove("hidden")
      mute.classList.add("hidden")
    } else {
      mute.classList.remove("hidden")
      unmute.classList.add("hidden")
    }
  })

  mute.addEventListener('click', () => {
    if (!audio.muted) {
      audio.muted = true;
      mute.classList.add("hidden")
      unmute.classList.remove("hidden")
    } 
  });
  unmute.addEventListener('click', () => {
    if (audio.muted) {
      audio.muted = false;
      unmute.classList.add("hidden")
      mute.classList.remove("hidden")
    } 
  });


  let zDeg = 235 * 6 / Math.PI

  previewCarouselItems.forEach( (preview, i) => {
    preview.style.transform = `rotateX(${60 * i}deg) translateZ(${zDeg}px)`
  })


  canvas.style.backgroundSize = "100% 100%";
  modalHandler()
})
