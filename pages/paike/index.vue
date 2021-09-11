<template>
  <view class="warp">
    <view class="contentBox">
      <view class="bottomContent" v-for="(item,index) in tableList" :key="index" @click="btnUpdate(item,index)" :data-item="item">
        <view class="contentLeft">
          <text>{{item.studentName}}</text>
          <text class="date">{{item.week}}</text>
        </view>
        <view class="contentRight">
          <text>{{item.courseName}}</text>
          <text class="description">{{item.startTime}}-{{item.endTime}}</text>
        </view>
        <view @click.stop="btnDelete(item.id)">
          <image src="../../static/img/shanchu.png" style="height: 50rpx;width: 50rpx;display: block;"></image>
        </view>
      </view>
      <view style="width: 100%;" @click="btnInsert">
        <image src="../../static/img/addImge.png" style="height: 50rpx;width: 50rpx;margin:10rpx auto;display: block;">
        </image>
      </view>
    </view>
    <ourLoading isFullScreen active text="加载中" :color="themeColor.color" :textColor="themeColor.color"
      v-if="loadModal" />
    <noData v-if="tableList.length == 0"></noData>
    
  
    <!-- 回退弹窗 -->
    <tan-dia :show="showDailog" type="center" :custom="true" :mask-click="false" @change="change">
      <view class="uni-tip">
        <!-- 标题 -->
        <view class="uni-tip-title">周几：</view>
        <view class="uni-tip-content">
          <picker @change="bindPickerChange" :value="index" :range="array">
            <view class="picker" :style="{'color': (index>-1 ? '':'#999999')}">
              {{index>-1?array[index]:'请选择星期'}}
            </view>
          </picker>
        </view>
        <view class="uni-tip-title">开始时间：</view>
        <view class="uni-tip-content">
          <view @click="DatePicker('time')">{{kaishi}}</view>
        </view>
        <view class="uni-tip-title">结束时间：</view>
        <view class="uni-tip-content">
          <view @click="DatePicker2('time')">{{jieshu}}</view>
        </view>
        <view class="uni-tip-title">教练：</view>
        <view class="uni-tip-content">
          <picker @change="bindPickerChange3" :range-key="'name'" :value="index3" :range="picker3">
            <view class="picker" :style="{'color': (index>-1 ? '':'#999999')}">
              {{index3>-1?picker3[index3].name:'请选择教练'}}
            </view>
          </picker>
        </view>
        <view class="uni-tip-title">课程：</view>
        <view class="uni-tip-content">
          <picker @change="PickerChange" :range-key="'name'" :value="index2" :range="picker">
            <view class="picker" :style="{'color': (index2>-1 ? '':'#999999')}">
              {{index2>-1?picker[index2].name:'请选择课程'}}
            </view>
          </picker>
        </view>
        <!-- 按钮部分 -->
        <view class="uni-tip-group-button">
          <button type="primary" @click="query">确定</button>
          <button type="warn" @click="cancel">取消</button>
        </view>
      </view>
      
      <mx-date-picker :show="showPicker" :type="type" :value="value" :show-tips="true" :show-seconds="false" @confirm="ed" @cancel="ed" />
      <mx-date-picker :show="showPicker2" :type="type" :value="value2" :show-tips="true" :show-seconds="false" @confirm="ed2" @cancel="ed2" />
      
    </tan-dia>
    
     
  </view>
 
</template>

