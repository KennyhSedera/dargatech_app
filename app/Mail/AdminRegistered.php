<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AdminRegistered extends Mailable
{
    use Queueable, SerializesModels;

    public $password;
    public $appLink;
    public $botLink;
    public $name;
    public $email;

    public function __construct($password, $appLink, $name, $email, $botLink)
    {
        $this->password = $password;
        $this->appLink = $appLink;
        $this->name = $name;
        $this->email = $email;
        $this->botLink = $botLink;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Vos identifiants de connexion en tant que Administrateur',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.admin_email',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
