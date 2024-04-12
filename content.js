console.log("Giaoculator is Running");
const LoginPattern = "https://tsinglanstudent.schoolis.cn/";
const LoginPattern2 = "https://tsinglanstudent.schoolis.cn/#!/";
if(window.location.href===LoginPattern || window.location.href===LoginPattern2){
    diyHomepage();
}else if(document.getElementsByClassName("ng-binding fe-components-stu-business-login-enter-box-__forgetLink--33qRdR5UpfjVrt3C_MdyYR").length>0){
    window.location.href = LoginPattern;
}
SHOW_REFRESH = false;
var tmp_stopHide = false;
var clicked_disclamer = false;

if(window.location.href==="http://4.3.2.1/homepage/login.html"){
    window.location.href="http://4.3.2.1";
}else if(window.location.href.includes("view.officeapps.live.com")){
    directDownloadFile_AddBtn();
}



chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    // 尝试结合两个版本的功能：使用chrome.storage.local来检查enable_state，并保留disable_autologin逻辑。
    chrome.storage.local.get('enable_state', function(result) {
        let type = message.type;
        let data = message.data;
        if (result.enable_state === true || !result.hasOwnProperty('enable_state') || type.startsWith("bp")) { // 如果enable_state为true或未设置，则继续。
            var disable_autologin = false;
            if (type == "load") {
                console.log("Rec_Do_Load");
                if (data.show == true){
                    const targetElement = document.querySelector('[class*="stu-common-stu-loading"]');
                    if (targetElement) {
                        targetElement.style.display = "table";
                    }
                } else {
                    const targetElement = document.querySelector('[class*="stu-common-stu-loading"]');
                    if (targetElement) {
                        targetElement.style.display = "none";
                    }
                }
            } else if (type == "bp-refresh"){
                location.reload();
            } else if (type == "bp-logpageState"){
                //换位置
            } else if (type == "bp-showRefresh"){
                showHideButtonAtHome();//NEW
            } else if (type == "bp-refresh-click"){
                simulateClickRefresh(0);
            } else if (type == "replace_context"){
                updateContent();
                setTimeout(() => {
                    updateContent();
                }, 100);
            } else if (type == "sim_login"){
                if(disable_autologin == false){
                    simulateClickLogin();
                    setTimeout(() => {
                        simulateClickLogin();
                    }, 1000);
                    sendSeccesstip("自动登录成功");
                    disable_autologin = true;
                }
            } else if (type == "tip_suc"){
                sendSeccesstip(data.cont);
            } else if (type == "tip_err"){
                sendErrortip(data.cont);
            } else if (type == "tip_info"){ // 合并tip_info和tip_info_long的处理
                sendInfotip(data.cont);
            } else if (type == "tip_info_long"){ // 合并tip_info和tip_info_long的处理
                sendInfotipLong(data.cont);
            } else if (type == "tip_alert"){
                sendAlerttip(data.cont);
            } else if (type == "tip_alert_long"){
                sendAlerttipLong(data.cont);
            } else if (type == "rc_infopage"){
                updateContent_DetailPage();
                showGPAcount(0);
            } else if (type == "rc_hidescore"){
                hideScoresRepeatedly(data,10,1500);
                tmp_stopHide = false;
            } else if (type == "rc_hideasm"){
                hideAssignments(data.cont);
                hideAseRepeatedly(data,10,1500);
                hideAseRepeatedly(data,100,3000);
            } else if (type == "bp-GPAcalced"){
                gpaClaced();
            } else if (type == "append2Scores"){
                appendAvgMaxScoresInPage(data,0);
            } else if (type == "bp-GPANotcalced"){
                gpaNotClaced();
            } else if (type == "bp-OpenPageAfterLoginNtw"){
                setTimeout(() => {
                    window.location.href="http://4.3.2.1";
                }, 20);
                setTimeout(() => {
                    window.location.href="http://4.3.2.1";
                }, 60);
            } else if (type == "stat-RenderText") {
                replaceTaskStat(data.cont)
            }
        }
    });
});

function Ntw_SimclickDisclamer(){
    if(!clicked_disclamer){
        var targ = document.getElementById("password_disclaimer");//用于快速点击disclamer选项
        if(targ){
            if(!targ.checked){
                targ.click();
                clicked_disclamer=true;
            }
        }
    }
}
function editPageText(){
    changeBarname(0, " (1)")
    changeBarname(1, " (2)")
    changeBarname(2, " (3)")
    changeBarname(3, " (4)")
}

function updateContent() {
    try {
        const targetElement = document.getElementsByClassName('ng-binding fe-components-stu-app-realtime-list-__updateTime--3zHR7bQeuvOr3Nr0IlpZGI');
        if (targetElement) { 
            for (cnt=0;cnt<targetElement.length;cnt++){
                target = targetElement[cnt];
                if(target.innerText=="首次公布时间：1970-01-01 08:00"){
                    target.innerText="由Giaoculator计算"
                }
                if(target.innerText=="First Publish Time：1970-01-01 08:00"){
                    target.innerText="Calc by Giaoculator"
                }
            }
        }
    } catch (error) {}
    setTimeout(() => {
        const targetElement = document.getElementsByClassName('ng-binding fe-components-stu-app-realtime-list-__updateTime--3zHR7bQeuvOr3Nr0IlpZGI');
        if (targetElement) { 
            for (cnt=0;cnt<targetElement.length;cnt++){
                target = targetElement[cnt];
                // BUG: 如果使用了搜索功能，重新回来这个不会生效
                if(target.innerText=="首次公布时间：1970-01-01 08:00"){
                    target.innerText="由Giaoculator计算"
                }
                if(target.innerText=="First Publish Time：1970-01-01 08:00"){
                    target.innerText="Calc by Giaoculator"
                }
            }
        }
    }, 100);
}

