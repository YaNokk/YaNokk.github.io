export function editChart(chart, type, value, dataSetIndex, rowIndex){
    if (type === 'label') {
        chart.data.datasets[dataSetIndex][type] = value;
    }
    else{
        chart.data.datasets[dataSetIndex].data[rowIndex][type] = value;
    }
}
export function chartChange({chart, nameS, dateS, priceS, newDataTriggerS, saveTriggerS, parentS, sortFunction, colorFunction, renderFunction, validator, modalClose, modalS, clearModal, dataList}){
    const name = document.querySelector(nameS),
    date = document.querySelector(dateS),
    price = document.querySelector(priceS),
    newDataButton = document.querySelector(newDataTriggerS),
    saveDataButton = document.querySelector(saveTriggerS),
    parent = document.querySelector(parentS),
    notification = document.querySelector('.notification');
    
    function addChart(chart, label, price, date) {
        const newDataSet = {
            label: label,
            data: [{
                x: date, 
                y: price
            }],
            borderColor: colorFunction(),
            fill: false,
            borderWidth: 3
        }
        chart.data.datasets.push(newDataSet);
        chart.update();
    };
    
    function updateChart(chart, price, date, index) {
        const newDataSetItem = {
            x : date,
            y : price
        };
        chart.data.datasets[index].data.push(newDataSetItem);
        chart.data.datasets[index].data.sort(sortFunction);
        chart.update();
    }
    
    function deleteChart(chart, dataSetIndex, dataSetItemIndex) {
        chart.data.datasets[dataSetIndex].data.splice(dataSetItemIndex, 1);
        chart.data.datasets[dataSetIndex].data.sort(sortFunction);
    }

    newDataButton.addEventListener('click', () => {
        if (validator([name, date, price])){
            let flag = false;
            chart.data.datasets.forEach((element, index) => {
                if (element.label === name.value) {
                    flag = true;
                    updateChart(chart, price.value, moment(date.value).format('DD/MM/YYYY'), index);
                    renderFunction(chart, parent, deleteChart);
                }
            })
            if (flag == false) {
                addChart(chart, name.value, price.value, moment(date.value).format('DD/MM/YYYY'));
                renderFunction(chart, parent, deleteChart);
            }
            if (chart.data.datasets.length > 0 && notification) {
                notification.remove();
            }
            modalClose(document.querySelector(modalS));
            clearModal(chart, dataList);
            localStorage.setItem('dataSets', JSON.stringify(chart.data.datasets));
        }
    })

    saveDataButton.addEventListener(('click'), () => {
        localStorage.setItem('dataSets', JSON.stringify(chart.data.datasets));
        chart.update();
    });

    document.querySelector('tbody').addEventListener('click', (e) => {
    if (e.target.getAttribute('data-table_delete') === '') {
        deleteChart(chart, +e.target.getAttribute('data-cellIndex'), +e.target.getAttribute('data-trashIndex'));
        renderFunction(chart, document.querySelector('.table_body'));
        chart.update();
    }
});
}