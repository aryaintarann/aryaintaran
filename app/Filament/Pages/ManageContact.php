<?php

namespace App\Filament\Pages;

use App\Models\Setting;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Pages\Page;

class ManageContact extends Page implements HasForms
{
    use InteractsWithForms;

    protected static ?string $navigationIcon = 'heroicon-o-envelope';
    protected static ?string $navigationLabel = 'Contact Settings';
    protected static ?string $title = 'Manage Contact';

    protected static string $view = 'filament.pages.manage-contact';

    public ?array $data = [];

    public function mount(): void
    {
        $settings = Setting::whereIn('key', [
            'contact_email',
            'contact_text',
            'instagram_url',
            'linkedin_url',
            'github_url',
            'gitlab_url',
            'whatsapp_url',
        ])->pluck('value', 'key')->toArray();
        $this->form->fill($settings);
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make('Contact Info')
                    ->schema([
                        TextInput::make('contact_email')
                            ->email()
                            ->required(),
                        Textarea::make('contact_text')
                            ->label('Display Text (HTML allowed)')
                            ->rows(3)
                            ->placeholder('HELLO@<br>ARYA.DEV'),
                    ]),
                Section::make('Social Links')
                    ->schema([
                        TextInput::make('instagram_url')->url()->placeholder('https://instagram.com/...'),
                        TextInput::make('linkedin_url')->url()->placeholder('https://linkedin.com/in/...'),
                        TextInput::make('github_url')->url()->placeholder('https://github.com/...'),
                        TextInput::make('gitlab_url')->url()->placeholder('https://gitlab.com/...'),
                        TextInput::make('whatsapp_url')->url()->placeholder('https://wa.me/...'),
                    ]),
            ])
            ->statePath('data');
    }

    public function save(): void
    {
        $data = $this->form->getState();

        foreach ($data as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value, 'type' => 'text']
            );
        }

        Notification::make()
            ->success()
            ->title('Contact settings updated')
            ->send();
    }
}