
const buscarUsuarios = async () => {
    const url = 'http://localhost:3000/users';
    const resp = await fetch(url);
    const data = await resp.json();
    return data;
}

const carregarUsuarios = async () => {
    const users = await buscarUsuarios();
    const tbodyUsers = document.querySelector('#lista-usuarios-body');

    tbodyUsers.innerHTML = '';

    users.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${user.name}</td>
            <td>${user.username ?? 'Não Informado'}</td>
            <td>${user.email}</td>
        `;
        tbodyUsers.appendChild(tr);
    }
    );

}


carregarUsuarios();