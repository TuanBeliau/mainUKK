<?php

namespace App\Filament\Resources;

use App\Filament\Resources\GuruResource\Pages;
use App\Filament\Resources\GuruResource\RelationManagers;
use Illuminate\Support\Facades\Storage;
use App\Models\Guru;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Tables\Actions\BulkAction;
use Filament\Tables\Actions\BulkActionGroup;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Validation\Rule;

class GuruResource extends Resource
{
    protected static ?string $model = Guru::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Card::make()
                    ->schema([
                        Forms\Components\TextInput::make('nama')
                            ->label('Nama Guru')
                            ->placeholder('Masukkan Nama Guru')
                            ->required(),

                        Forms\Components\TextInput::make('nip')
                            ->label('Nomor Induk Pegawai')
                            ->placeholder('Masukkan NIP Guru')
                            ->numeric()
                            ->rules(function (callable $get) {
                                return [
                                    Rule::unique('gurus', 'nip')->ignore($get('id')),
                                ];
                            })
                            ->validationMessages([
                                'unique' => 'NIP Sudah Digunakan',
                            ])
                            ->required(),
                        
                        Forms\Components\TextInput::make('email')
                            ->label('Email Guru')
                            ->placeholder('Masukkan Email Guru')
                            ->email()
                            ->required(),

                        Forms\Components\Select::make('gender')
                            ->label('Gender Guru')
                            ->options([
                                'L' => 'Laki-laki',
                                'P' => 'Perempuan'
                            ])
                            ->required(),

                        Forms\Components\TextInput::make('alamat')
                            ->label('Alamat Guru')
                            ->placeholder('Masukkan alamat siswa')
                            ->required(),
                            
                        Forms\Components\TextInput::make('kontak')
                            ->label('Kontak Guru')
                            ->placeholder('Masukkan kontak siswa')
                            ->minLength(10)
                            ->maxLength(15)
                            ->required(),

                        Forms\Components\FileUpload::make('foto')
                            ->label('Foto Guru')
                            ->image()
                            ->directory('foto-guru')
                            ->acceptedFileTypes(['image/jpeg', 'image/jpg', 'image/png'])
                            ->maxSize(2048)
                            ->required()
                            ->maxFiles(1)
                            ->enableOpen()
                            ->enableDownload()
                            ->disk('public'), 
                    ])
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('nama')->searchable(),
                Tables\Columns\TextColumn::make('nip')->searchable(),
                Tables\Columns\TextColumn::make('email')->searchable(),
                Tables\Columns\TextColumn::make('gender')
                    ->formatStateUsing(fn ($state) => $state == 'L' ? 'Laki-laki' : 'Perempuan'),
                Tables\Columns\TextColumn::make('alamat'),
                Tables\Columns\TextColumn::make('kontak'),
                Tables\Columns\ImageColumn::make('foto')
                    ->url(fn ($record) => Storage::url($record->foto))
                    ->circular(),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make()
                    ->action(function ($record) {
                        try {
                            $record->delete();

                            Notification::make()
                                ->title('Penghapusanf Guru Berhasil')
                                ->success()
                                ->send();
                        } catch (QueryException $e) {
                            if ($e->getCode() === '23000') {
                                Notification::make()
                                    ->title('Gagal Menghapus Data Guru Masih Digunakan di Laporan PKL')
                                    ->danger()
                                    ->send();
                            }
                        }
                    }),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    BulkAction::make('delete')
                        ->label('Hapus Terpilih')
                        ->icon('heroicon-o-trash')
                        ->color('danger')
                        ->requiresConfirmation()
                        ->action(function (Collection $records) {
                            foreach ($records as $record) {
                                try {
                                    $record->delete();
                                    Notification::make()
                                        ->title('Penghapusan Guru Berhasil')
                                        ->success()
                                        ->send();
                                } catch (QueryException $e) {
                                    if ($e->getCode() === '23000') {
                                        Notification::make()
                                            ->title("Gagal Menghapus {$record->nama}")
                                            ->body("Data Guru Masih Digunakan di Laporan PKL.")
                                            ->danger()
                                            ->send();
                                        continue;
                                    }

                                    throw $e;
                                }
                            }
                        })
                        ->deselectRecordsAfterCompletion(),
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
            'index' => Pages\ListGurus::route('/'),
            'create' => Pages\CreateGuru::route('/create'),
            'edit' => Pages\EditGuru::route('/{record}/edit'),
        ];
    }
} 