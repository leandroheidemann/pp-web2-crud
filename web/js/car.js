const findCars = async () => {
    const url = 'http://localhost:3000/cars';
    const resp = await fetch(url);
    const data = await resp.json();
    return data;
}

const renderCars = async () => {
    const cars = await findCars();

    if (!cars) {
        return;
    }

    const tbodyCars = document.querySelector('#lista-cars > tbody');

    tbodyCars.innerHTML = '';

    cars.forEach(car => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${car.model}</td>
            <td>${car.year}</td>
            <td>${car.color}</td>
            <td>${car.owner}</td>
        `;
        tbodyCars.appendChild(tr);
    });
}

renderCars();