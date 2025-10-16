$(document).ready(function() { 
    $('#cpf').on('input', function(){
        let value = $(this).val().replace(/\D/g, '');
        value = value.replace(/(\d{3})(\d)/, '$1.$2'); 
        value = value.replace(/(\d{3})(\d)/, '$1.$2'); 
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2'); 
        $(this).val(value);
    });
    
    $('#telefone').on('input', function(e) {
        let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não for número
        let formatted = '';

        if (value.length > 0) {
            formatted = '+' + value.substring(0, 2);
        }
        if (value.length > 2) {
            formatted += ' ' + value.substring(2, 4);
        }
        if (value.length > 4) {
            formatted += ' ' + value.substring(4, 9);
        }
        if (value.length > 9) {
            formatted += '-' + value.substring(9, 13);
        }

        e.target.value = formatted;
    });
   
//Eventos de validação em tempo real
$('#nome').on('blur', function() {
    validateNome();
});

$('#cpf').on('blur', function() {
    validateCPF();
});

$('#telefone').on('blur', function() {
    validateTel();
});

$('#numero').on('blur', function() {
    validateNumero();
});

$('#complemento').on('blur', function() {
    validateComp();
});

//Intercepta o envio do formulário para validação
$('#cadastroForm').on('submit', function(e) {
    e.preventDefault(); // Impede o envio padrão do formulário
    let isValid = true;
    if (!validateNome()) isValid = false;
    if (!validateTel()) isValid = false;
    if (!validateCPF()) isValid = false;
    if (!validateCEP()) isValid = false;
    if (!validateEstado()) isValid = false;
    if (!validateCidade()) isValid = false;
    if (!validateBairro()) isValid = false;
    if (!validateRua()) isValid = false;
    if (!validateNumero()) isValid = false;
    if (!validateComp()) isValid = false;

    if (isValid) {
        alert('Formulário enviado com sucesso!');
        // Aqui você pode adicionar o código para realmente enviar o formulário, se necessário
    }
});

function validateNome() {
    const nome = $('#nome').val().trim(); 
    const nomeRegex = /^[A-Za-zÀ-ÿ\s]{5,}$/;
    if (nome === '') {
        showError('nome', 'O nome é obrigatório.');
        return false;
    } else if (!nomeRegex.test(nome)) {
        showError('nome', 'O nome deve ter pelo menos 5 caracteres e conter apenas letras e espaços.');
        return false;
    } else {
        showSuccess('nome');
        return true;
    }
}

function validateNumero(){
    const numero = $('#numero').val().trim().replace(/\D/g, ''); 
    if (numero === '') {
        showError('numero', 'O numero é obrigatório.');
        return false;
    } else {
        showSuccess('numero');
        return true;
    }
}

function validateComp(){
    const complemento = $('#complemento').val().trim().replace(/^[A-Za-zÀ-ÿ\s]{5,}$/); 
    if (complemento === '') {
        showError('complemento', 'O complemento é obrigatório.');
        return false;
    } else {
        showSuccess('complemento');
        return true;
    }
}

function validateCPF() {
    const cpf = $('#cpf').val().replace(/\D/g, '');
    if (cpf === '') {
        showError('cpf', 'O CPF é obrigatório.');
        return false;
    } else if (cpf.length !== 11 || !isValidCPF(cpf)) {
        showError('cpf', 'Por favor, insira um CPF válido.');
        return false;
    } else {
        showSuccess('cpf');
        return true;
    }
}

function validateTel() {
    const telefone = $('#telefone').val().replace(/\D/g, '');
    const telRegex = /^\d/;
    if (telefone === '') {
        showError('telefone', 'O telefone é obrigatório.');
        return false;
    } else if (!telRegex.test(telefone)) {
        showError('telefone', 'Insira um telefone válido.');
        return false;
    } else {
        showSuccess('telefone');
        return true;
    }
}

/*Validar endereco pelo cep*/
let cepInput = document.getElementById('cep');
let ruaInput = document.getElementById('rua');
let bairroInput = document.getElementById('bairro');
let cidadeInput = document.getElementById('cidade');
let estadoInput = document.getElementById('estado');
let numeroInput = document.getElementById('numero');
let messageDiv = document.getElementById('message');
let form = document.getElementById('enderecoForm');

// Máscara para CEP
cepInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 5) {
        value = value.substring(0, 5) + '-' + value.substring(5, 8);
    }
    e.target.value = value;

// Verificar se o CEP está completo
    if (value.replace(/\D/g, '').length === 8) {
        buscarCEP(value.replace(/\D/g, ''));
    } else {
        limparCampos();
        checkIcon.classList.remove('active');
    }
});

