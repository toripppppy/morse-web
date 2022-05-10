const gameScreen = document.getElementById('screen');
const langButton = document.getElementById('lang-button')
const timeButton = document.getElementById('time-button')
const rangeButton = document.getElementById('range-button')
const helpButton = document.getElementById('help-button')
const timeArea = document.createElement('p');
const scoreArea = document.createElement('p');
const questionArea = document.createElement('div');
const answerArea = document.createElement('div');
const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

gameScreen.addEventListener('click', start);

const mnja = ['mmnmm', 'nm', 'nnm', 'mnmmm', 'nmnnn', 'nmnn', 'mnmnn', 'nnnm', 'mnmm', 'mmmm', 'mnmnm', 'mmnmn', 'mmmnm', 'nmmmn', 'mmmn', 'mn', 'nnmn', 'nmmn', 'nmnmm', 'nnmnn', 'nmn', 'mnmn', 'nnnn', 'mmnm', 'nnmm', 'mnnn', 'mmnnm', 'mmnn', 'n', 'mnn', 'mnnm', 'nnmnm', 'm', 'mnnnm', 'mnnmn', 'nmm', 'mnnmm', 'mm', 'nnn', 'mmn', 'mnmmn', 'mmm', 'nmnm', 'mnm', 'nmmm', 'nmnmn'],
    ja = ['あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け', 'こ', 'さ', 'し', 'す', 'せ', 'そ', 'た', 'ち', 'つ', 'て', 'と', 'な', 'に', 'ぬ', 'ね', 'の', 'は', 'ひ', 'ふ', 'へ', 'ほ', 'ま', 'み', 'む', 'め', 'も', 'や', 'ゆ', 'よ', 'ら', 'り', 'る', 'れ', 'ろ', 'わ', 'を', 'ん'],
    mnen = ['nm', 'mnnn', 'mnmn', 'mnn', 'n', 'nnmn', 'mmn', 'nnnn', 'nn', 'nmmm', 'mnm', 'nmnn', 'mm', 'mn', 'mmm', 'nmmn', 'mmnm', 'nmn', 'nnn', 'm', 'nnm', 'nnnm', 'nmm', 'mnnm', 'mnmm', 'mmnn'],
    en = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

let lang = {
    def: ja,
    mn: mnja,
}

let game = {
    time: 30,
    score: 0,
}

let Q = null;
let A = null;

langButton.onclick = () => { //言語設定
    if (lang.def === ja) {
        lang.def = en;
        lang.mn = mnen;
        langButton.innerText = '言語設定: 英文';
    } else {
        lang.def = ja;
        lang.mn = mnja;
        langButton.innerText = '言語設定: 和文';
    }
}

timeButton.onclick = () => { //制限時間設定
    if (game.time < 300) {
        game.time += 30;
    } else {
        game.time = 30;
    }
    timeButton.innerText = `制限時間: ${game.time}s`;
}

rangeButton.onclick = () => {
    range = window.prompt("出題する範囲を指定してください。\n<例> あ-お, A-G", "")
    if (range != null) {
        lang.def = lang.def.slice( lang.def.indexOf(range.slice(0, 1)), lang.def.indexOf(range.slice(-1)) + 1 );
    }
}

helpButton.onclick = () => {
    location.href = 'helptxt.html'
}

//キーを押したときの処理 m,n:mn入力 左矢印:スキップ 右矢印:正誤判定
let answer = '';
function keydownEvent(e) {
    let add = '';
    switch (e.key) {
        case 'm':
            add = 'm';
            break;
        case 'n':
            add = 'n';
            break;
        case 'ArrowLeft':
            makeQ();
            break;
        case 'ArrowRight':
            if (answer === A) {
                correct();
            } else {
                console.log(`ちゃう　answer:${answer} A:${A}`);
            }
            answer = '';
            break;
    }
    if (answer.length < 5) {
        answer += add;
    }
    answerArea.innerHTML = toMorse(answer);
};

function makeQ() { //Q&Aを生成
    Q = lang.def[Math.floor(Math.random() * lang.def.length)];
    A = lang.mn[lang.def.indexOf(Q)];
    questionArea.innerText = Q;
}

function toMorse(mn) { //mnを表示用に変換
    let result = mn;
    result = result.replaceAll('n', '・');
    result = result.replaceAll('m', 'ー');
    return(result);
}

function gameLoad() {
    gameScreen.innerHTML = '<div id="score"></div>';
    
    timeArea.innerText = timeArea.innerText + '■■■■■■■■■■■■■■■';
    timeArea.setAttribute('id', 'time-area');
    document.getElementById('score').appendChild(timeArea);

    scoreArea.innerText = 'score: 0'
    scoreArea.setAttribute('id', 'score-area');
    document.getElementById('score').appendChild(scoreArea);

    questionArea.innerHTML = '<p>あ</p>';
    questionArea.setAttribute('id', 'question-area');
    gameScreen.appendChild(questionArea);

    answerArea.setAttribute('id', 'answer-area');
    gameScreen.appendChild(answerArea);

    document.addEventListener('keydown', keydownEvent);
    makeQ();
}

async function start() {
    gameScreen.removeEventListener('click', start);
    const buttons = document.getElementsByClassName('button')
    for (let i = 0; i < buttons.length; i++) { //ボタン無効化
        buttons[i].setAttribute('disabled','disabled');
    }

    for (let i = 3; i > 0; i--) { //カウントダウン
        document.getElementById('start-header').innerText = i;
        await _sleep(1000);
    }
    gameLoad();

    let fixedTime = game.time;
    let timerId;
    timerId = setInterval(function() { //タイマースタート
        game.time--;
        if (game.time % (fixedTime / 15) === 0) {
            timeArea.innerText = timeArea.innerText.slice(0, -1);
        }
        if (game.time === 0) {
            clearInterval(timerId);
            stop();
        }
    }, 1000);
}

async function correct() {
    answerArea.style.color = '#15ff00';
    _sleep(300)
    answerArea.style.color = '#ffffff';
    console.log('正解！');
    game.score += 1;
    scoreArea.innerText = `score: ${game.score}`;
    makeQ();
}

function stop() {
    document.removeEventListener('keydown', keydownEvent);
    gameScreen.innerHTML = `<div id="question-area">score: ${game.score}</div>`;
    questionArea.innerHTML = `<p>score: ${game.score}</p>`;
    document.getElementById('question-area').style.paddingTop = "180px";

    const retryButton = document.createElement('button');
    retryButton.innerText = 'リトライ'
    retryButton.setAttribute('class', 'button');
    retryButton.setAttribute('id', 'retry-button');
    gameScreen.appendChild(retryButton);

    retryButton.onclick = () => {
        window.location.reload();
    }
}