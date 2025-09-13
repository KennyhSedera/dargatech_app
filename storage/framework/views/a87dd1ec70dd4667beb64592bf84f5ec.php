<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vos identifiants de connexion SISAM</title>
    <style>
        body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 600px;
        margin: 0 auto;
        padding: 10px;
        }
        .container {
        background-color: #ffffff;
        margin: 0;
        padding: 0;
        }
        .header {
            background: linear-gradient(90deg, #f8a01c 0%, #3da6e1 100%);
            color: white;
            padding: 15px;
            text-align: center;
        }
        h1 {
            margin: 0;
            font-size: 22px;
            font-weight: bold;
        }
        .tagline {
            color: #fff;
            font-style: italic;
            margin-top: 5px;
            font-size: 14px;
        }
        .content {
            padding: 20px 0;
        }
        p {
            margin-bottom: 15px;
        }
        .credentials {
            margin: 15px 0;
            padding: 10px;
            border-left: 3px solid #3da6e1;
            background-color: #f9f9f9;
        }
        .button {
            display: inline-block;
            background: linear-gradient(90deg, #f8a01c 0%, #3da6e1 100%);
            color: #fff !important;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 3px;
            margin: 10px 0;
            font-weight: 500;
        }
        ul {
            margin: 10px 0;
            padding-left: 25px;
        }
        li {
            margin-bottom: 5px;
        }
        .footer {
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #eee;
            font-size: 12px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Bienvenue sur notre plateforme SISAM</h1>
            <div class="tagline">Solution d'Irrigation Solaire Améliorée</div>
            <div class="tagline">« Avec le soleil, récolter des revenus »</div>
        </div>

        <div class="content">
            <p><strong>Cher technicien, chère technicienne <?php echo e($name); ?>,</strong></p>

            <p>Bienvenue sur la plateforme SISAM, votre nouvel outil professionnel pour la gestion et le suivi des interventions de maintenance sur les systèmes de pompage solaire.</p>

            <div class="credentials">
                <p><strong>Identifiant :</strong> <?php echo e($email); ?></p>
                <p><strong>Mot de passe :</strong> <?php echo e($password); ?></p>
            </div>

            <p>Pour vous connecter, cliquez simplement sur le bouton ci-dessous :</p>

            <div style="text-align: center;">
                <a href="<?php echo e($appLink); ?>" class="button">Accéder à mon compte</a>
            </div>

            <p>Voici le lien pour accéder à notre bot Telegram :</p>

            <div style="text-align: center;">
                <a href="<?php echo e($botLink); ?>" target="_blank" class="button">Ouvrir le bot</a>
            </div>

            <p>Cette plateforme a été spécialement conçue pour vous permettre de :</p>
            <ul>
                <li>Consulter le calendrier des interventions planifiées</li>
                <li>Accéder aux fiches techniques de chaque installation</li>
                <li>Signaler et documenter les interventions réalisées</li>
                <li>Suivre l'historique de maintenance de chaque équipement</li>
                <li>Accéder aux manuels techniques et procédures d'intervention</li>
                <li>Communiquer avec l'équipe support DARGATECH</li>
            </ul>

            <p>Grâce à cet outil, vous pourrez optimiser vos déplacements, préparer efficacement vos interventions et assurer une traçabilité complète des opérations de maintenance.</p>

            <p>Les informations que vous enregistrerez sur la plateforme contribueront directement à l'amélioration continue de nos systèmes et à la satisfaction des maraîchers utilisateurs.</p>

            <p>Pour toute question sur l'utilisation de cette plateforme, n'hésitez pas à contacter votre superviseur technique.</p>

            <p>Cordialement,<br><strong>L'équipe support DARGATECH SARL</strong></p>
        </div>

        <div class="footer">
            <p>Systèmes de pompage solaire Dargatech SARL</p>
            <p>© 2025 - Tous droits réservés</p>
        </div>
    </div>
</body>
</html>
<?php /**PATH D:\ENI\Stage\dargatech_app\resources\views/emails/bot_credentials.blade.php ENDPATH**/ ?>