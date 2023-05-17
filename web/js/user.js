import { Modal } from 'bootstrap';
import { createAlert, createTrEmptyMessage } from '../js/utils.js';

const serverUrl = 'http://localhost:3000/users';
var userId = null;
const debounceTime = 300;

var openModalButton = document.getElementById('open-modal');
openModalButton.onclick = (event) => {
    event.preventDefault();

    openModal();
};

const modalEl = document.getElementById('modal-user');
const modal = new Modal(modalEl, {
    keyboard: false
});

function handlerError(error, message) {
    createAlert(alerts, message, 'danger');

    console.error(error);
}
function hasParams(url) {
    return url.includes('?');
}

async function buscarUsuarios() {
    try {
        const userName = document.getElementById('filter-name').value;

        var url = serverUrl + '?';

        if (userName) {
            url += `name=${userName}`;
        }

        const username = document.getElementById('filter-username').value;

        if (username) {
            url += hasParams(url) ? '&' : '';
            url += `username=${username}`;
        }

        const email = document.querySelector('#filter-email').value;

        if (email) {
            url += hasParams(url) ? '&' : '';
            url += `email=${email}`;
        }

        const resp = await fetch(url);
        const data = await resp.json();
        return data;
    } catch (error) {
        handlerError(error, 'Não foi possível carregar os usuários');
    }
}

async function carregarUsuarios() {
    const users = await buscarUsuarios();

    const tbodyUsers = document.querySelector('#lista-usuarios > tbody');

    if (!users) {
        createTrEmptyMessage(tbodyUsers, 4, 'Nenhum usuário encontrado');

        return;
    }

    tbodyUsers.innerHTML = '';

    users.forEach(user => {
        const tr = document.createElement('tr');
        tr.id = `user-${user.id}`;
        tr.innerHTML = `
            <td>${user.name}</td>
            <td>${user.username ?? 'Não Informado'}</td>
            <td>${user.email}</td>
            <td class="text-center">
                <button id="edit-${user.id}" type="button" class="btn btn-primary btn-sm">
                    <i class="fas fa-user-pen"></i>
                </button>
                <button id="delete-${user.id}" type="button" class="btn btn-danger btn-sm">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;

        const deleteButton = tr.querySelector(`#delete-${user.id}`);
        deleteButton.onclick = () => openModalDelete(user.id);

        const editButton = tr.querySelector(`#edit-${user.id}`);
        editButton.onclick = () => editarUser(user.id);

        tbodyUsers.appendChild(tr);
    });
}

const debouncedProcessInput = debounce(carregarUsuarios, debounceTime);

const filterName = document.querySelector('#filter-name');
filterName.addEventListener("input", function (event) {
    const value = event.target.value;
    debouncedProcessInput(value);
});

const filterUsername = document.querySelector('#filter-username');
filterUsername.addEventListener("input", function (event) {
    const value = event.target.value;
    debouncedProcessInput(value);
});

const filterEmail = document.querySelector('#filter-email');
filterEmail.addEventListener("input", function (event) {
    const value = event.target.value;
    debouncedProcessInput(value);
});

function debounce(func, delay) {
    let timerId;

    return function (...args) {
        clearTimeout(timerId);

        timerId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

const deletarUser = async (id) => {
    try {
        const resp = await fetch(serverUrl + `/${id}`, {
            method: 'DELETE'
        });

        const data = await resp.json();

        if (data.error) {
            throw new Error(data);
        }

        createAlert(alerts, `Usuário ${data.name} excluído com sucesso!`, 'success');

        carregarUsuarios();
    } catch (error) {
        handlerError(error, 'Não foi possível excluir o usuário');
    }
}


async function editarUser(id) {
    try {
        const resp = await fetch(serverUrl + `/${id}`);
        const user = await resp.json();

        modalEl.querySelector('.modal-header').innerHTML = `
                <h5 class="modal-title">Editar Usuário</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            `;

        modal.show();

        const form = document.getElementById('form-user');

        userId = user.id;
        form.name.value = user.name;
        form.username.value = user.username;
        form.email.value = user.email;

        const submitButton = document.getElementById('submit-button');

        submitButton.innerHTML = 'Atualizar';
        submitButton.onclick = (event) => {
            event.preventDefault(); // Prevent the default behavior

            salvarUser();


        };
    } catch (error) {
        handlerError(error, 'Não foi possível carregar o usuário');
    }
}

const salvarUser = async () => {
    var url = serverUrl;

    if (userId) {
        url += `/${userId}`;
    }

    try {
        const form = document.querySelector('#form-user');
        const user = {
            name: form.name.value,
            username: form.username.value,
            email: form.email.value
        };

        const resp = await fetch(url, {
            method: userId ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        const data = await resp.json();

        createAlert(alerts, `Usuário ${data.name} ${userId ? 'atualizado' : 'cadastrado'} com sucesso!`, 'success');

        modal.hide();

        carregarUsuarios();
    } catch (error) {
        handlerError(error, 'Não foi possível atualizar o usuário');
    }
}

const openModal = () => {
    modalEl.querySelector('.modal-header').innerHTML = `
                <h5 class="modal-title">Cadastrar Usuário</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            `;

    modal.show();

    const form = document.getElementById('form-user');

    userId = null;
    form.name.value = '';
    form.username.value = '';
    form.email.value = '';

    const submitButton = document.getElementById('submit-button');

    submitButton.innerHTML = 'Cadastrar';
    submitButton.onclick = (event) => {
        event.preventDefault();

        salvarUser();
    };
}

function openModalDelete(user) {
    const modalEl = document.getElementById('modal-delete');
    const modal = new Modal(modalEl, {
        keyboard: false
    });

    const modalHeader = modalEl.querySelector('.modal-header');
    modalHeader.innerHTML = `
                <h5 class="modal-title">Excluir Usuário</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            `;

    const modalBody = modalEl.querySelector('.modal-body');
    modalBody.innerHTML = `
                <p>Deseja realmente excluir o usuário <strong>${user.name}</strong>?</p>
            `;

    const deleteButtonModal = document.querySelector('#btn-delete');

    deleteButtonModal.onclick = (event) => {
        event.preventDefault();

        deletarUser(user.id);

        modal.hide();

        carregarUsuarios();
    };

    modal.show();
}

carregarUsuarios();