const questionDivided = document.getElementById("question-area");
const scoreArea = document.getElementById("score-area");
const timeArea = document.getElementById("time-area");
const langButton = document.getElementById("lang-button");
const timeButton = document.getElementById("time-button");
const rangeInput = document.getElementById("range-input");
const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const screen = document.getElementById("screen");

let Q = null;
let A = null;
let score = 0;
let time = 30; //制限時間
let timebar = timeArea.innerText;
screen.addEventListener("click", start);

//mn <=> lang 翻訳用
const mnja = ["mmnmm","nm","nnm","mnmmm","nmnnn","nmnn","mnmnn","nnnm","mnmm","mmmm","mnmnm","mmnmn","mmmnm","nmmmn","mmmn","mn","nnmn","nmmn","nmnmm","nnmnn","nmn","mnmn","nnnn","mmnm","nnmm","mnnn","mmnnm","mmnn","n","mnn","mnnm","nnmnm","m","mnnnm","mnnmn","nmm","mnnmm","mm","nnn","mmn","mnmmn","mmm","nmnm","mnm","nmmm","nmnmn"];
const ja = ["あ","い","う","え","お","か","き","く","け","こ","さ","し","す","せ","そ","た","ち","つ","て","と","な","に","ぬ","ね","の","は","ひ","ふ","へ","ほ","ま","み","む","め","も","や","ゆ","よ","ら","り","る","れ","ろ","わ","を","ん"];
const mnen = ["nm","mnnn","mnmn","mnn","n","nnmn","mmn","nnnn","nn","nmmm","mnm","nmnn","mm","mn","mmm","nmmn","mmnm","nmn","nnn","m","nnm","nnnm","nmm","mnnm","mnmm","mmnn"];
const en = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

//lang = 指定の言語に設定
let lang = ja;
let mnlang = mnja;

langButton.onclick = () => { //言語設定
    if (lang === ja) {
        lang = en;
        mnlang = mnen;
        langButton.innerText = "言語設定: 英文";
    } else if (lang === en) {
        lang = ja;
        mnlang = mnja;
        langButton.innerText = "言語設定: 和文";
    }
}

timeButton.onclick = () => { //制限時間設定
    if (time < 300) {
        time += 30;
    } else {
        time = 30;
    }
    timeButton.innerText = `制限時間: ${time}s`;
}

//キーを押したときの処理 m,n:mn入力 左矢印:スキップ 右矢印:正誤判定
let answer = "";
function keydownEvent(e) {
    let add = "";
    switch (e.key) {
        case "m":
            add = "m";
            break;
        case "n":
            add = "n";
            break;
        case "ArrowLeft":
            makeQ();
            break;
        case "ArrowRight":
            if (answer === A) {
                console.log("正解！");
                score += 1;
                scoreArea.innerText = `score: ${score}`;
                makeQ();
            } else {
                console.log(`ちゃう　answer:${answer} A:${A}`);
            }
            answer = "";
            break;
    }
    if (answerArea.innerText.length < 5) {
        answer += add;
    }
    answerArea.innerText = toMorse(answer);
};

//question表示エリア作成
const questionArea = document.createElement("h1");
questionArea.innerText = "Click to Start";
questionArea.setAttribute("class", "question-area");
questionDivided.appendChild(questionArea);

//answer表示エリア作成
const answerArea = document.createElement("h2");
answerArea.setAttribute("class", "answer-area");
questionDivided.appendChild(answerArea);

//result表示エリア作成
const resultArea = document.createElement("div");
resultArea.setAttribute("class", "result-area");
questionDivided.appendChild(resultArea);

//リトライボタン作成
const retryButton = document.createElement("button");
retryButton.innerText = "リトライ";
retryButton.setAttribute("class", "retry-button");
resultArea.appendChild(retryButton);
retryButton.style.visibility = 'hidden';

retryButton.onclick = () => {
    retry();
}

function makeQ() { //Q&Aを生成
    Q = lang[Math.floor(Math.random() * lang.length)];
    A = mnlang[lang.indexOf(Q)];
    questionArea.innerText = Q;
}

function toMorse(mn) { //mnを表示用に変換
    let result = mn;
    result = result.replaceAll("n", "・");
    result = result.replaceAll("m", "ー");
    return(result);
}

function rangeSet() {
    let range = rangeInput.value;
    if (range != "") {
        lang = lang.slice( lang.indexOf(range.slice(0, 1)), lang.indexOf(range.slice(-1)) + 1 );
        console.log(lang);
    }
}

async function start() {
    langButton.disabled = true
    timeButton.disabled = true
    rangeInput.disabled = true
    rangeSet();
    screen.removeEventListener("click", start);
    questionArea.style.color = "#ffffff";
    for (let i = 3; i > 0; i--) { //カウントダウン
        questionArea.innerText = i;
        await _sleep(1000);
    }
    console.log("start!");
    screen.style.background = "#001032";
    questionArea.style.fontWeight = "Bold";
    questionArea.style.marginTop = "100px"
    scoreArea.innerText = "score: 0"
        timeArea.innerText = timeArea.innerText + "■■■■■■■■■■■■■■■";
    document.addEventListener("keydown", keydownEvent);
    makeQ();
    let fixedTime = time;
    let timerId;
    timerId = setInterval(function() { //タイマースタート
        time--;
        console.log(time);
        if (time % (fixedTime / 15) === 0) {
            timeArea.innerText = timeArea.innerText.slice(0, -1);
        }
        if (time === 0) {
            clearInterval(timerId);
            sokomade();
        }
    }, 1000);
}

function sokomade() {
    document.removeEventListener("keydown", keydownEvent); //入力無効化
    scoreArea.innerText = "";
    questionArea.style.margin = "0px";
    answerArea.style.marginTop = "0px";
    questionArea.style.marginTop = "150px";

    questionArea.innerText = `score: ${score}`;
    retryButton.style.visibility = "visible";

    //ツイートボタン作成
const anchor = document.createElement('a');
const hrefValue = "https://twitter.com/intent/tweet?button_hashtag=" + encodeURIComponent("モールス通信web") + "&ref_src=twsrc%5Etfw";
anchor.setAttribute('href', hrefValue);
anchor.setAttribute('class', 'twitter-hashtag-button');
anchor.setAttribute('data-text', `モールス通信webで${score}点獲得！`);
anchor.innerText = 'Tweet #モールス通信web';
answerArea.appendChild(anchor);

const script = document.createElement('script');
script.setAttribute('src', 'https://platform.twitter.com/widgets.js');
answerArea.appendChild(script);
}

function retry() {
    window.location.reload();
    retryButton.style.visibility = 'hidden';
}
