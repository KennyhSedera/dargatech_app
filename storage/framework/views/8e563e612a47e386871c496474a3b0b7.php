<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenue sur notre plateforme SISAM - Accès Administrateur</title>
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
            color: #fff;
            padding: 15px;
            text-align: center;
            margin-bottom: 20px;
        }

        .content {
            padding: 0 15px 15px;
        }

        h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }

        .credentials-box {
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 3px;
            padding: 10px;
            margin: 12px 0;
        }

        .password-box {
            font-family: monospace;
            font-size: 16px;
            background-color: #f0f0f0;
            padding: 8px;
            border-radius: 3px;
            margin-top: 5px;
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

        .admin-box {
            background-color: #f8f9fa;
            border-left: 4px solid #dc3545;
            padding: 8px 12px;
            margin: 15px 0;
            border-radius: 3px;
        }

        .features-list {
            margin: 15px 0;
        }

        .features-list ul {
            padding-left: 20px;
            margin: 8px 0;
        }

        .features-list li {
            margin-bottom: 5px;
        }

        .security-note {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 8px 12px;
            margin: 15px 0;
            border-radius: 3px;
        }

        .footer {
            text-align: center;
            padding: 15px 0;
            color: #666;
            font-size: 12px;
            border-top: 1px solid #eee;
            margin-top: 15px;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>Bienvenue sur notre plateforme SISAM</h1>
            <p style="margin: 5px 0 0 0; font-size: 14px;">Solution d'Irrigation Solaire Améliorée</p>
            <p style="margin: 5px 0 0 0; font-size: 14px;">Systèmes de pompage solaire Dargatech SARL</p>
            <p style="font-style: italic; margin-top: 8px; font-size: 14px;">« Avec le soleil, récolter des revenus »
            </p>
        </div>

        <div class="content">
            <div class="admin-box">
                <p><strong>Accès Administrateur</strong> - Droits de gestion système complets</p>
            </div>

            <p>Cher administrateur <?php echo e($name); ?>,</p>

            <p>Nous vous accordons un accès privilégié à la plateforme SISAM avec les droits d'administration complets.
                En tant qu'administrateur système, vous disposez de l'ensemble des fonctionnalités et des permissions
                nécessaires à la gestion globale de la plateforme.</p>

            <p><strong>Voici vos identifiants sécurisés :</strong></p>
            <div class="credentials-box">
                <p><strong>Identifiant :</strong> <?php echo e($email); ?></p>
                <p><strong>Mot de passe :</strong> <?php echo e($password); ?></p>
            </div>

            <p>Pour vous connecter à l'interface d'administration, cliquez sur le bouton ci-dessous :</p>

            <div style="text-align: center;">
                <a href="<?php echo e($appLink); ?>" class="button">Accéder à mon compte</a>
            </div>


            <p>Voici le lien pour accéder à notre bot Telegram :</p>

            <div style="text-align: center;">
                <a href="<?php echo e($botLink); ?>" target="_blank" class="button">Ouvrir le bot</a>
            </div>

            <div class="features-list">
                <p>Votre compte administrateur vous permet de :</p>
                <ul>
                    <li>Gérer l'ensemble des utilisateurs et leurs permissions</li>
                    <li>Configurer les paramètres système de la plateforme</li>
                    <li>Superviser toutes les installations et leurs données</li>
                    <li>Accéder aux logs et rapports d'activité complets</li>
                    <li>Modifier les configurations techniques des équipements</li>
                    <li>Exporter les données pour analyse externe</li>
                    <li>Effectuer des modifications sur l'ensemble des modules</li>
                </ul>
            </div>

            <p>La documentation technique complète de l'administration système est disponible dans la section
                "Documentation" de votre tableau de bord.</p>

            <div class="security-note">
                <p><strong>Important :</strong> Nous vous rappelons l'importance de respecter les procédures de sécurité
                    lors de vos opérations d'administration.</p>
            </div>

            <p>Pour toute assistance ou question relative à l'administration de la plateforme, vous pouvez contacter
                directement notre équipe de développement.</p>

            <p>Cordialement,</p>
            <p><strong>La Direction DARGATECH SARL</strong></p>
        </div>

        <div class="footer">
            <p>© 2025 Dargatech SARL. Tous droits réservés.</p>
            <p>Cet e-mail contient des informations confidentielles destinées uniquement aux administrateurs système.
            </p>
        </div>
    </div>
</body>

</html><?php /**PATH D:\ENI\Stage\dargatech_app\resources\views/emails/admin_email.blade.php ENDPATH**/ ?>