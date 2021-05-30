function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function chartSort(a, b) { 
    let fa = moment(a.x, 'DD/MM/YYYY').valueOf(), fb = moment(b.x, 'DD/MM/YYYY').valueOf(); 
    if(fa < fb) { 
        return -1; 
    } 
    if(fa > fb) { 
        return 1; 
    } 
    return 0; 
}

function validator(dataArray){
    function createNotification(type, message){
        const notification = document.createElement('div');
        notification.innerHTML = message;
        if (type) {
            notification.classList.add("valid-feedback");
        }
        if (!type) {
            notification.classList.add("invalid-feedback");
        }
        return notification;
    }

    let status = true;
    dataArray.forEach(e => {
        switch (e.getAttribute('data-type')) {
            case 'label':
                if (e.value.trim().length < 1) {
                    e.after(createNotification(false, `Please, enter a valid name`));
                    status = false;
                }else{
                    e.after(createNotification(true, `Looks good!`));
                }
                break;
            case 'x':
                if (moment(chartformatDate(e.value), 'DD/MM/YY').isValid()) {
                    e.after(createNotification(true, `Looks good!`));
                }else{
                    e.after(createNotification(false, `Please, enter a valid date`));
                    status = false;
                }
                break;
            case 'y':
                if (e.value < 0.1 || e.value > 10000) {
                    e.after(createNotification(false, `Please, enter a valid price`));
                    status = false;
                }else{
                    e.after(createNotification(true, `Looks good!`));
                }
                break;
            default:
                break;
        }
    })
    return status;
}
function chartformatDate(date){
    return date.split('-').reverse().join('/')
}
export {getRandomColor, chartSort, validator, chartformatDate};