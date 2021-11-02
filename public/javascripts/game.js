import Note from './note'
import Target from './target'
import { song1 } from './song/song1'
import { song2 } from './song/song2'
import { song3 } from './song/song3'
import { song4 } from './song/song4'

export default class Game {
  constructor(canvas, songId) {
    this.c = canvas.getContext('2d');
    this.dimensions = { width: canvas.width, height: canvas.height};
    this.score = 0;
    this.streak = 0;
    this.maxStreak = 0;
    this.audio;
    this.isPlaying = false;
    this.visibleNotes = this.generateNoteArray();
    this.missedNotes = [];
    this.allNotes = []
    this.totalNotes = 0
    this.notesHit = 0
    this.currentSong;

    this.addTargetListeners = this.addTargetListeners.bind(this)
    this.addTargetListeners()
    this.animate = this.animate.bind(this)
    this.checkCollisionDown = this.checkCollisionDown.bind(this)
    this.checkCollisionUp = this.checkCollisionUp.bind(this)
    this.scoreboard = this.scoreboard.bind(this)
    this.generateNotes = this.generateNotes.bind(this)
    this.firstGenerationNotes = this.firstGenerationNotes.bind(this)
    this.playSong = this.playSong.bind(this)
    this.noteGrabber = this.noteGrabber.bind(this)
    this.generateTargets = this.generateTargets.bind(this);
    this.targets = this.generateTargets();
    this.streakBoard = this.streakBoard.bind(this)
    this.resetStreak = this.resetStreak.bind(this)
    this.clearGame = this.clearGame.bind(this)

    this.selectSong = this.selectSong.bind(this)
    this.selectSong(songId)

    this.callGenerateNotes;
    this.counter = 0;

    // setIntervals to be stored when calculating scores
    this.score1;
    this.score2;
    this.score3;
    this.score4;
    this.score5;

    this.intervalValue = 0
    this.resumeTimeout
    this.startTimeout
    this.restartTimeout
    this.playNotes = this.playNotes.bind(this)

    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)

    this.keyLock1 = false;
    this.keyLock2 = false;
    this.keyLock3 = false;
    this.keyLock4 = false;
    this.keyLock5 = false;

