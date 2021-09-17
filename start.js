const notifier = require('node-notifier');
const shell = require('shelljs');

const wainingWord = [
  '看屏幕💻太久咯，起来动动吧！',
  '工作这么久了，看看远方吧。。。🐶',
  '生活不是只有屏幕，还有美好的世界，不看看吗🧐',
  '好累啊🥱',
  '喝水喝水喝水！！！🌊',
]
const resetTime = 180000; // 修复时间
let wainingTime = null; // 主循环变量
let lastLockTime = null; // 上次锁屏时间

// 执行主函数
main();

// 入口函数
function main() {
  notifier.notify('😊来吧，开始努力工作吧！XD');
  wainingMethod(); // 开始执行主循环函数
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
          notifier.notify('行吧，3分钟都不到。你自己看是身体重要还是工作重要吧😠');
        }
        lastLockTime = null;
        wainingMethod(); // 启动啊！！！
      }
      if (isLocked && !lastLockTime) {
        lastLockTime = new Date().getTime(); // 记录时间
        clearInterval(wainingTime) // 清空定时
      }
    })
  }, 1000);
}

// 主循环函数
function wainingMethod() {
  // 每半小时提醒叮屏幕太久了
  wainingTime = setInterval(() => {
    const randomNum = Math.round(Math.random() * (wainingWord.length - 1))
    notifier.notify(wainingWord[randomNum]);
  }, 1800000);
}

// 次循环函数
function secondWarningMethod() {
  // 每一分钟提醒叮屏幕太久了
  wainingTime = setInterval(() => {
    const randomNum = Math.round(Math.random() * (wainingWord.length - 1))
    notifier.notify(wainingWord[randomNum]);
  }, 60000);
}




// function wainingMethod() {
//   // 每半小时提醒叮屏幕太久了
//   wainingTime = setInterval(() => {
//     const randomNum = Math.round(Math.random() * (wainingWord.length - 1))
//     notifier.notify(wainingWord[randomNum]);
//   }, 2000);
// }


// 如果是工作日，判断是白天还是晚上
// 白天的话就启动好好工作的提示
// 然后进入循环的提示
// 晚上的话启动工作辛苦了，晚上回来还要继续学习
// 然后进入循环的提示

// 放假的话
// 最好判断下今天是否已经学习了，如果晚上才的话就提示白天为什么没有工作，晚上要加倍了，否则就说辛苦了，晚上还这么努力
// 如果是中午就进入学习，就提示周末也要好好加油啊

// 最好记录一下上次学习的时间*****
