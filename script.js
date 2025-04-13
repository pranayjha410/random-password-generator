const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#number");
const symbolCheck = document.querySelector("#symbol");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allcheckBox = document.querySelectorAll("input[type=checkbox]");

let password = "";
let passwordLength = 8;
let checkCount = 0;
handleSlider();
//set color of circle grey
setIndicator("#ccc");

//set password length
function handleSlider() {
  inputSlider.value = passwordLength; //deals slide
  lengthDisplay.innerText = passwordLength; //deals with display value of slide

    // Ensure min and max are numbers
    const min = Number(inputSlider.min);
    const max = Number(inputSlider.max);

    // Calculate the percentage fill
    const percent = ((passwordLength - min) * 100) / (max - min);

    // Update the slider track color using `linear-gradient`
    inputSlider.style.background = `linear-gradient(to right, #0077b6 ${percent}%, #ccc ${percent}%)`;
}

//set indicator
function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomNumber() {
  return getRndInteger(0, 9);
}

function generateLowerCase() {
  return String.fromCharCode(getRndInteger(97, 122));
}

function generateUpperCase() {
  return String.fromCharCode(getRndInteger(65, 90));
}

function generateSymbol() {
  // Randomly choose a range for common symbols excluding digits
  let randomChoice = getRndInteger(0, 3); // Randomly select one of the three ranges

  if (randomChoice === 0) {
    // Symbols like `!`, `"`, `#`, `$`, etc. (ASCII 33 to 47)
    return String.fromCharCode(getRndInteger(33, 47));
  } else if (randomChoice === 1) {
    // Symbols like `:`, `;`, `<`, `=`, `>`, `?`, `@` (ASCII 58 to 64)
    return String.fromCharCode(getRndInteger(58, 64));
  } else if (randomChoice === 2) {
    // Symbols like `[`, `\`, `]`, `^`, `_`, `,` (ASCII 91 to 96)
    return String.fromCharCode(getRndInteger(91, 96));
  } else {
    // Symbols like `{`, `|`, `}`, `~` (ASCII 123 to 126)
    return String.fromCharCode(getRndInteger(123, 126));
  }
}

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;

  //if box is checked
  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numberCheck.checked) hasNum = true;
  if (symbolCheck.checked) hasSym = true;

  if (hasUpper && hasLower && hasNum && hasSym && passwordLength >= 6) {
    setIndicator("#0f0");
  } else if ((hasLower || hasUpper) && (hasNum || hasSym)) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "copied";
  } catch (e) {
    copyMsg.innerText = "failed";
  }
  //span visible
  copyMsg.classList.add("active");

  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) {
    copyContent();
  }
});

function shufflePassword(array) {
  //fisher yates method
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

function handleCheckBoxChange() {
  checkCount = 0;
  allcheckBox.forEach((checkbox) => {
    if (checkbox.checked) checkCount++;
  });

  //edge case
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}

allcheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

generateBtn.addEventListener("click", () => {
  //if none of check box is not checked
  if (checkCount <= 0) return;

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
  console.log("startign ");
  //remove old password
  password = "";
  let funcArr = [];
  //check which are checked
  if (uppercaseCheck.checked) {
    funcArr.push(generateUpperCase);
  }
  if (lowercaseCheck.checked) {
    funcArr.push(generateLowerCase);
  }
  if (numberCheck.checked) {
    funcArr.push(generateRandomNumber);
  }
  if (symbolCheck.checked) {
    funcArr.push(generateSymbol);
  }

  //complusory addition
  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }
  console.log("complusory done");

  //remaining element
  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let randIndex = getRndInteger(0, funcArr.length - 1);
    password += funcArr[randIndex]();
  }
  console.log("remaingin done ");

  //shuffle the password
  password = shufflePassword(Array.from(password));
  console.log("shuffling done ");
  //show in UI
  passwordDisplay.value = password;
  console.log("UI addition is done ");
  //cal strenth
  calcStrength();
});
