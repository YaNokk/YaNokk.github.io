import {getRandomColor, chartSort, validator, chartformatDate, inputformatDate, sortTableByColumn} from './modules/utilites.js';
import {tableRender} from './modules/render.js';
import {modal, clearModal, modalClose} from './modules/modal.js';
import  {config} from './modules/config.js';
import {chartChange, editChart} from './modules/chartChange.js';

const chart = new Chart(document.getElementById('myChart'), config);
modal({chart : chart, openTrigger: '.header_btn', closeTrigger: '[data-modal_close]', modalS : '.modal', dataListS : '#datalistOptions'});
chartChange({chart: chart, nameS : '#name', dateS : '#date', priceS : '#price', newDataTriggerS : '[data-modal_new]', saveTriggerS : '.editing_btn', parentS : '#table', sortFunction : chartSort, colorFunction : getRandomColor, renderFunction : tableRender, validator : validator, modalClose : modalClose, modalS : '.modal', clearModal : clearModal, dataList : '#datalistOptions'});

chart.data.datasets = JSON.parse(localStorage.getItem('dataSets')) || chart.data.datasets ;
[...new Set(chart.data.datasets)].forEach(e => document.querySelector('#datalistOptions').innerHTML += `<option value=${e.label}>`)
if (chart.data.datasets.length === 0) {
    document.querySelector('.main_table').innerHTML += '<div class="notification">There is currently no data in the table</div>'
}
chart.update();
tableRender(chart, document.querySelector('.table_body'));

document.querySelector('.editing_btn').addEventListener(('click'), () => {
    localStorage.setItem('dataSets', JSON.stringify(chart.data.datasets));
    chart.update();
});
document.querySelector('#table').addEventListener('input', (e) => {
    clearModal(chart, '#datalistOptions');
    if ((e.target.getAttribute('contenteditable') === 'true' || e.target.nodeName === 'INPUT') && validator([e.target])) {
        editChart(chart, e.target.getAttribute('data-type'), e.target.innerHTML || chartformatDate(e.target.value), +e.target.getAttribute('data-dataset'), +e.target.getAttribute('data-rowindex'));
    }
});

document.querySelectorAll(".cell-sortable").forEach(headerCell => {
    headerCell.addEventListener("click", () => {
        const tableElement = document.querySelector('#table');
        const headerIndex = Array.prototype.indexOf.call(headerCell.parentElement.children, headerCell);
        const currentIsAscending = headerCell.classList.contains("th-sort-asc");
        sortTableByColumn(tableElement, headerIndex, !currentIsAscending);
    });
});
