/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./js/modules/chartChange.js":
/*!***********************************!*\
  !*** ./js/modules/chartChange.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "editChart": () => (/* binding */ editChart),
/* harmony export */   "chartChange": () => (/* binding */ chartChange)
/* harmony export */ });
function editChart(chart, type, value, dataSetIndex, rowIndex){
    if (type === 'label') {
        chart.data.datasets[dataSetIndex][type] = value;
    }
    else{
        chart.data.datasets[dataSetIndex].data[rowIndex][type] = value;
    }
}
function chartChange({chart, nameS, dateS, priceS, newDataTriggerS, saveTriggerS, parentS, sortFunction, colorFunction, renderFunction, validator, modalClose, modalS, clearModal, dataList}){
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

/***/ }),

/***/ "./js/modules/config.js":
/*!******************************!*\
  !*** ./js/modules/config.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "config": () => (/* binding */ config)
/* harmony export */ });
const config = {
    type: 'line',
    options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 0,
        title: {
            display: true,
            text: "Chart.js Time Scale"
        },
        scales: {
            x: {
                type: "time",
                time: {
                    parser: 'DD/MM/YYYY',
                    tooltipFormat: 'll',
                    minUnit : 'day',
                    displayFormats: {
                        quarter: 'MMM YYYY'
                    }
                },
                ticks: {
                    align: 'center',
                    crossAlign: 'center',
                    padding: 10
                }
            },
            y: {
                ticks: {
                    align: 'center',
                    crossAlign: 'center',
                    padding: 10
                },
                beginAtZero: true
            },
        },
        plugins: {
            legend: {
                labels: {
                    font: {
                        size: 20
                    }
                }
            }
        }
    },
    data: {
        datasets: []
    },
};

/***/ }),

/***/ "./js/modules/modal.js":
/*!*****************************!*\
  !*** ./js/modules/modal.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "modalOpen": () => (/* binding */ modalOpen),
/* harmony export */   "modalClose": () => (/* binding */ modalClose),
/* harmony export */   "clearModal": () => (/* binding */ clearModal),
/* harmony export */   "modal": () => (/* binding */ modal)
/* harmony export */ });
function modalOpen(modal){
    modal.classList.toggle('show');
}
function modalClose(modal){
    modal.classList.remove('show');
    document.body.style.overflow = '';
};

function clearModal(chart, dataListS){
    const dataList = document.querySelector(dataListS);
    dataList.innerHTML = '';
    [...new Set(chart.data.datasets)].forEach(e => dataList.innerHTML += `<option value=${e.label}>`);
    document.querySelectorAll('.modal_input').forEach(e => e.value = '');
    [...document.querySelectorAll('.invalid-feedback'), ...document.querySelectorAll('.valid-feedback')].forEach(e => e.remove());
}

function modal({chart, openTrigger, closeTrigger, modalS, dataListS}){ 
    const modal = document.querySelector(modalS);
    document.querySelector(openTrigger).addEventListener('click', () => {
        modalOpen(modal);
    });
    console.log(document.querySelectorAll(closeTrigger));
    document.querySelectorAll(closeTrigger).forEach(e => e.addEventListener('click', () => {
        modalClose(modal);
    }));

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-modal_close') === "") {
            modalClose(modal);
            clearModal(chart, dataListS);
        }
    })

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modalClose(modal);
        }
    });
}

/***/ }),

/***/ "./js/modules/render.js":
/*!******************************!*\
  !*** ./js/modules/render.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "cellRender": () => (/* binding */ cellRender),
/* harmony export */   "tableRender": () => (/* binding */ tableRender),
/* harmony export */   "chartformatDate": () => (/* binding */ chartformatDate)
/* harmony export */ });
function cellRender(chart, itemIndex){
    let tableItemCell = '';
    chart.data.datasets[itemIndex].data.forEach((element, index) => {
            tableItemCell += `<tr style="color: ${chart.data.datasets[itemIndex].borderColor}">
            <td class="table_item center" scope="row" width="10">${itemIndex + 1}</td>
            <td class="table_item center" width="30%"><input class="center" data-type=label data-dataset=${itemIndex} data-rowindex=${index} contenteditable="true" type='text' value="${chart.data.datasets[itemIndex].label}"></input></td>
            <td class="table_item center" width=30%><input class="center" data-type=x data-dataset=${itemIndex} data-rowindex=${index} contenteditable="true" type='date' value="${inputformatDate(element.x)}"></input></td>
            <td class="table_item center" width="30%"><input class="center" data-type=y data-dataset=${itemIndex} data-rowindex=${index} contenteditable="true" type='number' value="${inputformatDate(element.y)}"></input></td>
            <td class="table_item center" width="7%">
                <div class="btn-group dropstart">
                    <i class="bi bi-three-dots-vertical dots" type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                    </i>
                    <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#"><i class="bi bi-trash" data-cellIndex=${itemIndex} data-trashIndex=${index} data-table_delete></i></a></li>
                    </ul>
                </div>
            </td>
            </tr>`
    });
    return tableItemCell;
}

function tableRender(chart, parent){
    chart.data.datasets = chart.data.datasets.filter(e => e.data.length>0);
    parent.innerHTML = '';
    chart.data.datasets.forEach((element, index) => {
        parent.innerHTML += (cellRender(chart, index));
    })
}

function inputformatDate(date){
    return date.split('/').reverse().join('-')
}
function chartformatDate(date){
    return date.split('-').reverse().join('/')
}


/***/ }),

/***/ "./js/modules/utilites.js":
/*!********************************!*\
  !*** ./js/modules/utilites.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getRandomColor": () => (/* binding */ getRandomColor),
