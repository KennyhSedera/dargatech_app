<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Rapport de maintenance #<?php echo e($data->id); ?></title>
    <style>
        @page {
            margin: 20mm;
            size: A4;
        }

        body {
            font-family: DejaVu Sans, Arial, sans-serif;
            color: #000;
            background-color: #fff;
            margin: 0;
            padding: 0;
            font-size: 12px;
            line-height: 1.4;
        }

        .container {
            width: 100%;
            position: relative;
        }

        .header {
            width: 100%;
            margin-bottom: 30px;
            overflow: hidden;
            page-break-inside: avoid;
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
            margin-right: 10px;
            vertical-align: middle;
        }

        .logo-text {
            color: #666;
            font-size: 11px;
            margin-top: 4px;
            font-style: italic;
        }

        .document-info {
            float: right;
            width: 50%;
            text-align: right;
            font-size: 11px;
            color: #555;
        }

        .document-info div {
            margin-bottom: 3px;
        }

        .blue-text {
            color: #3490dc;
            font-weight: bold;
            font-size: 14px;
        }

        h1, h2 {
            color: #3490dc;
            margin-bottom: 15px;
            clear: both;
            page-break-after: avoid;
        }

        h1 {
            font-size: 20px;
            text-align: center;
            margin-top: 20px;
            margin-bottom: 30px;
            border-bottom: 2px solid #3490dc;
            padding-bottom: 10px;
        }

        h2 {
            font-size: 14px;
            margin-top: 25px;
            margin-bottom: 10px;
            background-color: #f8f9fa;
            padding: 8px 12px;
            border-left: 4px solid #3490dc;
        }

        ul {
            list-style-type: disc;
            padding-left: 20px;
            margin-bottom: 15px;
        }

        ul.sub-list {
            padding-left: 40px;
        }

        li {
            margin-bottom: 5px;
        }

        .section {
            margin-bottom: 25px;
            page-break-inside: avoid;
        }

        .clearfix:after {
            content: "";
            display: table;
            clear: both;
        }

        .footer {
            text-align: center;
            font-size: 10px;
            margin-top: 40px;
            border-top: 1px solid #ddd;
            padding-top: 10px;
            color: #666;
            page-break-inside: avoid;
        }

        img {
            max-width: 100%;
            max-height: 200px;
            object-fit: contain;
            margin: 10px 0;
            display: block;
        }

        /* Table styling */
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            page-break-inside: avoid;
        }

        th, td {
            border: 1px solid #3490dc;
            padding: 8px;
            text-align: left;
            vertical-align: top;
        }

        th {
            background-color: #3490dc;
            color: #fff;
            font-weight: bold;
            page-break-after: avoid;
        }

        .text-center {
            text-align: center;
        }

        .text-right {
            text-align: right;
        }

        .info-box {
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 4px;
            padding: 15px;
            margin: 15px 0;
        }

        .status-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 3px;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .status-completed {
            background-color: #28a745;
            color: white;
        }

        .status-pending {
            background-color: #ffc107;
            color: #212529;
        }

        .page-break {
            page-break-before: always;
        }

        /* Print-specific styles */
        @media print {
            body {
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
            }
        }
    </style>
