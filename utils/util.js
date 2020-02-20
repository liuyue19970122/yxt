const app = getApp();
// console.log('000')
app.globalData.isGo = false
const formatTime = function(date) {
  date = new Date(date)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatDateAn = function(date) {
  date = new Date(parseInt(date))
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}
const formatDate = function(date) {
  date = new Date(date)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('/')
}
const formatNumber = function(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
/** 
 * @param { moth:'202002',curMonth:'2020年02月'}
 * @return {type:array} 
 * objArr=[{name:'2020年02月01日';day:1}]
*/
const formatGetDayRange=function(month,curMonth){
  let arr=[]
    let td=new Date()
    let tdy=td.getFullYear()
    let tdm=td.getMonth()+1
    let tdd=td.getDate()
    if(tdm<10){
      tdm='0'+tdm.toString()
    }
    let tdymi=parseInt(tdy.toString()+tdm)//当前年月202002
    let cmi=parseInt(month)
    if(cmi<tdymi){
      let cmyi=parseInt(month[0]+month[1]+month[2]+month[3])
      let cmmfi=parseInt(month[5])
      let cmmi=cmmfi?parseInt(month[5]+month[6]):parseInt(month[6])
      let dayRange= new Date(cmyi, cmmi, 0).getDate()
      for(let i=1;i<=dayRange;i++){
        let is=i.toString()
        is=i<10?'0'+is:is
        let obj={
          name:curMonth+is+'日',
          day:is
        }
        arr.push(obj)
      }
    }else{
      for(let i=1;i<=tdd;i++){
        let is=i.toString()
        is=i<10?'0'+is:is
        let obj={
          name:curMonth+is+'日',
          day:is
        }
        arr.push(obj)
      }
    }
    arr.unshift({name:curMonth,day:'-1'})
    return arr
}
//获取openId
const getWxOpenId = function() {
  return new Promise((resolve, reject) => {
    let url = app.globalData.baseUrl + 'apiMall/wx/openId';
    let token = ''
    getToken().then(res => {
      token = res
    })
    wx.login({
      success: function(res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: url,
            method: "GET",
            header: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: token
            },
            data: {
              'code': res.code
            },
            success: function(res) {
              if (res.statusCode == 200) {
                resolve(res)
              }
              if (res.statusCode === 404 || res.statusCode === 500) {
                errHandle() //404 500错误处理
              }
            },
            fail: function(err) {
              if (!app.globalData.isShowErr) {
                app.globalData.isShowErr = true
                netErr()
              } else {
                return
              }
            }
          })
        }
      }
    });
  })
}
//获取token
const getToken = function() {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key: 'localToken',
      success: function(res) {
        var token = res.data.token
        resolve(token)
      },
      fail: function(res) {
        reject(res)
      },
    })
  })
}
//get 封装
const getRequest = function(url, token) {
  return new Promise((resolve, reject) => {
    //init
    var postToken = token;
    //网络请求
    wx.request({
      url: url,
      method: 'GET',
      header: {
        Authorization: postToken,
      },
      success: function(res) { //服务器返回数据
        resolve(res);
        if (res.statusCode === 404 || res.statusCode === 500) {
          errHandle() //404 500错误处理
        }
      },
      fail: function(e) {
        if (!app.globalData.isShowErr) {
          netErr()
        } else {
          return
        }
      }
    })
  });
}
//get 封装
const getRequestData = function(url, data, token) {
  return new Promise((resolve, reject) => {
    //init
    var postToken = token;
    //网络请求
    wx.request({
      url: url,
      data: data,
      method: 'GET',
      header: {
        Authorization: postToken,
      },
      success: function(res) { //服务器返回数据
        resolve(res);
        if (res.statusCode === 404 || res.statusCode === 500) {
          errHandle() //404 500错误处理
        }
      },
      fail: function(e) {
        if (!app.globalData.isShowErr) {
          netErr()
        } else {
          return
        }
      }
    })
  });
}
//post 封装
const postRequest = function(url, data, token) {
  return new Promise((resolve, reject) => {
    //init
    var postToken = token;
    //网络请求
    wx.request({
      url: url,
      method: 'POST',
      data: data,
      header: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization: postToken
      },
      success: function(res) { //服务器返回数据
        resolve(res);
        if (res.statusCode === 404 || res.statusCode === 500) {
          errHandle() //404 500错误处理
        }
      },
      fail: function(e) {
        if (!app.globalData.isShowErr) {
          netErr()
        } else {
          return
        }
      }
    })
  });
}
//internet err网络错误提示
const netErr = function() {
  wx.hideLoading()
  if (!app.globalData.isGo) {
    app.globalData.isGo = true
    wx.navigateTo({
      url: '/pages/serverError/errPage/errPage',
    })
  } else {
    return
  }
}
//request 无token执行步骤 get
const stepNoneToken = function(url) {
  return new Promise((resolve, reject) => {
    loginTry().then((res) => {
      let openId = JSON.parse(res.data.content).openid
      return loginAuthServer(openId)
    }).then((res) => {
      if (res.statusCode == 200) {
        var loginInfo = res.data;
        wx.setStorageSync("localToken", loginInfo)
        getToken().then((res) => {
          if (res) {
            return getRequest(url, res)
          }
        }).then((res) => {
          if (res.statusCode === 200) {
            resolve(res)
          }
        })
      } else {
        loginFail()
      }
    })
  })
}
//request 无token执行步骤post
const postNoneToken = function(url, data) {
  return new Promise((resolve, reject) => {
    loginTry().then((res) => {
      let openId = JSON.parse(res.data.content).openid
      return loginAuthServer(openId)
    }).then((res) => {
      if (res.statusCode == 200) {
        var loginInfo = res.data;
        wx.setStorageSync("localToken", loginInfo)
        getToken().then((res) => {
          if (res) {
            return postRequest(url, data, res)
          }
        }).then((res) => {
          if (res.statusCode === 200) {
            resolve(res)
          }
        })
      } else {
        loginFail()
      }
    })
  })
}
//request token失效get执行步骤
const tokenOverTime = function(url) {
  wx.showModal({
    title: '提示',
    content: '登录信息失效',
    // showCancel:false,
    success: function(res) {
      if (res.confirm) {
        wx.removeStorageSync("localToken")
        wx.redirectTo({
          url: '/pages/common/login/login',
        })
      }
    }
  })
}
//request token失效post执行步骤
const postTokenOverTime = function(url, data) {
  return new Promise((resolve, reject) => {
    updateToken().then((res) => {
      if (res.statusCode == 200) {
        getToken().then((res) => {
          if (res) {
            return postRequest(url, data, res)
          }
        }).then((res) => {
          if (res.statusCode === 200) {
            resolve(res)
          }
        })
      } else if (res.statusCode == 401) {
        return postNoneToken(url, data)
      }
    })
  })
}
const error = function() {
  wx.showModal({
    title: '提示',
    content: '操作失败',
    showCancel: false
  })
  app.globalData.isGo = true
}
//需要token验证 执行步骤get请求
const getRequestList = function(url, actType, callBack) {
  getToken().then((res) => {
    if (res) {
      return getRequest(url, res)
    }
  }).then((res) => {
    if (res.statusCode === 200) {
      callBack(res, actType)
    } else if (res.statusCode === 401) {
      tokenOverTime(url).then(res => {
        if (res.statusCode === 200) {
          callBack(res, actType) //请求结果处理
        }
      })
    }
  }).catch((res) => {
    if (res.errMsg) {
      // console.log
      error()
    }
  })
}
//需要token验证 执行步骤get有data请求
const getRequestListData = function(url, data, actType, callBack) {
  getToken().then((res) => {
    if (res) {
      return getRequestData(url, data, res)
    }
  }).then((res) => {
    if (res.statusCode === 200) {
      callBack(res, actType)
    } else if (res.statusCode === 401) {
      tokenOverTime(url).then(res => {
        if (res.statusCode === 200) {
          callBack(res, actType) //请求结果处理
        }
      })
    }
  }).catch((res) => {
    if (res.errMsg) {
      error()
      // stepNoneToken(url).then((res) => {
      //   callBack(res, actType)
      // })
    }
  })
}
//需要token验证 执行步骤post请求
const postRequestList = function(url, data, actType, callBack) {
  getToken().then((res) => {
    if (res) {
      return postRequest(url, data, res)
    }
  }).then((res) => {
    if (res.statusCode === 200) {
      callBack(res, actType)
    } else if (res.statusCode === 401) {
      tokenOverTime(url, data).then(res => {
        if (res.statusCode === 200) {
          callBack(res, actType) //请求结果处理
        }
      })
    }
  }).catch((res) => {
    console.log(res)
    error()
    // if (res.errMsg) {
    //   postNoneToken(url, data).then((res) => {
    //     callBack(res, actType)
    //   })
    // }
  })
}
/*获取当前页url*/
const getCurrentPageUrl = function() {
  var pages = getCurrentPages() //获取加载的页面
  var currentPage = pages[pages.length - 1] //获取当前页面的对象
  var url = currentPage.route //当前页面url
  return url
}
//404 500错误处理
const errHandle = function() {
  // wx.navigateTo({
  //   url: '../../pages/erroPage/erroPage',
  // })
  wx.hideLoading()
  var url = getCurrentPageUrl()
  if (!app.globalData.isGo) {
    app.globalData.isGo = true
    wx.navigateTo({
      url: '/pages/serverError/serverPage/serverPage',
    })
  } else {
    return
  }
}
// 获取输入框的值
const inputTest = function(e) {
  let val = e.detail.value,
    pos = e.detail.cursor;
  let reg = /([^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n])|(\s)/g
  var i = reg.test(val)
  if (!reg.test(val)) {
    return {
      value: val
    }
  }
  let obj = regStrFn(val)
  if (pos != -1 && obj.index) {
    //计算光标的位置　　
    pos = obj.index.index
  }
  return {
    value: obj.val,
    cursor: pos
  }
}
//正则表达式匹配
const regStrFn = function(str) {
  let reg = /([^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n])|(\s)/g,
    indexArr = reg.exec(str);
  if (str.match(reg)) {
    str = str.replace(reg, '');
  }
  let obj = {
    val: str,
    index: indexArr
  }
  return obj
}
// 验证输入最多两位小数
const clearNoNum = function(val) {
  // val=toString(val)
  console.log(val)
  //修复第一个字符是小数点 的情况.
  if (val != '' && val.substr(0, 1) == '.') {
    val = "";
  }
  val = val.replace(/^0*(0\.|[1-9])/, '$1'); //解决 粘贴不生效
  val = val.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符
  val = val.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的     
  val = val.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
  val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数     
  if (val.indexOf(".") < 0 && val != "") { //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
    if (val.substr(0, 1) == '0' && val.length == 2) {
      val = val.substr(1, val.length);
    }
  }
  return val
}
const getMoney = function(data) {
  var regexp = /(?:\.0*|(\.\d+?)0+)$/
  var num = (data / 100).toFixed(2)
  // num = num.replace(regexp, '$1')
  // num = toDecimal2(num)
  return num
}

