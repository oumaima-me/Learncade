// Quiz Data
const quizQuestions = [
  { question: "What is the output of print('Hello, World!')?", options: ["Hello, World!", "hello, world!", "HELLO, WORLD!", "Error"], correct: 0 },
  { question: "Which symbol is used for comments in Python?", options: ["//", "#", "/*", "<!--"], correct: 1 },
  { question: "What does x = 5; y = 3; print(x + y) output?", options: ["8", "53", "2", "Error"], correct: 0 },
  { question: "Python uses braces {} to define code blocks?", options: ["Yes", "No"], correct: 1 },
  { question: "Which keyword is used to define a function in Python?", options: ["func", "def", "function", "define"], correct: 1 }
];

// Global Variables
let currentQuestion = 0;
let userAnswers = [];
let userScore = 0;

let userEnergy = 3;
let maxEnergy = 3;
let lastEnergyRefill = Date.now();
let energyRefillInterval = 4 * 60 * 60 * 1000; // 4 hours
let energyTimer = null;

// Cooldown system
let failCount = 0;
let cooldownEnd = null;
let boosterActive = false;

// Mobile menu state
let mobileMenuOpen = false;

// Enhanced Navigation
function showSection(sectionId) {
  const sections = ['homeSection', 'quizSection', 'nftSection', 'coursesSection', 'aboutSection', 'lecturesPage', 'lectureSection', 'finalQuizAccessSection', 'finalQuizSection'];
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });
  const target = document.getElementById(sectionId);
  if (target) target.classList.remove('hidden');
  
  // Close mobile menu when navigating
  closeMobileMenu();
  
  // Scroll to top on section change
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showHome() { showSection('homeSection'); }
function showQuiz() { showSection('quizSection'); startQuiz(); }
function showNFTs() { showSection('nftSection'); }
function showCourses() { showSection('coursesSection'); }
function showAbout() { showSection('aboutSection'); }
function showLectures() { showSection('lecturesPage'); }

// Simple and Direct Mobile Menu Functions
function toggleMobileMenu() {
  console.log('toggleMobileMenu called');
  const navLinks = document.querySelector('.nav-links');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  
  if (navLinks && mobileMenuBtn) {
    mobileMenuOpen = !mobileMenuOpen;
    console.log('Mobile menu state:', mobileMenuOpen);
    
    if (mobileMenuOpen) {
      // Open menu
      navLinks.style.display = 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '100%';
      navLinks.style.left = '0';
      navLinks.style.right = '0';
      navLinks.style.background = '#1a1438';
      navLinks.style.padding = '20px';
      navLinks.style.borderRadius = '16px';
      navLinks.style.marginTop = '10px';
      navLinks.style.boxShadow = '0 0 20px rgba(138, 43, 226, 0.4)';
      navLinks.style.zIndex = '1000';
      
      mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
      document.body.style.overflow = 'hidden';
    } else {
      // Close menu
      closeMobileMenu();
    }
  } else {
    console.error('Mobile menu elements not found');
  }
}

function closeMobileMenu() {
  const navLinks = document.querySelector('.nav-links');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  
  if (navLinks && mobileMenuBtn) {
    mobileMenuOpen = false;
    
    // Reset all styles
    navLinks.style.display = '';
    navLinks.style.flexDirection = '';
    navLinks.style.position = '';
    navLinks.style.top = '';
    navLinks.style.left = '';
    navLinks.style.right = '';
    navLinks.style.background = '';
    navLinks.style.padding = '';
    navLinks.style.borderRadius = '';
    navLinks.style.marginTop = '';
    navLinks.style.boxShadow = '';
    navLinks.style.zIndex = '';
    
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    document.body.style.overflow = '';
    
    console.log('Mobile menu closed');
  }
}

// Enhanced click outside handler
function handleClickOutside(event) {
  if (mobileMenuOpen) {
    const navLinks = document.querySelector('.nav-links');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    
    if (navLinks && mobileMenuBtn) {
      if (!navLinks.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
        closeMobileMenu();
      }
    }
  }
}