function hideScores(scorelim) {
  const elements = document.getElementsByClassName('fe-components-stu-app-realtime-list-__content--2keQZ3lLv0HwiGHcw7cEeU');
  for (let element of elements) {
    const scoreNumElement = element.querySelector('.fe-components-stu-app-realtime-list-__scoreNum--toPOhGj5JXhKFaxKzn7G1');
    if (scoreNumElement) {
      const score = parseFloat(scoreNumElement.innerText);
      if (score < scorelim) {
        // TODO 加入小眼睛临时显示分数..?
        scoreNumElement.innerHTML = '<img src="' + chrome.runtime.getURL("res/disablev2.png") + '" alt="Disabled" style="width: 190%;" />';

        const scoreInfoElement = element.querySelector('.fe-components-stu-app-realtime-list-__scoreInfo--1d-D_GnPEaK1HTrcgeNURt');
        if (scoreInfoElement) {
          scoreInfoElement.remove();
        }
      }
    }
  }
}

function hideAssignments(settingData) {
    if(tmp_stopHide==true){
        return;
    }
    var scorelim = settingData.autoHide_Condition;
    const elements = document.getElementsByClassName('ng-scope fe-components-stu-app-task-list-__listItem--2LlZEXXtXjZzVCV4Ai9B6y');
    for (let element of elements) {
        try {
            var scoreNumElement = element.querySelector('.fe-components-stu-business-task-list-item-__taskScore--13ruwhA6IFpxEaXteLRQco');
            var totalScoreNum = (element.querySelector('span.ng-binding.ng-scope').textContent.match(/\d+/)[0]) * 1.0;
            if (scoreNumElement) {
                //var score = parseFloat(scoreNumElement.innerText) +"|" +totalScoreNum;
                var score = (parseFloat(scoreNumElement.innerText)/totalScoreNum)*100;
                if (score < scorelim && settingData.autoHide) {
                    scoreNumElement.innerHTML = '<img src="' + chrome.runtime.getURL("res/disable.png") + '" alt="Disabled" style="width: 70%;padding-top:20px;" />';
            
                    const scoreInfoElement = element.querySelector('.fe-components-stu-app-realtime-list-__scoreInfo--1d-D_GnPEaK1HTrcgeNURt');
                    if (scoreInfoElement) {
                        scoreInfoElement.remove();
                    }
                }
            }
        } catch (error) {
        }
        
    }
}


function updateContent_DetailPage() {
    const targetElement = document.getElementsByClassName('fe-components-stu-app-realtime-list-__basicInfoItem--2mLNqht5xhMaGuOPL1rAei');
    if (targetElement) { 
        for (cnt=0;cnt<targetElement.length;cnt++){
            target = targetElement[cnt];
            if(target.innerText=="首次公布时间：1970-01-01 08:00"){
                target.innerText="由Giaoculator计算"
            }
            if(target.innerText=="First Publish Time：1970-01-01 08:00"){
                target.innerText="By Giaoculator"
            }
        }
    } 
    engPage_opti();
    setTimeout(engPage_opti, 30);
}

function engPage_opti(){
    setTimeout(engPage_opti, 100);
    const targetElement2 = document.getElementsByClassName('ng-binding fe-components-stu-app-realtime-list-__modelTitle--8I6j6U9niNNfZsIj8855i');    
    if (targetElement2[0]) { 
        target = targetElement2[0];
        if(target.innerText=="Grade Details"){
            target.innerText="Details"
        }
        return true;
    } else {
        setTimeout(engPage_opti, 100);
        return false;
    }
}



document.onkeydown = function(e) {
    const target = e.target;
    const tagName = target.tagName.toUpperCase();
    const isEditable = target.isContentEditable || tagName === 'INPUT' || tagName === 'TEXTAREA';

    if(e.key === 'Enter' ){
        simulateClickLogin();
    } 

    if (isEditable) {
        console.log("Typing..")
        Ntw_SimclickDisclamer();
        
        return;
    }
    var currentWindow = window.location.href;

    if(e.key === 'Backspace' ){
        hidestudentInfo();
    } 
    if(e.key === 'Escape'){
        simulateClickLogout();
        
    } else if(e.key >= '1' && e.key <= '4'){
        simulateClickBar(e.key.charCodeAt(0) - 49);
    } else if(e.key == 'ArrowLeft' && (currentWindow === "https://tsinglanstudent.schoolis.cn/Home#!/task/list" || currentWindow === "https://tsinglanstudent.schoolis.cn/Home#!/schedule")){
        try{document.getElementsByClassName("fc-prev-button fc-button fc-state-default fc-corner-left fc-corner-right")[0].click();}catch{}
        try{document.getElementsByClassName("ng-scope fe-components-xb-pagination-__pageNumber--1VqmLfGo3J_SMKjULyiFzU fe-components-xb-pagination-__leftIcon--1xTQmlKB0ldX-7LWrTevD4")[0].click();}catch{}
    } else if(e.key == 'ArrowRight' && (currentWindow === "https://tsinglanstudent.schoolis.cn/Home#!/task/list" || currentWindow === "https://tsinglanstudent.schoolis.cn/Home#!/schedule")){
        try{document.getElementsByClassName("fc-next-button")[0].click();}catch{console.log("Notfound")}  
        try{document.getElementsByClassName("ng-scope fe-components-xb-pagination-__pageNumber--1VqmLfGo3J_SMKjULyiFzU fe-components-xb-pagination-__rightIcon--ZSZeXHkbdqtWaqpsNXVn-")[0].click();}catch{}
    } else if(e.key == 'ArrowDown' && currentWindow === "https://tsinglanstudent.schoolis.cn/Home#!/realtime/list"){
        simulateClickRefresh(1);
    } else if(e.key == 'ArrowUp' && currentWindow === "https://tsinglanstudent.schoolis.cn/Home#!/realtime/list"){
        simulateClickRefresh(-1);
    }
};


