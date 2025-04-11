<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PaiementPdfMail extends Mailable
{
    use Queueable, SerializesModels;

    public $pdfPath;
    public $pdfData;
    public $filename;

    /**
     * Create a new message instance.
     *
     * @param string $pdfPath
     * @param array $pdfData
     * @param string $filename
     * @return void
     */
    public function __construct($pdfPath, $pdfData, $filename)
    {
        $this->pdfPath = $pdfPath;
        $this->pdfData = $pdfData;
        $this->filename = $filename;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Reçu de paiement N°' . $this->pdfData['numero'])
            ->view('emails.paiement_pdf')
            ->attach($this->pdfPath, [
                'as' => $this->filename,
                'mime' => 'application/pdf',
            ]);
    }
}