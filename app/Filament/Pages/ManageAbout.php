<?php

namespace App\Filament\Pages;

use App\Models\Setting;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Pages\Page;

class ManageAbout extends Page implements HasForms
{
    use InteractsWithForms;

    protected static ?string $navigationIcon = 'heroicon-o-user';
    protected static ?string $navigationLabel = 'About Settings';
    protected static ?string $title = 'Manage About';

    protected static string $view = 'filament.pages.manage-about';

    public ?array $data = [];

    public function mount(): void
    {
        $settings = Setting::whereIn('key', [
            'about_title',
            'about_text',
            'about_image',
            'about_badge',
            'location_text',
            'location_emoji'
        ])->pluck('value', 'key')->toArray();
        $this->form->fill($settings);
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make('Introduction')
                    ->schema([
                        TextInput::make('about_title')
                            ->label('Title')
                            ->placeholder('I create chaos turned into order.'),
                        Textarea::make('about_text')
                            ->label('Description')
                            ->rows(3),
                    ]),
                Section::make('Profile Image & Badge')
                    ->schema([
                        FileUpload::make('about_image')
                            ->image()
                            ->directory('settings'),
                        TextInput::make('about_badge')
                            ->label('Badge Text')
                            ->placeholder('GEN Z DEV'),
                    ]),
                Section::make('Location')
                    ->schema([
                        Textarea::make('location_text')
                            ->label('Location Text (HTML allowed)')
                            ->rows(2)
                            ->placeholder('BASED IN<br>BALI'),
                        TextInput::make('location_emoji')
                            ->label('Emoji')
                            ->placeholder('🏝️'),
                    ]),
            ])
            ->statePath('data');
    }

    public function save(): void
    {
        $data = $this->form->getState();

        foreach ($data as $key => $value) {
            $type = 'text';
            if ($key === 'about_image')
                $type = 'image';

            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value, 'type' => $type]
            );
        }

        Notification::make()
            ->success()
            ->title('About settings updated')
            ->send();
    }
}