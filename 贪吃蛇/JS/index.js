var bw = 20,//方块宽度
    bh = 20,//方块高度
    tr = 30,//行数
    td = 30;//列数


var that;
class GreedySnake {
    constructor(id) {
        that = this;
        this.game = document.querySelector(id)
        this.snakeWrap = this.game.querySelector('#snakeWrap');
        this.pauseBtn = this.game.querySelector('.pauseBtn')
        this.init();
        var timer = null;
    }


    init() {
        this.pos = [];//记录所有蛇方块的位置
        this.foodPos = [];//记录食物位置
        this.score = 0;//得分
        this.eating = false;
        this.initSnake();
        this.updata();
        this.initFood();
        this.suspend();
        this.timer = setInterval(this.moving, 100)
    }

    updata() {//更新链表关系函数
        this.linkedList = this.snakeWrap.querySelectorAll('.snake')
        this.head = this.linkedList[0];
        this.tail = this.linkedList[this.linkedList.length - 1]
        for (var i = 0; i < this.linkedList.length; i++) {
            this.linkedList[i].next = this.linkedList[i + 1];
            this.linkedList[i].previous = this.linkedList[i - 1];

        }
    }

    createBlock(x, y, classname) {//方块创建函数
        var x = x * bw;
        var y = y * bh;

        this.newBlock = document.createElement('div');
        this.newBlock.className = classname;
        this.newBlock.style.position = 'absolute'
        this.newBlock.style.left = x + 'px'
        this.newBlock.style.top = y + 'px'
        this.newBlock.style.width = bw + 'px'
        this.newBlock.style.height = bh + 'px'

        return this.newBlock;
    }


    initSnake() {//蛇的初始化
        this.snakeHead = this.createBlock(2, 0, 'snakeHead snake');
        this.snakeBody1 = this.createBlock(1, 0, 'snakeBody snake');
        this.snakeBody2 = this.createBlock(0, 0, 'snakeBody snake');

        this.snakeWrap.appendChild(this.snakeHead);
        this.snakeWrap.appendChild(this.snakeBody1);
        this.snakeWrap.appendChild(this.snakeBody2);

        this.pos.push([2, 0], [1, 0], [0, 0]);//初始化蛇的位置

    }

    initFood() {//食物的初始化
        var x, y;//随机数
        var include = true;
        while (include) {
            x = Math.round(Math.random() * (td - 1));
            y = Math.round(Math.random() * (tr - 1));
            for (var i = 0; i < this.pos.length; i++) {
                if (!(x == this.pos[i][0] && y == this.pos[i][1])) {
                    include = false//食物与蛇不重叠，跳出循环 
                }
            }
        }
        this.food = this.createBlock(x, y, 'food');
        this.snakeWrap.appendChild(this.food);
        this.foodPos = [x, y];
    }



    suspend() { //暂停
        that.snakeWrap.addEventListener('click', function () {
            clearInterval(that.timer)
            that.pauseBtn.style.display = 'block';
            that.pauseBtn.children[0].addEventListener('click', function () {
                that.pauseBtn.style.display = 'none';
                that.timer = setInterval(that.moving, 100);

            })
        })
    }


    moving() {//移动处理函数 包含蛇的移动  包含移动、吃、游戏结束
        var i = 1;//默认向右
        var j = 0;
        var direction = '';

        document.onkeydown = function (e) {//方向控制函数
            if (e.which == 37 && direction != 'right') {//左
                i = -1;
                j = 0;
                direction = 'left';
                that.head.style.transform = 'rotate(180deg)'
            } else if (e.which == 39 && direction != 'left') {//右
                i = 1;
                j = 0;
                direction = 'right';
                that.head.style.transform = 'rotate(0deg)'
            } else if (e.which == 38 && direction != 'down') {//上
                i = 0;
                j = -1
                direction = 'up';
                that.head.style.transform = 'rotate(-90deg)'
            } else if (e.which == 40 && direction != 'up') {//下
                i = 0;
                j = 1;
                direction = 'down';
                that.head.style.transform = 'rotate(90deg)'
            }
        }

        that.head.style.left = (that.pos[0][0] + i) * bw + 'px';//移动
        that.head.style.top = (that.pos[0][1] + j) * bh + 'px';

        var newBody = that.createBlock(that.pos[0][0], that.pos[0][1], 'snakeBody snake')
        that.snakeWrap.insertBefore(newBody, that.head.next);//在蛇头原来的位置新建节点



        that.pos.unshift([that.pos[0][0] + i, that.pos[0][1] + j]);//更新位置


        that.updata();//更新链表

        that.eating = true;//默认遇到食物

        if (!(that.pos[0][0] == that.foodPos[0] && that.pos[0][1] == that.foodPos[1])) {//  没有遇到食物,执行下面的代码 遇到食物,不执行
            that.eating = false;
            that.tail.remove();//删除原尾巴
            that.pos.pop();//移除原尾巴的位置
            that.updata();//更新链表
        }

        that.eat();



        // 游戏结束
        for (var o = 1; o < that.pos.length; o++) {//不能用i、j 跟上面冲突
            if (that.pos[0][0] == that.pos[o][0] && that.pos[0][1] == that.pos[o][1]) {
                that.gameOver();
            }
        }

        if (that.pos[0][0] > tr - 1 || that.pos[0][1] > td - 1 || that.pos[0][0] < 0 || that.pos[0][1] < 0) {
            console.log(2)
            that.gameOver();
        }



    }



    eat() {//吃
        if (this.eating == true) {//蛇头到了食物的位置
            this.food.remove();
            this.initFood()
            this.score++;
        }
    }








    gameOver() {//游戏结束
        // clearInterval(that.timer);
        // alert('游戏结束，您的得分是' + this.score);
        // that.snakeWrap.innerHTML = '';

        // that.init();
    }


}


//开始游戏
function start() {
    var startBtn = document.querySelector('.startBtn')
    startBtn.children[0].addEventListener('click', function () {
        startBtn.style.display = 'none';
        var greedySnake = new GreedySnake('#game')
        console.log(greedySnake)
    })
}

start();






