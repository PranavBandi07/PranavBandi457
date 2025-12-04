document.addEventListener('DOMContentLoaded', function(){
  function $id(id){return document.getElementById(id)}
  var form = $id('contactForm') || document.querySelector('form.php-email-form') || document.querySelector('form')
  if(!form) return
  var nameI = $id('name')
  var surnameI = $id('surname')
  var emailI = $id('email')
  var phoneI = $id('phone')
  var addressI = $id('address')
  var r1 = $id('r1')
  var r2 = $id('r2')
  var r3 = $id('r3')
  var submitBtn = $id('submitBtn') || form.querySelector('button[type="submit"]')
  var formResult = $id('formResult')
  var popup = $id('submitPopup')
  if(!popup){
    popup = document.createElement('div')
    popup.id = 'submitPopup'
    popup.className = 'submit-popup'
    document.body.appendChild(popup)
  }

  function digitsOnly(v){ return v ? v.replace(/\D/g,'') : '' }
  function isEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) }
  function isLetters(v){ return /^[A-Za-zĀ-ž\s'\-]+$/.test(v) }

  function validPhone(v){
    var d = digitsOnly(v)
    if(!d) return false
    if(d.length === 8) return d[0] === '6'
    if(d.length === 9 && d[0] === '8') return d.slice(1)[0] === '6'
    if(d.length === 11 && d.slice(0,3) === '370') return d.slice(3)[0] === '6'
    return false
  }

  function setErr(el, msg){
    if(!el) return
    var id = 'err-'+el.id
    var err = document.getElementById(id)
    if(!err){
      err = document.createElement('div')
      err.id = id
      err.className = 'error'
      el.parentNode.appendChild(err)
    }
    err.textContent = msg
    el.classList.add('error-input')
  }

  function clearErr(el){
    if(!el) return
    var err = document.getElementById('err-'+el.id)
    if(err) err.textContent = ''
    el.classList.remove('error-input')
  }

  function validateOne(el){
    if(!el) return true
    var v = (el.value||'').trim()
    if(el === nameI || el === surnameI){
      if(v === '' || !isLetters(v)){ setErr(el,'Only letters'); return false }
      clearErr(el); return true
    }
    if(el === emailI){
      if(!isEmail(v)){ setErr(el,'Invalid email'); return false }
      clearErr(el); return true
    }
    if(el === phoneI){
      if(!validPhone(v)){ setErr(el,'Invalid phone'); return false }
      clearErr(el); return true
    }
    if(el === addressI){
      if(v.length < 3){ setErr(el,'Too short'); return false }
      clearErr(el); return true
    }
    return true
  }

  function toggleButton(){
    var ok = validateOne(nameI) && validateOne(surnameI) && validateOne(emailI) && validateOne(phoneI) && validateOne(addressI)
    if(submitBtn) submitBtn.disabled = !ok
  }

  var lastPhoneValue = ''
  var inputs = [nameI, surnameI, emailI, phoneI, addressI]
  inputs.forEach(function(el){
    if(!el) return
    el.addEventListener('input', function(e){
      if(el === phoneI){
        var currentValue = el.value
        var d = digitsOnly(currentValue)
        
        
        var isDeleting = currentValue.length < lastPhoneValue.length
        
        
        if(d.startsWith('370')) d = d.slice(3)
        if(d.startsWith('8') && d.length>1) d = d.slice(1)
        
        
        if(d.length === 0 || currentValue === '+370' || currentValue === '+370 '){
          el.value = '+370 '
          lastPhoneValue = '+370 '
        } else if(d.length <= 3){
          el.value = '+370 ' + d
          lastPhoneValue = el.value
        } else {
          el.value = '+370 ' + d.slice(0,3) + ' ' + d.slice(3)
          lastPhoneValue = el.value
        }
      }
      validateOne(el)
      toggleButton()
    })
  })

  function makeBubble(el){
    if(!el) return
    var wrap = el.parentNode
    if(!wrap) return
    var b = wrap.querySelector('.value-bubble')
    if(!b){
      b = document.createElement('div')
      b.className = 'value-bubble'
      wrap.appendChild(b)
    }
    b.textContent = el.value
  }

  function attachRange(el){
    if(!el) return
    makeBubble(el)
    el.addEventListener('input', function(){
      makeBubble(el)
    })
  }

  attachRange(r1); attachRange(r2); attachRange(r3)

  if(submitBtn) submitBtn.disabled = true

  form.addEventListener('submit', function(e){
    e.preventDefault()
    if(submitBtn && submitBtn.disabled) return
    
    
    var rating1Input = document.querySelector('input[name="rating-1"]:checked')
    var rating2Input = document.querySelector('input[name="rating-2"]:checked')
    var rating3Input = document.querySelector('input[name="rating-3"]:checked')
    
    var a = rating1Input ? Number(rating1Input.value) : (r1 ? Number(r1.value) : 0)
    var b = rating2Input ? Number(rating2Input.value) : (r2 ? Number(r2.value) : 0)
    var c = rating3Input ? Number(rating3Input.value) : (r3 ? Number(r3.value) : 0)
    
    var count = 0
    if(a) count++
    if(b) count++
    if(c) count++
    if(count === 0) count = 3
    var avg = Math.round(((a + b + c) / count) * 10) / 10
    
    
    var formData = {
      name: nameI ? nameI.value : '',
      surname: surnameI ? surnameI.value : '',
      email: emailI ? emailI.value : '',
      phone: phoneI ? phoneI.value : '',
      address: addressI ? addressI.value : '',
      rating1: a,
      rating2: b,
      rating3: c,
      averageScore: avg
    }
    console.log('Form Data:', formData)
    
    
    if(formResult){
      var lines = []
      if(nameI) lines.push('Name: ' + (nameI.value||''))
      if(surnameI) lines.push('Surname: ' + (surnameI.value||''))
      if(emailI) lines.push('Email: ' + (emailI.value||''))
      if(phoneI) lines.push('Phone: ' + (phoneI.value||''))
      if(addressI) lines.push('Address: ' + (addressI.value||''))
      
      
      var avgColor = '#ff6b6b' 
      if(avg >= 4 && avg < 7) avgColor = '#ffa500' 
      if(avg >= 7) avgColor = '#4CAF50' 
      
      var fullName = (nameI ? nameI.value : '') + ' ' + (surnameI ? surnameI.value : '')
      lines.push('') 
      lines.push(fullName + ': ' + avg)
      
      formResult.style.display = 'block'
      formResult.innerHTML = lines.slice(0, -2).join('<br>') + 
                             '<br><br><span style="color:' + avgColor + '; font-weight: bold; font-size: 1.1em;">' + 
                             lines[lines.length - 1] + '</span>'
      formResult.scrollIntoView({behavior:'smooth',block:'center'})
    }
    
    
    popup.textContent = 'Form submitted successfully!'
    popup.classList.add('show')
    setTimeout(function(){ popup.classList.remove('show') }, 1600)
    form.reset()
    if(submitBtn) submitBtn.disabled = true
    attachRange(r1); attachRange(r2); attachRange(r3)
  }, false)
})


