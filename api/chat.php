<?php
// ============================================================
// api/chat.php  –  Chatbot message endpoints
// ============================================================
// Routes
//   POST ?action=send    – send a user message, get bot reply
//                           Body: { "user_id": 1, "message": "hi" }
//   GET  ?action=history – fetch past messages
//                           ?user_id=  (optional, omit for all)
//   GET  ?action=rules   – list all chatbot rules (admin preview)
// ============================================================

require_once __DIR__ . '/../db_config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

match(true) {
    $method === 'POST' && $action === 'send'    => sendMessage(),
    $method === 'GET'  && $action === 'history' => getHistory(),
    $method === 'GET'  && $action === 'rules'   => getRules(),
    default => jsonResponse(['success' => false, 'error' => 'Invalid route.'], 400),
};

// ── SEND MESSAGE & GET REPLY ──────────────────────────────────
function sendMessage(): void {
    $data    = json_decode(file_get_contents('php://input'), true);
    $userId = $data['user_id'] ?? null;   // null = guest
    $message = trim($data['message']      ?? '');

    if ($message === '') {
        jsonResponse(['success' => false, 'error' => 'Message cannot be empty.'], 400);
    }

    $db = getDB();

    // ── Match against chatbot_rules (keyword LIKE, ordered by priority) ──
    $ruleStmt = $db->prepare('
        SELECT reply FROM chatbot_rules
        WHERE  ? LIKE CONCAT(\'%\', keyword, \'%\')
        ORDER  BY priority DESC
        LIMIT  1
    ');
    $ruleStmt->execute([strtolower($message)]);
    $rule  = $ruleStmt->fetch();
    $reply = $rule ? $rule['reply'] : "I'm sorry, I didn't understand that.";

    // ── Log the exchange ──────────────────────────────────────
    $logStmt = $db->prepare('
        INSERT INTO chat_messages (user_id, user_msg, bot_reply)
        VALUES (?, ?, ?)
    ');
    $logStmt->execute([
        $userId !== null ? (int)$userId : null,
        htmlspecialchars(strip_tags($message)),
        $reply
    ]);

    jsonResponse([
        'success' => true,
        'user_message' => $message,
        'bot_reply'    => $reply
    ]);
}

// ── CHAT HISTORY ──────────────────────────────────────────────
function getHistory(): void {
    $userId = $_GET['user_id'] ?? null;
    $db      = getDB();

    if ($userId !== null && is_numeric($userId)) {
        $stmt = $db->prepare('
            SELECT id, user_msg, bot_reply, created_at
            FROM   chat_messages
            WHERE  user_id = ?
            ORDER  BY created_at DESC
            LIMIT  50
        ');
        $stmt->execute([(int)$userId]);
    } else {
        // All messages (admin use)
        $stmt = $db->prepare('
            SELECT id, user_id, user_msg, bot_reply, created_at
            FROM   chat_messages
            ORDER  BY created_at DESC
            LIMIT  100
        ');
        $stmt->execute();
    }

    jsonResponse(['success' => true, 'messages' => $stmt->fetchAll()]);
}

// ── LIST BOT RULES ────────────────────────────────────────────
function getRules(): void {
    $db   = getDB();
    $stmt = $db->prepare('SELECT id, keyword, reply, priority FROM chatbot_rules ORDER BY priority DESC');
    $stmt->execute();

    jsonResponse(['success' => true, 'rules' => $stmt->fetchAll()]);
}