<script>
  import TanDia from '@/components/uni-dialog.vue'; // 自定义弹窗组件
  import MxDatePicker from "@/components/mx-datepicker/mx-datepicker.vue";
  import {
    mapState,
    mapMutations
  } from 'vuex';

  export default {
    components: {
      TanDia,
      MxDatePicker
    },
    data() {
      return {
        array: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        index: -1,
        jg: "",
        index2: -1,
        index3: -1,
        picker: [],
        picker3: [],
        jg2: "",
        xingqi:"",
        kaishi:"00:00",
        jieshu:"23:59",
        kecheng:"",
        kechengId:0,
        jiaolian:"",
        jiaolianId:0,
        chooseId:"",
        tableList: [], //数据列表
        loadModal: false, //加载列表
        themeList: this.$mConstDataConfig.themeList,
        showDailog: false, // 是否显示弹窗
        content: '' ,// 回退原因
        dateRange:'',
        showPicker: false,
        showPicker2: false,
        type: 'rangetime',
        value: '',
        value2: ''
      }
    },
    onLoad(val) {
      this.studentId = val.studentId;
      this.chargeType = val.chargeType;
      this.placeId = val.placeId;
      console.log(this.placeId);
      

      this.loadModal = true

      this.getList();
      this.addr();
      this.queryCoach();
      uni.setNavigationBarColor({
        frontColor: '#ffffff', //前景颜色值，包括按钮、标题、状态栏的颜色，仅支持 #ffffff 和 #000000
        backgroundColor: this.themeColor.color, //背景颜色值，有效值为十六进制颜色
        animation: { //动画效果
          duration: 100,
          timingFunc: 'easeIn'
        }
      })
    },
    methods: {
      DatePicker(type){//显示
        this.type = type;
        this.showPicker = true;
        this.value = this[type];
      },
      DatePicker2(type){//显示
        this.type = type;
        this.showPicker2 = true;
        this.value2 = this[type];
      },
      ed(e) {//选择
          console.log(e);
          this.showPicker = false;
          if(e) {
              this.kaishi = e.value; 
              //选择的值
              console.log('value => '+ e.value);
          }
      },
      ed2(e) {//选择
       console.log(e);
          this.showPicker2 = false;
          if(e) {
              this.jieshu = e.value; 
              //选择的值
              console.log('value => '+ e.value);
              //原始的Date对象
              console.log('date => ' + e.date);
          }
      },
      chongzhi(){
        this.xingqi = "";
        this.kaishi = "00:00";
        this.jieshu = "23:59";
        this.kecheng = "";
        this.index = -1;
        this.index2 = -1;
      },
      /* 查询课程 */
      addr() {
        // console.log(this.chargeType);
        var phone = wx.getStorageSync("phoneNumber")
        this.$http
          .testPost('/weixin/queryCouresByStuId', {
            type: this.chargeType
          })
          .then(res => {
            this.loadModal = false
            this.picker = res.data;
          })
          .catch(err => {
            this.loadModal = false;
          });
      },
      /* 查询教练 */
      queryCoach() {
        // console.log(this.chargeType);
        var phone = wx.getStorageSync("phoneNumber")
        this.$http
          .testPost('/weixin/queryCoach', {
            // type: this.chargeType
          })
          .then(res => {
            this.loadModal = false
            this.picker3 = res.data;
          })
          .catch(err => {
            this.loadModal = false;
          });
      },
      btnDelete(chooseId) {
        console.log(chooseId);
        let that = this;
        uni.showModal({
          title:'提示',
          content:'确定要删除吗？',
          success:function(res){
            if(res.confirm){
              // console.log('点击删除');
              that.$http
                .testPost('/weixin/deleteChooseClassRecordById/'+chooseId)
                .then(res2 => {
                  that.loadModal = false
                  that.getList();
                })
                .catch(err => {
                  this.loadModal = false;
                });
            }else{
              console.log('点击取消');
            }
          }
        })
      },
      btnInsert() {
        console.log("新增");
        let that = this;
        that.showDailog = true;
      },
      btnUpdate(item,index) {
        let that = this;
        let kechengObj = item;
        that.jg = kechengObj.week;//周
        that.index = that.getArrayIndex(that.array,kechengObj.week);//周 index
        that.kaishi=kechengObj.startTime;
        that.jieshu=kechengObj.endTime;
        that.kecheng=kechengObj.courseName;
        that.kechengId = kechengObj.courseId;//课程id
        that.jiaolian=kechengObj.coachName;
        that.jiaolianId = kechengObj.coachId;//教练id
        console.log(kechengObj);
        that.chooseId = kechengObj.id;
        that.picker.forEach((item2, index3, array) => {
            if(item2.name==kechengObj.courseName){
              that.index2 = index3;
            }
        })
        that.picker3.forEach((item2, index3, array) => {
            if(item2.name==kechengObj.coachName){
              that.index3 = index3;
            }
        })
        that.showDailog = true;
      },
      //下拉框
      bindPickerChange: function(e) { //改变的事件名
        //console.log('picker发送选择改变，携带值为', e.target.value)   用于输出改变索引值
        this.index = e.target.value //将数组改变索引赋给定义的index变量
        this.jg = this.array[this.index] //将array【改变索引】的值赋给定义的jg变量
        // console.log(this.jg)
      },
      //课程选择
      PickerChange(e) {
        this.index2 = e.detail.value;
        let formData = this.picker[this.index2];
        
        this.kecheng = formData.name;
        console.log(formData);
        this.kechengId = formData.id;
      },
      //教练选择
      bindPickerChange3(e) {
        this.index3 = e.detail.value;
        let formData = this.picker3[this.index3];
        
        this.jiaolian = formData.name;
        console.log(formData);
        this.jiaolianId = formData.id;
      },
      
      /** 回退方法 */
      returnClick() {
        this.showDailog = true
      },
      /** 回退弹窗取消方法 */
      cancel() {
        this.showDailog = false
        this.chongzhi();//重置参数
      },
      /** 回退弹窗确定方法 */
      query() {
        this.showDailog = false
        
        let that = this;
        console.log(that.jg);
        console.log(that.chooseId);
        console.log(that.kaishi);
        console.log(that.jieshu);
        console.log(that.kecheng);
        console.log(that.kechengId);
        console.log(this.studentId);
        
        if(that.chooseId == ""){
          this.$http
            .testPost('/weixin/addChooseClassRecordByEntity', 
            {
              endTime:that.jieshu,
              startTime:that.kaishi,
              week:that.jg,
              courseId:that.kechengId,
              courseName:that.kecheng,
              studentId:that.studentId,
              placeId:that.placeId,
              coachId:that.jiaolianId,
              coachName:that.jiaolian
            })
            .then(res => {
              this.loadModal = false
              this.getList();
            })
            .catch(err => {
              this.loadModal = false;
            });
          
        }else{
          this.$http
            .testPost('/weixin/updateChooseClassRecordByEntity', 
            {
              id:that.chooseId,
              endTime:that.jieshu,
              startTime:that.kaishi,
              week:that.jg,
              courseId:that.kechengId,
              courseName:that.kecheng,
              coachId:that.jiaolianId,
              coachName:that.jiaolian,
              studentId:that.studentId,
              placeId:that.placeId
            })
            .then(res => {
              this.loadModal = false
              this.getList();
            })
            .catch(err => {
              this.loadModal = false;
            });
        }
         
       
        
        this.chongzhi();//重置参数
      },
      /** 监听弹窗状态是否打开 */
      change(e) {
        // console.log(123);
        // console.log(e.show)
      },

      /* 列表 */
      getList() {
        let that = this;
        var phone = wx.getStorageSync("phoneNumber")
        this.$http
          .testPost('/weixin/findChooseClassRecordById/' + that.studentId)
          .then(res => {
            this.loadModal = false
            console.log(res);
            if (res.data.code = 200) {
              this.tableList = res.data
            } else {
              
            }
          })
          .catch(err => {
            // uni.stopPullDownRefresh();
            this.loadModal = false;
          });
      },
      //获取数组下标
      getArrayIndex(arr, obj) {
          var i = arr.length;
          while (i--) {
              if (arr[i] === obj) {
                  return i;
              }
          }
          return -1;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .contentBox {}

  .bottomContent {
    height: 110rpx;
    border-bottom: 2rpx solid rgba(242, 242, 242, 1);
    padding: 0 29rpx 0 29rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .bottomContent .contentLeft {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .bottomContent .contentLeft text {
    font-size: 28rpx;
    font-weight: bold;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    margin-top: -3rpx;
  }

  .bottomContent .contentLeft .date {
    font-size: 22rpx;
    font-weight: 500;
    // color: rgba(167, 167, 167, 1);
    margin-top: 3rpx;
  }

  .bottomContent .contentRight {
    display: flex;
    flex-direction: column;
    justify-content: center;

    .description {
      color: rgba(167, 167, 167, 1);
      font-size: 22rpx;
      font-weight: 400;
    }
  }

  .bottomContent .contentRight text {
    font-size: 28rpx;
    font-family: Microsoft YaHei;
    font-weight: 400;
    text-align: right;
    // font-weight: bold;
    // color:rgba(167,167,167,1);
  }


  /* 提示窗口 */
  .uni-tip {
    padding: 15px;
    width: 300px;
    background: #fff;
    box-sizing: border-box;
    border-radius: 10px;
  }

  .uni-tip-title {
    text-align: center;
    font-weight: bold;
    font-size: 16px;
    color: #333;
    text-align: left;
  }

  .uni-tip-content {
    padding: 15px;
    font-size: 14px;
    color: #666;
    /* background: #C8C7CC; */
    border: 2upx solid #ccc;
    border-radius: 10upx;
  }

  .uni-tip-content-textarea {
    height: 80rpx;
    width: 100%;
    text-align: left;
  }

  .uni-tip-group-button {
    margin-top: 10px;
    display: flex;
  }

  .uni-tip-group-button>button {
    font-size: 24upx;
    height: 40upx;
    line-height: 40upx;

  }
</style>
