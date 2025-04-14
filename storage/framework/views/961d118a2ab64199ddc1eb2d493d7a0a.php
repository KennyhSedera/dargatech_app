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
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            max-width: 150px;
            height: auto;
        }
        .content {
            margin-bottom: 30px;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #666;
        }
        .info-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .info-table td {
            padding: 8px;
            border-bottom: 1px solid #eee;
        }
        .info-table td:first-child {
            font-weight: bold;
            width: 40%;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="<?php echo e(public_path('images/titre.png')); ?>" alt="DARGATECH TOGO" class="logo">
            <h2>Reçu de Paiement N°<?php echo e($pdfData['numero']); ?></h2>
        </div>
        
        <div class="content">
            <p>Bonjour <?php echo e($pdfData['civilite_acheteur']); ?> <?php echo e($pdfData['nom_acheteur']); ?>,</p>
            
            <p>Veuillez trouver ci-joint votre reçu de paiement N°<?php echo e($pdfData['numero']); ?> pour le versement du loyer de la période du <?php echo e($pdfData['periode_couverte']); ?>.</p>
            
            <table class="info-table">
                <tr>
                    <td>Date:</td>
                    <td><?php echo e(date('d/m/Y', strtotime($pdfData['date']))); ?></td>
                </tr>
                <tr>
                    <td>Montant payé:</td>
                    <td><?php echo e($pdfData['montant_paye']); ?> Franc CFA</td>
                </tr>
                <tr>
                    <td>Mode de règlement:</td>
                    <td><?php echo e($pdfData['mode_paiement']); ?></td>
                </tr>
            </table>
            
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
</html><?php /**PATH E:\dargatech_app\resources\views/emails/paiement_pdf.blade.php ENDPATH**/ ?>