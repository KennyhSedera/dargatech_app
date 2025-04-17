<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vos identifiants de connexion</title>
    <style>
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            background-color: #f5f7fa;
            margin: 0;
            padding: 0;
            color: #333;
            line-height: 1.6;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 0;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background-color: #4A6FDE;
            color: white;
            padding: 25px;
            text-align: center;
        }
        .content {
            padding: 30px;
        }
        h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
            color: white;
        }
        .welcome-message {
            font-size: 18px;
            margin-bottom: 25px;
        }
        p {
            font-size: 16px;
            color: #4a4a4a;
            margin-bottom: 15px;
        }
        a {
            color: #4A6FDE;
            text-decoration: none;
            font-weight: 500;
        }
        a:hover {
            text-decoration: underline;
        }
        .important {
            font-weight: bold;
            color: #333;
        }
        .credentials-box {
            background-color: #f8f9fc;
            border-left: 4px solid #4A6FDE;
            padding: 15px 20px;
            margin: 20px 0;
            border-radius: 5px;
        }
        .telegram-button {
            display: inline-block;
            padding: 12px 25px;
            margin: 20px 0;
            background-color: #0088cc;
            color: white !important;
            text-align: center;
            border-radius: 5px;
            text-decoration: none;
            font-weight: 600;
            transition: background-color 0.2s ease;
        }
        .telegram-button:hover {
            background-color: #006699;
            text-decoration: none;
        }
        .site-link {
            display: inline-block;
            padding: 12px 25px;
            margin: 10px 0;
            background-color: #4A6FDE;
            color: white !important;
            text-align: center;
            border-radius: 5px;
            text-decoration: none;
            font-weight: 600;
            transition: background-color 0.2s ease;
        }
        .site-link:hover {
            background-color: #3a5ec7;
            text-decoration: none;
        }
        .footer {
            background-color: #f5f7fa;
            text-align: center;
            font-size: 13px;
            color: #6c757d;
            padding: 15px;
            border-top: 1px solid #eaeaea;
        }
        .logo {
            height: 50px;
            margin-bottom: 15px;
        }
        .divider {
            border-top: 1px solid #eaeaea;
            margin: 25px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Bienvenue sur notre plateforme !</h1>
        </div>
        
        <div class="content">
            <p class="welcome-message">Bonjour <strong class="important"><?php echo e($name); ?></strong>,</p>

            <p>Nous sommes ravis de vous accueillir parmi nos techniciens. Voici vos identifiants pour vous connecter à notre plateforme :</p>
            
            <div class="credentials-box">
                <p style="margin-bottom: 5px;"><strong>Mot de passe :</strong></p>
                <p style="font-family: monospace; font-size: 18px; background: #e9ecef; padding: 10px; border-radius: 4px; text-align: center;"><?php echo e($password); ?></p>
            </div>

            <p>Pour accéder à votre compte, veuillez cliquer sur le bouton ci-dessous :</p>
            
            <div style="text-align: center;">
                <a href="<?php echo e($appLink); ?>" class="site-link">Accéder à mon compte</a>
            </div>

            <div class="divider"></div>

            <p>Vous pouvez également interagir avec notre bot Telegram pour un accès rapide à nos services :</p>
            
            <div style="text-align: center;">
                <a href="https://t.me/<?php echo e($botUsername); ?>?start" class="telegram-button">Démarrer avec notre bot Telegram</a>
            </div>

            <p>Nous vous remercions de votre confiance et sommes impatients de vous accompagner dans votre expérience.</p>
            
            <p>Cordialement,<br>L'équipe support</p>
        </div>
        
        <div class="footer">
            <p>Ceci est un e-mail automatique, merci de ne pas y répondre.</p>
            <p>© 2025 - Tous droits réservés</p>
        </div>
    </div>
</body>
</html><?php /**PATH E:\dargatech_app\resources\views\emails\bot_credentials.blade.php ENDPATH**/ ?>