</head>
<body>
    <div class="container">

        <div class="clearfix header">
            <div class="logo-container">
                <div class="logo-inner">
                    <!-- Note: For PDF generation, use absolute paths or base64 encoded images -->
                    <!-- <img src="<?php echo e(public_path('images/logo.png')); ?>" alt="logo" class="logo" /> -->
                    <div style="width: 60px; height: 60px; background-color: #3490dc; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 10px; float: left;">
                        LOGO
                    </div>
                </div>
                <div class="logo-text">Dargatech - Solutions solaires durables</div>
            </div>
            <div class="document-info">
                <div><strong>Maintenance #<?php echo e($data->maintenanceId ?? $data->id); ?></strong></div>
                <div>Rapport d'intervention #<?php echo e($data->id); ?></div>
                <div><?php echo e(\Carbon\Carbon::parse($data->date_intervention)->locale('fr')->isoFormat('LL')); ?></div>
                <div class="status-badge status-completed">Terminé</div>
            </div>
        </div>

        <h1>Rapport de maintenance du kit solaire Dargatech</h1>

        <div class="section">
            <h2>1. Identification du client</h2>
            <div class="info-box">
                <ul>
                    <li><strong>Nom :</strong> <?php echo e($data->client->prenom ?? ''); ?> <?php echo e($data->client->nom ?? ''); ?></li>
                    <li><strong>Localisation :</strong> <?php echo e($data->client->localisation ?? 'Non spécifiée'); ?></li>
                    <li><strong>Date de l'intervention :</strong> <?php echo e(\Carbon\Carbon::parse($data->date_intervention)->locale('fr')->isoFormat('LL')); ?></li>
                    <li><strong>Technicien :</strong> <?php echo e($data->technicien->user->name ?? 'Non assigné'); ?></li>
                    <li><strong>Contact :</strong> <?php echo e($data->client->telephone ?? 'Non renseigné'); ?></li>
                </ul>
            </div>
        </div>

        <div class="section">
            <h2>2. Description de la Panne</h2>
            <ul>
                <li><strong>Problèmes rapportés :</strong> <?php echo e($data->description_panne ?? 'Aucune description disponible'); ?></li>
                <li><strong>Date et heure du signalement :</strong> <?php echo e(\Carbon\Carbon::parse($data->created_at)->locale('fr')->isoFormat('LL à HH:mm')); ?></li>
                <?php if($data->photo_probleme): ?>
                    <li><strong>Photos du problème :</strong><br/>
                        <?php
                            $photos = is_string($data->photo_probleme) ? json_decode($data->photo_probleme, true) : $data->photo_probleme;
                        ?>
                        <?php if(is_array($photos)): ?>
                            <?php $__currentLoopData = $photos; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $photo): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                <img src="<?php echo e(public_path($photo)); ?>" alt="Photo du problème" />
                            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                        <?php endif; ?>
                    </li>
                <?php endif; ?>
            </ul>
        </div>

        <div class="section">
            <h2>3. Diagnostic initial</h2>
            <div class="info-box">
                <p><strong>Vérifications préliminaires :</strong></p>
                <p><?php echo e($data->diagnostic_initial ?? 'Aucun diagnostic initial renseigné'); ?></p>
            </div>
        </div>

        <div class="section">
            <h2>4. Cause identifiée</h2>
            <div class="info-box">
                <p><strong>Résultat du diagnostic :</strong></p>
                <p><?php echo e($data->cause_identifiee ?? 'Aucune cause identifiée'); ?></p>
            </div>
        </div>

        <div class="section">
            <h2>5. Intervention réalisée</h2>
            <div class="info-box">
                <p><strong>Actions correctives :</strong></p>
                <p><?php echo e($data->intervention_realisee ?? 'Aucune intervention réalisée'); ?></p>
            </div>
        </div>

        <div class="section">
            <h2>6. Test Post-Réparation</h2>
            <div class="info-box">
                <p><strong>Vérification du fonctionnement :</strong> <?php echo e($data->verification_fonctionnement ?? 'Non vérifié'); ?></p>
            </div>
        </div>

        <div class="section">
            <h2>7. Recommandation au client</h2>
            <div class="info-box">
                <p><?php echo e($data->recommandation_client ?? 'Aucune recommandation particulière'); ?></p>
            </div>
        </div>

        <div class="footer">
            <p>Rapport généré le <?php echo e(\Carbon\Carbon::now()->format('d/m/Y à H:i')); ?> par <?php echo e($data->technicien->user->name ?? 'Système'); ?></p>
            <p>Dargatech - Solutions solaires durables | www.dargatech.com</p>
        </div>
    </div>
</body>
</html>
<?php /**PATH D:\ENI\Stage\dargatech_app\resources\views/pdf/rapport.blade.php ENDPATH**/ ?>