const validateNumber = function(val) {
  return val.replace(/\D/g, '')
}
const setTitle = function() {
  var userinfo = wx.getStorageSync("localToken").userInfo
  wx.setNavigationBarTitle({
    title: userinfo.orgName,
  })
}
const getTimest = function(time) {
  var timeArr = time.split('-')
  var date = new Date(timeArr.join('/'))
  // console.log(date)
  return date.getTime()
}

const uniqueArr = function(array) {
  //一个新的数组 
  var arrs = [];
  //遍历当前数组 
  for (var i = 0; i < array.length; i++) {
    //如果临时数组里没有当前数组的当前值，则把当前值push到新数组里面 
    if (arrs.indexOf(array[i]) == -1) {
      arrs.push(array[i])
    };
  }
  return arrs;
}


const getPrevPage = function() {
  var pages = getCurrentPages()
  return pages[pages.length - 2]
}
const getUserLocation = {
  getAuthSetting: function() {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success: function(res) {
          console.log(res)
          resolve(res)
        },
        fail: function(err) {
          reject(err)
        }
      })
    })
  },
  location: function() {
    return new Promise((resolve, reject) => {
      wx.getLocation({
        type: 'wgs84',
        success: function(res) {
          resolve(res)
        },
        fail: function(err) {
          console.log(err)
          reject(err)
        }
      })
    })
  },
  againAuth: function() {
    let that = this
    return new Promise((resolve, reject) => {
      wx.openSetting({
        success: function(dataAu) {
          if (dataAu.authSetting["scope.userLocation"] == true) {
            wx.showToast({
              title: '授权成功',
              icon: 'success',
              duration: 1000
            })
            that.location().then(res => {
              resolve(res)
            }).catch(err => {
              reject(err)
            })
          } else {
            wx.showToast({
              title: '授权失败',
              icon: 'none',
              duration: 1500
            })
          }
        },
        fail: function(err) {
          reject(err)
        }
      })
    })
  }
}
/**
 ** 加法函数，用来得到精确的加法结果
 ** 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
 ** 调用：accAdd(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 **/
