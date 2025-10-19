$('#email').on('blur', function () {
    validateEmail();
});

$('#senha').on('blur', function () {
    validateSenha();
});

// Intercepta o envio do formulário para validação
$('#cadastroForm').on('submit', function (e) {
    let isValid = true;
    
    if (!validateEmail()) isValid = false;
    if (!validateSenha()) isValid = false;
    
    if (!isValid) {
        e.preventDefault(); // Só impede se houver erro
    }
    // Se isValid = true, o formulário será enviado normalmente
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

function validateSenha() {
    const senha = $('#senha').val();
    
    if (senha.trim() === '') {
        showError('senha', 'A senha é obrigatória.');
        return false;
    } else {
        showSuccess('senha');
        return true;
    }
}

// Toggle para mostrar/ocultar senha
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

function showError(field, message) {
    $(`#${field}`).addClass('error').removeClass('success');
    $(`#${field}-error`).text(message);
}

function showSuccess(field) {
    $(`#${field}`).addClass('success').removeClass('error');
    $(`#${field}-error`).text('');
}