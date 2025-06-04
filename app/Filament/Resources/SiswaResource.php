<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SiswaResource\Pages;
use App\Filament\Resources\SiswaResource\RelationManagers;
use Illuminate\Support\Facades\Storage;
use App\Models\Siswa;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Validation\Rule;

class SiswaResource extends Resource
{
    protected static ?string $model = Siswa::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                //Membuat Card
                Forms\Components\Card::make()
                    ->schema([
                        Forms\Components\TextInput::make('nama')
                            ->label('Nama Siswa')
                            ->placeholder('Masukkan Nama Siswa')
                            ->rules(function (callable $get) {
                                return [
                                    Rule::unique('siswas', 'nama')->ignore($get('id')),
                                ];
                            })
                            ->validationMessages([
                                'unique' => 'Nama sudah digunakan.',
                            ])                               
                            ->required(),

                        Forms\Components\TextInput::make('nis')
                            ->label('Nomor Induk Siswa')
                            ->numeric()
                            ->minLength(5)
                            ->placeholder('Masukkan nis siswa')
                            ->rules(function (callable $get) {
                                return [
                                    Rule::unique('siswas', 'nis')->ignore($get('id')),
                                ];
                            })
                            ->validationMessages([
                                'unique' => 'nis sudah ada',
                            ])
                            ->required(),

                        Forms\Components\TextInput::make('email')
                            ->label('Email Siswa')
                            ->placeholder('Masukkan Email Siswa')
                            ->email()
                            ->required(),

                        Forms\Components\Select::make('gender')
                            ->label('Gender Siswa')
                            ->options([
                                'L' => 'Laki-laki',
                                'P' => 'Perempuan'
                            ])
                            ->required(),

                        Forms\Components\TextInput::make('alamat')
                            ->label('Alamat Siswa')
                            ->placeholder('Masukkan alamat siswa')
                            ->required(),
                            
                        Forms\Components\TextInput::make('kontak')
                            ->label('Kontak Siswa')
                            ->placeholder('Masukkan kontak siswa')
                            ->minLength(10)
                            ->maxLength(15)
                            ->required(),

                        Forms\Components\FileUpload::make('foto')
                            ->label('Foto Siswa')
                            ->image()
                            ->directory('foto-siswa')
                            ->acceptedFileTypes(['image/jpeg', 'image/jpg', 'image/png'])
                            ->maxSize(2048)
                            ->required()
                            ->maxFiles(1)
                            ->enableOpen()
                            ->enableDownload()
                            ->disk('public'),  
                        
                        Forms\Components\Select::make('status_lapor_pkl')
                            ->label('Status Lapor Pkl')
                            ->options([
                                'Belum Lapor' => 'Belum Lapor',
                                'Request Guru' => 'Request Guru',
                                'Sudah Lapor' => 'Sudah Lapor'
                            ]),
                        
                        Forms\Components\Select::make('Role')
                            ->label('Pilih Role')
                            ->relationship('user.roles', 'name', fn ($query) => $query->where('name', 'siswa'))
                            ->required()
                            ->visible(fn ($record) => $record?->user !== null)
                    ])
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('nama')->searchable(),
                Tables\Columns\TextColumn::make('nis')->searchable(),
                Tables\Columns\TextColumn::make('email'),
                Tables\Columns\TextColumn::make('gender')
                    ->formatStateUsing(fn ($state) => $state == 'L' ? 'Laki-laki' : 'Perempuan'),
                Tables\Columns\TextColumn::make('alamat'),
                Tables\Columns\TextColumn::make('kontak'),
                Tables\Columns\ImageColumn::make('foto')
                    ->url(fn ($record) => url(Storage::url($record->foto)))
                    ->circular(),
                Tables\Columns\IconColumn::make('status_lapor_pkl')
                    ->icon(fn (string $state) => [
                        'Belum Lapor'    => 'heroicon-o-x-circle',
                        'Request Guru'   => 'heroicon-o-information-circle',
                        'Sudah Lapor'    => 'heroicon-o-check-circle',
                    ][$state] ?? 'heroicon-o-question-mark-circle')
                    ->color(fn (string $state): string => match ($state) {
                        'Belum Lapor'  => 'warning',
                        'Request Guru' => 'info',
                        'Sudah Lapor'  => 'success',
                        default        => 'gray',
                    })
                    ->alignCenter()
                    ->searchable(),
                Tables\Columns\TextColumn::make('user.roles.name')
                    ->searchable()
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
            'index' => Pages\ListSiswas::route('/'),
            'create' => Pages\CreateSiswa::route('/create'),
            'edit' => Pages\EditSiswa::route('/{record}/edit'),
        ];
    }
} 