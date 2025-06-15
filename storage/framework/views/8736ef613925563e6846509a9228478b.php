<!-- resources/views/pdf/paiement.blade.php -->
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Reçu de paiement N°<?php echo e($data['numero']); ?></title>
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #000;
            background-color: #fff;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            position: relative;
            font-size: 12px;
        }
        .header {
            width: 100%;
            margin-bottom: 30px;
            overflow: hidden; 
        }
        .logo-container {
            float: left;
            width: 50%;
        }
        .logo-inner {
            display: inline-block;
            vertical-align: top;
        }
        .logo {
            width: 60px;
            height: 60px;
            margin-right: 5px;
            vertical-align: middle;
        }
        .logo-text {
            color: #999;
            font-size: 12px;
        }
        .document-info {
            float: right;
            width: 50%;
            text-align: right;
        }
        .blue-text {
            color: #3490dc;
        }
        .receipt-number {
            font-size: 18px;
            font-weight: bold;
        }
        .info-text {
            font-size: 10px;
            margin-top: 8px;
        }
        .info-sections {
            width: 100%;
            clear: both;
            margin-bottom: 24px;
            overflow: hidden; 
        }
        .info-section {
            margin-bottom: 10px;
        }
        .info-section-left {
            float: left;
            width: 49%;
        }
        .info-section-right {
            float: right;
            width: 49%;
        }
        .info-header {
            background-color: #3490dc;
            color: white;
            padding: 8px;
        }
        .info-content {
            border: 1px solid #3490dc;
            border-top: none;
            padding: 8px;
        }
        .doc-title {
            text-align: center;
            color: #3490dc;
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 16px;
            clear: both;
        }
        .table {
            width: 100%;
            clear: both;
        }
        .table table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 24px;
        }
        .table th {
            background-color: #3490dc;
            color: white;
            text-align: center;
            padding: 8px;
            border: 1px solid #3490dc;
        }
        .table td {
            padding: 8px;
            border: 1px solid #3490dc;
        }
        .text-center {
            text-align: center;
        }
        .text-right {
            text-align: right;
        }
        .total-summary {
            float: right;
            margin-top: 16px;
            margin-bottom: 30px;
            width: 50%;
            clear: both;
        }
        .total-table {
            width: 100%;
        }
        .payment-info {
            border: 1px solid #3490dc;
            margin-bottom: 24px;
            margin-top: 40px;
            padding: 10px;
            width: 100%;
            clear: both;
        }
        .signature {
            text-align: left;
            clear: both;
            margin-top: 20px;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            margin-top: 32px;
            padding-top: 8px;
            border-top: 1px solid #ccc;
            clear: both;
        }
        .payment-info td {
            padding-bottom: 10px;
        }
        .clearfix:after {
            content: "";
            display: table;
            clear: both;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- En-tête avec logo et informations du document -->
        <div class="header clearfix">
            <div class="logo-container">
                <div class="logo-inner">
                    <img src="<?php echo e(public_path('images/logo.png')); ?>" alt="logo" class="logo">
                </div>
                <div class="logo-inner">
                    <div>
                        <div>
                            <span class="blue-text" style="font-size: 12px; padding: 0 4px 4px 4px;">TOGO</span>
                            <img src="<?php echo e(public_path('images/togo.png')); ?>" alt="Togo Flag" style="height: 15px;">
                        </div>
                        <img src="<?php echo e(public_path('images/titre.png')); ?>" alt="logo" style="height: auto; width: 152px;">
                    </div>
                    <div class="logo-text">EXIGEZ LE MEILLEUR DU SOLAIRE</div>
                </div>
            </div>

            <div class="document-info">
                <div class="blue-text">
                    REÇU N°
                    <div class="receipt-number"><?php echo e($data['numero']); ?></div>
                </div>
                <div class="info-text">
                    Lieu de création: <?php echo e($data['lieu_creation']); ?><br>
                    Date de création: <?php echo e(date('d/m/Y', strtotime($data['date_creation']))); ?><br>
                    Date de vente: <?php echo e(date('d/m/Y', strtotime($data['date']))); ?>

                </div>
            </div>
        </div>

        <!-- Informations vendeur et acheteur côte à côte -->
        <div class="info-sections clearfix">
            <div class="info-section info-section-left">
                <div class="info-header">
                    VENDEUR:
                </div>
                <div class="info-content">
                    <strong><?php echo e($data['nom_vendeur']); ?></strong><br>
                    <?php echo e($data['ville_vendeur']); ?>, <?php echo e($data['pays_vendeur']); ?>

                </div>
            </div>
            <div class="info-section info-section-right">
                <div class="info-header">
                    ACHETEUR:
                </div>
                <div class="info-content">
                    <strong><?php echo e($data['civilite_acheteur']); ?> <?php echo e($data['nom_acheteur']); ?></strong><br>
                    <?php echo e($data['ville_acheteur']); ?>, <?php echo e($data['pays_acheteur']); ?>

                </div>
            </div>
        </div>

        <!-- Objet du document -->
        <div class="doc-title">
            SISAM - versement Loyer de la période du <?php echo e($data['periode_couverte']); ?>

        </div>

        <!-- Tableau des produits -->
        <div class="table">
        <table>
            <thead>
                <tr>
                    <th>N°</th>
                    <th>Désignation</th>
                    <th>Réf.</th>
                    <th>Qté</th>
                    <th>PU HT</th>
                    <th>Total HT</th>
                    <th>TVA</th>
                    <th>Montant TVA</th>
                    <th>Total TTC</th>
                </tr>
            </thead>
            <tbody>
                <?php $__currentLoopData = $data['produits']; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $index => $produit): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                <tr>
                    <td class="text-center"><?php echo e($index + 1); ?></td>
                    <td><?php echo e($produit['designation']); ?></td>
                    <td class="text-center"><?php echo e($produit['reference']); ?></td>
                    <td class="text-center"><?php echo e($produit['quantite']); ?></td>
                    <td class="text-right"><?php echo e(number_format($produit['prix_unitaire'], 0, ',', ' ')); ?></td>
                    <td class="text-right"><?php echo e(number_format($produit['total_ht'], 0, ',', ' ')); ?></td>
                    <td class="text-center"><?php echo e($produit['tva']); ?>%</td>
                    <td class="text-right"><?php echo e(number_format($produit['montant_tva'], 0, ',', ' ')); ?></td>
                    <td class="text-right"><?php echo e(number_format($produit['total_ttc'], 0, ',', ' ')); ?></td>
                </tr>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                <tr>
                    <td colspan="5" class="text-center" style="font-weight: bold;">TOTAL</td>
                    <td class="text-right" style="font-weight: bold;"><?php echo e(number_format($data['total_ht'], 0, ',', ' ')); ?></td>
                    <td></td>
                    <td class="text-right" style="font-weight: bold;"><?php echo e(number_format($data['total_tva'], 0, ',', ' ')); ?></td>
                    <td class="text-right" style="font-weight: bold;"><?php echo e(number_format($data['total_ttc'], 0, ',', ' ')); ?></td>
                </tr>
            </tbody>
        </table>
        </div>

        <!-- Résumé totaux -->
        <div class="total-summary clearfix">
            <table class="total-table">
                <tr>
                    <td class="text-right">Total HT</td>
                    <td class="text-right" style="font-weight: bold;"><?php echo e(number_format($data['total_ht'], 0, ',', ' ')); ?></td>
                </tr>
                <tr>
                    <td class="text-right">Montant TVA (0%)</td>
                    <td class="text-right" style="font-weight: bold;"><?php echo e(number_format($data['total_tva'], 0, ',', ' ')); ?></td>
                </tr>
                <tr>
                    <td class="text-right">Total TTC</td>
                    <td class="text-right" style="font-weight: bold;"><?php echo e(number_format($data['total_ttc'], 0, ',', ' ')); ?></td>
                </tr>
            </table>
        </div>

        <!-- Espace de séparation clair -->
        <div class="clearfix" style="height: 0px; clear: both;"></div>

        <!-- Informations de paiement -->
        <div class="payment-info">
            <table style="width: 100%;">
                <tr>
                    <td style="width: 25%;">À payer:</td>
                    <td style="width: 25%;"><?php echo e($data['a_payer'] ?? '0 Franc CFA'); ?></td>
                    <td style="width: 25%;">Montant payé:</td>
                    <td style="width: 25%;"><?php echo e($data['montant_paye']); ?> Franc CFA</td>
                </tr>
                <tr>
                    <td>Mode de règlement:</td>
                    <td><?php echo e($data['mode_paiement']); ?></td>
                    <td>Banque:</td>
                    <td><?php echo e($data['banque']); ?></td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td>IBAN:</td>
                    <td><?php echo e($data['iban']); ?></td>
                </tr>
            </table>
        </div>

        <!-- Signature -->
        <div class="signature">
            <div class="blue-text" style="margin-bottom: 8px;">Nom du vendeur</div>
            <div style="font-weight: bold;"><?php echo e($data['nom_vendeur']); ?></div>
        </div>

        <!-- Pied de page avec informations DARGATECH -->
        <div class="footer">
            <div>DARGATECH TOGO, SARL - TG-LRL-01-2024-B12-00008</div>
            <div>KARA, TOGO - Tel : +228 93 18 96 06 -</div>
            <div>www.dargatech.com</div>
        </div>
    </div>
</body>
</html><?php /**PATH D:\dargatech_app\resources\views/pdf/paiement.blade.php ENDPATH**/ ?>