function simulateClickLogin() {
    try{
        document.getElementsByClassName("fe-components-stu-business-login-enter-box-__signBtn--2VrsqhNGgcjYTh7LuAGzve")[0].click();
    }catch{

    }
}

function simulateClickBar(keyNum) {
    if(true){
        try{
            document.getElementsByClassName("ng-binding ng-scope fe-components-stu-business-topbar-__profileItem--342GOGLPiXlh4W0BfctRIF")[keyNum].click();
        }catch{
    
        }
    }
}

function changeBarname(keyNum, prefix) {
    if(true){
        try{
            var name = document.getElementsByClassName("ng-binding ng-scope fe-components-stu-business-topbar-__profileItem--342GOGLPiXlh4W0BfctRIF")[keyNum].innerText;
            document.getElementsByClassName("ng-binding ng-scope fe-components-stu-business-topbar-__profileItem--342GOGLPiXlh4W0BfctRIF")[keyNum].innerText = name + prefix;
        }catch{
    
        }
    }
}

function simulateClickLogout() {
    if(window.location.href === "https://tsinglanstudent.schoolis.cn/Home#!/task/list/detail"){
        document.getElementsByClassName("ng-binding ng-scope fe-components-xb-location-__router--nsd2ZgXX2cpKLO-r5y7lv")[0].click();
    }
    else{
        try{
            document.getElementsByClassName("fe-components-stu-app-realtime-list-__closeIcon--21rEx3pvaQh2o8ssUTWfBv")[0].click();
        }catch{
            try{
                document.getElementsByClassName("ng-binding fe-components-stu-business-topbar-profile-__liBtn--2o4Tw8hObEQPDm7WM_T2us")[1].click();
            }catch{
                try {
                    document.getElementsByClassName("logout hide")[0].click();
                } catch{
                    
                }
            }
        }
    }
}
function simulateClickRefresh(posChange) {
    var targtext = document.getElementsByClassName("fe-components-xb-pull-btn-__input--3TWoIfVMNo-eszvg3cnXCa")[0].value
    try{
        targlists = document.getElementsByClassName("ng-isolate-scope fe-components-xb-pull-btn-__t_overflow--3OZPYj_1Z20EZZbQur_fl9");
        for(targ in targlists){
            if(targlists[targ].getAttribute('xb-title') == targtext){
                targlists[targ*1.0 +posChange].click();
                continue;
            }
        } 
        setTimeout(() => { 
            updateContent();
            setTimeout(() => { 
                updateContent();
            }, 60);
        }, 25);
        updateContent();
    }catch(e){
    }
}

function sendSeccesstip(cont){
    const notyf = new Notyf
    notyf.success({
        duration: 1500,
        position: {
          x: 'right',
          y: 'bottom',
        },
        dismissible: true,
        message : cont
    })
}

function sendErrortip(cont){
    const notyf = new Notyf
    notyf.error({
        duration: 1500,
        position: {
          x: 'center',
          y: 'bottom',
        },
        dismissible: true,
        message : cont
    })
}

function sendInfotip(cont){
    const notyf = new Notyf({
        types: [
          {
            type: 'info',
            background: "#2884E8",
            icon: false
          }
        ]
      });

    notyf.open({
        type: 'info',
        duration: 2500,
        position: {
          x: 'left',
          y: 'top',
        },
        dismissible: true,
        message : cont
    })
}

function sendInfotipLong(cont){
    const notyf = new Notyf({
        types: [
          {
            type: 'info',
            background: "#2884E8",
            icon: false
          }
        ]
      });

    notyf.open({
        type: 'info',
        duration: 6000,
        position: {
          x: 'left',
          y: 'top',
        },
        dismissible: true,
        message : cont
    })
}

function sendAlerttipLong(cont){
    const notyf = new Notyf({
        types: [
          {
            type: 'warning',
            background: "orange",
            icon: false
          }
        ]
      });

    notyf.open({
        type: 'warning',
        duration: 6000,
        position: {
          x: 'right',
          y: 'top',
        },
        dismissible: true,
        message : cont
    })
}

function sendAlerttip(cont){
    const notyf = new Notyf({
        types: [
          {
            type: 'warning',
            background: 'orange',
            icon: false
          }
        ]
      });

    notyf.open({
        type: 'warning',
        duration: 1500,
        position: {
          x: 'center',
          y: 'bottom',
        },
        dismissible: true,
        message : cont
    })
}

function hideScoresRepeatedly(data, interval, duration) {
    // 计算需要调用的次数
    const times = Math.floor(duration / interval);

    for (let i = 0; i <= times; i++) {
        setTimeout(() => {
            chrome.storage.local.get('enable_state', function(result) {
                if(result.enable_state){
                    hideScores(data.cont);
                }
            });//该实现方式有待优化，可考虑在检测为false时continue
        }, i * interval);
    }
}

function hideAseRepeatedly(data, interval, duration) {
    if(tmp_stopHide==true){
        return;
    }

    const times = Math.floor(duration / interval);
    for (let i = 0; i <= 100; i++) {
        setTimeout(() => {  
            chrome.storage.local.get('enable_state', function(result) {
                if(result.enable_state){
                    hideAssignments(data.cont);
                }
            });//该实现方式有待优化，可考虑在检测为false时continue
        }, i * 2);
    }
    for (let i = 0; i <= times; i++) {
        setTimeout(() => {  
            chrome.storage.local.get('enable_state', function(result) {
                if(result.enable_state){
                    hideAssignments(data.cont);
                }
            });//该实现方式有待优化，可考虑在检测为false时continue
        }, i * interval);
    }
}   



