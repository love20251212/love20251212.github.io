function lovetime() {
    // 1. 设置在一起的起始日期 (注意：月份要减 1，11月写10)
    const startDate = new Date(2025, 11, 12, 0, 0, 0); 
    const today = new Date();

    let diff = today - startDate; // 总毫秒数

    // --- 计算年数 ---
    let years = today.getFullYear() - startDate.getFullYear();
    let tempDate = new Date(2025, 11, 12, 0, 0, 0);
    tempDate.setFullYear(startDate.getFullYear() + years);
    
    // 如果还没过今年的纪念日，年数减 1
    if (tempDate > today) {
        years--;
        tempDate = new Date(2025, 11, 12, 0, 0, 0);
        tempDate.setFullYear(startDate.getFullYear() + years);
    }

    // --- 计算剩余的时间差 ---
    let remainDiff = today - tempDate;

    const msPerDay = 24 * 60 * 60 * 1000;
    const msPerHour = 60 * 60 * 1000;
    const msPerMin = 60 * 1000;
    const msPerSec = 1000;

    const days = Math.floor(remainDiff / msPerDay);
    const hours = Math.floor((remainDiff % msPerDay) / msPerHour);
    const minutes = Math.floor((remainDiff % msPerHour) / msPerMin);
    const seconds = Math.floor((remainDiff % msPerMin) / msPerSec);

    // 没有year
    document.getElementById("lovetime").innerHTML = 
    `Since <b>12 Dec 2025</b>, we've already been together for ` +
    `<b>${days}</b> days <b>${hours}</b> hours <b>${minutes}</b> minutes <b>${seconds}</b> seconds.`;
    //有years
    // document.getElementById("lovetime").innerHTML = 
    //     `We have been together for <b style="font-size:1.8rem">${years}</b> years ` +
    //     `<b>${days}</b> days <b>${hours}</b> hours <b>${minutes}</b> minutes <b>${seconds}</b> seconds`;
}

setInterval(lovetime, 1000);
lovetime();


/////////////////////////////////////////////version2
// function lovetime() {
//     // 1. 设置在一起的时间 (注意：月份减 1)
//     // 2018, 11, 19 对应 2018年12月19日。如果是11月19日，请改为 2018, 10, 19
//     var startDate = new Date(2018, 10, 19, 0, 0, 0);
//     var today = new Date();

//     var diff = today - startDate; // 毫秒差

//     // 时间单位换算
//     var msPerSecond = 1000;
//     var msPerMinute = 60 * 1000;
//     var msPerHour = 60 * 60 * 1000;
//     var msPerDay = 24 * 60 * 60 * 1000;

//     // 计算
//     var totalDays = Math.floor(diff / msPerDay);
//     var diffYears = Math.floor(totalDays / 365.25); // 考虑闰年平均值
//     var remainDays = Math.floor((diff % msPerDay) / msPerDay); // 这里逻辑建议直接显示总天数更有冲击力

//     // 如果你想按 年+天+时+分+秒 显示：
//     var d = Math.floor(diff / msPerDay);
//     var h = Math.floor((diff % msPerDay) / msPerHour);
//     var m = Math.floor((diff % msPerHour) / msPerMinute);
//     var s = Math.floor((diff % msPerMinute) / msPerSecond);

//     document.getElementById("lovetime").innerHTML =
//         "我们已经在一起 " + d + "天 " + h + "小时 " + m + "分钟 " + s + "秒啦";
// }

// // 每秒刷新一次
// setInterval(lovetime, 1000);
// // 页面加载立刻执行一次，避免 1 秒空白
// lovetime();

////////////////////////////////////////////version1
// function lovetime() {
//     window.setTimeout("lovetime()", 1000);
//     var seconds = 1000
//     var minutes = seconds * 60
//     var hours = minutes * 60
//     var days = hours * 24
//     var years = days * 365
//     var today = new Date()
//     var todayYear = today.getFullYear()
//     var todayMonth = today.getMonth()
//     var todayDate = today.getDate()
//     var todayHour = today.getHours()
//     var todayMinute = today.getMinutes()
//     var todaySecond = today.getSeconds()
//     // 修改这里时间即可 我的是2018.11.19
//     var t1 = Date.UTC(2018, 11, 19, 0, 0, 0)
//     var t2 = Date.UTC(todayYear, todayMonth, todayDate, todayHour, todayMinute, todaySecond)
//     var diff = t2 - t1
//     var diffYears = Math.floor(diff / years)
//     var diffDays = Math.floor((diff / days) - diffYears * 365)
//     var diffHours = Math.floor((diff - (diffYears * 365 + diffDays) * days) / hours)
//     var diffMinutes = Math.floor((diff - (diffYears * 365 + diffDays) * days - diffHours * hours) / minutes)
//     var diffSeconds = Math.floor((diff - (diffYears * 365 + diffDays) * days - diffHours * hours - diffMinutes *
//         minutes) / seconds)
//     document.getElementById("lovetime").innerHTML = "我们已经在一起 " + diffYears + "年" + diffDays + "天" +
//         diffHours + "小时" + diffMinutes + "分钟" + diffSeconds + "秒啦"
// }
// lovetime()