<?php
// Pasta onde os vídeos vão ser salvos (dentro do servidor)
$pasta_destino = "uploads/";

// Se a pasta não existir, cria ela
if (!is_dir($pasta_destino)) {
    mkdir($pasta_destino, 0777, true);
}

// Verifica se o formulário foi enviado e se existe um arquivo
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_FILES["video"])) {
    
    $titulo = $_POST["titulo"] ?? "Sem título";
    $descricao = $_POST["descricao"] ?? "Sem descrição";

    $arquivo_nome = basename($_FILES["video"]["name"]);
    $arquivo_caminho = $pasta_destino . $arquivo_nome;
    $tipo_arquivo = strtolower(pathinfo($arquivo_caminho, PATHINFO_EXTENSION));

    // Tipos permitidos
    $tipos_permitidos = ["mp4", "avi", "mov", "mkv"];

    if (in_array($tipo_arquivo, $tipos_permitidos)) {
        if (move_uploaded_file($_FILES["video"]["tmp_name"], $arquivo_caminho)) {
            echo "<h2>✅ Upload realizado com sucesso!</h2>";
            echo "<p><strong>Título:</strong> $titulo</p>";
            echo "<p><strong>Descrição:</strong> $descricao</p>";
            echo "<video width='400' controls>
                    <source src='$arquivo_caminho' type='video/$tipo_arquivo'>
                  </video>";
        } else {
            echo "❌ Erro ao mover o arquivo para a pasta destino.";
        }
    } else {
        echo "❌ Tipo de arquivo não permitido. Envie apenas MP4, AVI, MOV ou MKV.";
    }
}
?>