function showStateAtLoginPage(){
    console.log("SHOWSTATE");
    chrome.storage.local.get('enable_state', function(estate) {
        chrome.storage.local.get('user_preference', function(tmp) {
            showStateAtLoginPageMain(tmp,estate.enable_state);
        });
    });

}

function showHideButtonAtHome(){
    showHideButton(tmp_stopHide);
    return;
    chrome.storage.local.get('enable_state', function() {
        chrome.storage.local.get('user_preference', function(tmp) {
            showHideButton(tmp);
        });
    });
}

// 
function changeHideState(){
    console.log(tmp_stopHide);
    tmp_stopHide = !tmp_stopHide;
    showHideButtonAtHome();
    document.getElementsByClassName("fe-components-xb-pagination-__active--38NmY6BWhbJQuJwfItXtYi")[0].click();
    return;
    // 设置显示状态为相反
    chrome.storage.local.get('user_preference', function(tmp) {
        var data = tmp.user_preference;
        data.autoHide = !data.autoHide;
        chrome.storage.local.set({user_preference: data});
    })
    // showHideButtonAtHome();
}

function showHideButton(tmp){
    // if (SHOW_REFRESH) {
    //     return;
    // }
    // SHOW_REFRESH = true;

    // var span = document.createElement('span');
    // span.className = 'ng-scope fe-components-stu-app-task-list-__marR10--3--xJSPS__rgN4cQ4G6FjE';
    // span.style.marginRight = '0';

    // var xb_rest_btn = document.createElement('xb-rest-btn');
    // xb_rest_btn.className = 'ng-isolate-scope';

    // var button = document.createElement('button');
    // button.className = 'ng-binding fe-components-xb-rest-btn-__cancel--GAK6A0SPZh0p3LOnXTukB';
    // button.style.height = '30px';
    //data = tmp.user_preference;
    hidestate = tmp

    // var div = document.querySelector('.fe-components-stu-common-stu-select-bar-__selectDiv--1TuYczJu6_9rrSCwO58S-d');
    // 获取ng-binding fe-components-xb-rest-btn-__cancel--GAK6A0SPZh0p3LOnXTukB的button元素，并将里面的内容替换为img
    button = document.querySelector('.fe-components-xb-rest-btn-__cancel--GAK6A0SPZh0p3LOnXTukB');
    url = chrome.runtime.getURL(hidestate==true ? "res/visOn.svg" : "res/visOff.svg"); // 你的SVG文件路径
    // button.innerHTML = '<img src="' + url + '" alt="*" style="height: 20px; width: 25px; margin-top:5px; fill: #ccc" />';
    if (hidestate==true){
        button.innerHTML = '<span><svg style="height: 20px; width: 25px; margin-top:5px; fill: #222" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"/></svg></span>'
    }else{
        button.innerHTML = '<span><svg style="height: 20px; width: 25px; margin-top:5px; fill: #222" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/></svg></span>'
    }
    // 给Button加上点击事件
    button.onclick = function() {
        changeHideState();
    }



}

function showStateAtLoginPageMain(tmp,estate) {
    var langSet = (navigator.language || navigator.userLanguage).startsWith('zh') ? 'cn' : 'en';
    var content;
    var div = document.querySelector('.fe-components-stu-business-login-enter-box-__signBtnWrap--1hC-pSiXWu5_WJuSPKGEzQ');
    if (!div) {
        console.log('指定的div未找到');
        return;
    }

    data = tmp.user_preference;
    if(data.autoHide==true && estate){
        if(langSet == 'cn'){
            if(data.autoHide_Condition > 100){
                content = '自动隐藏所有数据';
            }else{
                content = '自动隐藏分数低于'+data.autoHide_Condition+'%的数据';
            }
        }else{
            if(data.autoHide_Condition > 100){
                content = 'Auto-Hide Score Limit: Hide All';
            }else{
                content = 'Auto-Hide Score Limit: '+data.autoHide_Condition+'%';
            }
        }
    }else if(estate==false){
        if(langSet == 'cn'){
            content = 'Giaoculator已关闭';
        }else{
            content = 'Giaoculator is Disabled';
        }
    }else{
        if(langSet == 'cn'){
            content = '自动隐藏未开启';
        }else{
            content = 'Auto-Hide Scores Disabled';
        }
    }
    var containerG = document.getElementById('autoHideState');
    if(containerG){
        containerG.remove();
    }
    var container = document.createElement('div');
    container.id = 'autoHideState';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'flex-start';
    container.style.paddingBottom = '10px'; // 假设按钮的下内边距是10px

    // 创建图标img元素
    var iconImg = document.createElement('img');
    iconImg.src = chrome.runtime.getURL(data.autoHide&&estate ? "res/hideOn.svg" : "res/hideOff.svg"); // 你的SVG文件路径
    iconImg.alt = '*';
    iconImg.style.height = '20px'; // 根据需要调整大小
    iconImg.style.width = '25px'; // 根据需要调整大小
    container.appendChild(iconImg);

    // 创建文本
    var textSpan = document.createElement('span');
    textSpan.textContent = content;
    textSpan.style.marginTop = '-1px';
    textSpan.style.fontSize = '12px';
    textSpan.style.paddingLeft = '2px'; // 图标和文本之间的间距
    container.appendChild(textSpan);

    // 最后，将新创建的元素插入到div的第一个子元素（即button）之前
    var button = div.querySelector('button');
    if (button) {
        var myTarget = document.getElementById('autoHideState');
        div.insertBefore(container, button);
        
    } 
}function diyHomepage(){
    chrome.storage.local.get('user_preference', function(result) {
        showStateAtLoginPage();
        var sourcedata = result.user_preference;
        if(result.user_preference.advLogPage){
            setTimeout(() => {
                beautyLoginPage(sourcedata,0);
            }, 1);
            return;
        }
        try {
            var targ = document.getElementsByClassName("fe-components-stu-business-login-enter-box-__schoolBackground--2S3KJugj_l_m7T5hRdY_cv")[0];
            if(source.includes(".mp4"))  {
                targ.children[0].innerHTML = "<div id='video-wrapper' style='width: 100%; height: 100%; position: relative; overflow: hidden;'><video style='width: 100%; height: 100%; object-fit: cover;' autoplay loop muted><source src='"+source+"' type='video/mp4'>Your browser does not support the video tag.</video></div>";
            // } else if(source.includes(".jpg")||source.includes("image")||source.includes(".jpeg")||source.includes(".png")||source.includes(".webp")||source.includes(".svg")||source.includes("tiff")||source.includes("bmp")||source.includes("gif")){
            } else {
                var img = new Image();
                img.onload = function() {
                    // Get the dimensions of the image and the container
                    var imgWidth = img.width;
                    var imgHeight = img.height;
                    var containerWidth = targ.children[0].offsetWidth;
                    var containerHeight = targ.children[0].offsetHeight;

                    // Decide which background size to use based on the dimensions
                    if (imgWidth > containerWidth || imgHeight > containerHeight) {
                        targ.children[0].style.backgroundSize = "cover";
                    } else {
                        targ.children[0].style.backgroundSize = "contain";
                    }

                    // Center the background image and prevent repetition
                    targ.children[0].style.backgroundPosition = "center center";
                    targ.children[0].style.backgroundRepeat = "no-repeat";
                    targ.children[0].style.backgroundImage = "url("+source+")";
                };
                img.src = source;
            } 
        }
        catch (error) {
            // Consider logging the error or handling it as required
        }
    });
}


