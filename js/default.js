import BLOCKS from "./block.js";

//DOM
const playBg =document.querySelector('.play_bg > ul');
const gameText = document.querySelector('.game_text');
const scoreDisplay = document.querySelector('.score');
const restarButton = document.querySelector('.game_text > button');

//setting
const GAME_ROWS =15;
const GAME_COLS =10;

//variables
let score =0;
let duration = 500;
let downInterval;
let tempMovingItem;

const moveimgItem={
    type:'',
    direction:3,
    top:0,
    left:0,
}
init()

function init(){
    tempMovingItem={...moveimgItem};

    for(let i=0; i<GAME_ROWS; i++ ){
        prependNewLine()
    }
    generateNewBlock()
}
function prependNewLine(){
    const li = document.createElement('li');
    const ul = document.createElement('ul');

    for(let j=0; j < GAME_COLS; j++){
        const matrix = document.createElement('li');
        ul.prepend(matrix);
    }
    li.prepend(ul)
    playBg.prepend(li)
}
function readerBlocks(moveType = ''){
    const { type, direction, top, left } = tempMovingItem;
    const movinBlocks = document.querySelectorAll('.moving');
    movinBlocks.forEach(moving=>{
        moving.classList.remove(type,'moving');
    });
    BLOCKS[type][direction].some(block =>{
        const x = block[0] +left;
        const y = block[1] + top;
        const target = playBg.childNodes[y] ? playBg.childNodes[y].childNodes[0].childNodes[x] : null;
        const isAvailabel = checkEmpty(target);
        if(isAvailabel){
            target.classList.add(type, 'moving');
        }else{
            tempMovingItem={...moveimgItem}
            if(moveType ==='retry'){
                clearInterval(downInterval);
                showGameoverText();
            }
            setTimeout(()=>{
                readerBlocks('retry')
                if(moveType === 'top'){
                    seizeBlock();
                }
            },0);
            return true;
        }
    });
    moveimgItem.left=left;
    moveimgItem.top=top;
    moveimgItem.direction =direction;
}
function seizeBlock(){
    const movinBlocks = document.querySelectorAll('.moving');
    movinBlocks.forEach(moving =>{
        moving.classList.remove('moving');
        moving.classList.add('seized');
    });
    checkMath();
}
function checkMath(){
    const childNodes = playBg.childNodes;
    childNodes.forEach(child=>{
        let matched = true;
        child.children[0].childNodes.forEach(li =>{
            if(!li.classList.contains('seized')){
                matched =false;
            }
        });
        if(matched){
            child.remove();
            prependNewLine()
            score++;
            scoreDisplay.innerHTML =score;
        }
    });
    generateNewBlock();
}
function generateNewBlock(){
    clearInterval(downInterval);
    downInterval = setInterval(()=>{
        moveBlock('top',1)
    },duration);

    const blockArray = Object.entries(BLOCKS);
    const randomIndex = Math.floor(Math.random() * blockArray.length);
    moveimgItem.type=blockArray[randomIndex][0];
    moveimgItem.top=0;
    moveimgItem.left=3;
    moveimgItem.direction =0;
    tempMovingItem={...moveimgItem};
    readerBlocks()
}
function checkEmpty(target){
    if(!target || target.classList.contains('seized')){
        return false;
    }
    return true;
}
function moveBlock(moveType, amount){
    tempMovingItem[moveType] += amount;
    readerBlocks(moveType)
}
function changeDirection(){
    const direction = tempMovingItem.direction;
    direction === 3 ? tempMovingItem.direction = 0 : tempMovingItem.direction += 1;
    readerBlocks()
}
function dropBlock(){
    clearInterval(downInterval);
    downInterval =setInterval(()=>{
        moveBlock('top',1);
    },10);
}
function showGameoverText(){
    gameText.style.display = "flex";
}

//event handling
document.addEventListener('keydown', e =>{
    switch(e.keyCode){
        case 39:
            moveBlock('left', 1);
            break;
        case 37:
            moveBlock('left',-1);
            break;
        case 40:
            moveBlock('top',1);
            break;
        case 38:
            changeDirection();
            break;
        case 32:
            dropBlock();
            break;
        default:
            break;
    }
});

restarButton.addEventListener('click',()=>{
    playBg.innerHTML ='';
    gameText.style.display ='none';
    init();
});