// Lectures
let lecturePassed = [false, false, false];
let currentLecture = 1;
let lectureQuizQuestions = [];
let lectureQuizAnswers = [];
let lectureQuizScore = 0;
let lectureQuizCurrent = 0;

function openLecture(num) {
  showSection('lectureSection');
  loadLecture(num);
}

function loadLecture(num) {
  currentLecture = num;
  const titles = ["Lecture 1: Python Basics", "Lecture 2: Data Types", "Lecture 3: Control Flow"];
  const contents = [
    `<h4>Python Basics</h4><p>Learn about Python syntax, indentation, and basic print statements.</p>`,
    `<h4>Data Types</h4><p>Explore integers, floats, strings, and lists in Python.</p>`,
    `<h4>Control Flow</h4><p>Understand if-else statements, loops, and logical operators.</p>`
  ];
  document.getElementById('lectureTitle').textContent = titles[num - 1];
  document.getElementById('lectureContent').innerHTML = contents[num - 1];
  document.getElementById('lectureProgressText').textContent = `Lecture ${num} of 3`;
  document.getElementById('lectureProgressFill').style.width = `${num / 3 * 100}%`;
  document.getElementById('nextLectureBtn').style.display = 'block';
  document.getElementById('nextLectureBtn').textContent = 'Take Quiz';
  document.getElementById('nextLectureBtn').onclick = nextLecture;
  document.getElementById('prevLectureBtn').style.display = num > 1 ? 'block' : 'none';
  document.getElementById('prevLectureBtn').onclick = previousLecture;
}

function nextLecture() { startLectureQuiz(currentLecture); }
function previousLecture() { if (currentLecture > 1) openLecture(currentLecture - 1); }

// Lecture quizzes
function startLectureQuiz(num) {
  const quizzes = [
    [
      { q: "What is the output of print('Hello')?", o: ["Hello", "hello", "Error", "None"], c: 0 },
      { q: "Python uses indentation for?", o: ["Comments", "Code blocks", "Variables", "Loops"], c: 1 },
      { q: "Which is a valid variable name?", o: ["1var", "var_1", "var-1", "var 1"], c: 1 },
      { q: "What symbol starts a comment?", o: ["#", "//", "--", "/*"], c: 0 },
      { q: "Which is a string?", o: ["'abc'", "123", "True", "None"], c: 0 }
    ],
    [
      { q: "Which is an integer?", o: ["'5'", "5.0", "5", "True"], c: 2 },
      { q: "Which is a float?", o: ["5", "'5.0'", "5.0", "False"], c: 2 },
      { q: "Which is a list?", o: ["[1,2,3]", "'abc'", "123", "True"], c: 0 },
      { q: "Which is a string?", o: ["123", "'abc'", "True", "None"], c: 1 },
      { q: "Which is a boolean?", o: ["True", "'True'", "1", "None"], c: 0 }
    ],
    [
      { q: "Which keyword for loop?", o: ["for", "loop", "while", "repeat"], c: 0 },
      { q: "Which is a conditional?", o: ["if", "for", "while", "def"], c: 0 },
      { q: "Which ends a loop early?", o: ["break", "stop", "exit", "end"], c: 0 },
      { q: "Which repeats until false?", o: ["while", "for", "if", "def"], c: 0 },
      { q: "Which is logical AND?", o: ["&&", "and", "||", "or"], c: 1 }
    ]
  ];
  lectureQuizQuestions = quizzes[num - 1];
  lectureQuizAnswers = [];
  lectureQuizScore = 0;
  lectureQuizCurrent = 0;
  showLectureQuiz();
}

