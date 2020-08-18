//开始游戏
(function () {
    var startBtn = document.querySelector('.startBtn')
    startBtn.addEventListener('click', function () {
        startBtn.style.display = 'none';
        new GreedySnake('#game')
    })
}())

const bw = 20,//方块宽度
    bh = 20,//方块高度
    tr = 30,//行数
    td = 30;//列数

class GreedySnake {
    constructor(id) {
        this.game = document.querySelector(id)
        this.snakeWrap = this.game.querySelector('#snakeWrap');
        this.keepBtn = this.game.querySelector('.keepBtn');
        this.startBtn = this.game.querySelector('.startBtn')
        this.init();
    }

    init() {//init只调用一次
        // console.log(this)    //this指向实例对象
        this.pos = [];///用于记录所有蛇方块的位置
        this.foodPos = [];//用于记录食物位置
        this.score = 0;//用于记录得分
        this.eating = false;//用于判断是否遇到食物

        //决定走的方向 
        this.direction = {}
        this.direction.i = 1;//默认向右
        this.direction.j = 0;
        this.direction.face = '';

        //调用初始化方法
        this.initSnake();
        this.initFood();
        this.updata();

        // 添加事件
        this.snakeWrap.addEventListener('click', this.suspend.bind(this))
        this.keepBtn.addEventListener('click', this.keep.bind(this))//将this指向实例对象，不然this会指向点击的dom元素
        this.timer = setInterval(this.moving.bind(this), 100)
    }

    updata() {//更新链表关系函数
        this.linkedList = this.snakeWrap.querySelectorAll('.snake')
        this.head = this.linkedList[0];//---------------------------------蛇头
        this.tail = this.linkedList[this.linkedList.length - 1]//---------蛇尾
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

        // this.snakeWrap.appendChild(newBlock)//调用时就追加元素引入页面中  不好，后面moving的时候用不了
        return this.newBlock;//返回这个创建好的方块
    }

    initSnake() {//蛇的初始化
        this.snakeHead = this.createBlock(2, 0, 'snakeHead snake');
        this.snakeBody1 = this.createBlock(1, 0, 'snakeBody snake');
        this.snakeBody2 = this.createBlock(0, 0, 'snakeBody snake');

        this.snakeWrap.appendChild(this.snakeHead);//往页面中追加元素，注意appendChild和insertBefore的区别
        this.snakeWrap.appendChild(this.snakeBody1);
        this.snakeWrap.appendChild(this.snakeBody2);

        this.pos.push([2, 0], [1, 0], [0, 0]);//初始化蛇的位置
    }

    initFood() {//食物的初始化
        let x, y;//随机数
        let include = true;//食物是否与蛇重叠
        while (include) {
            x = Math.round(Math.random() * (td - 1));
            y = Math.round(Math.random() * (tr - 1));
            for (let item of this.pos) {
                if (!(x == item[0] && y == item[1])) {
                    include = false//食物与蛇不重叠，跳出循环 
                }
            }
        }
        this.food = this.createBlock(x, y, 'food');
        this.snakeWrap.appendChild(this.food);
        this.foodPos = [x, y];//记录食物位置
    }

    // 设置定时器
    interval(t, callback, ms) {
        // console.log(this)
        if (t) {//传true设置定时器
            this.timer = setInterval(callback, ms)
        } else {
            clearInterval(this.timer);
        }
    }

    // ----------------------------------------低耦合低耦合低耦合低耦合低耦合！！！！！---------------------------------

    // 清除定时器
    suspend(e) { //暂停
        e.stopPropagation()
        if (this.timer) {//清除定时器
            this.interval(false)
        }
        this.keepBtn.style.display = 'block';
    }

    // 重新设置定时器
    keep(e) {//暂停之后继续
        e.stopPropagation()
        this.interval(true, this.moving.bind(this), 100)
        this.keepBtn.style.display = 'none';
    }



    moving() {//移动处理函数 包含蛇的移动  包含移动、吃、游戏结束

        // console.log(this);      // this指向实例对象，因为在init时用bind改变了定时器的this指向，若不改变，this指向window 
        // console.log(that)   //实例对象


        // 原来是这么决定方向的 出现bug 应该是用闭包解决||改变this指向
        // var i = 0;//默认向右
        // var j = 1;
        // var face = '';


        document.onkeydown = run.bind(this)
        function run(e) {//方向控制函数  
            // console.log(this);     //this指向#document//改变了this指向，指向实例对象
            if (e.which == 37 && this.direction.face != 'right') {//左
                this.direction.i = -1;
                this.direction.j = 0;
                this.direction.face = 'left';
                this.head.style.transform = 'rotate(180deg)'
            } else if (e.which == 39 && this.direction.face != 'left') {//右
                this.direction.i = 1;
                this.direction.j = 0;
                this.direction.face = 'right';
                this.head.style.transform = 'rotate(0deg)'
            } else if (e.which == 38 && this.direction.face != 'down') {//上
                this.direction.i = 0;
                this.direction.j = -1
                this.direction.face = 'up';
                this.head.style.transform = 'rotate(-90deg)'
            } else if (e.which == 40 && this.direction.face != 'up') {//下
                this.direction.i = 0;
                this.direction.j = 1;
                this.direction.face = 'down';
                this.head.style.transform = 'rotate(90deg)'
            }
        }
        this.head.style.left = (this.pos[0][0] + this.direction.i) * bw + 'px';//移动
        this.head.style.top = (this.pos[0][1] + this.direction.j) * bh + 'px';

        this.newBody = this.createBlock(this.pos[0][0], this.pos[0][1], 'snakeBody snake')
        this.snakeWrap.insertBefore(this.newBody, this.head.next);//在蛇头原来(下一个的前面)的位置新建节点，
        // ----------------------------------------------------------------------------------------------游戏结束后重新开始再点击暂停后会有bug

        this.pos.unshift([this.pos[0][0] + this.direction.i, this.pos[0][1] + this.direction.j]);//更新位置,保持数组头存的是蛇头的位置,链表更新会比较简单

        this.updata();//更新链表

        this.eating = true;//默认遇到食物

        if (!(this.pos[0][0] == this.foodPos[0] && this.pos[0][1] == this.foodPos[1])) {//移动的时候,执行下面的代码 遇到食物,不执行//蛇头和食物重合
            this.tail.remove();//删除原尾巴
            this.pos.pop();//移除原尾巴的位置
            this.updata();//更新链表
            this.eating = false;
        }
        this.eat();

        // 游戏结束
        for (var i = 1; i < this.pos.length; i++) {//撞到自己
            if (this.pos[0][0] == this.pos[i][0] && this.pos[0][1] == this.pos[i][1]) {
                this.gameOver();
            }
        }
        if (this.pos[0][0] > tr - 1 || this.pos[0][1] > td - 1 || this.pos[0][0] < 0 || this.pos[0][1] < 0) {//撞墙
            this.gameOver();
        }
    }

    eat() {//吃
        if (this.eating) {//蛇头到了食物的位置
            this.food.remove();
            this.initFood()
            this.score++;
        }
    }

    gameOver() {//游戏结束
        clearInterval(this.timer);
        alert('游戏结束，您的得分是' + this.score);
        this.snakeWrap.innerHTML = '';//innerHTML不会删除事件，容易造成内存泄漏
        let startBtn = document.querySelector('.startBtn')
        startBtn.style.display = 'block';
    }
}









