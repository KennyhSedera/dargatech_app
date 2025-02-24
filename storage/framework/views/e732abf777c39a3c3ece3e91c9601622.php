<!DOCTYPE html>
<html>
<head>
    <title>Vos identifiants de connexion</title>
</head>
<body>
    <h1>Bienvenue sur notre plateforme !</h1>

    <p>Bonjour <strong><?php echo e($name); ?></strong>,</p>

    <p>Voici vos identifiants pour vous connecter :</p>
    <ul>
        <li>Mot de passe : <strong><?php echo e($password); ?></strong></li>
    </ul>

    <p>Connectez-vous sur le site : <a href="<?php echo e($appLink); ?>"><?php echo e($appLink); ?></a></p>

    <p>Démarrez la conversation avec notre bot Telegram :
        <a href="https://t.me/<?php echo e($botUsername); ?>?start">Cliquer ici</a>
    </p>

    <p>Merci de votre confiance !</p>

    <hr>
    <p style="font-size: 12px; color: gray;">Ceci est un e-mail automatique, merci de ne pas y répondre.</p>
</body>
</html>
<?php /**PATH D:\ENI\DargaTechProjet\dargatech_app\resources\views/emails/bot_credentials.blade.php ENDPATH**/ ?>