<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenue chez Dargatech</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 0;
      background-color: #f9f9f9;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      margin: 20px;
      overflow: hidden;
    }
    .header {
      background-color: #4A6FDE;
      color: white;
      padding: 25px;
      text-align: center;
    }
    .content {
      padding: 25px;
    }
    h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .success-message {
      background-color: #e7f3e8;
      border-left: 4px solid #28a745;
      padding: 10px 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .password-box {
      background-color: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 4px;
      padding: 15px;
      margin: 15px 0;
      text-align: center;
      font-family: monospace;
      font-size: 18px;
    }
    .button {
      display: inline-block;
      background-color: #4A6FDE;
      color: white !important;
      text-decoration: none;
      padding: 12px 25px;
      border-radius: 4px;
      margin: 15px 0;
      font-weight: 500;
      text-align: center;
    }
    .button:hover {
      background-color: #3a5ec7;
    }
    .warning {
      color: #856404;
      background-color: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 10px 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .footer {
      text-align: center;
      padding: 20px;
      color: #666;
      font-size: 14px;
      border-top: 1px solid #eee;
    }
    .logo {
      height: 50px;
      margin-bottom: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Bienvenue chez Dargatech</h1>
    </div>
    
    <div class="content">
      <div class="success-message">
        <p>Votre compte a été créé avec succès!</p>
      </div>
      
      <p>Bonjour,</p>
      
      <p>Nous sommes ravis de vous accueillir sur notre plateforme en tant que partenaire. Voici vos informations de connexion:</p>
      
      <p><strong>Votre mot de passe temporaire:</strong></p>
      <div class="password-box">
        <?php echo e($password); ?>

      </div>
      
      <p>Pour accéder à votre compte, veuillez cliquer sur le bouton ci-dessous:</p>
      
      <div style="text-align: center;">
        <a href="<?php echo e($appLink); ?>" class="button">Accéder à mon compte</a>
      </div>
      
      <div class="warning">
        <p><strong>Important:</strong> Pour des raisons de sécurité, nous vous recommandons de changer votre mot de passe après votre première connexion.</p>
      </div>
      
      <p>Si vous avez des questions ou besoin d'assistance, n'hésitez pas à contacter notre équipe de support.</p>
      
      <p>Cordialement,</p>
      <p><strong>L'équipe de Dargatech</strong></p>
    </div>
    
    <div class="footer">
      <p>© 2025 Dargatech. Tous droits réservés.</p>
      <p>Cet e-mail a été envoyé automatiquement, merci de ne pas y répondre.</p>
    </div>
  </div>
</body>
</html><?php /**PATH E:\dargatech_app\resources\views/emails/partenaire_email.blade.php ENDPATH**/ ?>