    // DOM elements and their event listeners
    this.pause = document.getElementById('pause');
    this.resume = document.getElementById('resume');
    this.scoreContainer = document.getElementsByClassName('game-end-container')[0]
    this.restart;
    this.back;
    this.selectMenuVolume
    this.pauseEventListener = this.pauseEventListener.bind(this)
    this.handleMute = this.handleMute.bind(this)
    this.endListener = this.endListener.bind(this)
    this.calculateGrade = this.calculateGrade.bind(this)
    this.scoreBtnListener = this.scoreBtnListener.bind(this)
    this.homePage = document.getElementsByClassName('homepage-container')[0]
    this.gameView = document.getElementsByClassName('game-view')[0]
    this.selectCircle = document.getElementsByClassName('song-selection-container-closed')[0]

  }

  selectSong(songId) {
    if (songId === 'song1') {
      this.currentSong = song1
      this.allNotes = song1.notes.slice()
      this.totalNotes = song1.totalNotes
    }
    else if (songId === 'song2') {
      this.currentSong = song2
      this.allNotes = song2.notes.slice()
      this.totalNotes = song2.totalNotes
    }
    else if (songId === 'song3') {
      this.currentSong = song3
      this.allNotes = song3.notes.slice()
      this.totalNotes = song3.totalNotes
    }
    else if (songId === 'song4') {
      this.currentSong = song4
      this.allNotes = song4.notes.slice()
      this.totalNotes = song4.totalNotes
    }
    this.allNotes.reverse()
    this.animate();
    this.playSong();
  }

  animate() {
    this.killJitter(this.c)
    this.c.clearRect(0, 0, canvas.width, canvas.height);
    this.scoreboard();
    this.streakBoard();
    
    this.targets.forEach( target => {
      this.c.save();
      target.displayTarget()
      this.c.restore();
    })


    // this.missedNotes collects missed notes and allows for them to
    // continue falling offscreen.
    this.missedNotes.forEach( note => {
      let pos = note.y - note.extensionLength - 30
      if (pos !== this.dimensions.height) note.update(this.currentSong.dy);
    })

    // this.visibleNotes is a 2D array containing a subarray of notes for each target
    // which allows for simultaneous inputs.
    // This updates all notes and clears any notes that are
    // out of bounds
    this.visibleNotes.forEach( (subArr, i) => {
      subArr.forEach( note => {
        note.update(this.currentSong.dy);
      })

      // if the first note in each subArr is out of bounds then clear it
      if (subArr[0] !== undefined) {
        // Clear if a holding note is out of bounds
        if (subArr[0].holdValue !== 0 && subArr[0].outOfBoundsTail(this.dimensions.height)) {
          this.resetStreak();
          subArr[0].color = 'gray';
          this.missedNotes.push(subArr.shift());
          
          if(i === 0) clearInterval(this.score1)
          if(i === 1) clearInterval(this.score2)
          if(i === 2) clearInterval(this.score3)
          if(i === 3) clearInterval(this.score4)
          if(i === 4) clearInterval(this.score5)

          // If a holding note was held for too long then clear the 
          // successful hit glow indicator from the target
          this.targets[i].successfulHit = false
        }
        // Clear if a single note is out of bounds
        else if (subArr[0].holdValue === 0 && subArr[0].outOfBounds(this.dimensions.height)) {
          this.resetStreak();
          subArr[0].color = 'gray';
          subArr.shift();
        }
        // If a holding note was not hit then gray it out
        else if (
          subArr[0].holdValue !== 0 && 
          subArr[0].outOfBoundsHoldingNoteHead(this.dimensions.height) &&
          !subArr[0].holdFlag) {
            if (subArr[0].color !== 'black') subArr[0].color = 'gray';
            this.resetStreak();
            this.missedNotes.push(subArr.shift())
        }
      }
    })

    if (this.isPlaying) requestAnimationFrame(this.animate)
  }

  scoreIncrementer() {
    return setInterval(() => {
      this.score += 2
    }, 100);
  }

  checkCollisionDown(x) {
    let note = this.visibleNotes[x][0];
    if (note) {
      if (note.inBounds(this.dimensions.height)) {
        // As long as the note was not previously colored out then 
        // the hit was successful!
        if (note.color !== "black" && note.color !== "gray") {
          if (note.holdValue !== 0 && !note.outOfBoundsHoldingNoteHead(this.dimensions.height)) {
            if(x === 0) this.score1 = this.scoreIncrementer()
            if(x === 1) this.score2 = this.scoreIncrementer()
            if(x === 2) this.score3 = this.scoreIncrementer()
            if(x === 3) this.score4 = this.scoreIncrementer()
            if(x === 4) this.score5 = this.scoreIncrementer()

            note.holdFlag = true;
            note.color = 'purple';
            this.targets[x].successfulHit = true
          } else {
            this.streak += 1;
            this.notesHit += 1
            if (this.streak > this.maxStreak) this.maxStreak = this.streak;
            this.targets[x].successfulHit = true
            this.score += 20;
            this.visibleNotes[x].shift();
            setTimeout(() => {this.targets[x].successfulHit = false}, 80)
          }
        }
      }
    }
  }

  checkCollisionUp(x) {
    let note = this.visibleNotes[x][0];
    this.targets[x].successfulHit = false;
    
    if(x === 0) clearInterval(this.score1)
    if(x === 1) clearInterval(this.score2)
    if(x === 2) clearInterval(this.score3)
    if(x === 3) clearInterval(this.score4)
    if(x === 4) clearInterval(this.score5)
    
    // make sure there is a note to look at when a keyup occurs
    if (note) {
      if (note.holdFlag && note.inBoundsTail(this.dimensions.height)) {
        this.streak += 1;
        this.notesHit += 1
        if (this.streak > this.maxStreak) this.maxStreak = this.streak;
        note.holdFlag = false;
        this.visibleNotes[x].shift();
      }
      else if (note.holdFlag && !note.inBoundsTail(this.dimensions.height)) {
        this.resetStreak();
        note.color = 'black';
        note.holdFlag = false;
      }
    }
  }

  handleKeyDown(e) {
    // Keydown will continue to listen if pressed
    // so keyLock will prevent the event from continuing
    if (e.key == "1" && !this.keyLock1) {
      this.keyLock1 = true;
      this.checkCollisionDown(0)
    } 
    if (e.key == "2" && !this.keyLock2) {
      this.keyLock2 = true;
      this.checkCollisionDown(1)
    } 
    if (e.key == "3" && !this.keyLock3) {
      this.keyLock3 = true;
      this.checkCollisionDown(2)
    } 
    if (e.key == "4" && !this.keyLock4) {
      this.keyLock4 = true;
      this.checkCollisionDown(3)
    } 
    if (e.key == "5" && !this.keyLock5) {
      this.keyLock5 = true;
      this.checkCollisionDown(4)
    } 
  }

  handleKeyUp(e) {
    if (e.key == "1") {
      this.keyLock1 = false;
      this.checkCollisionUp(0)
    } 
    if (e.key == "2") {
      this.keyLock2 = false;
      this.checkCollisionUp(1)
    } 
    if (e.key == "3") {
      this.keyLock3 = false;
      this.checkCollisionUp(2)
    } 
    if (e.key == "4") {
      this.keyLock4 = false;
      this.checkCollisionUp(3)
    } 
    if (e.key == "5") {
      this.keyLock5 = false;
      this.checkCollisionUp(4)
    } 
  }

  addTargetListeners() {
    window.addEventListener('keydown', e => this.handleKeyDown(e))
    window.addEventListener('keyup', e => this.handleKeyUp(e))
  }

  scoreboard() {
    let score = document.getElementById('score'); 
    score.innerHTML = this.score;
  }

  streakBoard() {
    let streak = document.getElementById('streak'); 
    let max = document.getElementById('max-streak'); 
    streak.innerHTML = this.streak;
    max.innerHTML = this.maxStreak;
  }

  resetStreak() {
    if (this.maxStreak < this.streak) {
      this.maxStreak = this.streak;
    };
    this.streak = 0;
  }

  generateNoteArray() {
    let notes = new Array(5);
    for (let i = 0; i < notes.length; i++) {
      notes[i] = new Array();
    }
    return notes
  }

  playNotes() {
    this.intervalValue += 1
    this.counter++;
    let remainingNotesNum = this.allNotes.length
    if (remainingNotesNum > 0) {
      if (this.allNotes[remainingNotesNum - 1].rest) {
        this.counter -= this.allNotes[remainingNotesNum - 1].tempo;
        this.allNotes.pop();
      }
      else if (this.allNotes[remainingNotesNum - 1].kill) {
        this.counter += 1;
        this.allNotes.pop();
      }
      if (this.counter === 1 && this.allNotes[remainingNotesNum - 1].tempo > 1) {
        this.noteGrabber();
        this.counter = 0;
      }
      else if (this.counter === 2) {
        this.counter = 0;
        this.noteGrabber();
      }
    }
  }

  generateNotes() {
    this.callGenerateNotes = setInterval( () => {
      this.playNotes()
    }, this.currentSong.tempo)
  }

  pauseEventListener() {
    this.audio.pause();
    this.pause.classList.add("hidden")
    this.resume.classList.remove("hidden")
    this.intervalValue %= this.currentSong.tempo
    this.isPlaying = false;
    clearInterval(this.callGenerateNotes)
    clearTimeout(this.resumeTimeout)
  }

  firstGenerationNotes() {
    this.generateNotes()
    this.pause.style.background = 'black'
    this.pause.style.opacity = '1'
    this.pause.addEventListener('click', this.pauseEventListener);
  }
      
  noteGrabber() {
    let noteParams = this.allNotes.pop();
    let note = new Note(noteParams.x, noteParams.y, this.c, this.returnColor(noteParams.x), noteParams.hold)
    this.visibleNotes[noteParams.pos].push(note);
    if (noteParams.chain) {
      let noteParams2 = this.allNotes.pop();
      let note2 = new Note(noteParams2.x, noteParams2.y, this.c, this.returnColor(noteParams2.x), noteParams.hold)
      this.visibleNotes[noteParams2.pos].push(note2);
    }
  }

  returnColor(pos) {
    const colorCode = {
      30: "green",
      150: "red",
      270: "yellow",
      390: "blue",
      510: "orange",
    }
    return colorCode[pos]
  }

  endListener() {
    this.audio.addEventListener('ended', () => {
      this.calculateGrade()
      let scoreValue = document.getElementById('score-value')
      let comboValue = document.getElementById('combo-value')
      let percentValue = document.getElementById('percent-value')
      let hitValue = document.getElementById('hit-value')
      let missedValue = document.getElementById('missed-value')
      scoreValue.innerHTML = this.score
      comboValue.innerHTML = this.maxStreak
      percentValue.innerHTML = (this.notesHit * 100 / this.totalNotes).toFixed(1) + '%'
      hitValue.innerHTML = this.notesHit
      missedValue.innerHTML = this.totalNotes - this.notesHit

      this.scoreContainer.style.display = 'flex'
    })
  }

  calculateGrade() {
    let grade = document.getElementsByClassName('game-end-score')[0]
    if ((this.notesHit / this.totalNotes) * 100 >= 88) {
      grade.innerHTML = 'A'
    }
    else if ((this.notesHit / this.totalNotes) * 100 >= 78.0) {
      grade.innerHTML = 'B'
    }
    else if ((this.notesHit / this.totalNotes) * 100 >= 68.0) {
      grade.innerHTML = 'C'
    }
    else if ((this.notesHit / this.totalNotes) * 100 >= 58.0) {
      grade.innerHTML = 'D'
    }
    else {
      grade.innerHTML = 'F'
    }
  }

  scoreBtnListener() {
    let replay = document.getElementById('replay-btn')
    let back = document.getElementById('back-btn')

    replay.addEventListener('click', () => {
      this.restart.click()
    })

    back.addEventListener('click', () => {
      this.back.click()
    })
  }

  playSong() {
    this.audio = document.getElementById('audio');
    this.restart = document.getElementById('restart');
    let volume = document.getElementById('game-volume')
    this.back = document.getElementById('back');

    this.endListener()
    this.scoreBtnListener()
    this.handleMute()

    const handleRestart = this.handleRestart.bind(this)
    const handleResume = this.handleResume.bind(this)

    setTimeout(() => {
      if (this.audio.currentTime === 0) {
        this.audio.play()
          .then(this.startTimeout = setTimeout(this.firstGenerationNotes, this.currentSong.introDelay));
        this.isPlaying = true;
        requestAnimationFrame(this.animate)
        
      }
      //fade delay
    }, 1500)

    this.selectMenuVolume = document.getElementById('select-menu-volume')

    volume.value = this.selectMenuVolume.value
    volume.addEventListener('change', (e) => {
      this.audio.volume = e.target.value / 100
    })

    this.back.addEventListener('click', () => {
      window.removeEventListener('keydown', this.handleKeyDown)
      window.removeEventListener('keyup', this.handleKeyUp)
      this.pause.removeEventListener('click', this.pauseEventListener)
      this.restart.removeEventListener('click', handleRestart);
      this.resume.removeEventListener('click', handleResume);
      this.selectMenuVolume.value = volume.value
      this.clearGame()
      //clear notes in settime out or everything zeros out before fade away
      setTimeout(() => this.handleBack(), 666)
    })

    this.restart.addEventListener('click', handleRestart);

    resume.addEventListener('click', handleResume)
  }

  handleMute() {
    let mute = document.getElementById('mute');
    let unmute = document.getElementById('unmute');

    if (this.audio.muted) {
      unmute.classList.remove("hidden")
      mute.classList.add("hidden")
    } else {
      mute.classList.remove("hidden")
      unmute.classList.add("hidden")
    }

    mute.addEventListener('click', () => {
      if (!this.audio.muted) {
        this.audio.muted = true;
        mute.classList.add("hidden")
        unmute.classList.remove("hidden")
      } 
    });
    unmute.addEventListener('click', () => {
      if (this.audio.muted) {
        this.audio.muted = false;
        unmute.classList.add("hidden")
        mute.classList.remove("hidden")
      } 
    });
  }

  clearGame() {
    this.currentSong = '';
    this.allNotes = []
    this.visibleNotes = this.generateNoteArray();
    this.missedNotes = [];
    this.totalNotes = 0
    this.notesHit = 0
    this.isPlaying = false;
    this.audio.pause()
    this.audio.currentTime = 0
    
    clearInterval(this.callGenerateNotes)
    clearTimeout(this.startTimeout)
    this.gameView.classList.remove('fadeIn')
    this.gameView.classList.add('fadeOut')
  }

  handleBack() {
    this.scoreContainer.style.display = 'none'
    this.score = 0;
    this.streak = 0;
    this.maxStreak = 0;
    this.selectCircle.classList.add('song-selection-container-open')
    this.selectCircle.classList.remove('song-selection-container-closed')
    this.pause.classList.remove("hidden")
    this.resume.classList.add("hidden")

    this.homePage.classList.remove('hidden')
    this.homePage.classList.add('fadeIn')
    this.gameView.classList.add('hidden')
    this.gameView.classList.remove('fadeOut')
    if (!this.audio.paused) {
      this.audio.pause()
      this.audio.currentTime = 0
    }
  }

  handleResume() {
    let dif = this.currentSong.tempo - this.intervalValue - 45
    dif = dif < 0 ? 0 : dif
    this.resumeTimeout = setTimeout( () => {
        this.playNotes()
        this.callGenerateNotes = setInterval( () => {
        this.playNotes()
      }, this.currentSong.tempo)
    }, dif)
  
    this.pause.classList.remove("hidden")
    this.resume.classList.add("hidden")
  
    this.audio.play();
    this.isPlaying = true;
  
    requestAnimationFrame(this.animate)
  }
  
  handleRestart() {
    if (this.currentSong !== "undefined" && this.currentSong !== "" ) {
      this.allNotes = this.currentSong.notes.slice()
      this.allNotes.reverse()
      this.scoreContainer.style.display = 'none'
      this.score = 0;
      this.streak = 0;
      this.maxStreak = 0;
      this.notesHit = 0
      this.visibleNotes = this.generateNoteArray();
      this.missedNotes = [];
      this.counter = 0
      this.pause.removeEventListener('click', this.pauseEventListener)
      this.pause.classList.remove("hidden")
      this.resume.classList.add("hidden")
      this.pause.style.background = 'rgb(65, 65, 65)'
      this.pause.style.opacity = '0.7'
      clearInterval(this.callGenerateNotes)
      clearTimeout(this.restartTimeout)
      clearTimeout(this.startTimeout)
      if (!this.isPlaying) {
        this.isPlaying = true;
        requestAnimationFrame(this.animate)
      }
      this.audio.currentTime = 0
      if (this.audio.paused) {
        this.audio.play().then(this.restartTimeout = setTimeout(this.firstGenerationNotes, this.currentSong.introDelay));
      } else {
        this.restartTimeout = setTimeout(this.firstGenerationNotes, this.currentSong.introDelay)
      }
      this.isPlaying = true;
    }
  }

  generateTargets() {
    const targets = []
    for(let i = 1; i < 6; i++) {
      targets.push(new Target(this.c, i))
    }
    return targets
  }

  killJitter(c) {
    c.beginPath();
    c.rect(0, 0, 0, 0);
    c.stroke();
  }
} 