const COLORS = {
  1: 'green',
  2: 'red',
  3: 'yellow',
  4: 'blue',
  5: 'orange',
}

// const COLORS = {
//   1: '#55f96b',
//   2: '#de0b4794',
//   3: '#f9f455',
//   4: '#55e2f9',
//   5: '#f99255',
// }

export default class Target {
  constructor(context, num) {
    this.context = context;
    this.color = 'lightgray';
    this.num = num;
    this.pos = (num - 1) * 120 + 110;
    this.pressedFlag = false;
    this.successfulHit = false;

    this.setTarget = this.setTarget.bind(this);
    this.setPressed = this.setPressed.bind(this);
    this.displayTarget = this.displayTarget.bind(this);
    this.addListeners = this.addListeners.bind(this);
    this.addListeners();
  }

  displayTarget() {
    if (this.pressedFlag) {
      this.setPressed();
    } else {
      this.setTarget();
    }
  }

  setPressed(){
    if (this.successfulHit) {
      this.context.shadowBlur = 30;
      this.context.shadowOffsetX = 3;
      this.context.shadowOffsetY = 3;
      this.context.shadowColor = "yellow";
    }
    this.context.beginPath();
    this.context.arc(this.pos, 678, 50, 0, Math.PI * 2, false);
    this.context.fillStyle = "black";
    this.context.fill();
    this.context.stroke();

    this.context.beginPath();
    this.context.arc(this.pos, 678, 45, 0, Math.PI * 2, false);
    this.context.fillStyle = COLORS[this.num];
    this.context.fill();
    this.context.stroke();
    
    this.context.beginPath();
    this.context.arc(this.pos, 678, 30, 0, Math.PI * 2, false);
    this.context.fillStyle = this.color;
    this.context.fill();
    this.context.stroke();
    this.context.shadowBlur = 0;
  }

  setTarget(){
    this.context.beginPath();
    this.context.arc(this.pos, 690, 50, 0, Math.PI * 2, false);
    this.context.fillStyle = "black";
    this.context.fill();
    this.context.stroke();

    this.context.beginPath();
    this.context.arc(this.pos, 690, 45, 0, Math.PI * 2, false);
    this.context.fillStyle = COLORS[this.num];
    this.context.fill();
    this.context.stroke();
    
    this.context.beginPath();
    this.context.arc(this.pos, 690, 30, 0, Math.PI * 2, false);
    this.context.fillStyle = this.color;
    this.context.fill();
    this.context.stroke();
  }
  
  addListeners() {
    addEventListener('keydown', e => {
      if (e.key == this.num) {
        this.color = 'black'
        this.pressedFlag = true;
      } 
    }),
    addEventListener('keyup', e => {
      if (e.key == this.num) {
        this.color = 'lightgray'
        this.pressedFlag = false;
      } 
    })
  }
}