const accAdd = function(arg1, arg2) {
  var r1, r2, m, c;
  try {
    r1 = arg1.toString().split(".")[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  } catch (e) {
    r2 = 0;
  }
  c = Math.abs(r1 - r2);
  m = Math.pow(10, Math.max(r1, r2));
  if (c > 0) {
    var cm = Math.pow(10, c);
    if (r1 > r2) {
      arg1 = Number(arg1.toString().replace(".", ""));
      arg2 = Number(arg2.toString().replace(".", "")) * cm;
    } else {
      arg1 = Number(arg1.toString().replace(".", "")) * cm;
      arg2 = Number(arg2.toString().replace(".", ""));
    }
  } else {
    arg1 = Number(arg1.toString().replace(".", ""));
    arg2 = Number(arg2.toString().replace(".", ""));
  }
  return (arg1 + arg2) / m;
}
/**
 ** 减法函数，用来得到精确的减法结果
 ** 说明：javascript的减法结果会有误差，在两个浮点数相减的时候会比较明显。这个函数返回较为精确的减法结果。
 ** 调用：accSub(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 **/
const accSub = function(arg1, arg2) {
  var r1, r2, m, n;
  try {
    r1 = arg1.toString().split(".")[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  } catch (e) {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
  n = (r1 >= r2) ? r1 : r2;
  return ((arg1 * m - arg2 * m) / m).toFixed(n);
}
/*  除法函数，用来得到精确的除法结果
说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回
较为精确的除法结果。
调用：accDiv(arg1,arg2)
    返回值：arg1除以arg2的精确结果
*/
const accDiv = function(arg1, arg2) {
  var t1 = 0,
    t2 = 0,
    r1, r2;
  try {
    t1 = arg1.toString().split(".")[1].length
  } catch (e) {}
  try {
    t2 = arg2.toString().split(".")[1].length
  } catch (e) {}
  r1 = Number(arg1.toString().replace(".", ""));
  r2 = Number(arg2.toString().replace(".", ""));
  return (r1 / r2) * Math.pow(10, t2 - t1);
}
//说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。 
//调用：accMul(arg1,arg2) 
//返回值：arg1乘以arg2的精确结果 
const accMul = function(arg1, arg2) {
  var m = 0,
    s1 = arg1.toString(),
    s2 = arg2.toString();
  try {
    m += s1.split(".")[1].length
  } catch (e) {}
  try {
    m += s2.split(".")[1].length
  } catch (e) {}
  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
}
// 转化成小数, 原函数toDecimal(datavalue)存在的精度问题，因涉及过多屏蔽。
const toDecimal = function(datevalue) {
  if (datevalue.indexOf('%') != -1) {
    datevalue = datevalue.replace(/%/g, '');
    if (datevalue.indexOf(',') != -1) {
      datevalue = datevalue.replace(/,/g, '');
    }
    // 除100精度在原有基础上增加2位。
    var decimal = (datevalue.indexOf('.') == -1) ? 0 : (datevalue.length - datevalue.indexOf('.') - 1);
    datevalue = accDiv(datevalue, 100).toFixed(decimal + 2);
    //     alert("toDecimal: " + datevalue);
  } else {
    if (datevalue.indexOf(',') != -1) {
      datevalue = datevalue.replace(/,/g, '');
    }
  }
  return datevalue;
}
// 获取下一页
const getNextPage = function(that, totalPage, callback) {
  console.log(totalPage)
  console.log(that.data.pageNum)
  if (totalPage > that.data.pageNum) {
    that.setData({
      pageNum: ++that.data.pageNum
    })
    console.log('99')
    callback()
  } else {
    wx.showToast({
      title: '已经是最后一页~',
    })
  }
}
const formatMoney = function(s, n) {
  return s
}
const getNowDate = function() {
  var date = new Date()
  let year = date.getFullYear()
  let month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)
  var day = date.getDate() > 9 ? date.getDate() + 1 : "0" + (date.getDate() + 1)
  let nowDate = [year, month, day].join('-')
  return nowDate
}
const getNowTime = function (time) {
  var date = time?new Date(time):new Date()
  let year = date.getFullYear()
  let month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)
  var day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate() 
  const hour = date.getHours() > 9 ? date.getHours() : "0" + date.getHours()
  const minute = date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes() 
  const second = date.getSeconds() > 9 ? date.getSeconds(): "0" + date.getSeconds() 
  let nowTime = [year, month, day].join('/') + ' ' + [hour, minute].join(':')
  return nowTime
}
module.exports = {
  formatTime: formatTime,
  getRequestList: getRequestList,
  getRequestListData: getRequestListData,
  postRequestList: postRequestList,
  getWxOpenId: getWxOpenId,
  inputTest: inputTest,
  clearNoNum: clearNoNum,
  getMoney: getMoney,
  validateNumber: validateNumber,
  setTitle: setTitle,
  getTimest: getTimest,
  formatDate: formatDate,
  formatDateAn: formatDateAn,
  getPrevPage: getPrevPage,
  uniqueArr: uniqueArr,
  getUserLocation: getUserLocation,
  accAdd: accAdd,
  accSub: accSub,
  accDiv: accDiv,
  accMul: accMul,
  toDecimal: toDecimal,
  getNextPage: getNextPage,
  formatMoney: formatMoney,
  getNowDate: getNowDate,
  getNowTime: getNowTime,
  formatGetDayRange:formatGetDayRange
}