function gpaClaced(){
    try {
        var langSet = (navigator.language || navigator.userLanguage).startsWith('zh') ? 'cn' : 'en';
        if(langSet == 'cn'){
            setTimeout(() => {
                document.getElementsByClassName("ng-binding fe-components-stu-app-realtime-list-__gpaContentTitle--JYXIB_rCNvSgM5wWcEYdJ")[0].innerText = "学期GPA (计算)";
            }, 20);
            document.getElementsByClassName("ng-binding fe-components-stu-app-realtime-list-__gpaContentTitle--JYXIB_rCNvSgM5wWcEYdJ")[0].innerText = "学期GPA (计算)";
        }else{
            setTimeout(() => {
                document.getElementsByClassName("ng-binding fe-components-stu-app-realtime-list-__gpaContentTitle--JYXIB_rCNvSgM5wWcEYdJ")[0].innerText = "Semester GPA (Calced)";
            }, 20);
            document.getElementsByClassName("ng-binding fe-components-stu-app-realtime-list-__gpaContentTitle--JYXIB_rCNvSgM5wWcEYdJ")[0].innerText = "Semester GPA (Calced)";
        }
    } catch{}
    
} 

function gpaNotClaced(){
    try {
    var langSet = (navigator.language || navigator.userLanguage).startsWith('zh') ? 'cn' : 'en';
    if(langSet != 'cn'){
        document.getElementsByClassName("ng-binding fe-components-stu-app-realtime-list-__gpaContentTitle--JYXIB_rCNvSgM5wWcEYdJ")[0].innerText = "Semester GPA";
    }else{
        document.getElementsByClassName("ng-binding fe-components-stu-app-realtime-list-__gpaContentTitle--JYXIB_rCNvSgM5wWcEYdJ")[0].innerText = "学期GPA";
    }}catch{}
}

function ntwLoginMain(){
    window.location.href = "http://4.3.2.1/ac_portal/20210314173759/pc.html?template=20210314173759&tabs=qrcode-pwd-dingtalk&vlanid=0&_ID_=0&switch_url=&url=";
    dticon = document.getElementsByClassName("auth-way-item-icon dingtalk")[0];
    dticon.src = chrome.runtime.getURL("res/disablev2.png")
}