document.addEventListener("DOMContentLoaded", function () {
  var board = document.getElementById("mg-board");
  if (!board) return;

  var startBtn = document.getElementById("mg-start");
  var restartBtn = document.getElementById("mg-restart");
  var diffEasy = document.getElementById("mg-diff-easy");
  var diffHard = document.getElementById("mg-diff-hard");
  var difficultyLabel = document.getElementById("mg-difficulty-label");
  var movesEl = document.getElementById("mg-moves");
  var matchesEl = document.getElementById("mg-matches");
  var timeEl = document.getElementById("mg-time");
  var messageEl = document.getElementById("mg-message");

  var items = ["🍎","🍌","🍇","🍒","🍉","🍍","🥝","🍑","🥥","🍓","🍐","🍊"];

  var currentDifficulty = "easy";
  var firstCard = null;
  var secondCard = null;
  var lockBoard = false;
  var moves = 0;
  var matches = 0;
  var totalPairs = 8;
  var timerInterval = null;
  var startTime = null;

  restartBtn.disabled = true;
  difficultyLabel.textContent = "Easy (4×4)";
  timeEl.textContent = "0.0 s";

  function getPairCount() {
    return currentDifficulty === "easy" ? 8 : 12;
  }

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i];
      arr[i] = arr[j];
      arr[j] = t;
    }
  }

  function createDeck() {
    var pairCount = getPairCount();
    var selected = items.slice(0, pairCount);
    var deck = [];
    for (var i = 0; i < selected.length; i++) {
      deck.push({ value: selected[i] });
      deck.push({ value: selected[i] });
    }
    shuffle(deck);
    return deck;
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(function () {
      var elapsed = (Date.now() - startTime) / 1000;
      timeEl.textContent = elapsed.toFixed(1) + " s";
    }, 100);
  }

  function resetStats() {
    moves = 0;
    matches = 0;
    totalPairs = getPairCount();
    movesEl.textContent = "0";
    matchesEl.textContent = "0";
    timeEl.textContent = "0.0 s";
    stopTimer();
  }

  function setBoardLayout() {
    board.className = "memory-board";
    if (currentDifficulty === "easy") {
      board.classList.add("memory-board-easy");
    } else {
      board.classList.add("memory-board-hard");
    }
  }

  function buildBoard() {
    var deck = createDeck();
    board.innerHTML = "";
    for (var i = 0; i < deck.length; i++) {
      var card = document.createElement("button");
      card.type = "button";
      card.className = "memory-card";
      card.setAttribute("data-value", deck[i].value);
      card.textContent = "";
      card.addEventListener("click", onCardClick);
      board.appendChild(card);
    }
  }

  function newGame() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    resetStats();
    setBoardLayout();
    buildBoard();
    restartBtn.disabled = false;
  }

  function flipCard(card) {
    card.classList.add("flipped");
    card.textContent = card.getAttribute("data-value");
  }

  function hideCard(card) {
    card.classList.remove("flipped");
    card.textContent = "";
  }

  function resetTurn() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
  }

  function finishGame() {
    stopTimer();
    messageEl.textContent = "You found all pairs in " + moves + " moves.";
  }

  function checkForMatch() {
    var v1 = firstCard.getAttribute("data-value");
    var v2 = secondCard.getAttribute("data-value");

    if (v1 === v2) {
      firstCard.classList.add("matched");
      secondCard.classList.add("matched");
      matches++;
      matchesEl.textContent = String(matches);
      resetTurn();
      if (matches === totalPairs) {
        finishGame();
      }
    } else {
      setTimeout(function () {
        hideCard(firstCard);
        hideCard(secondCard);
        resetTurn();
      }, 800);
    }
  }

  function onCardClick(e) {
    var card = e.currentTarget;
    if (lockBoard) return;
    if (!card || card.classList.contains("matched")) return;
    if (card === firstCard) return;
    if (!timerInterval) startTimer();

    flipCard(card);

    if (!firstCard) {
      firstCard = card;
      return;
    }

    secondCard = card;
    lockBoard = true;
    moves++;
    movesEl.textContent = String(moves);
    checkForMatch();
  }

  startBtn.addEventListener("click", function () {
    messageEl.textContent = "New game started.";
    newGame();
  });

  restartBtn.addEventListener("click", function () {
    messageEl.textContent = "Game restarted.";
    newGame();
  });

  diffEasy.addEventListener("click", function () {
    if (currentDifficulty === "easy") return;
    currentDifficulty = "easy";
    diffEasy.classList.add("active");
    diffHard.classList.remove("active");
    difficultyLabel.textContent = "Easy (4×4)";
    messageEl.textContent = "Difficulty changed to Easy.";
    newGame();
  });

  diffHard.addEventListener("click", function () {
    if (currentDifficulty === "hard") return;
    currentDifficulty = "hard";
    diffHard.classList.add("active");
    diffEasy.classList.remove("active");
    difficultyLabel.textContent = "Hard (6×4)";
    messageEl.textContent = "Difficulty changed to Hard.";
    newGame();
  });
});
