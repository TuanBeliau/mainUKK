<?php

namespace App\Filament\Resources;

use App\Filament\Resources\IndustriResource\Pages;
use Filament\Tables\Actions\BulkAction;
use Filament\Tables\Actions\BulkActionGroup;
use App\Filament\Resources\IndustriResource\RelationManagers;
use App\Models\Industri;
use App\Models\Guru;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\QueryException;
use Illuminate\Validation\Rule;
use Filament\Notifications\Notification;

class IndustriResource extends Resource
{
    protected static ?string $model = Industri::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Card::make()
                    ->schema([
                        Forms\Components\TextInput::make('nama')
                            ->label('Nama Industri')
                            ->placeholder('Masukkan Nama Industri')
                            ->rules(function (callable $get) {
                                return [
                                    Rule::unique('industris', 'nama')
                                ];
                            })
                            ->validationMessages([
                                'unique' => 'Industri Sudah Ada'
                            ]) 
                            ->required(),

                        Forms\Components\TextInput::make('bidang_usaha')
                            ->label('Bidang Usaha')
                            ->placeholder('Masukkan Bidang Usaha Industri')
                            ->required(),

                        Forms\Components\TextInput::make('alamat')
                            ->label('Alamat Industri')
                            ->placeholder('Masukkan Alamat Industri')
                            ->required(),

                        Forms\Components\TextInput::make('kontak')
                            ->label('Kontak Industri')
                            ->placeholder('Masukkan Kontak Industri')
                            ->required(),

                        Forms\Components\TextInput::make('email')
                            ->label('Email Industri')
                            ->placeholder('Masukkan Email Industri')
                            ->email()
                            ->required(),

                        Forms\Components\TextInput::make('website')
                            ->label('Website Industri')
                            ->placeholder('Masukkan Website Industri')
                            ->required(),
                    ])
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('nama')->searchable(),
                Tables\Columns\TextColumn::make('bidang_usaha')->searchable(),
                Tables\Columns\TextColumn::make('alamat')->searchable(),
                Tables\Columns\TextColumn::make('kontak'),
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
                                ->title('Penghapusanf Industri Berhasil')
                                ->success()
                                ->send();
                        } catch (QueryException $e) {
                            if ($e->getCode() === '23000') {
                                Notification::make()
                                    ->title('Gagal Menghapus Data Industri Masih Digunakan di Laporan PKL')
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
                                        ->title('Penghapusan Industri Berhasil')
                                        ->success()
                                        ->send();
                                } catch (QueryException $e) {
                                    if ($e->getCode() === '23000') {
                                        Notification::make()
                                            ->title("Gagal Menghapus {$record->nama}")
                                            ->body("Data Industri Masih Digunakan di Laporan PKL.")
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
            'index' => Pages\ListIndustris::route('/'),
            'create' => Pages\CreateIndustri::route('/create'),
            'edit' => Pages\EditIndustri::route('/{record}/edit'),
        ];
    }
}