function beautyLoginPage(srcData,redotimes){
    let colormode = srcData.homeDarkMode*1;
    var loginPageSrc = srcData.homeSrc;
    if(colormode >= 2){
        const hours = new Date().getHours();
        if (hours >= 6 && hours <= 18) {
            colormode = 1;
        } else {
            if(colormode == 3){
                loginPageSrc = srcData.homeSrcDark;
            }
            colormode = 0;
        }
    }
    

    try {
        if(loginPageSrc.includes("<local/jpg-1>")){
            loginPageSrc = chrome.runtime.getURL("usr/1.jpg"); 
        }
        if(loginPageSrc.includes("<local/png-1>")){
            loginPageSrc = chrome.runtime.getURL("usr/1.png"); 
        }
        if(loginPageSrc.includes("<local/mp4-1>")){
            loginPageSrc = chrome.runtime.getURL("usr/1.mp4"); 
        }
        if(loginPageSrc.includes("<local/mov-1>")){
            loginPageSrc = chrome.runtime.getURL("usr/1.mov"); 
        }
        if(loginPageSrc.includes("<local/jpg-2>")){
            loginPageSrc = chrome.runtime.getURL("usr/2.jpg"); 
        }
        if(loginPageSrc.includes("<local/png-2>")){
            loginPageSrc = chrome.runtime.getURL("usr/2.png"); 
        }
        if(loginPageSrc.includes("<local/mp4-2>")){
            loginPageSrc = chrome.runtime.getURL("usr/2.mp4"); 
        }
        if(loginPageSrc.includes("<local/mov-2>")){
            loginPageSrc = chrome.runtime.getURL("usr/2.mov"); 
        }
    }catch (error) {}

    try {
        document.getElementsByClassName('ng-scope fe-components-stu-business-login-enter-box-__headMain--7bzuRu-Sq5O2sOCFgPNQH')[0].children[0].src = chrome.runtime.getURL(colormode?"res/tsLogo_D.png":"res/tsLogo_W.png");
        if(!colormode){
            document.getElementById("autoHideState").children[1].style.color="#E4E4E4"
            const images = document.querySelectorAll('img');
            images.forEach(function(img) {
                if (img.src.includes('hideOn.svg')) {
                    img.src = img.src.replace('hideOn.svg', 'hideOn_Dark.svg');
                }else if (img.src.includes('hideOff.svg')) {
                    img.src = img.src.replace('hideOff.svg', 'hideOff_Dark.svg');
                }
            });
            const textlinks = document.querySelectorAll('a');
            textlinks.forEach(function(textlink) {
                textlink.style.color="#E4E4E4";
            });
            const inputs = document.querySelectorAll('input');
            inputs.forEach(function(tmp) {
                tmp.style.color="#E4E4E4";
            });
        }
        if(loginPageSrc.length<2 || loginPageSrc =="<default>"){
            loginPageSrc = "https://wallpapercave.com/wp/wp4469554.jpg";
        }
        var enterBoxs = document.getElementsByClassName("fe-components-stu-business-login-enter-box-__inputWrap--2OI0SgF-iDEHZborbYzrNZ ");
        document.getElementsByClassName("ng-scope fe-apps-login-__bgWhite--17b4s19HLx5VBdUGMT5Gz0")[0].style.backgroundSize = "cover";
        document.getElementsByClassName("fe-components-stu-business-login-enter-box-__schoolBackground--2S3KJugj_l_m7T5hRdY_cv")[0].remove();
        enterBoxs[0].style.borderRadius='10px'
        enterBoxs[0].style.backdropFilter="blur(10px)"
        enterBoxs[0].style.background=colormode? "rgba(255, 255, 255, .01)" : "rgba(088, 080, 082, .065)"
        enterBoxs[1].style.borderRadius='10px'
        enterBoxs[1].style.backdropFilter="blur(10px)"
        enterBoxs[1].style.background=colormode? "rgba(255, 255, 255, .01)" : "rgba(088, 080, 082, .065)"
        document.getElementsByClassName("ng-binding fe-components-stu-business-login-enter-box-__signBtn--2VrsqhNGgcjYTh7LuAGzve")[0].style.borderRadius='10px'
        //document.getElementsByClassName("ng-binding fe-components-stu-business-login-enter-box-__signBtn--2VrsqhNGgcjYTh7LuAGzve")[0].style.background='rgba(91,138,249,0.5)'
        document.getElementsByClassName('ng-scope fe-components-stu-business-login-enter-box-__headMain--7bzuRu-Sq5O2sOCFgPNQH')[0].children[0].style.maxHeight="95px"
        document.getElementsByClassName("fe-components-stu-business-login-enter-box-__accountContainer--22PmjI_OEsahZLiUEgL4zr")[0].style.paddingTop = "40px"
        document.getElementsByClassName("fe-components-stu-business-login-enter-box-__loginInformation--W2yiibeHcVKj_lJeq1rW_")[0].style.paddingTop = "52px"
        document.querySelector(".fe-components-stu-business-login-enter-box-__loginInformation--W2yiibeHcVKj_lJeq1rW_").style.backdropFilter="blur(10px)"
        document.querySelector(".fe-components-stu-business-login-enter-box-__loginInformation--W2yiibeHcVKj_lJeq1rW_").style.background=colormode? "rgba(255, 255, 255, .7)" : "rgba(038, 040, 042, .065)"
        if(loginPageSrc.includes(".jpg")||loginPageSrc.includes(".heic")||loginPageSrc.includes("image")||loginPageSrc.includes(".jpeg")||loginPageSrc.includes(".png")||loginPageSrc.includes(".webp")||loginPageSrc.includes(".svg")||loginPageSrc.includes("tiff")||loginPageSrc.includes("bmp")||loginPageSrc.includes("gif")){
            document.getElementsByClassName("ng-scope fe-apps-login-__bgWhite--17b4s19HLx5VBdUGMT5Gz0")[0].style.backgroundImage = "url("+loginPageSrc+")";
        } else {
            // 假设 targ 是目标元素，source 是视频源URL
            var targ = document.querySelector('div[ng-controller="login"]'); // 或者用来定位背景元素的其它选择器
            var source = loginPageSrc; // 替换为实际视频URL

            // 创建一个空的div作为视频容器
            var videoContainer = document.createElement('div');
            videoContainer.style.position = 'absolute';
            videoContainer.style.top = '0';
            videoContainer.style.left = '0';
            videoContainer.style.width = '100%';
            videoContainer.style.height = '100%';
            videoContainer.style.overflow = 'hidden';
            videoContainer.style.zIndex = '-1'; // 确保视频在其他内容之下

            // 设置视频HTML字符串
            videoContainer.innerHTML = "<video style='width: 100%; height: 100%; object-fit: cover;' autoplay loop muted><source src='" + source + "' type='video/mp4'>Your browser does not support the video tag.</video>";

            // 将视频容器追加到目标元素
            if (targ) {
                targ.style.background = 'none'; // 移除原背景
                targ.appendChild(videoContainer); // 添加视频容器
            }

    
        }
    } catch (error) {
        if(redotimes<50){
            setTimeout(() => {
                beautyLoginPage(srcData,redotimes+1);
            }, redotimes<6 ? 1 : redotimes);
        }
    }
    try {
        if(!colormode){
            document.getElementsByClassName("fe-components-directive-input-clear-__closeIcon--1-4h2qP26t0bSzIiZPJxT0")[0].remove()
            document.getElementsByClassName("fe-components-directive-input-clear-__closeIcon--1-4h2qP26t0bSzIiZPJxT0")[0].remove()
        }
    } catch (error) {
        
    }
    
}

