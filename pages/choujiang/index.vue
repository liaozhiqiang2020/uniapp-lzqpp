<template>
  <view class="bg">
    <view class="container">
      <view class="limitbean"></view>
      <view class="frame_view">
        <view class="frame_row" style="margin-top: 48rpx;">
          <view class="frame_item" :class="'item' + color[0]">
            <image :src="award[0].img"></image>
            <text>{{ award[0].name }}</text>
          </view>
          <view class="frame_item" :class="'item' + color[1]">
            <image :src="award[1].img"></image>
            <text>{{ award[1].name }}</text>
          </view>
          <view class="frame_item" :class="'item' + color[2]">
            <image :src="award[2].img"></image>
            <text>{{ award[2].name }}</text>
          </view>
        </view>

        <view class="frame_row">
          <view class="frame_item" :class="'item' + color[7]">
            <image :src="award[7].img"></image>
            <text>{{ award[7].name }}</text>
          </view>
          <!-- 抽奖 -->
          <!-- <image class="frame_item" :src="btnconfirm" @click="clickLuck"></image> -->
          <view style="text-align: center;color: #fff;">
            <view style="font-size: 36rpx;">{{free}}次</view>
            <!-- <view style="font-size: 28rpx;">免费次数</view> -->
          </view>
          <view class="frame_item" :class="'item' + color[3]">
            <image :src="award[3].img"></image>
            <text>{{ award[3].name }}</text>
          </view>
        </view>

        <view class="frame_row">
          <view class="frame_item" :class="'item' + color[6]">
            <image :src="award[6].img"></image>
            <text>{{ award[6].name }}</text>
          </view>
          <view class="frame_item" :class="'item' + color[5]">
            <image :src="award[5].img"></image>
            <text>{{ award[5].name }}</text>
          </view>
          <view class="frame_item" :class="'item' + color[4]">

            <image :src="award[4].img"></image>
            <text>{{ award[4].name }}</text>
          </view>
        </view>
      </view>
      <view class="luckbtulist">
        <view class="luckone" @click="clickLuck">
          <p v-if="payout==0" style="margin-top: 30upx;">抽一次</p>
          <view v-if="payout==1">
            <!-- <p style="margin-top: 10upx;">上三节课</p> -->
            <p style="margin-top: 30upx;">抽1次</p>
          </view>

        </view>
        <view class="luckfive" @click="clickLuckFive">
          <p v-if="payout==0" style="margin-top: 30upx;">五连抽</p>

          <view v-if="payout==1">
            <!-- <p style="margin-top: 10upx;">上15节课</p> -->
            <p style="margin-top: 30upx;">五连抽</p>
          </view>
        </view>
      </view>
      <view class="lucktips">
        <view class="lucktab">
          <view class="luckrule" @click="toggleTabs(0)" :style="styleObject">活动规则</view>
          <view class="record" @click="toggleTabs(1)" :style="styleObject1">获奖记录</view>
        </view>
        <view v-show="nowIndex==0" class="ruleinof">
          <view class="ruleconten">1、每上三节课积攒一次抽奖次数。</view>
          <view class="ruleconten">2、奖品均为积分，抽中后自动兑换到当前账户中。</view>
		  <view class="ruleconten">3、积分达到一定数额可换取相对应的奖品。</view>
          <view class="ruleconten">4、抽奖时出现问题请联系工作人员。</view>
          <view class="ruleconten">5、本活动最终解释权归零之启乒乓所有。</view>
        </view>
        <view class="ruleinof" v-show="nowIndex==1">
          <view style="width: 100%;height: 496rpx;  margin-top: 40rpx;overflow-y:auto;">
            <view class="recordlist" v-for="(item, index) in newslist" :key="index">
              <view class="">{{ item.drawDate }}</view>
              <view class="">{{ item.drawPrize }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- 弹出窗口 -->
    <view :class="{'share-box': shareState}" @click="handleHiddenShare">
      <view v-if="lucktype==0" class="nopop" :class="{'share-show': shareState}">
        <view style="margin-top: 60rpx;margin-left: 180rpx;margin-bottom: 30rpx;">
          <image src="https://lzqpp.natapp4.cc/circle_image/2021_06_8_14_36_52_5.png" mode=""
            style="width: 124rpx;height: 144rpx;"></image>
        </view>
        <view class="poptitle">抽奖次数不足</view>
        <view class="popbtn">确定</view>
      </view>
      <!-- 单抽 -->
      <view v-else-if="lucktype==1" class="onepop" :class="{'share-show': shareState}">
        <view class="popconten">
          <image :src="prizeimg" mode="" style="width: 190rpx;height: 190rpx;"></image>
          <view style="margin-top: 20rpx;color: #4A4A4A;font-size: 28rpx;">{{prize}}</view>
        </view>
        <view class="popbtn" style="margin-top: -90rpx;">确定</view>
      </view>
      <!-- 五连抽 -->
      <view v-else-if="lucktype==2" class="onepop" :class="{'share-show': shareState}">
        <view class="popcontenlist">
<!--          <view class="poplucklist" v-for="(item, index) in newslist" :key="index">
            <view class="">{{ item.drawDate }}</view>
            <view class="">{{ item.drawPrize }}</view>
          </view> -->
          <view class="poplucklist" v-for="(item, index) in poplucklist" :key="index">
            <image :src="item.aimgs" mode="" style="width: 80rpx;height: 80rpx;"></image>
            <view style="margin-top: 0rpx;color: #4A4A4A;font-size: 28rpx;">{{item.title}}</view>
          </view>

          <!-- <view class="poplucklist">
            <image :src="aimgs[1]" mode="" style="width: 80rpx;height: 80rpx;"></image>
            <view style="margin-top: 0rpx;color: #4A4A4A;font-size: 28rpx;">{{title[1]}}</view>
          </view>

          <view class="poplucklist">
            <image :src="aimgs[2]" mode="" style="width: 80rpx;height: 80rpx;"></image>
            <view style="margin-top: 0rpx;color: #4A4A4A;font-size: 28rpx;">{{title[2]}}</view>
          </view>

          <view class="poplucklist">
            <image :src="aimgs[3]" mode="" style="width: 80rpx;height: 80rpx;"></image>
            <view style="margin-top: 0rpx;color: #4A4A4A;font-size: 28rpx;">{{title[3]}}</view>
          </view>

          <view class="poplucklist">
            <image :src="aimgs[4]" mode="" style="width: 80rpx;height: 80rpx;"></image>
            <view style="margin-top: 0rpx;color: #4A4A4A;font-size: 28rpx;">{{title[4]}}</view>
          </view> -->

        </view>
        <view class="popbtn" style="margin-top: 60rpx;">确定</view>
      </view>
    </view>
  </view>
</template>

<script>
  //计数器
  var interval = null;
  //值越大旋转时间越长  即旋转速度
  var intime = 100;
  export default {
    data() {
      return {
        nowIndex: 0,
        color: [0, 0, 0, 0, 0, 0, 0, 0],
        award: [], //接收数组
        Luck: true, //防置重复点击
        lucktype: 2, //判断奖品类型
        luckPosition: 0, //停止位置
        prize: '', //奖品，
        prizeimg: 'https://lzqpp.natapp4.cc/circle_image/2021_06_8_14_35_36_10.png', //奖品图片
        // 弹窗按钮
        shareState: false,
        // tab切换
        styleObject: {
          'border-bottom': '3px solid #A24A1E',
        },
        styleObject1: '',
        //抽奖次数
        free: 6,
        // 判断类型
        payout: 0,
        allCount: 1000, //总份数(乘概率，最多千分之一),
        jidengjiang: 1,
        title: [],
        aimgs: [],
        newslist: [],
        poplucklist:[],
        studentName:"",
        studentId:""
      };
    },
    onLoad(val) {
      this.studentName = val.name;
      this.studentId = val.studentId;
      console.log(this.studentName);
      console.log(this.studentId);
      
      uni.setNavigationBarColor({
        frontColor: '#ffffff', //前景颜色值，包括按钮、标题、状态栏的颜色，仅支持 #ffffff 和 #000000
        backgroundColor: this.themeColor.color, //背景颜色值，有效值为十六进制颜色
        animation: { //动画效果
          duration: 100,
          timingFunc: 'easeIn'
        }
      })

      this.queryLotteryInfo();
      this.queryLotteryNumber();
      this.queryLuckyDrawResultByTel();

    },
    methods: {

      getDate() {
        var date = new Date();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        if (hour >= 0 && hour <= 9) {
          hour = "0" + hour;
        }
        if (minute >= 0 && minute <= 9) {
          minute = "0" + minute;
        }
        if (second >= 0 && second <= 9) {
          second = "0" + second;
        }
        var currentDate = date.getFullYear() + '-' + month + '-' + strDate + ' ' + hour + ':' + minute + ':' + second;
        return currentDate;
      },
      queryLuckyDrawResultByTel() {
        var that = this;
        var phone = wx.getStorageSync("phoneNumber");
        // var phone = '15684705196';
        this.$http
          .testPost('/weixin/queryLuckyDrawResultByTel/' + phone+"/"+this.studentId)
          .then(res => {
            console.log(res.data);
            that.newslist = res.data;
          })
          .catch(err => {

          });
      },
      queryLotteryNumber() {
        var that = this;
        var phone = wx.getStorageSync("phoneNumber");
        // var phone = '15684705196';
        this.$http
          .testPost('/weixin/queryLuckyDrawNumber/' + phone+"/"+this.studentId)
          .then(res => {
            that.free = res.data;
          })
          .catch(err => {

          });
      },
      queryLotteryInfo() {
        var that = this;
        this.$http
          .testPost('/weixin/queryLuckyDraw')
          .then(res => {
            that.firstChance = res.data.firstChance;
            that.firstName = res.data.firstName;
            that.secondChance = res.data.secondChance;
            that.secondName = res.data.secondName;
            that.thirdChance = res.data.thirdChance;
            that.thirdName = res.data.thirdName;
            that.fourChance = res.data.fourChance;
            that.fourName = res.data.fourName;
            that.fiveChance = res.data.fiveChance;
            that.fiveName = res.data.fiveName;


            that.award = [{
                img: 'https://lzqpp.natapp4.cc/circle_image/2021_06_8_14_35_36_10.png',
                name: that.firstName,
                chance: that.firstChance * that.allCount
              },
              {
                img: 'https://lzqpp.natapp4.cc/circle_image/2021_06_8_14_34_47_2.png',
                name: that.fiveName,
                chance: parseInt((that.fiveChance * that.allCount) / 4)
              },
              {
                img: 'https://lzqpp.natapp4.cc/circle_image/2021_06_8_14_35_36_10.png',
                name: that.secondName,
                chance: that.secondChance * that.allCount
              },
              {
                img: 'https://lzqpp.natapp4.cc/circle_image/2021_06_8_14_34_47_2.png',
                name: that.fiveName,
                chance: parseInt((that.fiveChance * that.allCount) / 4)
              },
              {
                img: 'https://lzqpp.natapp4.cc/circle_image/2021_06_8_14_35_36_10.png',
                name: that.thirdName,
                chance: that.thirdChance * that.allCount
              },
              {
                img: 'https://lzqpp.natapp4.cc/circle_image/2021_06_8_14_34_47_2.png',
                name: that.fiveName,
                chance: parseInt((that.fiveChance * that.allCount) / 4)
              },
              {
                img: 'https://lzqpp.natapp4.cc/circle_image/2021_06_8_14_35_36_10.png',
                name: that.fourName,
                chance: that.fourChance * that.allCount
              },
              {
                img: 'https://lzqpp.natapp4.cc/circle_image/2021_06_8_14_34_47_2.png',
                name: that.fiveName,
                chance: parseInt((that.fiveChance * that.allCount) / 4)
              },
            ]
          })
          .catch(err => {

          });
      },
      // 记录切换
      toggleTabs(index) {
        this.nowIndex = index;
        // this.shareState=true
        if (index == 1) {
          this.styleObject1 = {
            'border-bottom': '3px solid #A24A1E',
          }
          this.styleObject = {}
        } else {
          this.styleObject = {
            'border-bottom': '3px solid #A24A1E',
          }
          this.styleObject1 = {}
        }
      },
      // 关闭中奖弹窗
      handleHiddenShare() {
        this.shareState = false
      },
      // 点击抽奖
      clickLuck() {
        var phone = wx.getStorageSync("phoneNumber");
        // var phone = '15684705196';
        if (this.Luck == false) { //防止过度点击
          return;
        }
        this.Luck = false;

        //判断次数		
        if (this.free == 0) {
          this.shareState = true
          this.lucktype = 0
          this.Luck = true;
          return;
        }

        this.$http
          .testPost('/weixin/clickLuckyDraw/' + phone+"/"+this.studentId)
          .then(res => {
            console.log(res);
            if (res.data.code == 200) {
              var arr = [];
              //根据概率循环位置
              for (var i = 0; i < this.award.length; i++) {
                for (var k = 0; k < this.award[i].chance; k++) {
                  arr.push(i);
                }
              }

              //随机打乱数组
              for (let i = 0, len = arr.length; i < len; i++) {
                let index = parseInt(Math.random() * (len - 1));
                let tempValue = arr[i];
                arr[i] = arr[index];
                arr[index] = tempValue;
              }

              //从数组中随机抽取一个位置
              var a = Math.ceil(Math.random() * 10);

              if (this.free != 0) {
                this.free = this.free - 1 //抽奖次数减1
              }

              if (this.free == 0) {
                this.payout = 1
              }

              this.luckPosition = arr[a]; //位置
              this.prize = this.award[arr[a]].name //奖品名字
              this.prizeimg = this.award[arr[a]].img //奖品图片

              if (this.luckPosition == 0) {
                this.jidengjiang = 1;
              } else if (this.luckPosition == 2) {
                this.jidengjiang = 3;
              } else if (this.luckPosition == 4) {
                this.jidengjiang = 5;
              } else if (this.luckPosition == 6) {
                this.jidengjiang = 7;
              } else {
                this.jidengjiang = 9;
              }
              console.log(this.jidengjiang);
              console.log(this.prize);
              this.newslist.unshift({
                drawPrize: this.prize,
                drawDate: this.getDate()
              });

              // 设置this
              var e = this;
              //设置按钮不可点击
              //	e.btnconfirm = getApp().globalData.img_url + '/dianjichoujiangd.png';
              //清空计时器
              clearInterval(interval);
              var index = 0;
              //循环设置每一项的背景图
              interval = setInterval(function() {
                var c = [0, 0, 0, 0, 0, 0, 0, 0];
                if (index > 7) {
                  index = 0;
                }
                c[index] = 1;
                e.color = c;
                index++;
              }, intime);
              // console.log(intime);
              //模拟网络请求时间  设为两秒
              // var stoptime = 1000;
              // setTimeout(function() {

              this.$http
                .testPost('/weixin/saveLuckyDrawResult', {
                  tel: phone,
                  drawPrize: this.prize,
                  drawAwards: this.jidengjiang,
                  isCashPrize: 0,
                  studentId:this.studentId
                })
                .then(res => {
                  if (res.data.code == 200) {
                    e.stop(e.luckPosition);
                  }
                })

              // }, stoptime);
            }
          })
      },

      // 停止
      stop(which) {
        var e = this;
        //清空计数器
        clearInterval(interval);
        //初始化当前位置
        var current = -1;
        var color = e.color;
        for (var i = 0; i < color.length; i++) {
          if (color[i] == 1) {
            current = i;
          }
        }
        //下标从1开始
        var index = current + 1;
        e.stopLuck(which, index, intime, 10);
      },
      /**
       * which:中奖位置
       * index:当前位置
       * time：时间标记
       * splittime：每次增加的时间 值越大减速越快
       */
      stopLuck(which, index, time, splittime) {
        var e = this;
        //值越大出现中奖结果后减速时间越长
        var color = e.color;
        setTimeout(function() {
          //重置前一个位置
          var c = [0, 0, 0, 0, 0, 0, 0, 0];
          if (index > 7) {
            index = 0;
          }
          //当前位置为选中状态
          c[index] = 1;
          e.color = c;
          //如果旋转时间过短或者当前位置不等于中奖位置则递归执行
          //直到旋转至中奖位置
          if (time < 400 || index != which) {
            //越来越慢
            splittime++;
            time += splittime;
            //当前位置+1
            index++;
            e.stopLuck(which, index, time, splittime);
          } else {
            //中奖
            e.shareState = true
            e.Luck = true;
            e.lucktype = 1
            if (e.payout == 1) {
              e.limitnum = e.limitnum - 100
            }
          }
        }, time);
      },
      // 五连抽
      clickLuckFive() {
        var e = this;
        this.shareState = true
        // this.payout = 1

        if (this.free < 5) {
          this.lucktype = 0
          return;
        }

        this.lucktype = 2 //五连抽

        // if (this.free == 0) {
        //   this.payout = 1
        // }


        // // if (this.free < 5) {
        // //   this.lucktype = 0
        // // } else {
        // //   this.free = this.free - 5;
        // //   this.lucktype = 2 //五连抽

        

        var phone = wx.getStorageSync("phoneNumber");
        // var phone = '15684705196';
        this.$http
          .testPost('/weixin/clickLuckyDrawFive/' + phone+"/"+this.studentId)
          .then(res => {
            console.log(res);
            if (res.data.code == 200) {
              if (this.free != 0 && this.free >= 5) {
                this.free = this.free - 5 //抽奖次数减1
              }
            }
          })


        let wulian = [];
        for (let xxx = 0; xxx < 5; xxx++) {

          var arr = [];
          //根据概率循环位置
          for (var i = 0; i < this.award.length; i++) {
            for (var k = 0; k < this.award[i].chance; k++) {
              arr.push(i);
            }
          }

          //随机打乱数组
          for (let i = 0, len = arr.length; i < len; i++) {
            let index = parseInt(Math.random() * (len - 1));
            let tempValue = arr[i];
            arr[i] = arr[index];
            arr[index] = tempValue;
          }

          //从数组中随机抽取一个位置
          var a = Math.ceil(Math.random() * 10);

          let luckPosition = arr[a]; //位置
          let prize = this.award[arr[a]].name //奖品名字
          let prizeimg = this.award[arr[a]].img //奖品图片
          let jidengjiang = 9;

          if (luckPosition == 0) {
            jidengjiang = 1;
          } else if (luckPosition == 2) {
            jidengjiang = 3;
          } else if (luckPosition == 4) {
            jidengjiang = 5;
          } else if (luckPosition == 6) {
            jidengjiang = 7;
          } else {
            jidengjiang = 9;
          }

          e.newslist.unshift({
            drawPrize: prize,
            drawDate: e.getDate()
          });

          
          e.$http
            .testPost('/weixin/saveLuckyDrawResult', {
              tel: phone,
              drawPrize: prize,
              drawAwards: jidengjiang,
              isCashPrize: 0,
              studentId:this.studentId
            })
            .then(res => {
              if (res.data.code == 200) {
                let wulian1 = {
                  title:prize,
                  aimgs: prizeimg
                }
                wulian.push(wulian1);
              }
            })
            
            // console.log("aaaa"+wulian);
            
            // console.log("bbb"+e.poplucklist);
        }
        
        e.poplucklist = wulian;
        console.log(e.poplucklist);




        //中奖
        // e.shareState = true
        // e.Luck = true;
        // e.lucktype = 1





        // }
      }
    },


  };
</script>

<style>
  .bg {
    width: 100%;
    min-height: 2200upx;
    background: url("https://lzqpp.natapp4.cc/circle_image/2021_06_8_14_37_20_3.png") no-repeat;
    background-size: 100% 100%;

  }

  .container {
    overflow: hidden;
  }

  .limitbean {
    width: 100%;
    color: #fff;
    text-align: center;
    margin-top: 398rpx;
    font-size: 30rpx;
    margin-bottom: 24rpx;
  }

  .frame_view {
    width: 648rpx;
    height: 688rpx;
    margin: 0 auto;
    border-radius: 30rpx;
    background: url("https://lzqpp.natapp4.cc/circle_image/2021_06_8_14_37_50_4.png") no-repeat;
    background-size: 100% 100%;
    overflow: hidden;
  }

  .frame_row {
    width: 520rpx;
    height: 168rpx;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-left: 64rpx;
    margin-bottom: 20rpx;

  }

  .frame_item {
    width: 168rpx;
    height: 168rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    font-size: 20px;
    /* box-sizing:border-box; */
    background: #FFFFFF;
    /* 	border-radius: 17px; */
    /* 	box-shadow: 0px 6px 0px 0px rgba(236,231,228,1); */
    background: url("https://lzqpp.natapp4.cc/circle_image/2021_06_8_14_41_5_0.png") no-repeat;
    background-size: 100% 100%;


  }

  .frame_item image {
    width: 80rpx;
    height: 80rpx;
    display: block;

  }

  .frame_item text {
    font-size: 26rpx;
    display: block;
    width: 100%;
    text-align: center;
    color: #818181;
    margin-top: -40rpx;
  }

  .item1 {
    background: url("https://lzqpp.natapp4.cc/circle_image/2021_06_8_14_42_16_6.png") no-repeat;
    background-size: 100% 100%;
    // box-shadow: 0px 10px 20px 0px rgba(170,56,0,1), 0px 0px 20px 0px rgba(196,58,215,1), 0px 4px 0px 0px rgba(255,255,255,0.29);

  }

  .luckbtulist {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
  }

  .luckone {
    width: 310upx;
    height: 100upx;
    background: linear-gradient(360deg, #E4392C 0%, #F6A261 100%);
    box-shadow: 0px 10px 20px 0px rgba(153, 0, 0, 0.81), 0px 5px 0px 0px rgba(195, 48, 7, 1), 0px 4px 0px 0px rgba(255, 255, 255, 0.23);
    border-radius: 50upx;
    margin-right: 28rpx;
    text-align: center;
  }

  .luckfive {
    width: 310upx;
    height: 100upx;
    background: linear-gradient(180deg, #FFC3AC 0%, #D43EDC 100%);
    box-shadow: 0px 10px 20px 0px rgba(170, 56, 0, 1), 0px 5px 0px 0px rgba(196, 58, 215, 1), 0px 4px 0px 0px rgba(255, 255, 255, 0.29);
    border-radius: 50px;
    text-align: center;
  }

  .lucktips {
    width: 686rpx;
    height: 800rpx;
    background: #FFF8DF;
    border-radius: 20rpx;
    margin: 0 auto;
    margin-top: 70rpx;
  }

  .lucktab {
    width: 580rpx;
    height: 104rpx;
    border-bottom: 1rpx solid #A24A1E;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-around;
    font-size: 28rpx;
    color: #98370A;
    font-weight: 600;
  }

  .lucktab view {
    height: 100%;
    line-height: 104rpx;
  }

  .action {

    border-bottom: 3px solid #A24A1E;

  }

  .ruleinof {
    width: 584rpx;
    height: 496rpx;
    margin: 0 auto;
    font-size: 28rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #D97645;

  }

  .ruleinof .ruleconten {
    margin-top: 40rpx;
    line-height: 40rpx;
  }

  .recordlist {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20rpx;
  }


  // 弹出窗口
  .share-box {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0rpx;
    left: 0rpx;
    bottom: 0rpx;
    right: 0rpx;
    background-color: rgba(0, 0, 0, 0.4);
    transition: .3s;
    z-index: 999;
  }

  .nopop {
    display: none;
    width: 470rpx;
    height: 455rpx;
    background: #FFFFFF;
    border-radius: 30px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-top: -228rpx;
    /* 高度的一半 */
    margin-left: -235rpx;
    /* 宽度的一半 */
  }

  .share-show {
    display: block !important;
  }

  .poptitle {
    font-size: 28rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #4A4A4A;
    text-align: center;

  }

  .popbtn {
    width: 310upx;
    height: 100upx;
    background: linear-gradient(360deg, #E4392C 0%, #F6A261 100%);
    box-shadow: 0px 10px 10px 0px rgba(153, 0, 0, 0.81), 0px 5px 0px 0px rgba(195, 48, 7, 1), 0px 4px 0px 0px rgba(255, 255, 255, 0.23);
    border-radius: 50upx;
    margin-right: 28rpx;
    text-align: center;
    line-height: 100upx;
    font-size: 32upx;
    color: #fff;
    margin: 0 auto;
    margin-top: 36upx;
  }

  .onepop {
    display: none;
    width: 696rpx;
    height: 872rpx;
    background: url("https://lzqpp.natapp4.cc/circle_image/2021_06_8_14_41_31_5.png") no-repeat;
    background-size: 100% 100%;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-top: -438rpx;
    /* 高度的一半 */
    margin-left: -350rpx;
    /* 宽度的一半 */
    overflow: hidden;
  }

  .popconten {
    width: 470rpx;
    height: 472rpx;
    background: url("https://lzqpp.natapp4.cc/circle_image/2021_06_8_14_39_28_5.png") no-repeat;
    background-size: 100% 100%;
    margin: 0 auto;
    margin-top: 340rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

  }

  .popcontenlist {
    width: 470rpx;
    height: 300rpx;
    margin: 0 auto;
    margin-top: 370rpx;
    display: flex;
    align-items: center;
    flex-wrap: wrap;

  }

  .poplucklist {
    width: 88rpx;
    height: 180rpx;
    margin-left: 56rpx;
  }
</style>
