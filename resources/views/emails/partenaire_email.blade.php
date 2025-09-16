<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenue sur notre plateforme SISAM</title>
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

        .subheader {
            margin: 5px 0 0 0;
            font-size: 16px;
            font-weight: normal;
        }

        .tagline {
            font-style: italic;
            margin-top: 10px;
        }

        .success-message {
            background-color: #e7f3e8;
            border-left: 4px solid #3da6e1;
            padding: 8px 12px;
            margin: 15px 0;
            border-radius: 3px;
        }

        .credentials-box {
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 3px;
            padding: 10px;
            margin: 12px 0;
        }

        .button {
            display: inline-block;
            background: linear-gradient(90deg, #f8a01c 0%, #3da6e1 100%);
            color: white !important;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 3px;
            margin: 10px 0;
            font-weight: 500;
        }

        .button:hover {
            opacity: 0.9;
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
            <p class="subheader">Solution d'Irrigation Solaire Améliorée</p>
            <p class="subheader">Systèmes de pompage solaire Dargatech SARL</p>
            <p class="tagline">« Avec le soleil, récolter des revenus »</p>
        </div>

        <div class="content">
            <div class="success-message">
                <p>Votre compte partenaire a été créé avec succès!</p>
            </div>

            <p>Cher partenaire technique {{ $name }},</p>

            <p>Nous avons le plaisir de vous donner accès à la plateforme de supervision SISAM, conçue pour optimiser le
                suivi et la gestion des installations de pompage solaire déployées dans le cadre de notre collaboration.
            </p>

            <p><strong>Voici vos identifiants sécurisés :</strong></p>
            <div class="credentials-box">
                <p><strong>Identifiant :</strong> {{ $email }}</p>
                <p><strong>Mot de passe :</strong> {{ $password }}</p>
            </div>

            <p>Pour vous connecter à votre espace de supervision, cliquez sur le bouton ci-dessous :</p>

            <div style="text-align: center;">
                <a href="{{ $appLink }}" class="button">Accéder à mon compte</a>
            </div>

            <div class="features-list">
                <p>En tant que partenaire technique et maître d'œuvre, vous bénéficiez d'une interface de gestion
                    avancée vous permettant de :</p>
                <ul>
                    <li>Superviser toutes les installations en un coup d'œil</li>
                    <li>Suivre les indicateurs de performance en temps réel</li>
                    <li>Suivre les interventions techniques de maintenance</li>
                    <li>Évaluer l'impact des projets déployés</li>
                </ul>
            </div>

            <p>Cette plateforme facilitera la coordination entre les équipes DARGATECH et vos services techniques,
                assurant ainsi une mise en œuvre optimale du projet et une maintenance efficace des équipements.</p>

            <p>Nous restons à votre entière disposition pour toute assistance technique ou formation complémentaire sur
                l'utilisation de cet outil.</p>

            <p>Cordialement,</p>
            <p><strong>L'équipe support DARGATECH SARL</strong></p>
        </div>

        <div class="footer">
            <p>© 2025 Dargatech SARL. Tous droits réservés.</p>
            <p>Cet e-mail a été envoyé automatiquement, merci de ne pas y répondre.</p>
        </div>
    </div>
</body>

</html>