// 替换任务统计处的文字
function replaceTaskStat(text) {
    // ng-binding fe-components-stu-app-task-stat-__containerBody--37aNor2CicrLBH0qmwwofX
    document.getElementsByClassName("ng-binding fe-components-stu-app-task-stat-__containerBody--37aNor2CicrLBH0qmwwofX")[0].innerText = text;
}

function directDownloadFile() {
    const fullUrl = window.location.href;
    const urlObj = new URL(fullUrl);
    const params = new URLSearchParams(urlObj.search);
    const src = params.get('src');
    
    if (src) {
        window.location.href = src;
    } else {
        console.error('src参数不存在');
    }
}

function directDownloadFile_AddBtn() {
    // 创建按钮
    const btn = document.createElement('button');
    let text =(navigator.language || navigator.userLanguage).startsWith('zh') ? '下载' : 'Download';
    btn.innerHTML = '<img src='+chrome.runtime.getURL("res/download.svg")+' alt="下载" style="height: 20px; vertical-align: middle;"> '+text;
    btn.style.position = 'fixed';
    btn.style.right = '10px';
    btn.id = 'gcalcDownloadBtn';
    btn.style.bottom = '30px';
    btn.style.zIndex = '10000'; // 确保按钮在最顶层
    btn.style.padding = '5px 10px';
    btn.style.border = 'none';
    btn.style.cursor = 'pointer';
    btn.style.borderRadius = '5px';
    // '#007bff'
    btn.style.backgroundColor = '#4CAF50';
    btn.style.color = 'white';
    btn.style.fontSize = '10px';
    btn.style.fontWeight = 'bold';
    btn.onclick = function() {
        directDownloadFile();
    };
    document.body.appendChild(btn);
    if(document.getElementsByClassName("ms-Button root-163").length>4){
        document.getElementById('gcalcDownloadBtn').remove()
    }
}

function showGPAcount(redotimes){
    try {
        if(document.getElementById("gcalc_gpacntstate")){
            return;
        }
        var tiptext;
        let className = document.getElementsByClassName("ng-binding fe-components-stu-app-realtime-list-__gradeName--2NKfjy7pw11NCA7ZnBb5Fs")[0].innerText;
        let subjectName = document.getElementsByClassName("ng-binding fe-components-stu-app-realtime-list-__basicInfoItemValue--3Zx2X_CcFbD3XBxLp_NeFt")[0].innerText;
        let totalInfo = className + subjectName;
        let excludeList_LowWeight = ["Fine Art","IT","Ele","Drama","Chinese Painting","Architectural","Dance","Percussion","Vocal","Media","Programming","Spanish","Philosophy","Skills","Journalism","Creative"];
        let excludeList_NotCNT = ["TSSA","IELTS","TOFEL","Student","Clubs","Homeroom"];
        let categoryLists = document.getElementsByClassName("ng-binding fe-components-stu-app-realtime-list-__scoreListItemLabel--IDO2v_3UsPFqDDV9iQ2ml");
        if(excludeList_LowWeight.some(excludeItem => totalInfo.includes(excludeItem))){
            tiptext=tlang("该科目的GPA计算权重为0.5倍","This Subject Weights 0.5 in GPA Calculation")
        }else if(excludeList_NotCNT.some(excludeItem => totalInfo.includes(excludeItem))){
            tiptext=tlang("该科目不计入GPA计算","This Subject will be ignore in GPA Calculation")
        }else if(totalInfo.includes("C-Hum")){
            tiptext=tlang("该科目与中文计为一科计算","This Subject counts together with Chinese Culture")
        }else if(totalInfo.includes("Chinese")&&!totalInfo.includes("Second")){
            tiptext=tlang("该科目与中文人文计为一科计算","This Subject counts together with C-Humanities")
        }else if(totalInfo.includes("AP")&&!totalInfo.includes("Second")){
            tiptext=tlang("该科目为AP科目，加权0.5计入GPA","This Subject Weights +0.5 in GPA Calculation")
        }else{
            tiptext=tlang("该科目正常计入GPA计算","This Subject Weights 1 in GPA Calculation")
        }
        for(let i=0;i<categoryLists.length;i++){
            var tmp = categoryLists[i].innerText
            if(tmp.includes("Q1")||tmp.includes("Q2")||tmp.includes("Q3")||tmp.includes("Q4")){
                tiptext=tlang("该科目为初中部科目","This Subject is a MS Subject");
            }
        }
        let newHtml="<ul id='gcalc_gpacntstate' ng-class='[styles.scoreListItem,commonStyles.clearFix]' class='fe-components-stu-app-realtime-list-__scoreListItem--3G2orCiXa-n9QRjw05Ii8f fe-shared-css-__clearFix--2mg8N64gHXU6X_nBPlhIaB'> <!-- ngRepeat: items in $ctrl.evaluationProjectList --><!-- end ngRepeat: items in $ctrl.evaluationProjectList --><li ng-repeat='items in $ctrl.evaluationProjectList' class='ng-scope'> <ul ng-class='commonStyles.clearFix' ng-click='toggleChildItem($index)' class='fe-shared-css-__clearFix--2mg8N64gHXU6X_nBPlhIaB'> <li ng-class='[styles.scoreListItemLabel, styles.scoreListItemScoreWeight]' class='ng-binding fe-components-stu-app-realtime-list-__scoreListItemLabel--IDO2v_3UsPFqDDV9iQ2ml' style='font-size:"+tlang(13,11)+"px'>"+tiptext+"</li> <li ng-class='[styles.scoreListItemWeight, styles.scoreListItemScoreWeight]' class='ng-binding fe-components-stu-app-realtime-list-__scoreListItemWeight--285HojRL7boCDLSqVG3jB-'></li> <li ng-class='[styles.scoreListItemScore, styles.scoreListItemScoreWeight]' class='fe-components-stu-app-realtime-list-__scoreListItemScore--1SnqOFUX5PHAR3L-RwXhkl'> <span class='ng-binding'></span> <!-- ngIf: items.evaluationProjectList.length>0 && items.showChild --> <!-- ngIf: items.evaluationProjectList.length>0 && !items.showChild --> </li> </ul> </li></ul>"
        let targetDiv = document.querySelector('.fe-components-stu-app-realtime-list-__scoreList--3yQylVqARJbNb5r06eJd3c');
        if (targetDiv) {
            targetDiv.insertAdjacentHTML('beforeend', newHtml);
        } else {
            console.log('目标元素未找到。');
        }
    } catch (error) {
        setTimeout(() => {
            if(redotimes<30){
                showGPAcount(redotimes+1);
            }
        }, 50);
    }
    
}

