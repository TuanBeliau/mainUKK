<?php

namespace App\Filament\Resources\UserResource\Pages;

use App\Filament\Resources\UserResource;
use Filament\Forms\Form;
use Filament\Tables;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\BelongsToSelect;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Card;
use Filament\Tables\Table;
use App\Models\Guru;
use App\Models\Siswa;
use App\Models\User;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditUser extends EditRecord
{
    protected static string $resource = UserResource::class;

    public function form(Form $form): Form
    {
        return $form->schema([
            Card::make()
                ->schema([
                    TextInput::make('name')
                        ->hidden(fn ($get) => blank($get('name')))
                        ->label('Nama Admin')
                        ->placeholder('Masukkan Nama Admin')
                        ->validationMessages([
                            'unique' => 'Nama sudah digunakan.',
                        ])                               
                        ->required(),

                    BelongsToSelect::make('siswa_id')
                        ->label('Nama Siswa')
                        ->disabled()
                        ->relationship('siswa', 'nama')
                        ->options(Siswa::whereNotNull('nama')->pluck('nama', 'id'))
                        ->getOptionLabelUsing(fn ($value) => siswa::find($value)?->nama ?? 'Tidak ditemukan')
                        ->placeholder('Masukkan Nama Siswa')
                        ->hidden(fn ($get) => blank($get('siswa_id')))
                        ->required(),

                    BelongsToSelect::make('guru_id')
                        ->hidden(fn ($get) => blank($get('guru_id')))
                        ->options(Guru::whereNotNull('nama')->pluck('nama', 'id'))
                        ->label('Nama Guru')
                        ->disabled()
                        ->relationship('guru', 'nama')
                        ->placeholder('Masukkan Nama Guru')                         
                        ->required(),

                    TextInput::make('email')
                        ->hidden(fn ($get) => blank($get('email')))
                        ->label('Email Admin')
                        ->placeholder('Masukkan Email Admin')
                        ->email()
                        ->required(),

                    BelongsToSelect::make('siswa_id')
                        ->hidden(fn ($get) => blank($get('siswa_id')))
                        ->options(Siswa::whereNotNull('nama')->pluck('nama', 'id'))
                        ->getOptionLabelUsing(fn ($value) => siswa::find($value)?->nama ?? 'Tidak ditemukan')
                        ->disabled()
                        ->relationship('siswa', 'email')
                        ->label('Email Siswa')
                        ->required(),
                    
                    Select::make('Role')
                        ->label('Pilih role')
                        ->relationship('roles', 'name')
                        ->preload(),
        
                ])
        ]);
    }

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