function showLectureQuiz() {
  showSection('lectureSection');
  const q = lectureQuizQuestions[lectureQuizCurrent];
  document.getElementById('lectureTitle').textContent = `Quiz: Lecture ${currentLecture}`;
  document.getElementById('lectureContent').innerHTML =
    `<div><strong>${q.q}</strong></div>` +
    q.o.map((opt, i) => `<div style='margin:8px 0;'><label><input type='radio' name='lq' value='${i}'> ${opt}</label></div>`).join('');
  document.getElementById('lectureProgressText').textContent = `Question ${lectureQuizCurrent + 1} of 5`;
  document.getElementById('lectureProgressFill').style.width = `${(lectureQuizCurrent + 1) / 5 * 100}%`;
  document.getElementById('nextLectureBtn').textContent = lectureQuizCurrent < 4 ? 'Next Question' : 'Submit Quiz';
  document.getElementById('nextLectureBtn').onclick = nextLectureQuiz;
  document.getElementById('prevLectureBtn').style.display = lectureQuizCurrent > 0 ? 'block' : 'none';
  document.getElementById('prevLectureBtn').onclick = prevLectureQuiz;
}

function nextLectureQuiz() {
  const sel = document.querySelector('input[name="lq"]:checked');
  lectureQuizAnswers[lectureQuizCurrent] = sel ? parseInt(sel.value) : null;
  if (lectureQuizCurrent < 4) {
    lectureQuizCurrent++;
    showLectureQuiz();
  } else {
    lectureQuizScore = 0;
    lectureQuizAnswers.forEach((ans, i) => { if (ans === lectureQuizQuestions[i].c) lectureQuizScore++; });
    showLectureQuizResult();
  }
}

function prevLectureQuiz() {
  if (lectureQuizCurrent > 0) { lectureQuizCurrent--; showLectureQuiz(); }
}

function showLectureQuizResult() {
  if (lectureQuizScore >= 3) lecturePassed[currentLecture - 1] = true;
  document.getElementById('lectureTitle').textContent = `Quiz Result: Lecture ${currentLecture}`;
  document.getElementById('lectureContent').innerHTML =
    `<div style='text-align:center;'>
      <h3>Your Score: ${lectureQuizScore}/5</h3>
      <p>${lectureQuizScore>=3 ? "Great job! You passed." : "Try again! Unlimited attempts."}</p>
      <button class='btn btn-primary' onclick='startLectureQuiz(${currentLecture})'>Retry Quiz</button>
      ${currentLecture<3 ? `<button class='btn btn-secondary' onclick='openLecture(${currentLecture+1})'>Next Lecture</button>` : `<button class='btn btn-secondary' onclick='showHome()'>Back to Home</button>`}
      ${lecturePassed.every(Boolean) ? `<div style='margin-top:20px;'><button class='btn btn-primary' onclick='showFinalQuizAccess()'>Proceed to Final Quiz</button></div>` : ''}
    </div>`;
  document.getElementById('lectureProgressText').textContent = '';
  document.getElementById('lectureProgressFill').style.width = '100%';
  document.getElementById('nextLectureBtn').style.display = 'none';
  document.getElementById('prevLectureBtn').style.display = 'none';
  unlockFinalQuizIfReady();
}

function unlockFinalQuizIfReady() {
  if (lecturePassed.every(Boolean)) document.getElementById('finalQuizNav').style.display = 'inline-block';
}

// Final Quiz
let finalQuizQuestions = [];
let finalQuizAnswers = [];
let finalQuizScore = 0;
let finalQuizCurrent = 0;
let finalQuizTimer = null;
let finalQuizTimeLeft = 900; // 15 minutes

function showFinalQuizAccess() { showSection('finalQuizAccessSection'); }

function startFinalQuiz() {
  finalQuizQuestions = Array.from({ length: 30 }, (_, i) => ({
    q: `Final Q${i + 1}: What does Python code 'print(${i + 1})' output?`,
    o: [`${i + 1}`, `${i + 2}`, `${i}`, `Error`],
    c: 0
  }));
  finalQuizAnswers = [];
  finalQuizScore = 0;
  finalQuizCurrent = 0;
  finalQuizTimeLeft = 900;
  showSection('finalQuizSection');
  showFinalQuizQuestion();
  startFinalQuizTimer();
}

