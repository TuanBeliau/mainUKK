<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PKLResource\Pages;
use App\Filament\Resources\PKLResource\RelationManagers;
use App\Models\PKL;
use App\Models\Siswa;
use App\Models\Guru;
use App\Models\Industri;
use Illuminate\Validation\Validator;
use Carbon\Carbon;
use Closure;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class PKLResource extends Resource
{
    protected static ?string $model = PKL::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Card::make()
                    ->schema([
                        Forms\Components\Card::make()
                            ->schema([
                                Forms\Components\Select::make('siswa_id')
                                    ->label('Nama Siswa')
                                    ->disabled()
                                    ->relationship('siswa', 'nama')
                                    ->options(Siswa::whereNotNull('nama')->pluck('nama', 'id'))
                                    ->getOptionLabelUsing(fn ($value) => siswa::find($value)?->nama ?? 'Tidak ditemukan')
                                    ->placeholder('Masukkan Nama Siswa')
                                    ->hidden(fn ($get) => blank($get('siswa_id')))
                                    ->disabled(),

                                Forms\Components\Select::make('guru_id')
                                    ->label('Pilih Guru Pembimbing')
                                    ->searchable()
                                    ->preload()
                                    ->relationship('guru', 'nama'),

                                Forms\Components\Select::make('industri_id')
                                    ->label('Pilih Industri')
                                    ->searchable()
                                    ->preload()
                                    ->relationship('industri', 'nama')
                                    ->required(),

                                Forms\Components\DatePicker::make('mulai')
                                    ->label("Pilih Tanggal Mulai")
                                    ->required(),

                                Forms\Components\DatePicker::make('selesai')
                                    ->label("Pilih Tanggal Selesai")
                                    ->rule(function (callable $get) {
                                        return [
                                            function (string $attribute, $value, \Closure $fail) use ($get) {
                                                $mulai = $get('mulai');

                                                if (!$mulai || !$value) {
                                                    return;
                                                }

                                                $mulaiDate = Carbon::parse($mulai);
                                                $selesaiDate = Carbon::parse($value);

                                                if ($selesaiDate->lessThanOrEqualTo($mulaiDate)) {
                                                    $fail('Tanggal Selesai Tidak Boleh Kurang atau Sama Dengan Tanggal Mulai.');
                                                }

                                                if ($selesaiDate->lt($mulaiDate->copy()->addMonths(1))) {
                                                    $fail('Minimal Jarak Tanggal Mulai dan Selesai adalah 1 Bulan.');
                                                }
                                            }
                                        ];
                                    })
                                    ->required(),
                            ])
                    ])
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('siswa.nama')->searchable()->label('Nama Siswa'),
                Tables\Columns\TextColumn::make('guru.nama')->searchable()->label('Guru Pendamping'),
                Tables\Columns\TextColumn::make('industri.nama')->searchable()->label('Industri Tujuan'),
                Tables\Columns\TextColumn::make('mulai')->label('Tanggal Mulai PKL'),
                Tables\Columns\TextColumn::make('selesai')->label('Tanggal Selesai PKL'),
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
            'index' => Pages\ListPKLS::route('/'),
            'create' => Pages\CreatePKL::route('/create'),
            'edit' => Pages\EditPKL::route('/{record}/edit'),
        ];
    }
}