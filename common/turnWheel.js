var turnWheel = {
        //奖品接口 ，可以通过服务器设置接口
    rewards: [],
    //每个散型的颜色设置
    colors: [
        "#AE3EFF",
        "#4D3FFF",
        "#FC262C",
        "#3A8BFF",
        "#EE7602",
        "#FE339F",
        "#4D3FFF",
        "#FC262C"
    ],
    //转盘外圆的半径
    outsideRadius: 160,
    //转盘奖品位置距离圆心的距离 
    textRadius: 200,
    //转盘内圆的半径 
    insideRadius: 68,
    //开始角度 
    startAngle:270/Math.PI,
    //点击旋转状态 false:停止;ture:旋转 
    bRotate: false,
    //每次旋转动画角度 
    rotateAg: 5,
    //每次时间间隔
    rotateLimit: 20,
    //保存的动画timer
    timer: 0,
    //结束的时间
    goTime: 1000,
    //canvas的ctx
    ctx: false,
    //宽度
    width:320,
    //高度
    height:320,
    init: function() {
          
        this.ctx =  uni.createCanvasContext('wheelCanvas');
         
    },
    draw: function() {
         
    },
    /*
        index 奖品的索引
        callback 成功回调
        doing 进度回调
    */
    goRoate: function(index, callback,doing) {
         
    }
};
module.exports=turnWheel;