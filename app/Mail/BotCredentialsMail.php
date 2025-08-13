<?php
namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class BotCredentialsMail extends Mailable
{
    use Queueable, SerializesModels;

    public $password;
    public $botLink;
    public $appLink;
    public $name;
    public $email;

    public function __construct($password, $botLink, $appLink, $name, $email)
    {
        $this->password = $password;
        $this->botLink = $botLink;
        $this->appLink = $appLink;
        $this->name = $name;
        $this->email = $email;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Vos identifiants de connexion en tant que Technicien',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.bot_credentials',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }

}
