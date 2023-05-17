export const createAlert = (element, message, type, duration) => {
    const alert = document.createElement('div');
    alert.classList.add('alert', `alert-${type}`, 'alert-dismissible', 'fade', 'show');
    alert.setAttribute('role', 'alert');
    alert.innerHTML = `
        <strong>${message}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    element.appendChild(alert);

    setTimeout(() => alert.remove(), duration?? 5000);
}

export const createTrEmptyMessage = (tbody, colspan, message) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td class="text-center fw-bold" colspan="${colspan}">${message}</td>
    `;

    tbody.appendChild(tr);
}