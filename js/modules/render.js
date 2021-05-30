function cellRender(chart, itemIndex){
    let tableItemCell = '';
    chart.data.datasets[itemIndex].data.forEach((element, index) => {
            tableItemCell += `<tr style="color: ${chart.data.datasets[itemIndex].borderColor}">
            <td class="table_item center" scope="row" width="10"><div>${itemIndex + 1}</div></td>
            <td class="table_item center" width="30%"><div class="center" data-type=label data-dataset=${itemIndex} data-rowindex=${index}>${chart.data.datasets[itemIndex].label}</div></td>
            <td class="table_item center" width=30%><input class="center" data-type=x data-dataset=${itemIndex} data-rowindex=${index} type='date' value="${inputformatDate(element.x)}"></input></td>
            <td class="table_item center" width="30%"><input class="center" data-type=y data-dataset=${itemIndex} data-rowindex=${index} type='number' value="${inputformatDate(element.y)}"></input></td>
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
export {cellRender, tableRender, chartformatDate}