<!-- resources/views/emails/paiement_pdf.blade.php -->
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Reçu de paiement</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .header {
            background: linear-gradient(to right, #f5a623, #e3ca81, #4a90e2);
            color: white;
            padding: 20px;
            text-align: center;
        }
        .header h2 {
            margin: 0;
            padding: 10px 0;
        }
        .header p {
            margin: 5px 0;
            font-style: italic;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        .content {
            padding: 20px;
        }
        .info-block {
            background-color: #f7f7f7;
            border-left: 4px solid #4a90e2;
            padding: 10px 15px;
            margin: 20px 0;
        }
        .info-item {
            margin-bottom: 5px;
        }
        .info-label {
            font-weight: bold;
        }
        .button-container {
            text-align: center;
            margin: 25px 0;
        }
        .button {
            display: inline-block;
            background: linear-gradient(to right, #f5a623, #e3ca81);
            color: white;
            padding: 12px 25px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
        }
        .footer {
            border-top: 1px solid #eee;
            padding: 15px;
            text-align: center;
            font-size: 12px;
            color: #666;
        }
        ul {
            list-style-type: disc;
            padding-left: 20px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h2>Reçu de Paiement N°<?php echo e($pdfData['numero']); ?></h2>
        <p>Solution de Gestion Immobilière</p>
        <p>« Votre confiance, notre priorité »</p>
    </div>
    
    <div class="container">
        <div class="content">
            <p>Cher/Chère <?php echo e($pdfData['civilite_acheteur']); ?> <?php echo e($pdfData['nom_acheteur']); ?>,</p>
            
            <p>Bienvenue sur votre espace de gestion locative. Veuillez trouver ci-dessous votre reçu de paiement pour le versement du loyer de la période du <?php echo e($pdfData['periode_couverte']); ?>.</p>
            
            <div class="info-block">
                <div class="info-item">
                    <span class="info-label">Numéro de reçu :</span> <?php echo e($pdfData['numero']); ?>

                </div>
                <div class="info-item">
                    <span class="info-label">Date :</span> <?php echo e(date('d/m/Y', strtotime($pdfData['date']))); ?>

                </div>
                <div class="info-item">
                    <span class="info-label">Montant payé :</span> <?php echo e($pdfData['montant_paye']); ?> Franc CFA
                </div>
                <div class="info-item">
                    <span class="info-label">Mode de règlement :</span> <?php echo e($pdfData['mode_paiement']); ?>

                </div>
            </div>
            
            <p>Ce reçu est joint à cet email en format PDF et vous permet de :</p>
            <ul>
                <li>Conserver une preuve de paiement</li>
                <li>Suivre l'historique de vos versements</li>
                <li>Justifier vos dépenses locatives</li>
            </ul>
            
            <p>Nous vous remercions pour votre confiance.</p>
            
            <p>Cordialement,<br>
            <?php echo e($pdfData['nom_vendeur']); ?><br>
            DARGATECH TOGO</p>
        </div>
        
        <div class="footer">
            <p>DARGATECH TOGO, SARL - TG-LRL-01-2024-B12-00008<br>
            KARA, TOGO - Tel : +228 93 18 96 06<br>
            www.dargatech.com</p>
        </div>
    </div>
</body>
</html><?php /**PATH D:\ENI\Stage\dargatech_app\resources\views/emails/paiement_pdf.blade.php ENDPATH**/ ?>