$('#email').on('blur', function () {
    validateEmail();
});

$('#senha').on('blur', function () {
    validateSenha($(this).val());
});

$('#senha').on('input', function () {
    validateSenha($(this).val());
});

//Intercepta o envio do formulário para validação
$('#cadastroForm').on('submit', function (e) {
    e.preventDefault(); // Impede o envio padrão do formulário
    let isValid = true;
    if (!validateEmail()) isValid = false;
    if (!validateSenha()) isValid = false;
    if (isValid) {
        // Aqui você pode adicionar o código para realmente enviar o formulário, se necessário
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

function validateSenha(senha) {
    // Se senha não for passada (ex: chamada no submit), pega o valor do campo
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

    let html = '<ul style="list-style:none;padding-left:0">';
    requisitos.forEach(req => {
        html += `<li style="color:${req.valido ? 'green' : 'red'}">${req.valido ? '✔' : '✖'} ${req.texto}</li>`;
    });
    html += '</ul>';

    $('#senha-requisitos').html(html);

    // Se todos os requisitos forem válidos, retorna true, senão mostra erro
    const senhaValida = requisitos.every(req => req.valido);
    if (!senhaValida) {
        showError('senha', '');
        return false;
    } else {
        showSuccess('senha');
        return true;
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

function showError(field, message) {
    $(`#${field}`).addClass('error').removeClass('success');
    $(`#${field}-error`).text(message);
}

function showSuccess(field) {
    $(`#${field}`).addClass('success').removeClass('error');
    $(`#${field}-error`).text('');
}