function showFinalQuizQuestion() {
  const q = finalQuizQuestions[finalQuizCurrent];
  document.getElementById('finalQuizTitle').textContent = `Final Quiz: Question ${finalQuizCurrent + 1} of 30`;
  document.getElementById('finalQuizContent').innerHTML =
    `<div><strong>${q.q}</strong></div>` +
    q.o.map((opt, i) => `<div style='margin:8px 0;'><label><input type='radio' name='fq' value='${i}'> ${opt}</label></div>`).join('');
  document.getElementById('finalQuizProgressFill').style.width = `${(finalQuizCurrent + 1) / 30 * 100}%`;
  document.getElementById('finalQuizProgressText').textContent = `Question ${finalQuizCurrent + 1} of 30`;
  document.getElementById('finalQuizNextBtn').textContent = finalQuizCurrent < 29 ? 'Next Question' : 'Submit Final Quiz';
  document.getElementById('finalQuizNextBtn').onclick = nextFinalQuiz;
  document.getElementById('finalQuizPrevBtn').style.display = finalQuizCurrent > 0 ? 'block' : 'none';
  document.getElementById('finalQuizPrevBtn').onclick = prevFinalQuiz;
}

function nextFinalQuiz() {
  const sel = document.querySelector('input[name="fq"]:checked');
  finalQuizAnswers[finalQuizCurrent] = sel ? parseInt(sel.value) : null;
  if (finalQuizCurrent < 29) {
    finalQuizCurrent++;
    showFinalQuizQuestion();
  } else {
    submitFinalQuiz();
  }
}

function prevFinalQuiz() {
  if (finalQuizCurrent > 0) { finalQuizCurrent--; showFinalQuizQuestion(); }
}

function startFinalQuizTimer() {
  clearInterval(finalQuizTimer);
  updateFinalQuizTimer();
  finalQuizTimer = setInterval(() => {
    finalQuizTimeLeft--;
    updateFinalQuizTimer();
    if (finalQuizTimeLeft <= 0) {
      clearInterval(finalQuizTimer);
      submitFinalQuiz();
    }
  }, 1000);
}

function updateFinalQuizTimer() {
  const min = Math.floor(finalQuizTimeLeft / 60);
  const sec = finalQuizTimeLeft % 60;
  document.getElementById('finalQuizTimer').textContent = `Time Left: ${min}:${sec.toString().padStart(2, '0')}`;
}

function submitFinalQuiz() {
  clearInterval(finalQuizTimer);
  finalQuizScore = 0;
  finalQuizAnswers.forEach((ans, i) => { if (ans === finalQuizQuestions[i].c) finalQuizScore++; });
  showFinalQuizResult();
}

function showFinalQuizResult() {
  let percentage = Math.round((finalQuizScore / 30) * 100);
  let tier, tierEmoji;
  if (percentage >= 95) { tier = 'Gold'; tierEmoji = '🥇'; }
  else if (percentage >= 80) { tier = 'Silver'; tierEmoji = '🥈'; }
  else if (percentage >= 60) { tier = 'Bronze'; tierEmoji = '🥉'; }
  else { tier = null; }

  document.getElementById('finalQuizSection').innerHTML = `
    <div class='quiz-container' style='text-align:center;'>
      <h3>Final Quiz Complete!</h3>
      <div style='font-size:2rem;margin:20px 0;'>Your Score: <span style='color:var(--primary-accent);'>${percentage}%</span></div>
      <p>You got ${finalQuizScore} out of 30 questions correct!</p>
      ${tier ? `
        <div style='margin:30px 0;'>
          <h4 style='color:var(--success);'>${tierEmoji} ${tier} NFT Rewarded!</h4>
          <p>You've earned a ${tier} NFT for performance!</p>
          <button class='mint-button' onclick='mintFinalNFT("${tier}",${percentage})'>Mint NFT</button>
        </div>
      ` : `
        <div style='margin:30px 0;'>
          <h4 style='color:var(--warning);'>No NFT Rewarded</h4>
          <p>At least 60% is required to earn an NFT. Try again!</p>
          <button class='btn btn-secondary' onclick='startFinalQuiz()'>Retry Final Quiz</button>
        </div>
      `}
      <div style='margin-top:30px;'>
        <button class='btn btn-secondary' onclick='showHome()'>Back to Home</button>
        <button class='btn btn-primary' onclick='startFinalQuiz()'>Retry Final Quiz</button>
      </div>
    </div>`;
}

