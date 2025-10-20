//Eventos de validação em tempo real
$('#nome').on('blur', function() {
    validateNome();
});
$('#data').on('blur', function() {
    validateData();
});
$('#peso').on('blur', function() {
    validatePeso();
});
$('#motivo').on('blur', function() {
    validateMotivo();
});

//Intercepta o envio do formulário para validação
$('#cadastroForm').on('submit', function(e) {
    e.preventDefault(); // Impede o envio padrão do formulário
    let isValid = true;
    if (!validateNome()) isValid = false;
    if (!validateData()) isValid = false;
    if (!validatePeso()) isValid = false;
    if (!validateMotivo()) isValid = false;
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

function validateData() {
    const data = $('#data').val().trim(); 
    const dataRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (data === '' || data.length < 10) {
        showError('data', 'A data é obrigatória.');
        return false;
    }
    if (!dataRegex.test(data)) {
        showError('data', 'A data deve estar no formato DD/MM/AAAA.');
        return false;
    }
    // Separar dia, mês e ano
    const [dia, mes, ano] = data.split('/').map(Number);
    // Validar se é uma data válida
    const dataInformada = new Date(ano, mes - 1, dia);
    if (dataInformada.getDate() !== dia || 
        dataInformada.getMonth() !== mes - 1 || 
        dataInformada.getFullYear() !== ano) {
        showError('data', 'Data inválida. Verifique o dia, mês e ano.');
        return false;
    }
    // Validar se a data é anterior ao dia atual
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    if (dataInformada >= hoje) {
        showError('data', 'A data deve ser anterior ao dia atual.');
        return false;
    }
    showSuccess('data');
    return true;
}
// Máscara automática para o campo de data
$('#data').on('input', function(e) {
    let valor = e.target.value.replace(/\D/g, '');
    if (valor.length >= 2) {
        valor = valor.substring(0, 2) + '/' + valor.substring(2);
    }
    if (valor.length >= 5) {
        valor = valor.substring(0, 5) + '/' + valor.substring(5, 9);
    }
    e.target.value = valor;
});


function validatePeso() { 
    const peso = $('#peso').val().trim(); 
    const pesoRegex = /^\d/;  // aceita 00,00kg ou 000,00kg
    if (peso === '') {
        showError('peso', 'O peso é obrigatório.');
        return false;
    }
    if (!pesoRegex.test(peso)) {
        showError('peso', 'Formato inválido.');
        return false;
    }
    return true;
}


function validateMotivo() { 
    const motivo = $('#motivo').val().trim(); 
    const motivoRegex = /^[A-Za-zÀ-ÿ\s]/;  // aceita 00,00kg ou 000,00kg
    if (motivo === '') {
        showError('motivo', 'O motivo é obrigatório.');
        return false;
    }
    if (!motivoRegex.test(motivo)) {
        showError('motivo', '');
        return false;
    }
    return true;
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
}