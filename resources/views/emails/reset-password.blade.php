<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Réinitialisation de Mot de Passe</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }

        .email-container {
            background-color: white;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
        }

        .header {
            background: #f8a01c;
            background: -webkit-linear-gradient(90deg, #f8a01c 0%, #3da6e1 100%);
            background: linear-gradient(90deg, #f8a01c 0%, #3da6e1 100%);
            color: #ffffff !important;
            padding: 15px;
            text-align: center;
            margin-bottom: 30px;
        }

        .logo {
            width: 120px;
            height: 120px;
            background-color: #5e35b15a;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
        }

        .logo-text {
            color: white;
            font-size: 36px;
            font-weight: bold;
        }

        h1 {
            color: #5e35b1;
            font-size: 24px;
            margin-bottom: 20px;
        }

        h2 {
            color: #333;
            font-size: 18px;
            margin-top: 30px;
            margin-bottom: 15px;
        }

        p {
            margin-bottom: 20px;
        }

        .btn {
            display: inline-block;
            background: #f8a01c;
            background: -webkit-linear-gradient(90deg, #f8a01c 0%, #3da6e1 100%);
            background: linear-gradient(90deg, #f8a01c 0%, #3da6e1 100%);
            color: white !important;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 4px;
            font-weight: bold;
            margin: 20px 0;
            text-align: center;
            transition: background-color 0.3s;
        }

        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 14px;
            color: #666;
            border-top: 1px solid #eee;
            padding-top: 20px;
        }

        .expiration {
            font-size: 14px;
            color: #f44336;
            font-style: italic;
        }

        .security-note {
            background-color: #e8f5e9;
            border-left: 4px solid #4caf50;
            padding: 15px;
            border-radius: 4px;
            margin: 25px 0;
        }

        .security-icon {
            font-size: 18px;
            color: #4caf50;
            margin-right: 5px;
        }

        .warning {
            background-color: #fff8e1;
            border-left: 4px solid #ff9800;
            padding: 15px;
            border-radius: 4px;
            margin: 25px 0;
        }
    </style>
</head>

<body>
    <div class="email-container">
        <div class="header">
            <h2>Réinitialisation de Mot de Passe</h2>
        </div>

        <p>Bonjour <strong>{{ $name }}</strong>,</p>

        <p>Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte. Si vous êtes à l'origine
            de cette demande, veuillez cliquer sur le bouton ci-dessous pour créer un nouveau mot de passe.</p>

        <div style="text-align: center;">
            <a href="{{ url('reset-password/' . $token . '?email=' . $email) }}" class="btn">Réinitialiser mon mot de
                passe</a>
        </div>

        <p class="expiration">Ce lien expirera dans <strong>15 minutes</strong> pour des raisons de sécurité.</p>

        <div class="security-note">
            <span class="security-icon">🔒</span> <strong>Information de sécurité importante :</strong>
            <p>Pour protéger votre compte, ce lien a été généré spécifiquement pour vous et ne peut être utilisé qu'une
                seule fois. Toutes les activités de réinitialisation de mot de passe sont enregistrées et surveillées
                pour vous protéger contre les accès non autorisés.</p>
        </div>

        <div class="warning">
            <strong>⚠️ Attention :</strong>
            <p>Si vous n'avez pas demandé cette réinitialisation de mot de passe, nous vous recommandons de sécuriser
                immédiatement votre compte en vérifiant vos autres informations de sécurité et en contactant notre
                service client.</p>
        </div>

        <h2>Conseils de sécurité</h2>
        <ul>
            <li>Ne partagez jamais vos identifiants de connexion avec qui que ce soit, y compris notre équipe de
                support.</li>
            <li>Choisissez un mot de passe fort contenant au moins 12 caractères, incluant des chiffres, des lettres
                majuscules et minuscules, et des caractères spéciaux.</li>
            <li>N'utilisez pas le même mot de passe pour plusieurs services ou sites web.</li>
            <li>Activez l'authentification à deux facteurs dans les paramètres de votre compte pour une protection
                supplémentaire.</li>
        </ul>

        <p>Si vous rencontrez des difficultés avec le bouton ci-dessus, vous pouvez également copier et coller l'URL
            suivante dans votre navigateur :</p>

        <p
            style="word-break: break-all; font-size: 12px; background-color: #f5f5f5; padding: 10px; border-radius: 4px;">
            {{ url('reset-password/' . $token . '?email=' . $email) }}
        </p>

        <p>Ce lien est personnel et ne doit pas être partagé. Si vous avez des questions ou besoin d'assistance,
            n'hésitez pas à contacter notre équipe de support à l'adresse <a
                href="mailto:support@{{ config('app.domain') }}">support@{{ config('app.domain') }}</a>.</p>

        <div class="footer">
            <p>Cordialement,<br>L'équipe de sécurité de <strong>{{ config('app.name') }}</strong></p>
            <p style="font-size: 12px;">Cet email a été envoyé automatiquement depuis une adresse qui n'accepte pas les
                réponses. Pour nous contacter, veuillez utiliser notre formulaire de support.</p>
            <p style="font-size: 11px; color: #888;">Adresse IP de la demande : {{ request()->ip() }} | Date et heure :
                {{ now()->format('d/m/Y à H:i') }}</p>
        </div>
    </div>
</body>

</html>