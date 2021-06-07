import {getRandomColor, chartSort, validator} from './modules/utilites.js';
import {chart} from './modules/chart.js';
import {cellRender, tableRender, chartformatDate} from './modules/render.js';

chart.data.datasets = JSON.parse(localStorage.getItem('dataSets')) || chart.data.datasets ;
[...new Set(chart.data.datasets)].forEach(e => document.querySelector('#datalistOptions').innerHTML += `<option value=${e.label}>`)
if (chart.data.datasets.length === 0) {
    document.querySelector('.main_table').innerHTML += '<div class="notification">There is currently no data in the table</div>'
}
chart.update();
tableRender(chart, document.querySelector('.table_body'), deleteChart);
document.querySelector('.header_btn').addEventListener('click', () => {
    document.querySelector('.modal').classList.toggle('show');
});
function modalClose(modalS){
    const modal = document.querySelector(modalS);
    modal.classList.toggle('show');
    document.body.style.overflow = '';
};
document.querySelector('.modal').addEventListener('click', (e) => {
    if (e.target === document.querySelector('.modal') || e.target.getAttribute('data-modal_close') === "") {
        modalClose('.modal');
        clearModal();
    }
})

const modalDeafult = 
    `<div class="modal-dialog">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title">New stock</h5>
            <button type="button" class="btn-close" data-modal_close aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <input type="text" class="modal_input" placeholder="Tesla" id="name">
            <input type="date" class="modal_input" placeholder="10/26/2021" id="date" min="1900-01-01" max="3000-12-31">
            <input type="number" class="modal_input" placeholder="850$" id="price">
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-modal_close>Close</button>
            <button type="button" class="btn btn-primary" data-modal_new>Save changes</button>
        </div>
        </div>
    </div>`;

let nameT = document.querySelector('#name'),
dateT = document.querySelector('#date'),
priceT = document.querySelector('#price'),
parent = document.querySelector('.table_body'),
saveBtn = document.querySelector('.editing_btn');
document.querySelector('[data-modal_new]').addEventListener('click', () => {
    nameT = document.querySelector('#name'),
    dateT = document.querySelector('#date'),
    priceT = document.querySelector('#price'),
    parent = document.querySelector('.table_body'),
    saveBtn = document.querySelector('.editing_btn');
    if (validator([nameT,dateT,priceT])){
        let flag = false;
        chart.data.datasets.forEach((element, index) => {
            if (element.label === nameT.value) {
                flag = true;
                updateChart(chart, priceT.value, moment(dateT.value).format('DD/MM/YYYY'), index);
                tableRender(chart, parent, deleteChart);
            }
        })
        if (flag == false) {
            addChart(chart, nameT.value, priceT.value, moment(dateT.value).format('DD/MM/YYYY'));
            tableRender(chart, parent, deleteChart);
        }
        if (chart.data.datasets.length > 0 && document.querySelector('.notification')) {
            document.querySelector('.notification').remove();
        }
        modalClose('.modal');
        clearModal(document.querySelector('.modal'), modalDeafult);
        localStorage.setItem('dataSets', JSON.stringify(chart.data.datasets));
    }
})

document.querySelector('#table').addEventListener('input', (e) => {
    clearModal();
    if ((e.target.nodeName === 'INPUT') && validator([e.target])) {
        editChart(chart, e.target.getAttribute('data-type'), e.target.innerHTML || chartformatDate(e.target.value), +e.target.getAttribute('data-dataset'), +e.target.getAttribute('data-rowindex'));
        localStorage.setItem('dataSets', JSON.stringify(chart.data.datasets));
        chart.update();
    }
});

function editChart(chart, type, value, dataSetIndex, rowIndex){
    if (type === 'label') {
        chart.data.datasets[dataSetIndex][type] = value;
    }
    else{
        chart.data.datasets[dataSetIndex].data[rowIndex][type] = value;
    }
}

