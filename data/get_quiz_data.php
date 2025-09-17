<?php

include 'db.php';

header('Content-Type: application/json');

$topic = $_GET['topic'] ?? 'meeting_someone';
$questionLang = $_GET['question_lang'] ?? 'indonesian';
$answerLang = $_GET['options_lang'] ?? 'english';
$numQuestions = 5;

$questions = [];

try {
    // Query para perguntas
    $sql_questions = "SELECT 
        text_{$questionLang} AS question_text, 
        text_{$answerLang} AS correct_answer, 
        text_english AS correct_english_text,
        audio_{$questionLang} AS audio_path, 
        id 
        FROM {$topic} 
        ORDER BY RAND() LIMIT {$numQuestions}";

    $stmt_questions = $pdo->prepare($sql_questions);
    $stmt_questions->execute();
    $all_rows = $stmt_questions->fetchAll();

    // Função para montar o caminho da imagem no formato esperado pelo front
    $getImage = function($topic, $english_text) {
        $fileName = strtolower(str_replace(' ', '_', $english_text)) . ".png";
        // Caminho da imagem para o front (URL relativa do servidor)
        $urlPath = "../../../assets/{$topic}/{$fileName}";
        return $urlPath;
    };

    foreach ($all_rows as $row) {
        $correct_answer = $row['correct_answer'];
        $correct_english_text = $row['correct_english_text'];
        $question_id = $row['id'];

        // Query para opções erradas
        $sql_options = "SELECT text_{$answerLang} AS option_text, text_english AS option_english_text 
                        FROM {$topic} 
                        WHERE id != :id 
                        ORDER BY RAND() LIMIT 3";
        $stmt_options = $pdo->prepare($sql_options);
        $stmt_options->bindParam(':id', $question_id, PDO::PARAM_INT);
        $stmt_options->execute();

        // Adiciona a resposta correta
        $options_array = [[
            'text' => $correct_answer, 
            'image' => $getImage($topic, $correct_english_text)
        ]];

        // Adiciona alternativas erradas
        while ($opt_row = $stmt_options->fetch()) {
            $options_array[] = [
                'text' => $opt_row['option_text'],
                'image' => $getImage($topic, $opt_row['option_english_text'])
            ];
        }

        shuffle($options_array);

        $questions[] = [
            'question_text' => $row['question_text'],
            'audio_path' => $row['audio_path'],
            'correct_answer' => $correct_answer,
            'options' => $options_array
        ];
    }

    echo json_encode($questions, JSON_UNESCAPED_UNICODE);

} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error: ' . $e->getMessage()]);
}