//Eventos de validação em tempo real
$('#email').on('blur', function() {
    validateEmail();
});

$('#cref').on('blur', function() {
    validateCREF();
});

$('#senha').on('blur', function() {
    validateSenha();
});

$('#senha').on('input', function () {
    validateSenha($(this).val());
});

$('#conf_senha').on('blur', function() {
    validateConf_senha();
});

//Intercepta o envio do formulário para validação
    $('#cadastroForm').on('submit', function(e) {
        e.preventDefault(); // Impede o envio padrão do formulário
        let isValid = true;
        if (!validateEmail()) isValid = false;
        if (!validateSenha()) isValid = false;
        if (!validateConf_senha()) isValid = false;
        if (isValid) {
            // Redireciona para a tela do professor sem enviar o formulário ao servidor
            window.location.href = 'professormain';
        }
    });

function validateEmail() {
    const email = $('#email').val().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === '') {
        showError('email', 'O email é obrigatório.');
        return false;
    } else if (!emailRegex.test(email)) {
        showError('email', 'Por favor, insira um email válido.');
        return false;
    } else {
        showSuccess('email');
        return true;
    }
}

function validateCREF() {
    const cref = $('#cref').val().trim();
    const crefRegex = /^\d{6}-[A-Z]\/[A-Z]{2}$/;
    if (cref === '') {
        showError('cref', 'O CREF é obrigatório.');
        return false;
    } else if (!crefRegex.test(cref)) {
        showError('cref', 'Insira um CREF válido.');
        return false;
    } else {
        showSuccess('cref');
        return true;
    }
}

function validateSenha(senha, isSubmit) {
    if (senha === undefined) {
        senha = $('#senha').val();
    }

    if (senha.trim() === '') {
        showError('senha', 'A senha é obrigatória.');
        $('#senha-requisitos').html('');
        return false;
    }

    const requisitos = [
        { id: 'min', texto: 'Mínimo 8 caracteres', valido: senha.length >= 8 },
        { id: 'maiuscula', texto: 'Letra maiúscula', valido: /[A-Z]/.test(senha) },
        { id: 'minuscula', texto: 'Letra minúscula', valido: /[a-z]/.test(senha) },
        { id: 'numero', texto: 'Número', valido: /\d/.test(senha) },
        { id: 'especial', texto: 'Caractere especial (@$!%*?&)', valido: /[@$!%*?&]/.test(senha) }
    ];

    const senhaValida = requisitos.every(req => req.valido);

    if (!senhaValida) {
        let html = '<ul style="list-style:none;padding-left:0">';
        requisitos.forEach(req => {
            html += `<li style="color:${req.valido ? 'green' : 'red'}">${req.valido ? '✔' : '✖'} ${req.texto}</li>`;
        });
        html += '</ul>';
        $('#senha-requisitos').html(html);

        if (isSubmit) {
            showError('senha', 'Insira uma senha forte.');
        } else {
            showError('senha', '');
        }
        return false;
    } else {
        $('#senha-requisitos').html(''); // Some com os requisitos
        showSuccess('senha');
        return true;
    }
}

function validateConf_senha() {
    const senha = $('#senha').val();
    const confSenha = $('#conf_senha').val();
    if (confSenha.trim() === '') {
        showError('conf_senha', 'Confirme sua senha.');
        return false;
    }
    if (senha !== confSenha) {
        showError('conf_senha', 'As senhas não coincidem.');
        return false;
    }
    showSuccess('conf_senha');
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

function bSubmit(){
    let isValid = true;
    if (!validateEmail()) isValid = false;
    if (!validateCREF()) isValid = false;
    if (!validateSenha(undefined, true)) isValid = false; // Passa true para mostrar mensagem só no envio
    if (!validateConf_senha()) isValid = false;
    if (isValid) {
        $('#cadastroForm').off('submit').submit();
    }
}

$('#toggleSenha').on('click', function() {
    const input = $('#senha');
    const icon = $(this).find('i');
    if (input.attr('type') === 'password') {
        input.attr('type', 'text');
        icon.removeClass('fa-eye').addClass('fa-eye-slash');
    } else {
        input.attr('type', 'password');
        icon.removeClass('fa-eye-slash').addClass('fa-eye');
    }
});

$('#toggleConfSenha').on('click', function() {
    const input = $('#conf_senha');
    const icon = $(this).find('i');
    if (input.attr('type') === 'password') {
        input.attr('type', 'text');
        icon.removeClass('fa-eye').addClass('fa-eye-slash');
    } else {
        input.attr('type', 'password');
        icon.removeClass('fa-eye-slash').addClass('fa-eye');
    }
});

// Atualize também o evento de submit do formulário:
$('#cadastroForm').off('submit').on('submit', function(e) {
    e.preventDefault();
    bSubmit();
});

$('#cref').on('input', function(e) {
    let value = e.target.value.replace(/[^0-9A-Za-z]/g, '');
    let formatted = '';

    if (value.length > 0) {
        formatted = value.substring(0, 6);
    }

    if (value.length > 6) {
        formatted += '-' + value.substring(6, 7).toUpperCase();
    }

    if (value.length > 7) {
        formatted += '/' + value.substring(7, 9).toUpperCase();
    }

    e.target.value = formatted;
});