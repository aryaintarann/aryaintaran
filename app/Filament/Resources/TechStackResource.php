<?php

namespace App\Filament\Resources;

use App\Filament\Resources\TechStackResource\Pages;
use App\Filament\Resources\TechStackResource\RelationManagers;
use App\Models\TechStack;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class TechStackResource extends Resource
{
    protected static ?string $model = TechStack::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('icon')
                    ->placeholder('e.g. heroicon-o-cpu or image url'),
                Forms\Components\Select::make('category')
                    ->options([
                        'frontend' => 'Frontend',
                        'backend' => 'Backend',
                        'tools' => 'Tools',
                        'design' => 'Design',
                    ])
                    ->required()
                    ->default('backend'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable(),
                Tables\Columns\TextColumn::make('category')
                    ->badge()
                    ->color(fn(string $state): string => match ($state) {
                        'frontend' => 'success',
                        'backend' => 'warning',
                        'tools' => 'gray',
                        'design' => 'info',
                    }),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListTechStacks::route('/'),
            'create' => Pages\CreateTechStack::route('/create'),
            'edit' => Pages\EditTechStack::route('/{record}/edit'),
        ];
    }
}
