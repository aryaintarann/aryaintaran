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

class ManageHeader extends Page implements HasForms
{
    use InteractsWithForms;

    protected static ?string $navigationIcon = 'heroicon-o-home';
    protected static ?string $navigationLabel = 'Header Settings';
    protected static ?string $title = 'Manage Header';

    protected static string $view = 'filament.pages.manage-header';

    public ?array $data = [];

    public function mount(): void
    {
        $settings = Setting::whereIn('key', ['hero_subtitle', 'hero_title_1', 'hero_title_2', 'hero_text', 'marquee_text'])->pluck(
            'value',
            'key'
        )->toArray();
        $this->form->fill($settings);
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make('Hero Section')
                    ->schema([
                        TextInput::make('hero_subtitle')
                            ->label('Subtitle (Top)')
                            ->placeholder('Portfolio 2025'),
                        TextInput::make('hero_title_1')
                            ->label('Main Title Line 1')
                            ->placeholder('CREATIVE'),
                        TextInput::make('hero_title_2')
                            ->label('Main Title Line 2 (Animated)')
                            ->placeholder('DEVELOPER'),
                        Textarea::make('hero_text')
                            ->label('Description')
                            ->rows(3),
                    ]),
                Section::make('Marquee')
                    ->schema([
                        TextInput::make('marquee_text')
                            ->label('Scrolling Text')
                            ->placeholder('Web Development * UI/UX Design...'),
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
            ->title('Header settings updated')
            ->send();
    }
}