function mintFinalNFT(tier, percentage) {
  document.getElementById('finalQuizSection').innerHTML = `
    <div class='quiz-container' style='text-align:center;'>
      <h3>Minting Your NFT...</h3>
      <div class='progress-bar'><div class='progress-fill' id='mintFinalProgressFill' style='width:0%;'></div></div>
      <p id='mintFinalStatus'>Connecting to blockchain...</p>
    </div>`;
  const steps = [
    { progress: 20, text: 'Connecting to blockchain...' },
    { progress: 40, text: 'Validating transaction...' },
    { progress: 60, text: 'Creating NFT metadata...' },
    { progress: 80, text: 'Uploading to IPFS...' },
    { progress: 100, text: 'Finalizing mint...' }
  ];
  let currentStep = 0;
  const mintInterval = setInterval(() => {
    if (currentStep < steps.length) {
      const step = steps[currentStep];
      document.getElementById('mintFinalProgressFill').style.width = step.progress + '%';
      document.getElementById('mintFinalStatus').textContent = step.text;
      currentStep++;
    } else {
      clearInterval(mintInterval);
      setTimeout(() => {
        document.getElementById('finalQuizSection').innerHTML =
          `<div class='quiz-container' style='text-align:center;'>
             <h4 style='color:var(--success);'>🎉 NFT Successfully Minted!</h4>
             <p>Your ${tier} NFT (${percentage}%) has been added to your collection. View it on a blockchain explorer!</p>
             <button class='btn btn-secondary' onclick='showHome()'>Back to Home</button>
           </div>`;
      }, 1000);
    }
  }, 800);
}

// Main Quiz
function startQuiz() {
  currentQuestion = 0;
  userAnswers = [];
  displayQuestion();
  updateProgress();
}

function displayQuestion() {
  const question = quizQuestions[currentQuestion];
  document.getElementById('questionText').textContent = question.question;
  const optionsContainer = document.getElementById('optionsContainer');
  optionsContainer.innerHTML = '';
  question.options.forEach((option, index) => {
    const optionDiv = document.createElement('div');
    optionDiv.className = 'option';
    optionDiv.innerHTML = `
      <input type="radio" name="answer" value="${index}" id="option${index}">
      <label for="option${index}">${option}</label>
    `;
    optionsContainer.appendChild(optionDiv);
  });
  document.querySelectorAll('.option').forEach(option => {
    option.addEventListener('click', function () {
      document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
      this.classList.add('selected');
      this.querySelector('input').checked = true;
    });
  });
}

function nextQuestion() {
  const selectedOption = document.querySelector('input[name="answer"]:checked');
  userAnswers[currentQuestion] = selectedOption ? parseInt(selectedOption.value) : null;
  if (currentQuestion < quizQuestions.length - 1) {
    currentQuestion++;
    displayQuestion();
    updateProgress();
  } else {
    submitQuiz();
  }
}

function previousQuestion() {
  if (currentQuestion > 0) {
    currentQuestion--;
    displayQuestion();
    updateProgress();
    if (userAnswers[currentQuestion] !== null) {
      const radio = document.querySelector(`input[value="${userAnswers[currentQuestion]}"]`);
      if (radio) {
        radio.checked = true;
        radio.parentElement.classList.add('selected');
      }
    }
  }
}

function updateProgress() {
  const progressPercentage = ((currentQuestion + 1) / quizQuestions.length) * 100;
  document.getElementById('quizProgressFill').style.width = progressPercentage + '%';
  document.getElementById('quizProgressText').textContent = `Question ${currentQuestion + 1} of ${quizQuestions.length}`;
  
  // Update button visibility
  const prevBtn = document.getElementById('prevBtn');
  const submitBtn = document.getElementById('submitBtn');
  
  if (prevBtn) {
    prevBtn.style.display = currentQuestion > 0 ? 'block' : 'none';
  }
  
  if (submitBtn) {
    submitBtn.textContent = currentQuestion === quizQuestions.length - 1 ? 'Submit Quiz' : 'Next Question';
    submitBtn.onclick = currentQuestion === quizQuestions.length - 1 ? submitQuiz : nextQuestion;
  }
}

