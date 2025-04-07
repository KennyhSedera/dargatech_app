<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vos identifiants de connexion</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #333;
            text-align: center;
        }
        p {
            font-size: 16px;
            color: #333;
            line-height: 1.6;
        }
        a {
            color: #007bff;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        .important {
            font-weight: bold;
            color: #333;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: gray;
            margin-top: 20px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin-top: 20px;
            background-color: #007bff;
            color: white;
            text-align: center;
            border-radius: 5px;
            text-decoration: none;
        }
        .button:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Bienvenue sur notre plateforme !</h1>

        <p>Bonjour <strong class="important">{{ $name }}</strong>,</p>

        <p>Voici vos identifiants pour vous connecter :</p>
        <ul>
            <li>Mot de passe : <strong class="important">{{ $password }}</strong></li>
        </ul>

        <p>Connectez-vous sur le site : <a href="{{ $appLink }}" class="important">{{ $appLink }}</a></p>

        <p>Démarrez la conversation avec notre bot Telegram :</p>
        <p><a href="https://t.me/{{ $botUsername }}?start" class="button">Cliquer ici</a></p>

        <p>Merci de votre confiance !</p>

        <hr>

        <div class="footer">
            <p>Ceci est un e-mail automatique, merci de ne pas y répondre.</p>
        </div>
    </div>
</body>
</html>