/* harmony export */   "chartSort": () => (/* binding */ chartSort),
/* harmony export */   "validator": () => (/* binding */ validator),
/* harmony export */   "chartformatDate": () => (/* binding */ chartformatDate),
/* harmony export */   "inputformatDate": () => (/* binding */ inputformatDate),
/* harmony export */   "sortTableByColumn": () => (/* binding */ sortTableByColumn)
/* harmony export */ });
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

function sortTableByColumn(table, column, asc = true) {
    const dirModifier = asc ? 1 : -1;
    const tBody = table.tBodies[0];
    const rows = Array.from(tBody.querySelectorAll("tr"));
    const sortedRows = rows.sort((a, b) => {
        const aColText = a.querySelector(`td:nth-child(${ column + 1 })`).textContent.trim() + a.querySelector('input').value.trim();
        const bColText = b.querySelector(`td:nth-child(${ column + 1 })`).textContent.trim() + b.querySelector('input').value.trim();
        return aColText > bColText ? (1 * dirModifier) : (-1 * dirModifier);
    });
    while (tBody.firstChild) {
        tBody.removeChild(tBody.firstChild);
    }
    tBody.append(...sortedRows);
    table.querySelectorAll("th").forEach(th => th.classList.remove("th-sort-asc", "th-sort-desc"));
    table.querySelector(`th:nth-child(${ column + 1})`).classList.toggle("th-sort-asc", asc);
    table.querySelector(`th:nth-child(${ column + 1})`).classList.toggle("th-sort-desc", !asc);
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
function inputformatDate(date){
    return date.split('/').reverse().join('-')
}



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./js/script.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_utilites_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/utilites.js */ "./js/modules/utilites.js");
/* harmony import */ var _modules_render_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/render.js */ "./js/modules/render.js");
/* harmony import */ var _modules_modal_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/modal.js */ "./js/modules/modal.js");
/* harmony import */ var _modules_config_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modules/config.js */ "./js/modules/config.js");
/* harmony import */ var _modules_chartChange_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modules/chartChange.js */ "./js/modules/chartChange.js");






const chart = new Chart(document.getElementById('myChart'), _modules_config_js__WEBPACK_IMPORTED_MODULE_3__.config);
(0,_modules_modal_js__WEBPACK_IMPORTED_MODULE_2__.modal)({chart : chart, openTrigger: '.header_btn', closeTrigger: '[data-modal_close]', modalS : '.modal', dataListS : '#datalistOptions'});
(0,_modules_chartChange_js__WEBPACK_IMPORTED_MODULE_4__.chartChange)({chart: chart, nameS : '#name', dateS : '#date', priceS : '#price', newDataTriggerS : '[data-modal_new]', saveTriggerS : '.editing_btn', parentS : '#table', sortFunction : _modules_utilites_js__WEBPACK_IMPORTED_MODULE_0__.chartSort, colorFunction : _modules_utilites_js__WEBPACK_IMPORTED_MODULE_0__.getRandomColor, renderFunction : _modules_render_js__WEBPACK_IMPORTED_MODULE_1__.tableRender, validator : _modules_utilites_js__WEBPACK_IMPORTED_MODULE_0__.validator, modalClose : _modules_modal_js__WEBPACK_IMPORTED_MODULE_2__.modalClose, modalS : '.modal', clearModal : _modules_modal_js__WEBPACK_IMPORTED_MODULE_2__.clearModal, dataList : '#datalistOptions'});

chart.data.datasets = JSON.parse(localStorage.getItem('dataSets')) || chart.data.datasets ;
[...new Set(chart.data.datasets)].forEach(e => document.querySelector('#datalistOptions').innerHTML += `<option value=${e.label}>`)
if (chart.data.datasets.length === 0) {
    document.querySelector('.main_table').innerHTML += '<div class="notification">There is currently no data in the table</div>'
}
chart.update();
(0,_modules_render_js__WEBPACK_IMPORTED_MODULE_1__.tableRender)(chart, document.querySelector('.table_body'));

document.querySelector('.editing_btn').addEventListener(('click'), () => {
    localStorage.setItem('dataSets', JSON.stringify(chart.data.datasets));
    chart.update();
});
document.querySelector('#table').addEventListener('input', (e) => {
    (0,_modules_modal_js__WEBPACK_IMPORTED_MODULE_2__.clearModal)(chart, '#datalistOptions');
    if ((e.target.getAttribute('contenteditable') === 'true' || e.target.nodeName === 'INPUT') && (0,_modules_utilites_js__WEBPACK_IMPORTED_MODULE_0__.validator)([e.target])) {
        (0,_modules_chartChange_js__WEBPACK_IMPORTED_MODULE_4__.editChart)(chart, e.target.getAttribute('data-type'), e.target.innerHTML || (0,_modules_utilites_js__WEBPACK_IMPORTED_MODULE_0__.chartformatDate)(e.target.value), +e.target.getAttribute('data-dataset'), +e.target.getAttribute('data-rowindex'));
    }
});

document.querySelectorAll(".cell-sortable").forEach(headerCell => {
    headerCell.addEventListener("click", () => {
        const tableElement = document.querySelector('#table');
        const headerIndex = Array.prototype.indexOf.call(headerCell.parentElement.children, headerCell);
        const currentIsAscending = headerCell.classList.contains("th-sort-asc");
        (0,_modules_utilites_js__WEBPACK_IMPORTED_MODULE_0__.sortTableByColumn)(tableElement, headerIndex, !currentIsAscending);
    });
});

})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map