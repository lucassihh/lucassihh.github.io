<?php
require_once('./db.php'); // db file

header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            // Rota para buscar itens de vocabulário de uma tabela específica
            if (isset($_GET['topic'])) {
                $tableName = $_GET['topic'];
                
                // Validação simples para evitar injeção de SQL
                if (!preg_match('/^[a-zA-Z0-9_]+$/', $tableName)) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Nome da tabela inválido.']);
                    return;
                }

                $sql = "SELECT * FROM $tableName ORDER BY id ASC";
                $stmt = $pdo->query($sql);
                $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

                if ($items) {
                    echo json_encode($items, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
                } else {
                    http_response_code(404);
                    echo json_encode(['error' => "Tabela '$tableName' não encontrada ou vazia."]);
                }
                return;
            }

            // Rota padrão: buscar todas as tabelas de vocabulário
            // Você precisará ajustar essa lógica para listar apenas as tabelas que você quer expor.
            // Aqui, estamos listando todas as tabelas no banco de dados.
            $sql = "SHOW TABLES";
            $stmt = $pdo->query($sql);
            $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);

            echo json_encode($tables, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            break;

        default:
            http_response_code(405);
            echo json_encode(['error' => 'Método não permitido.']);
            break;
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro na conexão ou consulta: ' . $e->getMessage()]);
}

?>