function submitQuiz() {
  const selectedOption = document.querySelector('input[name="answer"]:checked');
  userAnswers[currentQuestion] = selectedOption ? parseInt(selectedOption.value) : null;

  userScore = 0;
  userAnswers.forEach((answer, index) => {
    if (answer === quizQuestions[index].correct) userScore++;
  });

  const percentage = Math.round((userScore / quizQuestions.length) * 100);

  // Consume energy
  userEnergy = Math.max(0, userEnergy - 1);
  updateEnergyDisplay();

  // Cooldown logic
  const passed = percentage >= 60;
  if (!passed) {
    failCount++;
    let waitMs = 0;
    if (failCount === 1) waitMs = 15 * 60 * 1000;
    else if (failCount === 2) waitMs = 60 * 60 * 1000;
    else waitMs = 24 * 60 * 60 * 1000;
    cooldownEnd = Date.now() + waitMs;
    showCooldown(waitMs);
  } else {
    failCount = 0;
    cooldownEnd = null;
    showQuizResults(percentage);
  }
}

function showQuizResults(percentage) {
  const quizContainer = document.querySelector('#quizSection .quiz-container');
  quizContainer.innerHTML = `
    <div style="text-align: center;">
      <h3>Quiz Complete!</h3>
      <div style="font-size: 2rem; margin: 20px 0;">
        Your Score: <span style="color: var(--primary-accent);">${percentage}%</span>
      </div>
      <p>You got ${userScore} out of ${quizQuestions.length} questions correct!</p>
      ${percentage >= 60 ? `
        <div style="margin: 30px 0;">
          <h4 style="color: var(--success);">🎉 Congratulations!</h4>
          <p>You've earned an NFT based on performance!</p>
          <button class="btn btn-primary" onclick="showNFTEarned(${percentage})">View Your NFT</button>
        </div>
      ` : `
        <div style="margin: 30px 0;">
          <h4 style="color: var(--warning);">Keep Learning!</h4>
          <p>You need at least 60% to earn an NFT. Try again!</p>
          <button class="btn btn-secondary" onclick="startQuiz()" ${cooldownEnd && Date.now() < cooldownEnd ? 'disabled' : ''}>Retry Quiz</button>
          ${cooldownEnd && Date.now() < cooldownEnd ? `<div style='margin-top:15px;color:var(--danger);'>Cooldown active. Please wait or complete a study booster to reduce wait time.</div><button class='btn btn-primary' onclick='startBooster()'>Start Study Booster</button>` : ''}
        </div>
      `}
      <div style="margin-top: 30px;">
        <button class="btn btn-secondary" onclick="showHome()">Back to Home</button>
        <button class="btn btn-primary" onclick="startQuiz()" ${cooldownEnd && Date.now() < cooldownEnd ? 'disabled' : ''}>Take Another Quiz</button>
      </div>
    </div>
  `;
}

function showCooldown(waitMs) {
  const quizContainer = document.querySelector('#quizSection .quiz-container');
  let minutes = Math.ceil(waitMs / 60000);
  quizContainer.innerHTML = `
    <div style='text-align:center;'>
      <h3 style='color:var(--danger);'>Cooldown Active</h3>
      <p>You must wait <strong>${minutes} minutes</strong> before retrying.</p>
      <button class='btn btn-primary' onclick='startBooster()'>Start Study Booster (Reduce cooldown)</button>
      <div style='margin-top:30px;'><button class='btn btn-secondary' onclick='showHome()'>Back to Home</button></div>
    </div>
  `;
}

