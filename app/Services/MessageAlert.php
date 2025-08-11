<?php

namespace App\Services;

class MessageAlert
{
    public static function getErrorMessage($type = 'general')
    {
        $messages = [
            'general' => "⚠️ *Une erreur s'est produite*\n\nVeuillez réessayer ou contactez le support technique.",
            'database' => "🔌 *Erreur de connexion*\n\nProblème temporaire avec la base de données.\nRéessayez dans quelques instants.",
            'session' => "⏰ *Session expirée*\n\nVotre session a expiré. Recommencez l'opération.",
            'validation' => "❌ *Données invalides*\n\nVérifiez les informations saisies et réessayez."
        ];

        return $messages[$type] ?? $messages['general'];
    }

    public static function getSuccessMessage($action)
    {
        $messages = [
            'save' => "✅ *Enregistrement réussi !*\n\nLes données ont été sauvegardées avec succès.",
            'update' => "🔄 *Mise à jour effectuée !*\n\nLes modifications ont été appliquées.",
            'delete' => "🗑️ *Suppression confirmée*\n\nL'élément a été supprimé définitivement."
        ];

        return $messages[$action] ?? "✅ *Opération réussie !*";
    }
}
