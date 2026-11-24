<?php
// Formulaire de devis AT Company : envoie la demande par e-mail (hébergement OVH, fonction mail()).
header('Content-Type: application/json; charset=utf-8');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['ok' => false]); exit; }
if (!empty($_POST['site_web'])) { echo json_encode(['ok' => true]); exit; } // robot

function champ($k, $max = 200) { return trim(mb_substr(str_replace(["\r", "\n"], ' ', (string)($_POST[$k] ?? '')), 0, $max)); }
$nom = champ('nom'); $ent = champ('entreprise'); $email = champ('email'); $tel = champ('telephone', 40);
$ville = champ('ville'); $secteur = champ('secteur', 60);
$services = isset($_POST['services']) && is_array($_POST['services']) ? implode(', ', array_map(fn($s) => mb_substr((string)$s, 0, 60), $_POST['services'])) : '';
$message = trim(mb_substr((string)($_POST['message'] ?? ''), 0, 5000));

if ($nom === '' || $ent === '' || $tel === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || empty($_POST['consentement'])) {
  echo json_encode(['ok' => false, 'error' => 'Merci de remplir les champs obligatoires avec une adresse e-mail valide.']); exit;
}

$dest = 'contact@at-company.fr';
$sujet = '=?UTF-8?B?' . base64_encode("Nouvelle demande de devis : $ent") . '?=';
$corps = "Nouvelle demande depuis at-company.fr\n\n"
  . "Nom : $nom\nEntreprise : $ent\nE-mail : $email\nTéléphone : $tel\nVille : $ville\n"
  . "Secteur : $secteur\nIntéressé par : $services\n\nMessage :\n$message\n";
$entetes = "From: AT Company <no-reply@at-company.fr>\r\nReply-To: $email\r\nContent-Type: text/plain; charset=UTF-8\r\n";

$ok = @mail($dest, $sujet, $corps, $entetes, '-fno-reply@at-company.fr');
echo json_encode($ok ? ['ok' => true] : ['ok' => false, 'error' => "L'envoi n'a pas fonctionné. Appelez-nous au 01 47 90 75 60."]);
