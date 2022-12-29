var Time = {
    // 获取当前时间戳
    getUnix: function () {
        var date = new Date();
        return date.getTime();
    },
    // 获取今天0点0分0秒的时间戳
    getTodayUnix: function () {
        var date = new Date();
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        return date.getTime();
    },
    // 获取今年1月1日0点0分0秒的时间戳
    getYearUnix: function () {
        var date = new Date();
        date.setMonth(0);
        date.setDate(1);
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        return date.getTime();
    },
    // 获取标准年月日
    getLastDate: function(time) {
        var date = new Date(time);
        var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
        var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        return date.getFullYear() + '-' + month + "-" + day;
    },
    // 转换时间
    getFormatTime: function(bindingTime) {
        
        let timestamp=new Date(bindingTime).getTime()  
        var now = this.getUnix();    //当前时间戳
        var today = this.getTodayUnix(); //今天0点时间戳
        // var year = this.getYearUnix();   //今年0点时间戳
        var timer = (now - timestamp) / 1000;   // 转换为秒级时间戳
        var tip = '';
 
        if (timer <= 0) {
            tip = '刚刚';
        } else if (Math.floor(timer/60) <= 0) {
            tip = '刚刚';
        } else if (timer < 3600) {
            tip = Math.floor(timer/60) + '分钟前';
        } else if (timer >= 3600 && (timestamp - today >= 0) ) {
            tip = Math.floor(timer/3600) + '小时前';
        } else if (timer/86400 <= 31) {
            tip = Math.ceil(timer/86400) + '天前';
        } else {
            tip = this.getLastDate(timestamp);
        }
        return tip;
    },
    // 转换聊天时间
    // getFormatChatTime: function(bindingTime) {
        
    //     let timestamp=new Date(bindingTime).getTime()  
    //     let min=new Date(bindingTime).getMinutes()>10?new Date(bindingTime).getMinutes():'0'+new Date(bindingTime).getMinutes()
    //     let hour=new Date(bindingTime).getHours()>10?new Date(bindingTime).getHours():'0'+new Date(bindingTime).getHours()
    //     let time= hour+':'+min
    //     var now = this.getUnix();    //当前时间戳
    //     var today = this.getTodayUnix(); //今天0点时间戳
    //     // var year = this.getYearUnix();   //今年0点时间戳
    //     var timer = (now - timestamp) / 1000;   // 转换为秒级时间戳
    //     var tip = '';
 
    //     if (timer <= 0) {
    //         tip = '刚刚';
    //     } else if (Math.floor(timer/60) <= 0) {
    //         tip = '刚刚';
    //     } else if (timer < 3600) {
    //         tip = time
    //     } else if (timer >= 3600 && (timestamp - today >= 0) ) {
    //         tip = Math.floor(timer/3600) + '小时前';
    //     } else if (timer/86400 <= 31) {
    //         tip = Math.ceil(timer/86400) + '天前';
    //     } else {
    //         tip = this.getLastDate(timestamp);
    //     }
    //     return tip;
    // },
    //判断是否超出3分钟 
    getDeleteShow(data){
        var now = this.getUnix();    //当前时间戳
        let bindingTime=new Date(data.date).getTime()   // 将传来时间转为时间戳
        var timer = (now - bindingTime) / 1000;   // 转换为秒级时间戳
        var tip = '';
        if(timer<=180&&data.uid==data.id){
            tip='block'
        }else{
            tip='none'
        }
        return tip
    }
};
// 时间格式指令
export const directiveTime=
{
    beforeMount: function (el, binding) {
        el.innerHTML = Time.getFormatTime(binding.value);
        el.__timeout__ =setInterval(() => {
            el.innerHTML = Time.getFormatTime(binding.value);
        }, 60000);
    },
    beforeUnmount: function (el) {
        clearInterval(el.__timeout__);
        delete el.__timeout__;
    }
}
export const chatTime=
{
    componentUpdated:function (el, binding) {
        clearInterval(el.__timeout__);
        el.innerHTML = Time.getFormatTime(binding.value);
        el.__timeout__ =setInterval(() => {
            el.innerHTML = Time.getFormatTime(binding.value);
        }, 60000);
    },
    unbind: function (el) {
        clearInterval(el.__timeout__);
        delete el.__timeout__;
    }
}
// 删除指令
export const directiveDeleteShow={
    bind:function(el,binding){
        el.style.display = Time.getDeleteShow(binding.value);
        el.__timeout__ =setInterval(() => {
            el.style.display = Time.getDeleteShow(binding.value);
        }, 60000);
    },
    unbind: function (el) {
        clearInterval(el.__timeout__);
        delete el.__timeout__;
    }
}
export const directiveTextshow={
    inserted:function(el) {
        if (el.scrollHeight>96) {
            el.className=' text-truncate-4 text-sizi-12 mb-2 line-height'
            let span=document.createElement("span");  
            span.className="more info--text"; 
            span.style.cursor='pointer'
            span.innerHTML="点击展开更多"
            span.addEventListener("click",function() {
                span.style.display='none'
                el.className='text-sizi-12 mb-2 line-height'
            }) 
            el.appendChild(span)
        }
    },
}