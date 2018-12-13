(function mainIIFE(){
    let canvas = document.body.querySelector("canvas");
    let ctx = canvas.getContext("2d");
    
    canvas.width = 0.55 * screen.width;
    canvas.height = canvas.width;
    let CW = canvas.width;
    let CH = canvas.height;
    
    canvas.style.left = (screen.width / 2) - (CW / 2) + "px";
    canvas.style.top = (screen.height / 2) - (CH / 2) + "px";
    let offSetTop = canvas.offsetTop;
    let offSetLeft = canvas.offsetLeft;
    
    let size, difficulty;
    let lastSqr = 0;
    let repeat = false;
    
    let clear = document.body.querySelector("#clear");
    let newQuiz = document.body.querySelector("#new");
    let hint = document.body.querySelector("#hint");
    let solve = document.body.querySelector("#solve");
    let buttonArr = document.body.querySelectorAll("span");
    
    let buttonWidth = 300;
    let buttonHeight = 100;
    
    for(let button of buttonArr){
        button.style.width = buttonWidth + "px";
        button.style.height = buttonHeight + "px";
        button.style.lineHeight = buttonHeight + "px";
    }
    
    clear.style.top = 0.3 * screen.height + "px";
    clear.style.left = buttonWidth / 12 + "px";
    
    newQuiz.style.top = 0.6 * screen.height + "px";
    newQuiz.style.left = buttonWidth / 12 + "px";
    
    hint.style.top = 0.3 * screen.height + "px";
    hint.style.right = buttonWidth / 12 + "px";
    
    solve.style.top = 0.6 * screen.height + "px";
    solve.style.right = buttonWidth / 12 + "px";
    
    function promptSize() {
        let sizePrompt = prompt("Please choose the size of the board (3x3, 5x5, 7x7): ");
        evaluatePromptSize(sizePrompt);
    }
    
    function evaluatePromptSize(sizePrompt) {
        if ([3, 5, 7].includes(parseInt(sizePrompt))) {
            size = parseInt(sizePrompt);
            createBoard();
        } else {
            alert("Please enter either 3, 5 or 7.");
            promptSize();
        }
    }
    
    function promptDiff() {
        let diffprompt = prompt("Please choose your difficulty (1, 2, 3)");
        evaluatePromptDiff(diffprompt);
    }
    
    function evaluatePromptDiff(diffprompt) {
        if ([1, 2, 3].includes(parseInt(diffprompt))) {
            difficulty = parseInt(diffprompt);
        } else {
            alert("Please enter either 1, 2, or 3");
            promptDiff();
        }
    }
    
    
    
    function createBoard() {
        for (let counter = 0; counter < (size * 3); counter++) {
            for (let counter2 = 0; counter2 < (size * 3); counter2++) {
                squareArr.push(new Square(counter2 / (size * 3) * CW, counter / (size * 3) * CH, counter, counter2, CW / (size * 3), CH / (size * 3)));
            }
        }
        for (let sqr of squareArr) {
            sqr.setBigSqr();
        }
    }
    
    function shuffleArr(array) {
        let currentIndex = array.length, temporaryValue, randomIndex;
    
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }
    
    let sqrArrCounter = 0;
    
    function createSolution() {
        let initArr = [];
        let initArrCounter = 0;
    
        for (let counter = 1; counter < size * 3 + 1; counter++) {
            initArr.push(counter);
        }
        initArr = shuffleArr(initArr);
    
        for (let num of initArr) {
            squareArr[sqrArrCounter].changeCorrectNum(initArr[initArrCounter]);
            initArrCounter++; sqrArrCounter++;
        }
    
        for (let counter = 0; counter < size; counter++) {
    
            if (counter != 0) {
                initArr.push(initArr[0]);
                initArr.splice(0, 1);
    
                initArrCounter = 0;
    
                for (let num of initArr) {
                    if (sqrArrCounter >= Math.pow(size * 3, 2)) {
                        return false;
                    }
                    squareArr[sqrArrCounter].changeCorrectNum(initArr[initArrCounter]);
                    initArrCounter++; sqrArrCounter++;
                }
            }
    
            for (let counter2 = 0; counter2 < size - 1; counter2++) {
                for (let counter3 = 0; counter3 < 3; counter3++) {
                    initArr.push(initArr[0]);
                    initArr.splice(0, 1);
                }
    
                initArrCounter = 0;
                for (let num of initArr) {
                    squareArr[sqrArrCounter].changeCorrectNum(initArr[initArrCounter]);
                    initArrCounter++; sqrArrCounter++;
                }
            }
        }
    }
    function setQuiz(){
        let numArr = [];
        let currentNum;
        for(let counter = 0; counter < Math.floor(50 / difficulty * size / 3); counter++){
            do{
                currentNum = Math.floor(Math.random() * (squareArr.length - 1));
            }while(numArr.includes(currentNum));
            numArr.push(currentNum);
        }
        for(let num of numArr){
            squareArr[num].fixVal();
        }
    }
    
    function checkValid(sqrIndex){
        for(let square of squareArr){
            if((square.getAllVals()[2] == squareArr[sqrIndex].getAllVals()[2] || square.getAllVals()[3] == squareArr[sqrIndex].getAllVals()[3] || (square.getAllVals()[6] == squareArr[sqrIndex].getAllVals()[6] && square.getAllVals()[7] == squareArr[sqrIndex].getAllVals()[7])) && square != squareArr[sqrIndex]){
                if(square.getAllVals()[8] == squareArr[sqrIndex].getAllVals()[8] && squareArr[sqrIndex].getAllVals()[8] != null && square.getAllVals()[11]){
                    squareArr[sqrIndex].changeBorder("red");
                }
            }
        }
    }
    
    function check4win(){
        for(let square of squareArr){
            if(square.getAllVals()[8] == null){
                return false;
            }
        }
    
        for(let square of squareArr){
            for(let square2 of squareArr){
                if((square2.getAllVals()[2] == square.getAllVals()[2] || square2.getAllVals()[3] == square.getAllVals()[3] || (square2.getAllVals()[6] == square.getAllVals()[6] && square2.getAllVals()[7] == square.getAllVals()[7])) && square != square2){
                    if(square2.getAllVals()[8] == square.getAllVals()[8] && square.getAllVals()[8] != null && square2.getAllVals()[11]){
                        return false;
                    }
                }
            }
        }
    
        return true;
    }
    
    class Square {
        constructor(posX, posY, row, col, width, height) {
            let _posX = posX;
            let _posY = posY;
            let _row = row;
            let _col = col;
            let _width = width;
            let _height = height;
            let _squareRow;
            let _squareCol;
            let _counter = 1;
            let _number = null;
            let _correctNum = null;
            let _borderClr = "transparent";
            let _fillClr = "gray";
            let _fixed = false;
            let _validNums = []
    
            this.getCol = function () {
                return _col;
            }
            this.getRow = function () {
                return _row;
            }
            this.getAllVals = function () {
                return [_posX, _posY, _row, _col, _width, _height, _squareRow, _squareCol, _number, _correctNum, _borderClr, _fixed, _validNums];
            }
            this.changeBorder = function (arg) {
                _borderClr = arg;
            }
            this.changeCorrectNum = function(arg){
                _correctNum = arg;
            }
            this.changeNum = function(arg){
                _number = arg;
            }
            this.convertNum2Correct = function(){
                _number = _correctNum;
            }
            this.fixVal = function () {
                _fixed = true;
                _number = _correctNum;
            }
            this.reset = function(){
                _fixed = false;
                _correctNum = null;
                _number = null;
                _borderClr = "transparent";
            }
            this.setBigSqr = function () {
                if (_row < 3) {
                    _squareRow = 0;
                } else if (_row < 6) {
                    _squareRow = 1;
                } else if (_row < 9) {
                    _squareRow = 2;
                }
                if (_col < 3) {
                    _squareCol = 0;
                } else if (_col < 6) {
                    _squareCol = 1;
                } else if (_col < 9) {
                    _squareCol = 2;
                }
            }
    
            this.drawNum = function () {
                if(_fixed){
                    ctx.save();
                    ctx.translate(_posX, _posY);
                    ctx.fillStyle = _fillClr;
                    ctx.lineWidth = 5;
                    ctx.fillRect(0, 0, _width, _height);
                    ctx.restore();
                }
    
                ctx.save();
                ctx.translate(_posX + (_width / 2), _posY + (_height / 4 * 3));
                ctx.textAlign = "center";
                ctx.font = `${CW / (size * 4)}px calibri`;
                if (_number != null) {
                    ctx.fillText(JSON.stringify(_number), 0, 0);
                }
                ctx.restore();
    
                ctx.save();
                ctx.translate(_posX, _posY);
                ctx.strokeStyle = _borderClr;
                ctx.lineWidth = 5;
                ctx.strokeRect(0, 0, _width, _height);
                ctx.restore();
            }
    
            this.incrementNum = function () {
                if (_number == null) {
                    _number = 1;
                } else {
                    if (_number == size * 3) {
                        _number = 1;
                    } else {
                        _number++;
                    }
                }
            }
        }
    }
    let squareArr = [];
    function drawBoard() {
        for (let counter = 1; counter < (size * 3) + 1; counter++) {
            ctx.save();
            ctx.translate(CW / (size * 3) * counter, 0);
            ctx.fillRect(0, 0, 1, CH);
            ctx.restore();
    
            ctx.save();
            ctx.translate(0, CH / (size * 3) * counter);
            ctx.fillRect(0, 0, CW, 1);
            ctx.restore();
        }
        for (let counter = 1; counter < size; counter++) {
            ctx.save();
            ctx.translate((CW / size * counter) - 5, 0);
            ctx.fillRect(0, 0, 40 / size, CH);
            ctx.restore();
    
            ctx.save();
            ctx.translate(0, (CH / size * counter) - 5);
            ctx.fillRect(0, 0, CH, 40 / size);
            ctx.restore();
        }
    }
    
    function draw() {
        ctx.clearRect(0, 0, CW, CH);
        for (let sqr of squareArr) {
            sqr.drawNum();
        }
        drawBoard();
    }
    promptSize();
    promptDiff();
    createSolution();
    setQuiz();
    draw();
    
    function clickHandler(e) {
        evaluateClick(e.clientX, e.clientY)
    }
    
    function evaluateClick(posX, posY) {
        for (let sqr of squareArr) {
            if (posX - offSetLeft > sqr.getAllVals()[0] && posX - offSetLeft < sqr.getAllVals()[0] + sqr.getAllVals()[4]) {
                if (posY - offSetTop > sqr.getAllVals()[1] && posY - offSetTop < sqr.getAllVals()[1] + sqr.getAllVals()[5]) {
                    if (!sqr.getAllVals()[11]) {
                        squareArr[lastSqr].changeBorder("transparent");
                        checkValid(lastSqr);
                        sqr.incrementNum();
                        sqr.changeBorder("green");
                        lastSqr = squareArr.indexOf(sqr);
                        draw();
                        if (check4win()) {
                            alert("you have cracked the puzzle!");
                        }
                    }
                }
            }
        }
    }
    
    function rClickHandler(e) {
        evalRClick(e.clientX, e.clientY);
        return false;
    }
    function evalRClick(posX, posY) {
        for (let sqr of squareArr) {
            if (posX - offSetLeft > sqr.getAllVals()[0] && posX - offSetLeft < sqr.getAllVals()[0] + sqr.getAllVals()[4]) {
                if (posY - offSetTop > sqr.getAllVals()[1] && posY - offSetTop < sqr.getAllVals()[1] + sqr.getAllVals()[5]) {
                    if (!sqr.getAllVals()[11]) {
                        sqr.changeBorder("transparent");
                        sqr.changeNum(null);
                        lastSqr = squareArr.indexOf(sqr);
                        draw();
                    }
                }
            }
        }
    }
    
    function hintHandler(){
        let currNum, noMore;
        do {
            noMore = true;
            for (let square of squareArr) {
                if (!square.getAllVals()[11]) {
                    noMore = false;
                    break;
                }
            }
            if (noMore) {
                return false;
            }
            currNum = Math.round(Math.random() * (squareArr.length - 1));
        } while (squareArr[currNum].getAllVals()[11]);
        squareArr[currNum].convertNum2Correct();
        squareArr[currNum].fixVal();
        draw();
    }
    
    canvas.addEventListener("click", clickHandler)
    canvas.oncontextmenu = rClickHandler;
    
    newQuiz.addEventListener("click", function () {
        canvas.addEventListener("click", clickHandler);
        hint.addEventListener("click", hintHandler);
        canvas.oncontextmenu = rClickHandler;
    
        for (let sqr of squareArr) {
            sqr.reset();
        }
        sqrArrCounter = 0;
        createSolution();
        setQuiz();
        draw();
    });
    
    clear.addEventListener("click", function () {
        canvas.addEventListener("click", clickHandler);
        hint.addEventListener("click", hintHandler);
        canvas.oncontextmenu = rClickHandler;
    
        for (let sqr of squareArr) {
            if (!sqr.getAllVals()[11]) {
                sqr.changeNum(null);
                sqr.changeBorder("transparent");
            }
        }
        draw();
    });
    
    hint.addEventListener("click", hintHandler);
    
    solve.addEventListener("click", function () {
        canvas.removeEventListener("click", clickHandler);
        hint.removeEventListener("click", hintHandler);
        canvas.oncontextmenu = function () { return false; };
        for (let sqr of squareArr) {
            sqr.convertNum2Correct();
        }
        draw();
    });
})();