var rate = 5.0;
var moveCount = 0;
var timer;
var preClicked = null;
var totalMatched;
var tdata;
var timerIntrvl;
var newGame = true;


var tb = document.querySelector('.tb');
var td = document.querySelector('td');
var start = document.querySelector('#start-btn');
var timerEl = document.querySelector('#timer');
var moveEl = document.querySelector('.moves');
var starInnerEl = document.querySelector('.stars-inner');
var popupEl = document.querySelector('.popup-container');
var img = document.getElementsByClassName('img');

var bmusic = new Audio('assets/s-music.mp3');
var bclcik = new Audio('assets/s-click.mp3');
var bcorrect = new Audio('assets/s-ok.mp3');
var bwon = new Audio('assets/s-won.mp3');
var bwrong = new Audio('assets/s-wrong.mp3');
var btimer = new Audio('assets/s-timer.mp3');


document.querySelector('.reset').addEventListener('click', function () {
  start.click();
  bmusic.pause();
})

start.addEventListener('click', function () {
  // initialize the game
  rate = 5.0;
  moveCount = 0;
  timer = 0;
  preClicked = null;
  totalMatched = 0;
  tdata = new Array(1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8);
  popupEl.style.display = 'none';
  tb.style.opacity = 1;

  init();

  // start Audio background
  btimer.currentTime = 0;
  btimer.play();

  setTimeout(() => {
    var t = Array.from(document.querySelectorAll('td'));
    t.forEach(e => {
      e.firstElementChild.style.opacity = 0;
      if (newGame) {
        e.addEventListener('click', () => {
          e.classList.add('td_zoom');
          e.firstElementChild.style.opacity = 1;
          validate(e);
        })
      }
      // start timer
      clearInterval(timerIntrvl);
      timerIntrvl = setInterval(() => {
        timer++;
        let m = parseInt(timer/60);
        let s = timer%60;
        if(m<10) m = '0'+m;
        if(s<10) s = '0'+s;
        timerEl.textContent = m+':'+s;

        calRating();

      }, 1000);
    })

    btimer.pause();
    bmusic.currentTime = 0;
    bmusic.play();
  }, 2000)

})

function validate(e) {
  bclcik.currentTime = 0;
  bclcik.play();
  if (preClicked != null && e != preClicked) {
    if (e.firstElementChild.src == preClicked.firstElementChild.src) {
      console.log("OK Matched");
      bcorrect.currentTime = 0;
      bcorrect.play();
      totalMatched++;
    } else {
      console.log("Not matched");
      bwrong.currentTime = 0;
      bwrong.play();
      let bcpreClick = preClicked;
      e.classList.add('td_shake');
      bcpreClick.classList.add('td_shake');

      setTimeout(() => {
        e.classList.remove('td_zoom');
        e.classList.remove('td_shake');
        e.firstElementChild.style.opacity = 0;
        bcpreClick.classList.remove('td_zoom');
        bcpreClick.classList.remove('td_shake');
        bcpreClick.firstElementChild.style.opacity = 0;

      }, 200);
    }
    preClicked = null;
    moveCount++;
    moveEl.innerHTML = moveCount + ' moves';
  } else if (preClicked == null) {
    // first time click no pair
    preClicked = e;
    moveCount++;
    moveEl.innerHTML = moveCount + ' moves';
  }
  if (totalMatched > 7) {
    clearInterval(timerIntrvl);
    console.log("You won");
    document.querySelector('.head-text').textContent = 'You won';
    document.querySelector('.rateOut').style.display = 'block';
    document.querySelector('.rateLen').style.width = calRating();
    popupEl.style.display = '';
    bmusic.pause();
    bwon.currentTime = 0;
    bwon.play();
  }
}

function calRating() {
  var starTotal = 5.0;
  var rateTime = 0;
  var effMoveCount = 0;
  //  decrease rating after 12sec and 20moves
  //console.log("sec : ",timer);
  if (timer > 12) {
    rateTime = (timer - 12) * 0.065;
    if (rateTime > 2.5) {
      rateTime = 2.5;
    }
  }
  if (moveCount > 20) {
    effMoveCount = moveCount - 20;
  }
  var rateMove = (effMoveCount * 0.10).toFixed(2);
  rate = 5 - rateTime - rateMove;
  rate = rate.toFixed(2);
  //console.log("rate:"+rate);
  const starPercentage = (rate / starTotal) * 100;
  const starPercentageRounded = Math.round(starPercentage / 10) * 10 + "%";
  starInnerEl.style.width = starPercentageRounded;
  return starPercentageRounded;

}
function init() {
  tdata = shuffleArray(tdata);
  console.log(tdata);
  timerEl.innerHTML = '0:00';
  moveEl.innerHTML = 0;
  starInnerEl.style.width = '100%';
  fillTable();
  var t = Array.from(document.querySelectorAll('td'));
  t.forEach((e) => {
    e.classList.remove('td_zoom');
    e.firstElementChild.style.opacity = 1;
  })

}

function fillTable() {
  for (let i = 1; i < 17; i++) {
    document.querySelector('.img' + i).src = 'img/im' + tdata[i - 1] + '.png';
  }
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}