async function buscarCEP(cep) {
    // Mostrar loading
    loadingIcon.classList.add('active');
    checkIcon.classList.remove('active');
    cepInput.classList.remove('valid', 'invalid');
    messageDiv.style.display = 'none';
            
// Limpar campos anteriores
limparCampos();
try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();
    loadingIcon.classList.remove('active');
    if (data.erro) {
    // CEP não encontrado
    cepInput.classList.add('invalid');
    showMessage('CEP não encontrado. Verifique e tente novamente.', 'error');
    return;
    }

    // CEP válido - preencher campos
    cepInput.classList.add('valid');
    checkIcon.classList.add('active');
    ruaInput.value = data.logradouro || '';
    bairroInput.value = data.bairro || '';
    cidadeInput.value = data.localidade || '';
    estadoInput.value = data.uf || '';

    // Se algum campo vier vazio, permitir edição
    if (!data.logradouro) {
        ruaInput.removeAttribute('readonly');
        ruaInput.placeholder = 'Digite o nome da rua';
    }
    if (!data.bairro) {
        bairroInput.removeAttribute('readonly');
        bairroInput.placeholder = 'Digite o nome do bairro';
    }

    // Focar no campo de número
    numeroInput.focus();
} catch (error) {
    loadingIcon.classList.remove('active');
    cepInput.classList.add('invalid');
    showMessage('Erro ao buscar CEP. Verifique sua conexão e tente novamente.', 'error');
    console.error('Erro:', error);
    }
}

function limparCampos() {
    ruaInput.value = '';
    bairroInput.value = '';
    cidadeInput.value = '';
    estadoInput.value = '';
            
// Tornar campos readonly novamente
    ruaInput.setAttribute('readonly', 'readonly');
    bairroInput.setAttribute('readonly', 'readonly');
    ruaInput.placeholder = 'Nome da rua';
    bairroInput.placeholder = 'Nome do bairro';
}

function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = 'message ' + type;
    messageDiv.style.display = 'block';
 }

// Validação do formulário
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const cep = cepInput.value.replace(/\D/g, '');
        if (cep.length !== 8) {
            showMessage('Por favor, insira um CEP válido com 8 dígitos.', 'error');
            cepInput.focus();
            return;
        }
        if (!cepInput.classList.contains('valid')) {
            showMessage('Por favor, aguarde a validação do CEP.', 'info');
            return;
        }
        if (!numeroInput.value.trim()) {
            showMessage('Por favor, preencha o número do endereço.', 'error');
            numeroInput.focus();
            return;
        }

// Dados do formulário
    const endereco = {
    cep: cepInput.value,
    rua: ruaInput.value,
    numero: numeroInput.value,
    complemento: document.getElementById('complemento').value,
    bairro: bairroInput.value,
    cidade: cidadeInput.value,
    estado: estadoInput.value
};
    // Aqui você pode enviar os dados para seu backend
    // fetch('/api/salvar-endereco', { method: 'POST', body: JSON.stringify(endereco) })
});

// Permitir apenas números no campo de número
    numeroInput.addEventListener('input', function(e) {
        this.value = this.value.replace(/\D/g, '');
    });

function isValidCPF(cpf) {
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(9))) return false;
        sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    return remainder === parseInt(cpf.charAt(10));
    }

function showError(field, message) {
    $(`#${field}`).addClass('error').removeClass('success');
    $(`#${field}-error`).text(message);
}

function showSuccess(field) {
    $(`#${field}`).addClass('success').removeClass('error');
    $(`#${field}-error`).text('');
}

function clearError(field) {
    $(`#${field}-error`).text('');
}});