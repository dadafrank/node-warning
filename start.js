const notifier = require('node-notifier');
const shell = require('shelljs');
const lockSystem = require('lock-system');

const warningWord = [
  '看屏幕💻太久咯，起来动动吧！',
  '工作这么久了，看看远方吧。。。🐶',
  '生活不是只有屏幕，还有美好的世界，不看看吗🧐',
  '好累啊🥱，要不休息一会？',
  '喝水喝水喝水！！！🌊',
]
const resetTime = 180000; // 休息时间
let wainingTime = null; // 主循环变量
let waitLockTime = null; // 等待锁屏时间变量
let lastLockTime = null; // 上次锁屏时间

// 执行主函数
main();

// 入口函数
function main() {
  notifier.notify({
    title: 'Frank的提示',
    message: '😊来吧，开始努力工作吧！XD'
  });
  warningMethod(); // 开始执行主循环函数
  sysLockMethod(); // 开始执行监听函数
}

// 监听是否锁定屏幕了
function sysLockMethod() {
  setInterval(() => { // 每1s监听一次
    shell.exec(`
      function screenIsLocked { [ "$(/usr/libexec/PlistBuddy -c "print :IOConsoleUsers:0:CGSSessionScreenIsLocked" /dev/stdin 2>/dev/null <<< "$(ioreg -n Root -d1 -a)")" != "true" ] && return 0 || return 1; }
      if screenIsLocked; then
        echo true
      else
        echo false
      fi
    `, { silent: true }, (code, stdout, stderr) => {
      const isLocked = stdout.trim() === 'false'
      // 当上次未true并且当前false并且距离上次锁定屏幕超过3分钟说明休息了，清除主函数循环
      if (!isLocked && lastLockTime) {
        const time = new Date().getTime();
        if ((time - lastLockTime) < resetTime) {
          notifier.notify({
            title: 'Frank的提示',
            message: '休息3分钟都不到。你自己看是身体重要还是工作重要吧😠'
          });
        } else {
          notifier.notify({
            title: 'Frank的提示',
            message: '休息好了就开始好好工作吧😊'
          });
        }
        lastLockTime = null;
        warningMethod(); // 启动啊！！！
      }
      if (isLocked && !lastLockTime) {
        lastLockTime = new Date().getTime(); // 记录时间
        clearInterval(wainingTime) // 清空定时
        clearTimeout(waitLockTime) // 清空定时
      }
    })
  }, 1000);
}

// 主循环函数
function warningMethod() {
  // 每半小时提醒叮屏幕太久了
  wainingTime = setInterval(() => {
    const randomNum = Math.round(Math.random() * (warningWord.length - 1))
    notifier.notify({
      title: 'Frank的提示',
      message: warningWord[randomNum],
      sound: true,
      actions: '点击锁定屏幕'
    }, (err, response) => {
      if (response === 'activate') { // 用户点击，则锁定屏幕
        lockSystem()
      }
    });
    // 1分钟还不关屏幕开启循环模式
    waitLockTime = setTimeout(() => {
      secondWarningMethod()
    }, 60000);
  }, 1800000);
}

// 无限循环函数
function secondWarningMethod() {
  clearInterval(wainingTime)
  notifier.notify({
    title: 'Frank的提示',
    message: '再不锁屏就要进入无限提示模式了！😠',
    sound: true,
    actions: '锁定屏幕'
  }, (err, response) => {
    if (response === 'activate') { // 用户点击，则锁定屏幕
      lockSystem()
    }
  });
  // 每10秒提醒叮屏幕太久了
  wainingTime = setInterval(() => {
    const randomNum = Math.round(Math.random() * (warningWord.length - 1))
    notifier.notify({
      title: 'Frank的提示',
      message: warningWord[randomNum],
      sound: true,
      actions: '锁定屏幕'
    }, (err, response) => {
      if (response === 'activate') { // 用户点击，则锁定屏幕
        lockSystem()
      }
    });
  }, 10000);
}