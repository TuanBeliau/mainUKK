<?php

namespace App\Filament\Resources\GuruResource\Pages;

use App\Filament\Resources\GuruResource;
use Filament\Actions;
use App\Models\PKL;
use Filament\Resources\Pages\EditRecord;

class EditGuru extends EditRecord
{
    protected static string $resource = GuruResource::class;

    protected function getRedirectUrl(): string {
        return $this->getResource()::getUrl('index');
    }

    protected function canDelete(): bool
    {
        return \App\Models\Pkl::where('industri_id', $this->record->id)->doesntExist();
    }

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