function startBooster() {
  boosterActive = true;
  const quizContainer = document.querySelector('#quizSection .quiz-container');
  quizContainer.innerHTML = `
    <div style='text-align:center;'>
      <h3>Study Booster</h3>
      <p>Mini-lesson: What does <code>len([1,2,3])</code> return in Python?</p>
      <button class='btn btn-primary' onclick='completeBooster()'>It returns 3</button>
    </div>
  `;
}

function completeBooster() {
  boosterActive = false;
  if (cooldownEnd && Date.now() < cooldownEnd) {
    let remaining = cooldownEnd - Date.now();
    cooldownEnd = Date.now() + Math.floor(remaining / 2);
  }
  showQuizResults(userScore / quizQuestions.length * 100);
}

// Energy System
function refillEnergy() {
  const now = Date.now();
  const elapsed = now - lastEnergyRefill;
  const refillCount = Math.floor(elapsed / energyRefillInterval);
  if (refillCount > 0 && userEnergy < maxEnergy) {
    userEnergy = Math.min(maxEnergy, userEnergy + refillCount);
    lastEnergyRefill = now - (elapsed % energyRefillInterval);
    updateEnergyDisplay();
  }
}

function startEnergyTimer() {
  if (energyTimer) clearInterval(energyTimer);
  energyTimer = setInterval(refillEnergy, 60 * 1000);
}

function updateEnergyDisplay() {
  const energyPercentage = (userEnergy / maxEnergy) * 100;
  const energyFill = document.getElementById('energyFill');
  const energyText = document.getElementById('energyText');
  
  if (energyFill) energyFill.style.width = energyPercentage + '%';
  if (energyText) energyText.textContent = `${userEnergy}/${maxEnergy} Energy`;
}

// NFT display
function showNFTEarned(percentage) {
  showNFTs();
  let tier, tierColor, tierEmoji;
  if (percentage >= 95) { tier = 'Gold'; tierColor = 'var(--gold)'; tierEmoji = '🥇'; }
  else if (percentage >= 80) { tier = 'Silver'; tierColor = '#c0c0c0'; tierEmoji = '🥈'; }
  else { tier = 'Bronze'; tierColor = '#cd7f32'; tierEmoji = '🥉'; }
  
  const nftTier = document.getElementById('nftTier');
  const nftTitle = document.getElementById('nftTitle');
  const nftDescription = document.getElementById('nftDescription');
  const nftScore = document.getElementById('nftScore');
  const nftDisplay = document.getElementById('nftDisplay');
  
  if (nftTier) {
    nftTier.textContent = `${tierEmoji} ${tier} NFT`;
    nftTier.className = `nft-tier ${tier.toLowerCase()}`;
  }
  if (nftTitle) nftTitle.textContent = `Python ${tier} Master`;
  if (nftDescription) nftDescription.textContent = `A ${tier} NFT earned for ${percentage}% performance!`;
  if (nftScore) nftScore.textContent = `${percentage}%`;
  if (nftDisplay) nftDisplay.style.display = 'block';
}

// NFT Minting
function mintNFT() {
  const mintBtn = document.getElementById('mintBtn');
  const mintingProgress = document.getElementById('mintingProgress');
  const mintComplete = document.getElementById('mintComplete');
  
  if (mintBtn) mintBtn.style.display = 'none';
  if (mintingProgress) mintingProgress.style.display = 'block';
  
  const steps = [
    { progress: 20, text: 'Connecting to blockchain...' },
    { progress: 40, text: 'Validating transaction...' },
    { progress: 60, text: 'Creating NFT metadata...' },
    { progress: 80, text: 'Uploading to IPFS...' },
    { progress: 100, text: 'Finalizing mint...' }
  ];
  
  let currentStep = 0;
  const mintInterval = setInterval(() => {
    if (currentStep < steps.length) {
      const step = steps[currentStep];
      const mintProgressFill = document.getElementById('mintProgressFill');
      const mintStatus = document.getElementById('mintStatus');
      
      if (mintProgressFill) mintProgressFill.style.width = step.progress + '%';
      if (mintStatus) mintStatus.textContent = step.text;
      currentStep++;
    } else {
      clearInterval(mintInterval);
      setTimeout(() => {
        if (mintingProgress) mintingProgress.style.display = 'none';
        if (mintComplete) mintComplete.style.display = 'block';
      }, 1000);
    }
  }, 800);
}