function addChart(chart, label, price, date) {
    const newDataSet = {
        label: label,
        data: [{
            x: date, 
            y: price
        }],
        borderColor: getRandomColor(),
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
    chart.data.datasets[index].data.sort(chartSort);
    chart.update();
}

function deleteChart(chart, dataSetIndex, dataSetItemIndex) {
    chart.data.datasets[dataSetIndex].data.splice(dataSetItemIndex, 1);
    chart.data.datasets[dataSetIndex].data.sort(chartSort);
}

function sortTableByColumn(table, column, asc = true) {
    const dirModifier = asc ? 1 : -1;
    const tBody = table.tBodies[0];
    const rows = Array.from(tBody.querySelectorAll("tr"));
    let sortedRows;
    if (column === 0) {
            sortedRows = rows.sort((a, b) => {
            const aColText = Number(a.childNodes[1].childNodes[0].innerHTML);
            const bColText = Number(b.childNodes[1].childNodes[0].innerHTML);
            return aColText > bColText ? (1 * dirModifier) : (-1 * dirModifier);
        });
    }
    if (column === 1) {
            sortedRows = rows.sort((a, b) => {
            const aColText =a.childNodes[3].childNodes[0].innerHTML;
            const bColText = b.childNodes[3].childNodes[0].innerHTML;
            return aColText > bColText ? (1 * dirModifier) : (-1 * dirModifier);
        });
    }
    if (column === 2) {
        sortedRows = rows.sort((a, b) => {
        const aColText = Number(moment(a.childNodes[5].childNodes[0].value.replace(/-/gim, '/')));
        const bColText = Number(moment(b.childNodes[5].childNodes[0].value.replace(/-/gim, '/')));
        return aColText > bColText ? (1 * dirModifier) : (-1 * dirModifier);
        });
    }
    if (column === 3) {
        sortedRows = rows.sort((a, b) => {
            const aColText = Number(a.childNodes[7].childNodes[0].value);
            const bColText = Number(b.childNodes[7].childNodes[0].value);
            return aColText > bColText ? (1 * dirModifier) : (-1 * dirModifier);
        });
    }

    while (tBody.firstChild) {
        tBody.removeChild(tBody.firstChild);
    }
    tBody.append(...sortedRows);
    table.querySelectorAll("th").forEach(th => th.classList.remove("th-sort-asc", "th-sort-desc"));
    table.querySelector(`th:nth-child(${ column + 1})`).classList.toggle("th-sort-asc", asc);
    table.querySelector(`th:nth-child(${ column + 1})`).classList.toggle("th-sort-desc", !asc);
}

document.querySelectorAll(".cell-sortable").forEach(headerCell => {
    headerCell.addEventListener("click", () => {
        const tableElement = document.querySelector('#table');
        const headerIndex = Array.prototype.indexOf.call(headerCell.parentElement.children, headerCell);
        const currentIsAscending = headerCell.classList.contains("th-sort-asc");
        sortTableByColumn(tableElement, headerIndex, !currentIsAscending);
    });
});

document.querySelector('tbody').addEventListener('click', (e) => {
    if (e.target.getAttribute('data-table_delete') === '') {
        deleteChart(chart, +e.target.getAttribute('data-cellIndex'), +e.target.getAttribute('data-trashIndex'));
        tableRender(chart, document.querySelector('.table_body'));
        if (chart.data.datasets.length === 0) {
            const notification = document.createElement('div');
            notification.innerHTML = `There is currently no data in the table`;
            notification.classList.add(`notification`);
            document.querySelector('.main_table').append(notification);
        }
        localStorage.setItem('dataSets', JSON.stringify(chart.data.datasets));
        clearModal();
        chart.update();
    }
});

function clearModal(){
    document.querySelector('#datalistOptions').innerHTML = '';
    [...new Set(chart.data.datasets)].forEach(e => document.querySelector('#datalistOptions').innerHTML += `<option value=${e.label}></option>`);
    document.querySelectorAll('.modal_input').forEach(e => e.value = '');
    [...document.querySelectorAll('.invalid-feedback'), ...document.querySelectorAll('.valid-feedback')].forEach(e => e.remove());
}
