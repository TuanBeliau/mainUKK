<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserResource\Pages;
use App\Filament\Resources\UserResource\RelationManagers;
use App\Models\User;
use App\Models\Siswa;
use App\Models\Guru;
use Filament\Forms;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                //Membuat Card
                Forms\Components\Card::make()
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->label('Nama Admin')
                            ->placeholder('Masukkan Nama Admin')
                            ->reactive()
                            ->requiredWithout('guru_id')
                            ->disabled(fn ($get) => filled($get('guru_id'))),

                        Forms\Components\TextInput::make('email')
                            ->label('Email Admin')
                            ->reactive()
                            ->placeholder('Masukkan Email Admin')
                            ->email()
                            ->requiredWithout('guru_id')
                            ->disabled(fn ($get) => filled($get('guru_id'))),

                        Forms\Components\BelongsToSelect::make('guru_id')
                            ->label('Nama Guru')
                            ->nullable()
                            ->reactive()
                            ->relationship('guru', 'nama')
                            ->placeholder('Masukkan Nama Guru')
                            ->disabled(fn ($get) => filled($get('name')) && filled($get('email')))
                            ->requiredWithout(['name', 'email']),

                        Forms\Components\TextInput::make('password')
                            ->label('Password')
                            ->password()
                            ->required()
                            ->autocomplete('new-password')
                            ->dehydrated(fn ($state) => filled($state))
                            ->dehydrateStateUsing(fn ($state) => Hash::make($state))
                            ->placeholder('Masukkan Password'),
                        
                        Forms\Components\Select::make('Role')
                            ->label('Pilih role')
                            ->relationship('roles', 'name')
                            ->preload(),
                    ])
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                ->getStateUsing(function ($record) {
                    return $record->name ?? $record->siswa->nama ?? $record->guru->nama ?? '-';
                })
                ->searchable(query: function ($query, $search) {
                    $query
                        ->orWhere('name', 'like', "%{$search}%")
                        ->orWhereHas('siswa', fn ($q) => 
                            $q->where('nama', 'like', "%{$search}%")
                        );
                }),
                Tables\Columns\TextColumn::make('email')
                ->getStateUsing(function ($record) {
                    return $record->email ?? $record->siswa->email ?? $record->guru->email ?? '-';
                })
                ->searchable(query: function ($query, $search) {
                    $query
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhereHas('siswa', fn ($q) => 
                            $q->where('email', 'like', "%{$search}%")
                        );
                }),
                Tables\Columns\TextColumn::make('gender')
                ->getStateUsing(function ($record) {
                    return $record->gender ?? $record->siswa->gender ?? 'Tidak di Set';
                })
                ->formatStateUsing(function ($state) {
                    return match ($state) {
                        'L' => 'Laki-laki',
                        'P' => 'Perempuan',
                        default => 'Tidak di Set'
                    };
                }),
                Tables\Columns\TextColumn::make('alamat')
                ->getStateUsing(function ($record) {
                    return $record->alamat ?? $record->siswa->alamat ?? 'Tidak di Set';
                }),
                Tables\Columns\TextColumn::make('kontak')
                ->getStateUsing(function ($record) {
                    return $record->kontak ?? $record->siswa->kontak ?? 'Tidak di Set';
                }),
                Tables\Columns\TextColumn::make('roles.name')
                ->searchable(),
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
            'index' => Pages\ListUsers::route('/'),
            'create' => Pages\CreateUser::route('/create'),
            'edit' => Pages\EditUser::route('/{record}/edit'),
        ];
    }
}