// Course handlers
function startPythonCourse() { alert('Starting Python Course! Navigate to course content.'); }
function startDataScienceCourse() { alert('Starting Data Science Course! Navigate to course content.'); }
function startWebDevCourse() { alert('Starting Web Development Course! Navigate to course content.'); }

// Responsive utilities
function handleResize() {
  // Close mobile menu on resize to larger screen
  if (window.innerWidth > 992 && mobileMenuOpen) {
    closeMobileMenu();
  }
  
  // Adjust energy display position on mobile
  const energyDisplay = document.querySelector('.energy-display');
  if (energyDisplay) {
    if (window.innerWidth <= 992) {
      energyDisplay.style.position = 'relative';
      energyDisplay.style.top = 'auto';
      energyDisplay.style.right = 'auto';
    } else {
      energyDisplay.style.position = 'fixed';
      energyDisplay.style.top = '20px';
      energyDisplay.style.right = '20px';
    }
  }
}

// Touch and swipe support for mobile
let touchStartX = 0;
let touchStartY = 0;

function handleTouchStart(event) {
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
}

function handleTouchMove(event) {
  if (!touchStartX || !touchStartY) return;
  
  const touchEndX = event.touches[0].clientX;
  const touchEndY = event.touches[0].clientY;
  
  const diffX = touchStartX - touchEndX;
  const diffY = touchStartY - touchEndY;
  
  // Prevent horizontal scrolling on mobile
  if (Math.abs(diffX) > Math.abs(diffY)) {
    event.preventDefault();
  }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM loaded, initializing Learncade...');
  
  // Initialize energy system
  updateEnergyDisplay();
  startEnergyTimer();
  
  // Show home section
  showHome();
  
  // Hide final quiz nav initially
  const finalQuizNav = document.getElementById('finalQuizNav');
  if (finalQuizNav) finalQuizNav.style.display = 'none';
  
  // Setup mobile menu - simple and direct approach
  setupMobileMenu();
  
  // Add click outside listener
  document.addEventListener('click', handleClickOutside);
  
  // Add resize listener
  window.addEventListener('resize', handleResize);
  
  // Add touch support
  document.addEventListener('touchstart', handleTouchStart, { passive: false });
  document.addEventListener('touchmove', handleTouchMove, { passive: false });
  
  // Handle resize on load
  handleResize();
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Enhanced keyboard navigation
  document.addEventListener('keydown', function(event) {
    // Close mobile menu with Escape key
    if (event.key === 'Escape' && mobileMenuOpen) {
      closeMobileMenu();
    }
    
    // Navigate quiz with arrow keys
    if (event.target.closest('.quiz-container')) {
      if (event.key === 'ArrowLeft' && currentQuestion > 0) {
        previousQuestion();
      } else if (event.key === 'ArrowRight' && currentQuestion < quizQuestions.length - 1) {
        nextQuestion();
      }
    }
  });
});

// Simple mobile menu setup function
function setupMobileMenu() {
  console.log('Setting up mobile menu...');
  
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  
  console.log('Mobile menu button found:', mobileMenuBtn);
  console.log('Nav links found:', navLinks);
  
  if (mobileMenuBtn && navLinks) {
    // Add click event listener
    mobileMenuBtn.addEventListener('click', function(event) {
      event.preventDefault();
      event.stopPropagation();
      console.log('Mobile menu button clicked!');
      toggleMobileMenu();
    });
    
    // Add click listeners to nav links to close menu when navigating
    navLinks.addEventListener('click', function(event) {
      if (event.target.tagName === 'A') {
        console.log('Nav link clicked, closing menu');
        closeMobileMenu();
      }
    });
    
    console.log('Mobile menu setup complete!');
  } else {
    console.error('Mobile menu elements not found!');
  }
}