function tlang(chi,eng){
    return (navigator.language || navigator.userLanguage).startsWith('zh') ? chi:eng;
}

function hidestudentInfo(){
    try {
        document.getElementsByClassName("fe-components-stu-business-head-img-__faceRadius--1KnMrEFLUQRin87ps3YG_k")[0].src=chrome.runtime.getURL("res/settings.svg");
        document.getElementsByClassName("fe-components-stu-business-topbar-profile-__User--2nAN-ZibOa7TaBGcERbXX0")[0].remove();
        document.getElementsByClassName("fe-components-stu-business-topbar-profile-__navUserBox--XXkgBpUL2yMAg1-Bz8tLq")[0].style="height:10px";
    } catch (error) {}
    try {document.getElementsByClassName("fe-components-stu-business-topbar-profile-edit-__StatisticsTabItem--CudXhV9FC828VnLP4xeqJ")[1].remove()} catch (error) {}
    try {document.getElementsByClassName("fe-components-stu-app-task-detail-__topInfoLi---LQyncvlBCIHhDzj4LFAn fe-components-stu-app-task-detail-__topInfo--2dj7QXyKxrcGchkM3UQrFK fe-components-stu-app-task-detail-__studentInfo--3pYOqsjP22Jx0AnmEkK9HR")[0].remove()} catch (error) {}
}

function appendAvgMaxScoresInPage(data,redotimes){
    try {
        let elementToAppend;
        let targetElement = document.getElementsByClassName("fe-components-stu-app-task-detail-__itemClassInfo--2Ist05O25K5lXA-9nAmiDO")[0]; // 找到目标元素
        if(document.getElementsByClassName("ng-binding ng-scope fe-components-stu-app-task-detail-__itemClassInfoShow--359Ece2CkimkinYlmlxVbP").length==2){
            return;
        }else if(document.getElementsByClassName("ng-binding ng-scope fe-components-stu-app-task-detail-__itemClassInfoShow--359Ece2CkimkinYlmlxVbP").length==1){
            document.getElementsByClassName("ng-binding ng-scope fe-components-stu-app-task-detail-__itemClassInfoShow--359Ece2CkimkinYlmlxVbP")[0].remove();
        }
        let maxS=data.maxS;
        let avgS=data.avgS;
        let iconModel = "<img src="+chrome.runtime.getURL("res/icon.png")+" id='gcalc2ScoresIcon' alt='Ico' style='vertical-align: middle; margin-right: 5px; height: 24px;'>"
        let maxScoreModel = "<p ng-class='styles.itemClassInfoShow' ng-if='taskDetailInfo.displayClassAvgScore' class='ng-binding ng-scope fe-components-stu-app-task-detail-__itemClassInfoShow--359Ece2CkimkinYlmlxVbP'>"+tlang("班级最高成绩:","Class Highest:")+maxS+"</p>"
        let avgScoreModel = "<p ng-class='styles.itemClassInfoShow' ng-if='taskDetailInfo.displayClassAvgScore' class='ng-binding ng-scope fe-components-stu-app-task-detail-__itemClassInfoShow--359Ece2CkimkinYlmlxVbP'>"+tlang("班级平均成绩:","Class Average:")+avgS+"</p>"
        let tempDiv = document.createElement('div'); // 创建一个临时的div元素

        tempDiv.innerHTML = iconModel;
        elementToAppend = tempDiv.firstChild; 
        targetElement.appendChild(elementToAppend);

        tempDiv.innerHTML = avgScoreModel;
        elementToAppend = tempDiv.firstChild; 
        targetElement.appendChild(elementToAppend);
        
        tempDiv.innerHTML = maxScoreModel;
        elementToAppend = tempDiv.firstChild; 
        targetElement.appendChild(elementToAppend);
        setTimeout(() => {
            if(!document.getElementById("gcalc2ScoresIcon")){
                appendAvgMaxScoresInPage(data,redotimes+1)
            }   
        }, 200);
        
    } catch (error) {
        setTimeout(() => {
            if(redotimes<10){
                appendAvgMaxScoresInPage(data,redotimes+1)
            }
            
        }, redotimes*20);
    }
    
}