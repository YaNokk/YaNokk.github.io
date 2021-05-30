export function modalOpen(modal){
    modal.classList.toggle('show');
}
export function modalClose(modal){
    modal.classList.remove('show');
    document.body.style.overflow = '';
};

export function clearModal(chart, dataListS){
    const dataList = document.querySelector(dataListS);
    dataList.innerHTML = '';
    [...new Set(chart.data.datasets)].forEach(e => dataList.innerHTML += `<option value=${e.label}>`);
    document.querySelectorAll('.modal_input').forEach(e => e.value = '');
    [...document.querySelectorAll('.invalid-feedback'), ...document.querySelectorAll('.valid-feedback')].forEach(e => e.remove());
}

export function modal({chart, openTrigger, closeTrigger, modalS, dataListS}){ 
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