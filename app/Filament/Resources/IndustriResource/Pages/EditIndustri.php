<?php

namespace App\Filament\Resources\IndustriResource\Pages;

use App\Filament\Resources\IndustriResource;
use Filament\Actions;
use App\Models\PKL;
use Filament\Resources\Pages\EditRecord;

class EditIndustri extends EditRecord
{
    protected static string $resource = IndustriResource::class;

    protected function getRedirectUrl(): string {
        return $this->getResource()::getUrl('index');
    }

    protected function canDelete(): bool
    {
        return \App\Models\Pkl::where('guru_id', $this->record->id)->doesntExist();
    }

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
