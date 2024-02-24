/*
 * This script contains functionality for a light-dark theme toggle and a simple calculator.
 * Light-Dark Theme:
 * - Toggles the appearance of the theme by clicking on a designated element.
 * - Accessibility: Allows toggling by pressing the "Enter" key when focused on the toggle element.
 *
 * Calculator Logic:
 * - Handles basic calculator operations (addition, subtraction, multiplication, division).
 * - Allows input of numbers and operators via mouse click or keyboard input.
 * - Provides functionality for reset, delete, and execution of operations.

Author: Mahmoud Khalil
Date: 21-02-2024
*/

// Light-Dark Theme
const toggleElement = document.querySelector(".themes__toggle");

const toggleDarkTheme = () => {
    toggleElement.classList.toggle('themes__toggle--isActive');
};

const toggleDarkThemeAccessibility = (event) => {
    if (event.key === 'Enter')
        toggleDarkTheme();
};

toggleElement.addEventListener('click', toggleDarkTheme);
toggleElement.addEventListener('keydown', toggleDarkThemeAccessibility);

// Calculator Logic
let storedNumber = '';
let currentNumber = '';
let operation = '';

const resultElement = document.querySelector('.calc__result');
const keyElements = document.querySelectorAll('[data-type]')

const updateResult = (value) => {
    resultElement.innerHTML = !value? '0' : value;
};

const numberButtonHandler = (value) => {
    if (value === '0' && currentNumber === '0') return;
    if (value === '.' && currentNumber.includes('.')) return;
    if (!operation) storedNumber = '';                           // to reset after pressing equal

    currentNumber += value;
    updateResult(currentNumber);
}

const resetButtonHandler = () => {
    storedNumber = '';
    currentNumber = '';
    operation = '';
    updateResult(currentNumber);  
}

const deleteButtonHandler = () => {
    if (!currentNumber || currentNumber === '0') return;
    currentNumber = currentNumber.slice(0, -1);
    updateResult(currentNumber);
}

const doMath = () => {
    switch (operation){
        case '+':
            return (parseFloat(storedNumber) + parseFloat(currentNumber));
        case '-':
            return (parseFloat(storedNumber) - parseFloat(currentNumber));
        case '*':
            return (parseFloat(storedNumber) * parseFloat(currentNumber));
        case '/':
            if (currentNumber === '0') return 'Infinite';
            return (parseFloat(storedNumber) / parseFloat (currentNumber));
        default:
            throw new Error('Invalid operation');
        }
}

const executeHandler = (condition) => {
    if (currentNumber && storedNumber && operation) {
        storedNumber = String(doMath());
        updateResult(storedNumber);
        currentNumber ='';
    }
    if (condition === 'handle equal') {                 // to reset after pressing equal
        currentNumber = '';
        operation = '';
    }
}

const operationButtonsHandler = (operationValue) => {
    if (!currentNumber && !storedNumber) return;

    if (currentNumber && storedNumber) executeHandler('handle operation');

    if (currentNumber && !storedNumber) {
        storedNumber = currentNumber;
        currentNumber = '';
    }
    operation = operationValue;
}


const operationHandler = (button) => {
    switch (button) {
        case 'c':
            resetButtonHandler();
            break;
        case 'Backspace':
            deleteButtonHandler();
            break;
        case 'Enter':
            executeHandler('handle equal');
            break;
        case '+':
        case '-':
        case '*':
        case '/':
            operationButtonsHandler(button);
            break;
        default:
            break;
    }
}

const onClickHandler = (element) => {
    const type = element.dataset.type;
    const value = element.dataset.value;

    if (type === 'number') {
        numberButtonHandler(value);
    }
    else if (type === 'operation') {
        operationHandler(value);
    }
}

const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
const operations = ['-', '+', '*', '/', 'Enter', 'Backspace', 'c'];
const keys = [...numbers, ...operations];

const keyboardHandler = (key) => {
    // if (numbers.includes(key)) numberHandler(key);
    // else if (operations.includes(key)) operationHandler(key);
    if (keys.includes(key)) {
        const element = document.querySelector(`[data-value="${key}"]`);
        
        element.classList.add('hover');
        element.click();
        setTimeout(() => element.classList.remove('hover'), 300);
    }
}

keyElements.forEach((element) => {
    element.addEventListener('click', () => onClickHandler(element));
});

window.addEventListener('keydown', (event) => keyboardHandler(event.key));