const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export const dayTimeToDate = (dt) => {
    const date  = new Date(dt * 1000);

    const  hours = date.getHours();
    const  minutes = "0" + date.getMinutes();
    const  seconds = "0" + date.getSeconds();

    return months[date.getMonth()] +'-' + date.getDate() + '-' + date.getFullYear() + ' ' + hours +  ':'  +  minutes.substr(-2) + ':' + seconds.substr(-2);
}